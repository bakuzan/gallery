
class Item:
    def __init__(self, name, image):
        self.name = name
        self.image = image


class Group:
    def __init__(self, name, items=[]):
        self.name = name
        self.items = items

    def add(self, item):
        self.items.append(item)
