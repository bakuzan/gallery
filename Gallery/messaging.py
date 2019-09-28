import sys
import json


def log(message):
    print(message, flush=True)


def log_dict(message, d):
    print(message)
    print(json.dumps(d, sort_keys=False, indent=2), flush=True)


def log_replace_line(message):
    sys.stdout.write("\033[F")
    print(message, flush=True)
