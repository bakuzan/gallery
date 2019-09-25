from os import listdir, path
import base64
import datetime
import timeit
import imghdr

from jinja.env import get_jinja_env
from config import get_gallery_config
from models import Item
from consts import DEFAULT_COLOURS


def get_gallery_template():
    env = get_jinja_env()
    return env.get_template('index.html')


def get_item_from_file(filepath, filename):
    [name, ext] = filename.split(".")
    prefix = "data:image/%s;base64," % ext

    with open(filepath, "rb") as image_file:
        raw_bytes = base64.b64encode(image_file.read())
        encoded_string = prefix + raw_bytes.decode()
        return Item(name, encoded_string)


def get_items_from_directory(base_path, files, recursive):
    bases = []
    groups = []

    for filename in files:
        filepath = path.join(base_path, filename)

        if path.isdir(filepath) and recursive:
            nested_files = listdir(filepath)
            g_items = get_items_from_directory(
                filepath, nested_files, recursive)
            g = Group(filename, g_items)
            groups.append(g)

        if path.isfile(filepath) and imghdr.what(filepath):
            item = get_item_from_file(filepath, filename)
            bases.append(item)

    return bases


def read_files(base_path, files, recursive):
    bases = get_items_from_directory(base_path, files, recursive)
    return bases


def save_gallery(title, data):
    title = title.replace(" ", "_")
    here = path.dirname(__file__)
    output_path = path.join(here, "../", "%s_Gallery.html" % title)

    with open(output_path, "w") as jin:
        jin.write(data)


if __name__ == "__main__":
    start_time = timeit.default_timer()

    cfg = get_gallery_config()
    gallery_path = cfg.get("setup", "location")
    title = cfg.get("setup", "title")
    row_height = cfg.get("setup", "row_height", fallback=150)
    recursive = cfg.getboolean("setup", "recursive", fallback=False)

    colours = cfg._sections["colours"]
    colours = colours if colours is not None else DEFAULT_COLOURS
    colours = {**DEFAULT_COLOURS, **colours}

    files = listdir(gallery_path)
    items = read_files(gallery_path, files, recursive)

    template = get_gallery_template()
    output = template.render(title=title,
                             items=items,
                             row_height=row_height,
                             colours=colours,
                             location=gallery_path,
                             date=datetime.datetime.now())

    save_gallery(title, output)

    end_time = timeit.default_timer()
    time_taken = end_time - start_time
    print("Generated %s gallery in %s seconds" % (title, time_taken))
