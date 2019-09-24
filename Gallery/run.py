from os import listdir, path
from jinja2 import Environment, FileSystemLoader
import base64
import datetime
import timeit
import imghdr

from config import get_gallery_config
from models import Item


def get_gallery_template():
    loader = FileSystemLoader('templates')
    env = Environment(loader=loader)
    return env.get_template('index.html')


def read_files(base_path, files):
    bases = []

    for filename in files:
        filepath = path.join(base_path, filename)
        [name, ext] = filename.split(".")

        if path.isfile(filepath) and imghdr.what(filepath):
            prefix = "data:image/%s;base64," % ext

            with open(filepath, "rb") as image_file:
                raw_bytes = base64.b64encode(image_file.read())
                encoded_string = prefix + raw_bytes.decode()
                item = Item(name, encoded_string)
                bases.append(item)

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

    files = listdir(gallery_path)
    items = read_files(gallery_path, files)

    template = get_gallery_template()
    output = template.render(title=title,
                             items=items,
                             row_height=row_height,
                             location=gallery_path,
                             date=datetime.datetime.now())

    save_gallery(title, output)

    end_time = timeit.default_timer()
    time_taken = end_time - start_time
    print("Generated %s gallery in %s seconds" % (title, time_taken))
