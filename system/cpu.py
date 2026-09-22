import psutil

def get_cpu():
    return{
        "usage_percent" : psutil.cpu_percent(interval=1),
        "cores" : psutil.cpu_count(logical=True),
        "frequency_mhz" : psutil.cpu_freq().current

    }