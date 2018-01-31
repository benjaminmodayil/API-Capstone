function editLocalStorage(newItem) {
  var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || []
  let tempItems = oldItems
  oldItems = []

  oldItems.push(newItem)
  let allTheNew = oldItems.concat(tempItems)
  console.log(allTheNew)

  localStorage.setItem('itemsArray', JSON.stringify(allTheNew))
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

function createCard(item, type) {
  let element = document.createElement(`li`)
  element.classList.add('js-card')
  element.classList.add('js-fadeInDown')
  element.classList.add(`js-${type}`)

  let typeCheck =
    type === 'span-half'
      ? `
        <p class="js-card__description">${item.description.substr(0, 85)}...</p>`
      : null

  let imageCheck =
    item.urlToImage === null || item.urlToImage.charAt(0) === `/` ? true : false
  console.log(imageCheck)
  let imageTemplate = `<a href=${item.url}>
      <div class="js-card__img" style="background-image:url(${
        item.urlToImage
      })" role="img" alt="">
      </div>
    </a>
  `
  element.innerHTML = `
  ${imageCheck === false ? imageTemplate : ''}
       <div class="js-card__container ${imageCheck === true ? 'js-stretch' : ''}">
        <div class="js-card__text">
          <a href=${item.url}>
            <h2>${item.title}</h2>
            <p class="js-card__author">${item.author}</p>
            ${typeCheck}
          </a>
        </div>
        <button class="js-add-to-saved" type="button"><span class="screenreader-only">save article</span><img src="./images/file-add.svg"></button>
       </div>
      `
  return element
}
