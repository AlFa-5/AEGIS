from interface import get_interfaces
from traffic import get_traffic
from connection import get_connections


interfaces = get_interfaces()
traffic = get_traffic()
connections = get_connections()

network_data = {
    "interfaces": interfaces,
    "traffic": traffic,
    "connections": connections
}

print(network_data)