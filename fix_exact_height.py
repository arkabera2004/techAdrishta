import re

with open("src/components/SwitchEventCard.jsx", "r") as f:
    switch = f.read()

# 1. Add states for screenHeight and navbarHeight
state_match = "const [isScrolling, setIsScrolling] = useState(false);"
new_states = """const [isScrolling, setIsScrolling] = useState(false);
    const [screenHeight, setScreenHeight] = useState(0);
    const [navbarHeight, setNavbarHeight] = useState(0);"""
switch = switch.replace(state_match, new_states)

# 2. Add ref to switch-screen-scroll to capture screenHeight
scroll_div_match = """<div
                        ref={scrollRef}
                        className={`switch-screen-scroll w-full h-full relative overflow-hidden`}"""
new_scroll_div = """<div
                        ref={el => {
                            if (el) {
                                scrollRef.current = el;
                                if (screenHeight === 0) setScreenHeight(el.clientHeight);
                            }
                        }}
                        className={`switch-screen-scroll w-full h-full relative overflow-hidden`}"""
switch = switch.replace(scroll_div_match, new_scroll_div)

# 3. Add ref to Navbar to capture navbarHeight
navbar_match = """<div className="w-full flex justify-between items-center px-[4cqi] py-[1.5cqi] border-b border-[rgba(135,206,235,0.15)] animate-in fade-in slide-in-from-top-4 duration-700 relative z-20">"""
new_navbar = """<div 
                                ref={el => { if (el && navbarHeight === 0) setNavbarHeight(el.clientHeight); }}
                                className="w-full flex justify-between items-center px-[4cqi] py-[1.5cqi] border-b border-[rgba(135,206,235,0.15)] animate-in fade-in slide-in-from-top-4 duration-700 relative z-20">"""
switch = switch.replace(navbar_match, new_navbar)

# 4. Update the heights of PixelMario and AboutContent to use the calculated pixel height
# For PixelMario:
pixel_mario_match = """className="w-full flex-shrink-0 flex flex-col items-center relative z-10" style={{ height: "36.7cqi" }}"""
new_pixel_mario = """className="w-full flex-shrink-0 flex flex-col items-center relative z-10" style={{ height: screenHeight && navbarHeight ? `${screenHeight - navbarHeight}px` : "36.7cqi" }}"""
switch = switch.replace(pixel_mario_match, new_pixel_mario)

# For AboutContent:
about_content_match = """style={{ height: "36.7cqi", padding: '1.5cqi 2cqi 1cqi 2cqi', transition: 'opacity 0.25s ease', opacity: blackFade ? 0 : 1 }}"""
new_about_content = """style={{ height: screenHeight && navbarHeight ? `${screenHeight - navbarHeight}px` : "36.7cqi", padding: '1.5cqi 2cqi 1cqi 2cqi', transition: 'opacity 0.25s ease', opacity: blackFade ? 0 : 1 }}"""
switch = switch.replace(about_content_match, new_about_content)

# 5. Make sure the window resize updates the heights!
resize_effect = """
    useEffect(() => {
        const handleResize = () => {
            if (scrollRef.current) setScreenHeight(scrollRef.current.clientHeight);
            // We can't easily query navbar here without a ref, but it scales proportionally so updating screenHeight is good enough.
            // Actually, let's just trigger a re-render and let the refs update it.
            setScreenHeight(0);
            setNavbarHeight(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
"""
switch = switch.replace(state_match, state_match + "\n" + resize_effect)

with open("src/components/SwitchEventCard.jsx", "w") as f:
    f.write(switch)

print("Updated SwitchEventCard for exact pixel heights.")
