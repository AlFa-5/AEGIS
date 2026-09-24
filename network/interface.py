import psutil
import socket


def get_interfaces():
    addresses = psutil.net_if_addrs()
    stats = psutil.net_if_stats()

    interfaces = []

    for name in addresses:
        interface = {
            "name": name,
            "is_up": stats[name].isup,
            "speed_mbps": stats[name].speed,
            "ip": None,
            "mac": None
        }

        for addr in addresses[name]:
            if addr.family == socket.AF_INET:
                interface["ip"] = addr.address

            elif addr.family == psutil.AF_LINK:
                interface["mac"] = addr.address

        interfaces.append(interface)

    return interfaces
