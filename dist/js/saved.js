let oldItems, tempItems

oldItems = JSON.parse(localStorage.getItem('itemsArray')) || []
tempItems = unique(oldItems, e => e.title)

tempItems.map((item, i) => {
  let type, element

  type = i % 5 === 0 ? 'span-half' : 'span-quarter'
  element = createCard(item, type, true)
  element.style.animationDelay = `${i * 5 / 50}s`
  $('[data-saved]').append(element)
})

$('.js-remove-saved').on('click', function(e) {
  console.log('testing')
  $current = $(e.currentTarget)
  title = $current
    .closest('li')
    .find('.js-card__text')
    .find('h2')
    .text()
  console.log(title)
  removeLocalStorage(title)
  console.log(oldItems)
  $(this)
    .closest('li')
    .remove()
})
