from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import collect_data
import json

import os
import subprocess
import tempfile


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RuleRequest(BaseModel):
    rule: str

class SaveRuleRequest(BaseModel):
    rule: str
    enabled: bool = True

@app.get("/api/system")
def get_system():
    return collect_data()["system"]


@app.get("/api/network")
def get_network():
    return collect_data()["network"]

def load_rules():
    rules_path = os.path.expanduser("~/mini_soc/data/rules.json")

    if not os.path.exists(rules_path):
        return []

    with open(rules_path, "r", encoding="utf-8") as file:
        return json.load(file)
    
def save_rules(rules):
    rules_path = os.path.expanduser("~/mini_soc/data/rules.json")

    with open(rules_path, "w", encoding="utf-8") as file:
        json.dump(rules, file, indent=2)

@app.post("/api/rules/validate")
def validate_rule(request: RuleRequest):
    rule = request.rule.strip()

    if not rule:
        return {
            "valid": False,
            "error": "Rule is empty"
        }

    if "\x00" in rule:
        return {
            "valid": False,
            "error": "Invalid null byte in rule"
        }

    if len(rule) > 10000:
        return {
            "valid": False,
            "error": "Rule is too large"
        }

    # Dedicated AEGIS directory for Suricata validation logs
    log_dir = os.path.expanduser(
        "~/mini_soc/runtime/suricata-log"
    )

    os.makedirs(log_dir, exist_ok=True)

    temp_path = None

    try:
        # Create a temporary rule file containing
        # exactly the rule written by the client
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".rules",
            delete=False,
            encoding="utf-8"
        ) as temp_file:

            temp_file.write(rule)
            temp_path = temp_file.name

        # Ask Suricata to validate the temporary rule
        result = subprocess.run(
            [
                "/usr/bin/suricata",
                "-T",
                "-S",
                temp_path,
                "-l",
                log_dir,
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )

        output = "\n".join(
            part
            for part in [result.stdout, result.stderr]
            if part
        ).strip()

        if result.returncode == 0:
            return {
                "valid": True,
                "message": "Suricata accepted the rule",
                "output": output,
            }

        return {
            "valid": False,
            "error": output or "Suricata rejected the rule",
        }

    except subprocess.TimeoutExpired:
        return {
            "valid": False,
            "error": "Suricata validation timed out"
        }

    except Exception as exc:
        return {
            "valid": False,
            "error": str(exc)
        }

    finally:
        # Delete the temporary rule file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/api/rules")
def save_rule(request: SaveRuleRequest):
    rule = request.rule.strip()

    if not rule:
        return {
            "success": False,
            "error": "Rule is empty"
        }

    rules = load_rules()

    new_rule = {
        "rule": rule,
        "enabled": request.enabled
    }

    rules.append(new_rule)

    save_rules(rules)

    return {
        "success": True,
        "rule": new_rule
    }

@app.get("/api/rules")
def get_rules():
    rules = load_rules()

    return {
        "rules": rules
    }