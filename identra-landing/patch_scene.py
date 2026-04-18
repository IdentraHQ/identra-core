import re

with open("components/ui/SecureCoreScene.tsx", "r") as f:
    content = f.read()

# Make it performant by using Dpr and rendering simple stuff conditionally
# and hiding sparkles

# Let's replace the sparkles and lights section:
old_sparkles = """                <MetallicRubiksCube />

                <Sparkles count={800} scale={15} size={1.2} speed={0.4} opacity={0.15} color="#ffffff" />
                <Sparkles count={200} scale={12} size={2.5} speed={0.8} opacity={0.25} color="#4fd1c5" />

                {/* Reduced ambient wash to allow real metallic contrast, boosted point lights for bright highlights */}
                <ambientLight intensity={0.4} />
                <rectAreaLight width={20} height={20} position={[0, 10, 0]} color={"#ffffff"} intensity={8} />
                <pointLight position={[-10, 5, -5]} intensity={25} color="#6366f1" />
                <pointLight position={[10, -5, 5]} intensity={30} color="#ffffff" />
                <pointLight position={[5, 10, 5]} intensity={15} color="#4fd1c5" />"""

new_sparkles = """                <MetallicRubiksCube />

                {/* Optimize light & sparkles for performance */}
                <group visible={typeof window !== 'undefined' && window.innerWidth > 768}>
                    <Sparkles count={400} scale={15} size={1.2} speed={0.4} opacity={0.15} color="#ffffff" />
                    <Sparkles count={100} scale={12} size={2.5} speed={0.8} opacity={0.25} color="#4fd1c5" />
                    <rectAreaLight width={20} height={20} position={[0, 10, 0]} color={"#ffffff"} intensity={8} />
                </group>

                <ambientLight intensity={0.4} />
                <pointLight position={[-10, 5, -5]} intensity={15} color="#6366f1" />
                <pointLight position={[10, -5, 5]} intensity={20} color="#ffffff" />
                <pointLight position={[5, 10, 5]} intensity={10} color="#4fd1c5" />"""

content = content.replace(old_sparkles, new_sparkles)

old_mat = """    // Ultra-Premium Dark Gunmetal / Obsidian Finish
    const metallicMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#0d0d12",      // Deep black/gunmetal base
        emissive: "#000000",   
        metalness: 1.0,        // Fully metallic
        roughness: 0.15,       // Slight diffusion for a heavy, expensive matte-shine look
        clearcoat: 1.0,        // Glossy outer shell
        clearcoatRoughness: 0.05, 
        envMapIntensity: 2.5,  // Bright enough to catch the studio highlights
        iridescence: 0.1,      // Extremely subtle tech sheen
        iridescenceIOR: 1.4,
    }), []);"""

new_mat = """    // Adaptive Premium Material (Drops heavy features on mobile)
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const metallicMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#0d0d12",
        emissive: "#000000",   
        metalness: 0.9,        
        roughness: 0.2,       
        clearcoat: isMobile ? 0 : 1.0,        // Disable expensive clearcoat on mobile
        clearcoatRoughness: 0.05, 
        envMapIntensity: isMobile ? 1.5 : 2.5,  
        iridescence: isMobile ? 0 : 0.1,      // Disable iridescence on mobile
        iridescenceIOR: 1.4,
    }), [isMobile]);"""

content = content.replace(old_mat, new_mat)

old_canvas = """            <Canvas
                camera={{ position: [0, 0, 12], fov: 35 }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
                dpr={[1, 1.5]}
            >"""

new_canvas = """            <Canvas
                camera={{ position: [0, 0, 12], fov: 35 }}
                gl={{
                    antialias: typeof window !== 'undefined' && window.innerWidth > 768, // Disable AA on mobile
                    alpha: false,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
                dpr={typeof window !== 'undefined' && window.innerWidth > 768 ? [1, 1.5] : 1} // Limit to 1 on mobile
            >"""

content = content.replace(old_canvas, new_canvas)

with open("components/ui/SecureCoreScene.tsx", "w") as f:
    f.write(content)

