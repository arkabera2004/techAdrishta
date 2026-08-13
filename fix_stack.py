import re

with open("src/components/SwitchEventCard.jsx", "r") as f:
    switch = f.read()

# We want to move the motion.div with y: contentY to ABOVE the STATE C & D section.
# Let's find the start of STATE C & D.
c_d_start = """                        {/* STATE C & D: Pixel Mario UI */}"""
content_y_wrapper = """                        <motion.div 
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
                        >"""

# 1. Remove the contentY wrapper from its current position.
switch = switch.replace(content_y_wrapper + "\n", "")

# 2. Insert the contentY wrapper right before the STATE C & D section.
switch = switch.replace(c_d_start, content_y_wrapper + "\n" + c_d_start)

# 3. We need to make sure the Pixel Mario UI renders when bootState is E as well.
# Because if bootState is E, we still want it to be the top section!
switch = switch.replace(
    "{(bootState === 'C' || bootState === 'D') && (",
    "{(bootState === 'C' || bootState === 'D' || bootState === 'E') && ("
)

# 4. We need to make sure Pixel Mario UI has a fixed height so it takes the first full screen.
switch = switch.replace(
    'className="w-full flex-1 flex flex-col items-center relative z-10"',
    'className="w-full flex-shrink-0 flex flex-col items-center relative z-10" style={{ height: "100%" }}'
)

# 5. Make sure the About Content also has a fixed height and is flex-shrink-0
switch = switch.replace(
    'className="w-full flex-1 flex flex-col items-center gap-[1.5cqi] animate-in fade-in duration-300 z-10"',
    'className="w-full flex-shrink-0 flex flex-col items-center gap-[1.5cqi] animate-in fade-in duration-300 z-10" style={{ height: "100%" }}'
)

# 6. We also need to fix the condition for About Content. We can leave it as bootState === 'E' or make it render in D as well.
# If we render it in D, then when the user scrolls, they see it immediately.
switch = switch.replace(
    "{bootState === 'E' && (",
    "{(bootState === 'D' || bootState === 'E') && ("
)

with open("src/components/SwitchEventCard.jsx", "w") as f:
    f.write(switch)

print("Updated SwitchEventCard for full stacking.")
