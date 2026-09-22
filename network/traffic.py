import psutil


def get_traffic():
    traffic = psutil.net_io_counters()

    return {
        "bytes_received": traffic.bytes_recv,
        "bytes_sent": traffic.bytes_sent,
        "packets_received": traffic.packets_recv,
        "packets_sent": traffic.packets_sent
    }


print(get_traffic())