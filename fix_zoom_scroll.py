import re

with open("src/pages/Home.jsx", "r") as f:
    home = f.read()

# 1. Add zoomTrackerRef state
state_replace = """
  const [zoomTrackerRef, setZoomTrackerRef] = useState(null);
  const { scrollYProgress: zoomProgress } = useScroll({
    target: zoomTrackerRef,
    offset: ["start start", "end end"]
  });
"""
home = home.replace("  const heroWrapperRef = useRef(null);", "  const heroWrapperRef = useRef(null);\n" + state_replace)

# 2. Change SwitchEventCard prop to use zoomProgress instead of heroProgress
home = home.replace("scrollYProgress={heroProgress}", "scrollYProgress={zoomProgress}")

# 3. Add the zoomTrackerRef div inside heroWrapperRef
tracker_div = """      <section ref={heroWrapperRef} style={{ height: `calc(300vh + ${contentHeight}px)`, position: 'relative', zIndex: 20 }}>
        <div ref={setZoomTrackerRef} style={{ position: 'absolute', top: 0, height: '300vh', width: '100%', pointerEvents: 'none' }} />"""

home = re.sub(r'<section ref=\{heroWrapperRef\} style=\{\{ height: `calc\(300vh \+ \$\{contentHeight\}px\)`,\s*position: \'relative\', zIndex: 20 \}\}>', tracker_div, home)

with open("src/pages/Home.jsx", "w") as f:
    f.write(home)

print("Home.jsx zoom tracking updated.")
