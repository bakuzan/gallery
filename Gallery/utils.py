import sys
import os
import imghdr

from jinja.env import get_jinja_env
from messaging import log, log_replace_line


def get_gallery_template():
    env = get_jinja_env()
    return env.get_template('index.html')


def is_image(filepath):
    return os.path.isfile(filepath) and imghdr.what(filepath)


def get_output_path(title):
    title = title.replace(" ", "_")
    here = os.path.dirname(__file__)
    return os.path.join(here, "../", "{0}_Gallery.html".format(title))


def reset_confirmation():
    sys.stdout.write("\033[F\033[K")
    sys.stdout.write("\033[F\033[K")
    sys.stdout.write("\033[F\033[K")
    log_replace_line("Please answer yes or no. (y/n)")


def ask_user_to_confirm(title):
    confirmations = ["yes", "y"]
    valid_responses = confirmations + ["no", "n"]

    message = """
    \rGallery `{0}` already exists.
    \rDo you wish to overwrite the current gallery?
    \r""".format(title)

    while True:
        try:
            response = input(message)
        except ValueError:
            reset_confirmation()
            continue

        if response not in valid_responses:
            reset_confirmation()
            continue
        else:
            return response in confirmations
