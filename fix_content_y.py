import re

# 1. Update SwitchEventCard.jsx
with open("src/components/SwitchEventCard.jsx", "r") as f:
    switch = f.read()

# Add props
switch = switch.replace(
    "export default function SwitchEventCard({ onBootStateChange, isZoomingOut, scrollYProgress, children }) {",
    "export default function SwitchEventCard({ onBootStateChange, isZoomingOut, scrollYProgress, children, contentY, onContentHeightChange }) {"
)

# Replace the inner block with motion.div
inner_block_start = "                        {/* STATE E: About Content (Single Screen Replacement) */}"
inner_block_replace = """                        <motion.div 
                            style={{ y: contentY, width: '100%', display: 'flex', flexDirection: 'column' }}
                            ref={el => {
                                if (el && onContentHeightChange && !el.dataset.observed) {
                                    el.dataset.observed = 'true';
                                    const obs = new ResizeObserver(entries => {
                                        onContentHeightChange(entries[0].contentRect.height);
                                    });
                                    obs.observe(el);
                                }
                            }}
                        >
                        {/* STATE E: About Content (Single Screen Replacement) */}"""

switch = switch.replace(inner_block_start, inner_block_replace)

# Close the motion div after children
switch = switch.replace(
    "{typeof children === 'function' ? children(scrollRef) : children}\n                        </div>",
    "{typeof children === 'function' ? children(scrollRef) : children}\n                        </motion.div>\n                        </div>"
)

with open("src/components/SwitchEventCard.jsx", "w") as f:
    f.write(switch)

# 2. Update Home.jsx
with open("src/pages/Home.jsx", "r") as f:
    home = f.read()

# Pass props to SwitchEventCard
home = home.replace(
    "<SwitchEventCard \n                onBootStateChange={setBootState} \n                isZoomingOut={bootSequenceTriggered} \n                scrollYProgress={zoomProgress}\n              >",
    "<SwitchEventCard \n                onBootStateChange={setBootState} \n                isZoomingOut={bootSequenceTriggered} \n                scrollYProgress={zoomProgress}\n                contentY={contentY}\n                onContentHeightChange={setContentHeight}\n              >"
)

# Remove motion.div wrapper from children and the ResizeObserver from Home
home = home.replace(
    "const obs = new ResizeObserver(entries => {\n        setContentHeight(entries[0].contentRect.height);\n    });\n    obs.observe(contentRef.current);\n    return () => obs.disconnect();",
    "// ResizeObserver moved to SwitchEventCard"
)

# Replace <motion.div ref={contentRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', y: contentY }}>
# with a normal div
home = home.replace(
    "<motion.div ref={contentRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', y: contentY }}>",
    "<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>"
)
home = home.replace(
    "                         </motion.div>\n                     );\n                 }}",
    "                         </div>\n                     );\n                 }}"
)

with open("src/pages/Home.jsx", "w") as f:
    f.write(home)

print("Updated SwitchEventCard and Home for unified scrolling.")
