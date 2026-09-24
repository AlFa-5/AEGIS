import psutil
import socket


def get_connections():
    connections = psutil.net_connections()

    result = []

    for conn in connections:

        connection = {
            "local_ip": conn.laddr.ip,
            "local_port": conn.laddr.port,
            "remote_ip": None,
            "remote_port": None,
            "protocol": "TCP" if conn.type == socket.SOCK_STREAM else "UDP",
            "state": conn.status,
            "pid": conn.pid
        }

        if conn.raddr:
            connection["remote_ip"] = conn.raddr.ip
            connection["remote_port"] = conn.raddr.port

        result.append(connection)

    return result


def get_connection_summary(connections):
    established = 0
    listening = 0
    tcp = 0
    udp = 0

    remote_endpoints = []

    for connection in connections:

        if connection["state"] == "ESTABLISHED":
            established += 1

        if connection["state"] == "LISTEN":
            listening += 1

        if connection["protocol"] == "TCP":
            tcp += 1
        elif connection["protocol"] == "UDP":
            udp += 1

        if connection["remote_ip"]:
            remote_endpoints.append({
                "ip": connection["remote_ip"],
                "port": connection["remote_port"]
            })

    return {
        "established": established,
        "listening": listening,
        "tcp": tcp,
        "udp": udp,
        "remote_endpoints": remote_endpoints
    }