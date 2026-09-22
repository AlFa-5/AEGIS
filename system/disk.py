import psutil

def get_disk():
    disk = psutil.disk_usage("/")
    return {
        "usage_percent" : disk.percent,
        "used_bytes" : disk.used,
        "free_bytes" : disk.free,
        "total_bytes" : disk.total
    }