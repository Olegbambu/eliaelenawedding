const NAVBAR_OFFSET = 88

// Document position without CSS transforms, so scroll animations
// in progress do not shift the scroll target.
const getLayoutTop = (element) => {
  let top = 0
  for (let node = element; node; node = node.offsetParent) top += node.offsetTop
  return top
}

export function scrollToSection(href) {
  const target = document.querySelector(href)
  if (!target) return
  const top = href === '#hero' ? 0 : Math.max(0, getLayoutTop(target) - NAVBAR_OFFSET)
  if (window.lenis) {
    window.lenis.scrollTo(top, { duration: 1.2 })
  } else {
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
