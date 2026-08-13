import re

with open("src/components/SwitchEventCard.jsx", "r") as f:
    switch = f.read()

# 1. Add isScrolling state
import_match = "const [pressed, setPressed] = useState(null);"
is_scrolling_code = """
    const [pressed, setPressed] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        return effectiveScroll.onChange(v => {
            setIsScrolling(v >= 0.99);
        });
    }, [effectiveScroll]);
"""
switch = switch.replace(import_match, is_scrolling_code)

# 2. Fix Pixel Mario conditional
pixel_mario_cond = "{(bootState === 'C' || bootState === 'D' || bootState === 'E') && ("
new_pixel_mario_cond = "{(bootState === 'C' || bootState === 'D' || isScrolling) && ("
switch = switch.replace(pixel_mario_cond, new_pixel_mario_cond)

# 3. Fix About Content conditional
about_content_cond = "{(bootState === 'D' || bootState === 'E') && ("
new_about_content_cond = "{(bootState === 'E' || isScrolling) && ("
switch = switch.replace(about_content_cond, new_about_content_cond)

with open("src/components/SwitchEventCard.jsx", "w") as f:
    f.write(switch)

print("Updated SwitchEventCard to use isScrolling state.")
