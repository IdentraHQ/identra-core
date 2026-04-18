import re

with open("app/globals.css", "r") as f:
    content = f.read()

content = content.replace("overflow-x: hidden;", "overflow-x: clip;")

with open("app/globals.css", "w") as f:
    f.write(content)
