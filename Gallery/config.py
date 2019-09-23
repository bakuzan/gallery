from os.path import abspath, dirname, join
from configparser import ConfigParser


def get_gallery_config():
    configFilePath = abspath(join(dirname(__file__), '../', 'config.txt'))

    parser = ConfigParser()
    parser.read(configFilePath)

    return parser
