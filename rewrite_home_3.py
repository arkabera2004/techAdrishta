import re

with open('src/pages/Home.jsx', 'r') as f:
    home = f.read()

# 1. Extract Panel A and Panel B
panels_match = re.search(r'\{/\* ─── PANEL A \(Foreground Layer\) ─── \*/\}.*?\{/\* ─── PANEL B \(Foreground Layer\) ─── \*/\}.*?</div>\n      </section>', home, re.DOTALL)
if not panels_match:
    print("Could not find PANELS in Home.jsx")
    exit(1)
panels_code = panels_match.group(0)

# 2. Extract SwitchEventCard instance
switch_match = re.search(r'<SwitchEventCard \n.*?/>', home, re.DOTALL)
if not switch_match:
    print("Could not find SwitchEventCard in Home.jsx")
    exit(1)
switch_code = switch_match.group(0)

# 3. Create the new wrapper format
# We need to render the panels INSIDE SwitchEventCard via a render prop or children.
# But wait, earlier I wrapped them directly like this:
new_switch = """<SwitchEventCard 
                onBootStateChange={setBootState} 
                isZoomingOut={bootSequenceTriggered} 
                scrollYProgress={heroProgress}
              >
                 {(scrollRef) => {
                     if (!innerScrollRef && scrollRef.current) {
                         setTimeout(() => setInnerScrollRef(scrollRef.current), 0);
                     }
                     return (
                         <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
""" + panels_code + """
                         </div>
                     );
                 }}
              </SwitchEventCard>"""

# 4. Replace panels from bottom, replace switch instance with new_switch
home_new = home.replace(panels_code, "")
home_new = home_new.replace(switch_code, new_switch)

with open('src/pages/Home.jsx', 'w') as f:
    f.write(home_new)

print("Home.jsx wrapper successfully applied!")
