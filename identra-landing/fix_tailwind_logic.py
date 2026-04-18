import re

with open("components/sections/HowIdentraWorks.tsx", "r") as f:
    content = f.read()

# Fix 1
content = content.replace(
    "md:${isActive ? 'scale-100 opacity-100 blur-0' : 'scale-90 opacity-30 blur-[2px]'}",
    "${isActive ? 'md:scale-100 md:opacity-100 md:blur-0' : 'md:scale-90 md:opacity-30 md:blur-[2px]'}"
)

# Fix 2
content = content.replace(
    "md:${isActive ? 'bg-gradient-to-br from-[#0f0f10] to-black border-white/20 shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)]' : 'bg-black/40 border-white/5'}",
    "${isActive ? 'md:bg-gradient-to-br md:from-[#0f0f10] md:to-black md:border-white/20 md:shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)]' : 'md:bg-black/40 md:border-white/5'}"
)

# Fix 3
content = content.replace(
    "md:${isActive ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'}",
    "${isActive ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-40 md:translate-y-2'}"
)

# Fix 4
content = content.replace(
    "md:${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}",
    "${isActive ? 'md:w-full md:opacity-100' : 'md:w-0 md:opacity-0'}"
)

# Fix 5
content = content.replace(
    "md:${isActive ? 'translate-x-0' : '-translate-x-4'}",
    "${isActive ? 'md:translate-x-0' : 'md:-translate-x-4'}"
)

# Fix 6
content = content.replace(
    "md:${isActive ? 'max-h-40 opacity-80' : 'max-h-0 opacity-0'}",
    "${isActive ? 'md:max-h-40 md:opacity-80' : 'md:max-h-0 md:opacity-0'}"
)

with open("components/sections/HowIdentraWorks.tsx", "w") as f:
    f.write(content)
