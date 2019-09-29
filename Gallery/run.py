import os
import base64
import datetime
import timeit
from pathlib import Path

from utils import ask_user_to_confirm, get_gallery_template, get_output_path, is_image
from config import get_gallery_config, get_section
from consts import DEFAULT_COLOURS
from models import Group, Item
from messaging import log, log_dict, log_replace_line


def get_item_from_file(filepath, filename):
    [name, ext] = filename.split(".")
    prefix = "data:image/{0};base64,".format(ext)

    with open(filepath, "rb") as image_file:
        raw_bytes = base64.b64encode(image_file.read())
        encoded_string = prefix + raw_bytes.decode()
        return Item(name, encoded_string)


def read_files(base_path, recursive):
    log("Reading files {0}.".format(
        "recursively" if recursive else "shallowly"))
    groups = []

    if recursive:
        for subdir, dirs, files in os.walk(base_path, followlinks=True):
            log("Reading {0}...".format(subdir))
            group_name = subdir.replace(base_path, "")
            items = []

            for filename in files:
                filepath = subdir + os.sep + filename

                if is_image(filepath):
                    item = get_item_from_file(filepath, filename)
                    items.append(item)

            g = Group(group_name, items)
            groups.append(g)
            log_replace_line("Reading {0}...Done".format(subdir))

    else:
        log("Reading {0}...".format(base_path))
        g = Group("")
        groups.append(g)
        files = os.listdir(base_path)

        for filename in files:
            filepath = base_path + os.sep + filename

            if is_image(filepath):
                item = get_item_from_file(filepath, filename)
                g.add(item)

        log_replace_line("Reading {0}...Done".format(base_path))

    return [g for g in groups if len(g.items) > 0]


def save_gallery(title, data):
    log("Saving gallery {0}...".format(title))

    output_path = get_output_path(title)

    with open(output_path, "w") as jin:
        jin.write(data)
        log_replace_line("Saving gallery {0}...Done".format(title))


if __name__ == "__main__":
    start_time = timeit.default_timer()

    cfg = get_gallery_config()
    gallery_path = cfg.get("setup", "location")
    title = cfg.get("setup", "title")
    row_height = cfg.get("setup", "row_height", fallback=150)
    recursive = cfg.getboolean("setup", "recursive", fallback=False)

    colours = get_section(cfg, 'colours', DEFAULT_COLOURS)

    output_path = get_output_path(title)

    if os.path.exists(output_path):
        has_confirmed = ask_user_to_confirm(title)

        if not has_confirmed:
            log("Exiting...")
            os._exit(0)

    log_dict("Generating gallery with config:", cfg._sections)

    groups = read_files(gallery_path, recursive)

    template = get_gallery_template()
    output = template.render(title=title,
                             groups=groups,
                             row_height=row_height,
                             colours=colours,
                             location=gallery_path,
                             date=datetime.datetime.now())

    save_gallery(title, output)

    end_time = timeit.default_timer()
    time_taken = end_time - start_time
    log("Generated {0} gallery in {1} seconds".format(title, time_taken))
