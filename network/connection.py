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


print(get_connections())