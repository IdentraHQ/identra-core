import re

with open("components/sections/ProblemInsight.tsx", "r") as f:
    content = f.read()

# Remove the nasty blur on mobile and simplify motion math
old_blur_vars = """    // Diffusion effect
    const blur = useTransform(scrollYProgress, [0.90, 1], ["blur(0px)", "blur(20px)"]);
    const contentOpacity = useTransform(scrollYProgress, [0.90, 1], [1, 0]);
    const scale = useTransform(scrollYProgress, [0.90, 1], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0.90, 1], [0, -50]);"""

new_blur_vars = """    // Simple fade transition (removed heavy blur filter for performance)
    const contentOpacity = useTransform(scrollYProgress, [0.90, 1], [1, 0]);
    const scale = useTransform(scrollYProgress, [0.90, 1], [1, 0.95]);
    const y = useTransform(scrollYProgress, [0.90, 1], [0, -20]);"""
content = content.replace(old_blur_vars, new_blur_vars)

old_motion_div = """<motion.div style={{ filter: blur, opacity: contentOpacity, scale, y }} className="relative w-full text-center h-full flex items-center justify-center">"""
new_motion_div = """<motion.div style={{ opacity: contentOpacity, scale, y }} className="relative w-full text-center h-full flex items-center justify-center">"""
content = content.replace(old_motion_div, new_motion_div)

old_noise = """            <div
                className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            />"""

new_noise = """            {/* Grain disabled/simplified to reduce scroll lag */}
            <div
                className="absolute inset-0 opacity-[0.01] pointer-events-none md:mix-blend-overlay hidden md:block"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            />"""
content = content.replace(old_noise, new_noise)

with open("components/sections/ProblemInsight.tsx", "w") as f:
    f.write(content)
