const bigSection = document.querySelector('.big-section')
const mirrorSection = document.querySelector('.mirror-container')
bigSection.addEventListener('mouseenter', e => {
  mirrorSection.style.display = 'block'
})
bigSection.addEventListener('mouseleave', e => {
  mirrorSection.style.display = 'none'
})
