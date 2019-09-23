from os import path
from jinja2 import Environment, FileSystemLoader
import base64

from config import get_gallery_config


def get_gallery_template():
    env = Environment(loader=FileSystemLoader('templates'))
    return env.get_template('index.html')


def read_files(base_path, files):
    bases = []

    for file in files:
        if path.isfile(file):
            filepath = path.join(base_path, file)

            with open(filepath, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read())
                bases.append(encoded_string)

    return bases


def save_gallery(title, data):
    title = title.replace(" ", "_")
    output_path = path.join("../", "%s_Gallery.html" % title)
    with open(output_path, "w") as jin:
        jin.write(data)


if __name__ == "__main__":
    cfg = get_gallery_config()
    gallery_path = cfg.get("setup", "location")
    title = cfg.get("setup", "title")

    files = os.listdir(gallery_path)
    files_as_b64 = read_files(gallery_path, files)

    template = get_gallery_template()
    output = template.render(foo='Hello World!')

    save_gallery(title, output)
    print("Generated %s gallery" % title)
