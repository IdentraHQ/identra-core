import re

with open("app/globals.css", "r") as f:
    content = f.read()

# Fix the white patch flashing on scroll
new_bg = """  background-color: #030304 !important;
  color-scheme: dark;"""

content = content.replace("  background: transparent !important;", new_bg)

with open("app/globals.css", "w") as f:
    f.write(content)
