import re

with open("components/sections/HowIdentraWorks.tsx", "r") as f:
    content = f.read()

# Add base unblurred/visible styles for mobile
content = content.replace(
    "${isActive ? 'md:scale-100 md:opacity-100 md:blur-0' : 'md:scale-90 md:opacity-30 md:blur-[2px]'}",
    "opacity-100 scale-100 blur-0 ${isActive ? 'md:scale-100 md:opacity-100 md:blur-0' : 'md:scale-90 md:opacity-30 md:blur-[2px]'}"
)

# Replace the messy background interpolation logic with consistent simple logic
content = content.replace(
    "bg-gradient-to-br from-[#0f0f10] to-black border-white/20 border ${isActive ? 'md:bg-gradient-to-br md:from-[#0f0f10] md:to-black md:border-white/20 md:shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)]' : 'md:bg-black/40 md:border-white/5'}",
    "border ${isActive ? 'bg-gradient-to-br from-[#0f0f10] to-black border-white/20 shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)]' : 'bg-black/40 border-white/5 md:bg-black/40 md:border-white/5'}"
)

with open("components/sections/HowIdentraWorks.tsx", "w") as f:
    f.write(content)
