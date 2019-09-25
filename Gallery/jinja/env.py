from os.path import abspath, dirname, join
from jinja2 import Environment, FileSystemLoader, Markup


def include_raw(env):
    return lambda filename: Markup(env.loader.get_source(env, filename)[0])


def get_jinja_env():
    loader = FileSystemLoader('templates')
    env = Environment(loader=loader)
    env.globals['include_raw'] = include_raw(env)
    return env
