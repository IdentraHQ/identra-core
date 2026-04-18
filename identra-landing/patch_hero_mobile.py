import re

with open("components/sections/Hero.tsx", "r") as f:
    content = f.read()

# 1. Update font size of the main heading
content = content.replace(
    '<h1 className="font-display text-5xl md:text-7xl lg:text-8xl', 
    '<h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl'
)

# 2. Update the Hero container structure to allow background fallback gradient and vertical alignment on mobile
old_layout = """    return (
        <section id="hero-section" className="relative h-screen w-full flex items-center overflow-hidden bg-transparent">
            {/* Atmosphere Layer: Volumetric Light & Fog */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* 1. Top-Left Spotlight REMOVED */}
                {/* 2. Bottom Fog REMOVED */}
            </div>



            {/* Content Layer */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-24 w-full">"""

new_layout = """    return (
        <section id="hero-section" className="relative min-h-[100svh] w-full flex flex-col justify-center pt-24 pb-12 md:pt-0 md:pb-0 overflow-hidden bg-transparent">
            {/* Atmosphere Layer: Volumetric Light & Fog */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Mobile Text Readability Gradient */}
                <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-[#030304] via-[#030304]/80 to-transparent md:hidden z-0" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 lg:px-24 w-full">"""

content = content.replace(old_layout, new_layout)

# 3. Update the CTA margin for mobile separation
content = content.replace(
    'className="flex flex-col w-full max-w-lg mt-4"',
    'className="flex flex-col w-full max-w-lg mt-8 md:mt-4"'
)

with open("components/sections/Hero.tsx", "w") as f:
    f.write(content)

print("Patched Hero layout!")
