import sys
import json


def log(message):
    print(message, flush=True)


def log_dict(message, d):
    log(message)
    log(json.dumps(d, sort_keys=False, indent=2))


def log_replace_line(message):
    sys.stdout.write("\033[F\033[K")
    print(message, flush=True)
