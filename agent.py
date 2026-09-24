from datetime import datetime

from system.cpu import get_cpu
from system.ram import get_ram
from system.disk import get_disk

from network.interface import get_interfaces
from network.traffic import get_traffic
from network.connection import get_connections


def collect_data():
    return {
        "timestamp": datetime.now().isoformat(),
        "system": {
            "cpu": get_cpu(),
            "memory": get_ram(),
            "disk": get_disk(),
        },
        "network": {
            "interfaces": get_interfaces(),
            "traffic": get_traffic(),
            "connections": get_connections(),
        },
    }


if __name__ == "__main__":
    print(collect_data())