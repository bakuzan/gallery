from jinja2 import Environment, FileSystemLoader, Markup


def include_raw(filename):
    return Markup(loader.get_source(self, filename)[0])


def get_jinja_env():
    loader = FileSystemLoader(['templates', 'styles', 'js'])
    env = Environment(loader=loader)
    env.globals['include_raw'] = include_raw
    return env