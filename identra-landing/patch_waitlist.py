import re

with open("components/ui/WaitlistForm.tsx", "r") as f:
    content = f.read()

content = content.replace("backdrop-blur-xl", "backdrop-blur-md md:backdrop-blur-xl")

with open("components/ui/WaitlistForm.tsx", "w") as f:
    f.write(content)
