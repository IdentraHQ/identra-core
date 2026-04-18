import re

with open("components/sections/HowIdentraWorks.tsx", "r") as f:
    content = f.read()

print(content[content.find("return ("):])
