import re

with open("src/pages/Home.jsx", "r") as f:
    home = f.read()

# We need to change heroWrapperRef from height '300vh' to a dynamic height.
# And add the contentY transform.
# But wait, we also need to pass this contentY to SwitchEventCard, OR just apply it to the content wrapper inside Home!
# Since the content is defined in Home.jsx, we can just wrap it in a motion.div!

# 1. Add states and imports
state_imports = """
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const obs = new ResizeObserver(entries => {
        setContentHeight(entries[0].contentRect.height);
    });
    obs.observe(contentRef.current);
    return () => obs.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const [vh2, setVh2] = useState(2000);
  useEffect(() => { setVh2(window.innerHeight * 2); }, []);
  const contentY = useTransform(scrollY, [vh2, vh2 + contentHeight], [0, -contentHeight]);
"""

home = home.replace("  const [innerScrollRef, setInnerScrollRef] = useState(null);", "  const [innerScrollRef, setInnerScrollRef] = useState(null);\n" + state_imports)

# 2. Change heroWrapperRef height
home = re.sub(r'<section ref=\{heroWrapperRef\} style=\{\{ height: \'300vh\',', 
              r'<section ref={heroWrapperRef} style={{ height: `calc(300vh + ${contentHeight}px)`,', home)

# 3. Apply motion.div to the content
content_start = """                         <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>"""
content_replace = """                         <motion.div ref={contentRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', y: contentY }}>"""
home = home.replace(content_start, content_replace)
home = home.replace("                         </div>\n                     );\n                 }}", "                         </motion.div>\n                     );\n                 }}")

with open("src/pages/Home.jsx", "w") as f:
    f.write(home)

print("Home.jsx updated for native scrolling.")
