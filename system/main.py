from datetime import datetime

from cpu import get_cpu
from ram import get_ram
from disk import get_disk


system = {
    "timestamp": datetime.now().isoformat(),
    "cpu": get_cpu(),
    "memory": get_ram(),
    "disk": get_disk()
}

print(system)