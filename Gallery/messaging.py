import json


def log(message):
    print(message)


def log_dict(message, d):
    print(message)
    print(json.dumps(d, sort_keys=False, indent=2))


def log_replace_line(message):
    print(message, end='\r')
