function editLocalStorage(newItem) {
  var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || []
  let tempItems = oldItems
  oldItems = []

  oldItems.push(newItem)
  let allTheNew = oldItems.concat(tempItems)

  localStorage.setItem('itemsArray', JSON.stringify(allTheNew))
}

function removeLocalStorage(title) {
  var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || []
  let newItems = oldItems.filter(item => item.title !== title)

  localStorage.setItem('itemsArray', JSON.stringify(newItems))
}

function setDate() {
  var date = new Date()
  var weekday = new Array(7)
  weekday[0] = 'Sunday'
  weekday[1] = 'Monday'
  weekday[2] = 'Tuesday'
  weekday[3] = 'Wednesday'
  weekday[4] = 'Thursday'
  weekday[5] = 'Friday'
  weekday[6] = 'Saturday'
  let currentDay = weekday[date.getDay()]
  return currentDay
}

function unique(arr, f) {
  const vArr = arr.map(f)
  return arr.filter((_, i) => vArr.indexOf(vArr[i]) === i)
}

function createCard(item, type, iconIsRemove = false) {
  let element = document.createElement(`li`)
  element.classList.add('js-card')
  element.classList.add('js-fadeInDown')
  element.classList.add(`js-${type}`)

  let descriptionCheck =
    type === 'span-half'
      ? `
        <p class="js-card__description">${item.description.substr(0, 85)}...</p>`
      : ''

  let imageCheck =
    item.urlToImage === undefined ||
    item.urlToImage === null ||
    item.urlToImage.charAt(0) === `/`
      ? true
      : false

  let title = item.title === null ? (element.innerHTML = '') : item.title
  let authorTemplate = `<p class="js-card__author">${item.author}</p>`

  let authorCheck = item.author === null ? true : false

  let imageTemplate = `<a class="js-card__img-container" href=${item.url}>
      <div class="js-card__img" style="background-image:url(${
        item.urlToImage
      })" role="img" alt="">
      </div>
    </a>
  `
  let correctIcon = iconIsRemove
    ? `<img class="icon-file-delete" src="./images/icon-delete.svg">`
    : `<img class="icon-file-add" src="./images/file-add.svg">`

  let correctClass = iconIsRemove ? `js-remove-saved` : `js-add-to-saved`

  element.innerHTML = `
  ${imageCheck === false ? imageTemplate : ''}
       <div class="js-card__container ${imageCheck === true ? 'js-stretch' : ''}">
        <div class="js-card__text">
          <a href=${item.url}>
            <h2>${item.title}</h2>
            ${authorCheck ? '' : authorTemplate}
            ${descriptionCheck}
          </a>
        </div>
        <button class="js-card__button ${correctClass}" type="button" title="save article"><span class="screenreader-only">save article</span>${correctIcon}</button>
       </div>
      `
  return element
}
