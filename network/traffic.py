import psutil
import time


_previous = psutil.net_io_counters()
_previous_time = time.time()


def get_traffic():
    global _previous, _previous_time

    current = psutil.net_io_counters()
    current_time = time.time()

    elapsed = current_time - _previous_time

    download_speed = (
        (current.bytes_recv - _previous.bytes_recv)
        / elapsed
        if elapsed > 0
        else 0
    )

    upload_speed = (
        (current.bytes_sent - _previous.bytes_sent)
        / elapsed
        if elapsed > 0
        else 0
    )

    _previous = current
    _previous_time = current_time

    return {
        "download_bytes_per_second": download_speed,
        "upload_bytes_per_second": upload_speed,
        "packets_received": current.packets_recv,
        "packets_sent": current.packets_sent
    }