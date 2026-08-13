import re

with open("src/pages/Home.jsx", "r") as f:
    content = f.read()

# Find the start of the Speakers section
split_marker = "{/* ─── SPEAKERS (Sticky Layer) ─── */}"
idx = content.find(split_marker)

if idx != -1:
    # We want to keep everything before idx
    new_content = content[:idx]
    
    # We need to add the closing tags for Home component and the styles block
    styles_idx = content.find("const iconBtnStyle")
    if styles_idx != -1:
        new_content += """
    </main>
  );
}

""" + content[styles_idx:]
    else:
        print("Could not find styles block")
    
    with open("src/pages/Home.jsx", "w") as f:
        f.write(new_content)
    print("Successfully deleted lower sections!")
else:
    print("Could not find speakers section")

