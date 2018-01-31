var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || []
let tempItems = oldItems
// oldItems = []

// oldItems.push(newItem)
// let allTheNew = oldItems.concat(tempItems)
console.log(oldItems)

// localStorage.setItem('itemsArray', JSON.stringify(allTheNew))
oldItems.map((item, i) => {
  console.log(item)

  let type = i % 5 === 0 ? 'span-half' : 'span-quarter'
  let element = createCard(item, type)
  element.style.animationDelay = `${i * 5 / 50}s`

  $('[data-saved]').append(element)
})
