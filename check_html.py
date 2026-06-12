from html.parser import HTMLParser

class TagCounter(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in ['img', 'br', 'hr', 'input', 'link', 'meta']:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag not in ['img', 'br', 'hr', 'input', 'link', 'meta']:
            if self.stack and self.stack[-1][0] == tag:
                self.stack.pop()
            else:
                top = self.stack[-1][0] if self.stack else "EMPTY"
                self.errors.append(f"Mismatched closing tag </{tag}> at line {self.getpos()[0]}. Top of stack was <{top}>")

parser = TagCounter()
parser.feed(open('index.html').read())

for e in parser.errors:
    print(e)
