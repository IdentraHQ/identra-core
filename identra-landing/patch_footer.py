import re

with open("components/sections/DownloadFooter.tsx", "r") as f:
    content = f.read()

# Hide heavy nebulas and scanning beam on mobile by adding `hidden md:block`

nebula_1_old = """className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none\""""
nebula_1_new = """className="hidden md:block absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none\""""
content = content.replace(nebula_1_old, nebula_1_new)

nebula_2_old = """className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none\""""
nebula_2_new = """className="hidden md:block absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none\""""
content = content.replace(nebula_2_old, nebula_2_new)

beam_old = """className="absolute inset-x-0 h-[200px] bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none\""""
beam_new = """className="hidden md:block absolute inset-x-0 h-[200px] bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none\""""
content = content.replace(beam_old, beam_new)

# Optimize waitlist form container width for mobile to prevent overflow
form_old = """className="w-full md:w-[450px]\""""
form_new = """className="w-full max-w-[100vw] md:w-[450px] overflow-hidden md:overflow-visible px-2 md:px-0\""""
content = content.replace(form_old, form_new)

with open("components/sections/DownloadFooter.tsx", "w") as f:
    f.write(content)

