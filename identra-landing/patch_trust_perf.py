import re

with open("components/sections/SecurityTrust.tsx", "r") as f:
    content = f.read()

# 1. Remove the dynamic blur filter that causes extreme lag on scroll
content = content.replace(
    'const card1Filter = useTransform(scrollYProgress, [0.3, 0.8], ["blur(0px)", "blur(4px)"]);',
    '// Removed heavy dynamic blur for mobile performance\n    // const card1Filter = useTransform(scrollYProgress, [0.3, 0.8], ["blur(0px)", "blur(4px)"]);'
)

content = content.replace(
    'style={{ scale: card1Scale, opacity: card1Opacity, filter: card1Filter }}',
    'style={{ scale: card1Scale, opacity: card1Opacity }}'
)

# 2. Optimize backdrop blur
content = content.replace(
    'backdrop-blur-xl',
    'backdrop-blur-md md:backdrop-blur-xl'
)

# 3. Optimize massive heavy drop-shadows on mobile stack panels
content = content.replace(
    'shadow-[0_-10px_40px_rgba(0,0,0,0.5)]',
    'shadow-2xl md:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]'
)

content = content.replace(
    'shadow-[0_-20px_80px_rgba(0,0,0,0.8)]',
    'shadow-2xl md:shadow-[0_-20px_80px_rgba(0,0,0,0.8)]'
)

# 4. Limit the animated bars on mobile to save CPU
content = content.replace(
    '{[...Array(16)].map((_, i) => (',
    '{[...Array(8)].map((_, i) => ('
)

with open("components/sections/SecurityTrust.tsx", "w") as f:
    f.write(content)
