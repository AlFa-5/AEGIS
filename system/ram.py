import psutil

def get_ram():
    ram = psutil.virtual_memory()
    return {
        "usage_percent" : ram.percent,
        "usage_bytes" : ram.used,
        "available_bytes" : ram.available,
        "total_byts" : ram.total
    }