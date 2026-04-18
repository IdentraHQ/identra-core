import re

with open("components/sections/ProductExperience.tsx", "r") as f:
    content = f.read()

# Replace massive background blur filters with simpler colored backgrounds for mobile
old_card_bg = """className="flex-1 flex flex-col relative min-w-0 bg-background/50 z-0" """
new_card_bg = """className="flex-1 flex flex-col relative min-w-0 bg-background/90 md:bg-background/50 z-0" """
content = content.replace(old_card_bg, new_card_bg)

old_backdrop = "backdrop-blur-2xl"
new_backdrop = "backdrop-blur-md md:backdrop-blur-2xl"
content = content.replace(old_backdrop, new_backdrop)

old_mac = "backdrop-blur-xl"
new_mac = "backdrop-blur-md md:backdrop-blur-xl"
content = content.replace(old_mac, new_mac)

with open("components/sections/ProductExperience.tsx", "w") as f:
    f.write(content)
