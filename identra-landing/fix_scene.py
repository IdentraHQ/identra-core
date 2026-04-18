import re

with open("components/ui/SecureCoreScene.tsx", "r") as f:
    content = f.read()

# I am doing a very safe string replacement using python 
old_effect = """    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!cubesGroupRef.current || !pivotRef.current || !groupRef.current) return;

            const allCubes = [...cubesGroupRef.current.children];"""

new_effect = """    useLayoutEffect(() => {
        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isDesktop, isMobile } = context.conditions as any;
            
            if (!cubesGroupRef.current || !pivotRef.current || !groupRef.current) return;

            // Base scale and position adjustment for mobile 
            gsap.set(groupRef.current.scale, { 
                x: isDesktop ? 1.05 : 0.65, 
                y: isDesktop ? 1.05 : 0.65, 
                z: isDesktop ? 1.05 : 0.65 
            });
            gsap.set(groupRef.current.position, { 
                x: isDesktop ? 3.8 : 0, 
                y: isDesktop ? -0.2 : -3.5, // Pulls the cube safely to the bottom of the phone screen
                z: -4.5 
            });

            const allCubes = [...cubesGroupRef.current.children];"""

content = content.replace(old_effect, new_effect)


old_scroll = """            // 3. Scroll Interactions
            gsap.to(groupRef.current!.position, {
                y: 2,
                z: -5,
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            });

            const problemTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: "#problem-section",
                    start: "top center",
                    end: "bottom center",
                    scrub: 1.5,
                }
            });

            allCubes.forEach((mesh: any) => {
                if (!mesh.isMesh) return;
                const targetX = mesh.userData.origX * 5.0;
                const targetY = mesh.userData.origY * 5.0;
                const targetZ = mesh.userData.origZ * 5.0;
                
                problemTimeline.to(mesh.position, {
                    x: targetX,
                    y: targetY,
                    z: targetZ,
                    ease: "power2.inOut"
                }, 0);

                problemTimeline.to(mesh.rotation, {
                    x: Math.random() * Math.PI * 2,
                    y: Math.random() * Math.PI * 2,
                    z: Math.random() * Math.PI * 2,
                    ease: "power2.inOut"
                }, 0);
            });

            gsap.to(groupRef.current!.position, {
                z: -40, 
                ease: "power2.in",
                scrollTrigger: {
                    trigger: "#howidentraworks",
                    start: "top bottom", 
                    end: "top center",   
                    scrub: 1,
                }
            });
            gsap.to(groupRef.current!.scale, {
                x: 0,
                y: 0,
                z: 0,
                ease: "power2.in",
                scrollTrigger: {
                    trigger: "#howidentraworks",
                    start: "top bottom",
                    end: "top center",
                    scrub: 1,
                }
            });
        });"""


new_scroll = """            // 3. Scroll Interactions Responsive
            gsap.to(groupRef.current!.position, {
                y: isDesktop ? 2 : 0, // travel less on mobile
                z: isDesktop ? -5 : -3, 
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: isDesktop ? 1 : 0.8,
                    invalidateOnRefresh: true,
                }
            });

            const problemTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: "#problem-section",
                    start: "top center",
                    end: "bottom center",
                    scrub: isDesktop ? 1.5 : 1,
                    invalidateOnRefresh: true,
                }
            });

            const spreadFactor = isDesktop ? 5.0 : 2.5; 
            const rotFactor = isDesktop ? (Math.PI * 2) : Math.PI;

            allCubes.forEach((mesh: any) => {
                if (!mesh.isMesh) return;
                
                problemTimeline.to(mesh.position, {
                    x: mesh.userData.origX * spreadFactor,
                    y: mesh.userData.origY * spreadFactor,
                    z: mesh.userData.origZ * spreadFactor,
                    ease: "power2.inOut"
                }, 0);

                problemTimeline.to(mesh.rotation, {
                    x: Math.random() * rotFactor,
                    y: Math.random() * rotFactor,
                    z: Math.random() * rotFactor,
                    ease: "power2.inOut"
                }, 0);
            });

            gsap.to(groupRef.current!.position, {
                z: isDesktop ? -40 : -20, 
                ease: "power2.in",
                scrollTrigger: {
                    trigger: "#howidentraworks",
                    start: "top bottom", 
                    end: "top center",   
                    scrub: isDesktop ? 1 : 0.8,
                    invalidateOnRefresh: true,
                }
            });
            
            if (isDesktop) {
                gsap.to(groupRef.current!.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    ease: "power2.in",
                    scrollTrigger: {
                        trigger: "#howidentraworks",
                        start: "top bottom",
                        end: "top center",
                        scrub: 1,
                    }
                });
            }
        });

        return () => mm.revert(); // clean up matchMedia context"""

content = content.replace(old_scroll, new_scroll)
content = content.replace("        return () => ctx.revert();\n    }, []);", "    }, []);")

with open("components/ui/SecureCoreScene.tsx", "w") as f:
    f.write(content)

print("Patched SecureCoreScene matchMedia logic.")
