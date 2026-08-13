import re

# 1. Update SwitchEventCard.jsx
with open("src/components/SwitchEventCard.jsx", "r") as f:
    switch = f.read()

# Add nintendoIndex state
switch = re.sub(r"const \[blackFade, setBlackFade\] = useState\(false\);", "const [blackFade, setBlackFade] = useState(false);\n    const [nintendoIndex, setNintendoIndex] = useState(0);", switch)

# Update Joy-Con Down
dpad_down_regex = r"""<button \s*className="d-pad-btn absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 opacity-0 z-20 cursor-pointer"\s*onClick=\{\(\) => \{\s*if \(bootState === 'D'\) setBootState\('E'\);\s*\}\}\s*/>"""
new_dpad_down = """<button 
                                    className="d-pad-btn absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 opacity-0 z-20 cursor-pointer"
                                    onClick={() => {
                                        if (isScrolling) return;
                                        if (bootState === 'D') setBootState('E');
                                        else if (bootState === 'E') { setBootState('F'); setNintendoIndex(0); }
                                        else if (bootState === 'F' && nintendoIndex < 2) setNintendoIndex(nintendoIndex + 1);
                                    }}
                                />"""
switch = re.sub(dpad_down_regex, new_dpad_down, switch)

# Update Joy-Con Up
dpad_up_regex = r"""<button \s*className="d-pad-btn absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 opacity-0 z-20 cursor-pointer"\s*onClick=\{\(\) => \{\s*if \(bootState === 'E'\) setBootState\('D'\);\s*\}\}\s*/>"""
new_dpad_up = """<button 
                                    className="d-pad-btn absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 opacity-0 z-20 cursor-pointer"
                                    onClick={() => {
                                        if (isScrolling) return;
                                        if (bootState === 'F') {
                                            if (nintendoIndex > 0) setNintendoIndex(nintendoIndex - 1);
                                            else setBootState('E');
                                        }
                                        else if (bootState === 'E') setBootState('D');
                                    }}
                                />"""
switch = re.sub(dpad_up_regex, new_dpad_up, switch)

# Update children pass
children_regex = r"\{typeof children === 'function' \? children\(scrollRef\) : children\}"
new_children = "{typeof children === 'function' ? children({ scrollRef, isScrolling, bootState, nintendoIndex }) : children}"
switch = re.sub(children_regex, new_children, switch)

with open("src/components/SwitchEventCard.jsx", "w") as f:
    f.write(switch)
print("Updated SwitchEventCard.jsx")

# 2. Update Home.jsx
with open("src/pages/Home.jsx", "r") as f:
    home = f.read()

# Update StickyTicket definition
ticket_def = r"function StickyTicket\(\{ event, index, baseTilt, scrollContainerRef \}\) \{"
new_ticket_def = "function StickyTicket({ event, index, baseTilt, scrollContainerRef, isScrolling, bootState, nintendoIndex }) {"
home = re.sub(ticket_def, new_ticket_def, home)

# Update StickyTicket return
ticket_ret_regex = r"""  return \(\s*<div\s*ref=\{ref\}\s*style=\{\{\s*position: 'sticky',\s*top: `calc\(160px \+ \$\{index \* 24\}px\)`,\s*zIndex: index \+ 10,\s*\}\}\s*>\s*<motion\.div\s*style=\{\{ rotate, transformOrigin: 'center center' \}\}\s*whileHover=\{\{ rotate: 0 \}\}\s*>"""
new_ticket_ret = """  const isNintendo = !isScrolling;
  const isNintendoVisible = bootState === 'F' && nintendoIndex >= index;
  return (
    <div
      ref={ref}
      style={{
        position: isNintendo ? 'absolute' : 'sticky',
        top: isNintendo ? `calc(160px + ${index * 24}px)` : `calc(160px + ${index * 24}px)`,
        left: 0,
        width: '100%',
        zIndex: isNintendo ? (index + 50) : (index + 10),
        pointerEvents: isNintendo ? (isNintendoVisible ? 'auto' : 'none') : 'auto',
      }}
    >
      <motion.div
        initial={false}
        animate={{ 
          y: isNintendo ? (isNintendoVisible ? 0 : 500) : 0, 
          opacity: isNintendo ? (isNintendoVisible ? 1 : 0) : 1 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={isNintendo ? {} : { rotate, transformOrigin: 'center center' }}
        whileHover={isNintendo ? {} : { rotate: 0 }}
      >"""
home = re.sub(ticket_ret_regex, new_ticket_ret, home)

# Update render prop function
render_prop = r"                 \{\(scrollRef\) => \{"
new_render_prop = "                 {({ scrollRef, isScrolling, bootState, nintendoIndex }) => {"
home = re.sub(render_prop, new_render_prop, home)

# Update Panel A styles
panel_a_regex = r"""      <section\s*ref=\{panelARef\}\s*style=\{\{\s*position: 'relative',\s*zIndex: 10,\s*backgroundColor: 'var\(--bg\)',\s*paddingTop: '2rem'\s*\}\}\s*>"""
new_panel_a = """      <section
        ref={panelARef}
        style={{
          position: !isScrolling ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: !isScrolling ? '100%' : 'auto',
          zIndex: 10,
          backgroundColor: !isScrolling ? 'transparent' : 'var(--bg)',
          paddingTop: !isScrolling ? 0 : '2rem',
          opacity: !isScrolling ? (bootState === 'F' ? 1 : 0) : 1,
          pointerEvents: !isScrolling ? (bootState === 'F' ? 'auto' : 'none') : 'auto',
          transition: 'opacity 0.5s ease',
        }}
      >"""
home = re.sub(panel_a_regex, new_panel_a, home)

# Update section title
section_header_regex = r"""              \.\.\.styles\.sectionHeader,\s*position: 'sticky',\s*top: '-1px',\s*zIndex: 5,"""
new_section_header = """              ...styles.sectionHeader,
              display: !isScrolling ? 'none' : 'flex',
              position: 'sticky',
              top: '-1px',
              zIndex: 5,"""
home = re.sub(section_header_regex, new_section_header, home)

# Update padding/gap wrappers
wrapper1_regex = r"""            <div style=\{\{ paddingBottom: '2\.5rem', paddingTop: '2rem' \}\}>\s*<div style=\{\{ display: 'flex', width: '100%', flexDirection: 'column', gap: '5rem' \}\}>"""
new_wrapper1 = """            <div style={{ paddingBottom: !isScrolling ? 0 : '2.5rem', paddingTop: !isScrolling ? 0 : '2rem' }}>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: !isScrolling ? 0 : '5rem' }}>"""
home = re.sub(wrapper1_regex, new_wrapper1, home)

# Update content wrap
content_wrap_regex = r"""        <div style=\{styles\.contentWrap\}>"""
new_content_wrap = """        <div style={!isScrolling ? { margin: 0, padding: 0 } : styles.contentWrap}>"""
home = re.sub(content_wrap_regex, new_content_wrap, home)

# Update StickyTicket pass props
pass_props_regex = r"""                  <StickyTicket key=\{ev\.id\} event=\{ev\} index=\{i\} baseTilt=\{ev\.tilt \?\? 0\} scrollContainerRef=\{innerScrollRef\} />"""
new_pass_props = """                  <StickyTicket key={ev.id} event={ev} index={i} baseTilt={ev.tilt ?? 0} scrollContainerRef={innerScrollRef} isScrolling={isScrolling} bootState={bootState} nintendoIndex={nintendoIndex} />"""
home = re.sub(pass_props_regex, new_pass_props, home)

with open("src/pages/Home.jsx", "w") as f:
    f.write(home)
print("Updated Home.jsx")
