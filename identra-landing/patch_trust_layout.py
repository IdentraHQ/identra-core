import re

with open("components/sections/SecurityTrust.tsx", "r") as f:
    content = f.read()

# Adjust padding and heights for smaller phone viewports
content = content.replace(
    'className="p-8 md:p-10 flex items-start gap-8 h-full"',
    'className="p-6 md:p-10 flex items-start gap-4 md:gap-8 h-full"'
)

# Text scaling
content = content.replace(
    'text-2xl font-medium text-white',
    'text-xl md:text-2xl font-medium text-white'
)

content = content.replace(
    'text-base text-muted-foreground/80',
    'text-sm md:text-base text-muted-foreground/80'
)

# Responsive gaps for the data vis portions
content = content.replace(
    'p-6 relative overflow-hidden group',
    'p-4 md:p-6 relative overflow-hidden group'
)
content = content.replace(
    'p-6 relative overflow-hidden flex',
    'p-4 md:p-6 relative overflow-hidden flex'
)
content = content.replace(
    'p-6 flex items-center',
    'p-4 md:p-6 flex items-center'
)

with open("components/sections/SecurityTrust.tsx", "w") as f:
    f.write(content)
