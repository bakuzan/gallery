from os.path import abspath, dirname, join
from configparser import SafeConfigParser, NoSectionError


def get_gallery_config():
    configFilePath = abspath(join(dirname(__file__), '../', 'config.txt'))

    parser = SafeConfigParser()
    parser.read(configFilePath)

    return parser


def get_section(cfg, section, defaults):
    try:
        values = dict(cfg.items("colours"))
        return {**defaults, **values}
    except NoSectionError:
        return defaults
