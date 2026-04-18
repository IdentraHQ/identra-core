import re

with open("components/ui/SecureCoreScene.tsx", "r") as f:
    content = f.read()

# I am going to alter the MetallicRubiksCube group initial position based on window viewport if it's not strictly using GSAP. 
# Oh wait, GSAP is managing it. Let's just adjust the JSX default and let GSAP take over.
# It's better to give the <group> an ID and apply CSS, or conditionally render in JS. 
# BUT the safest way is inside useLayoutEffect matchMedia, since that executes immediately before paint.

# Let's adjust the useLayoutEffect completely to use matchMedia properly!
old_effect = """    useLayoutEffect(() => {
        const ctx = gsap.context(() => {"""

new_effect = """    useLayoutEffect(() => {
        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isDesktop, isMobile } = context.conditions as any;
            
            if (!cubesGroupRef.current || !pivotRef.current || !groupRef.current) return;

            // Immediately set mobile vs desktop base scale and position
            gsap.set(groupRef.current.scale, { 
                x: isDesktop ? 1 : 0.6, 
                y: isDesktop ? 1 : 0.6, 
                z: isDesktop ? 1 : 0.6 
            });
            gsap.set(groupRef.current.position, { 
                x: isDesktop ? 3.8 : 0, 
                y: isDesktop ? -0.2 : -4.0, // Push very low on mobile so text is completely free
                z: -4.5 
            });

"""

# We'll use the replace string tool for safety instead.
