let newsAPIKey = 'ed14c7ddee15497fb440c9369baf1371'
let newsAPIURL = `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${newsAPIKey}`
// https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=
// https://newsapi.org/v2/everything?q=apple&from=2018-01-15&to=2018-01-15&sortBy=popularity&apiKey=
// https://newsapi.org/v2/everything?domains=wsj.com,nytimes.com
var na_req = new Request(newsAPIURL)
var na_Top = new Request(
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsAPIKey}`
)
var na_req = new Request(newsAPIURL)
let data = []

let currentArticles = []

const categories = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology'
]
$('.container').append(`<div class="js-button-container"></div>`)
$('.container').append(
  `<h2 class="h2 js-headline-and-search-results">Headlines for <span class="js-result-title">${setDate()}</span></h2>`
)

categories.forEach(item =>
  $('.js-button-container').append(`
    <button class="js-category" data-category="${item}">${item}</button>
    `)
)

let fetchQuery = query => {
  var myHeaders = new Headers()
  var myInit = { method: 'GET', headers: myHeaders, mode: 'cors', cache: 'default' }

  fetch(
    query
      ? `https://newsapi.org/v2/everything?q=${query}&sortBy=popularity&apiKey=${newsAPIKey}`
      : `https://newsapi.org/v2/everything?q=from=2018-01-24&to=2018-01-24&sortBy=popularity&apiKey=${newsAPIKey}`,
    myInit
  )
    .then(function(response) {
      return response.json()
    })
    .then(response => {
      data = response.articles
      data = unique(data, e => e.title)
      currentArticles = data
      return data
    })
    .then(data => {
      renderArticles(data)
    })
}

$('.home-page').on('click', '[data-category]', e => {
  let category = e.currentTarget.dataset.category
  fetchQuery(category)
})

$('.container').append(`<ul></ul>`)

$('form').on('submit', e => {
  e.preventDefault()
  let $formValue = $('input').val()

  fetchQuery($formValue)
})

// unique arrays
function unique(arr, f) {
  const vArr = arr.map(f)
  return arr.filter((_, i) => vArr.indexOf(vArr[i]) === i)
}
//

let listContainer = document.querySelector('ul')
listContainer.classList.add('js-news-list')

function createCard(item, type) {
  let element = document.createElement(`li`)
  element.classList.add('js-card')
  element.classList.add('js-fadeInDown')

  setTimeout(() => {
    element.classList.remove('js-fadeInDown')
  }, 200)

  element.classList.add(`js-${type}`)

  if (type === 'span-half') {
    element.innerHTML = `<a href=${item.url}>
  <div class="js-card__img" style="background-image:url(${
    item.urlToImage
  })" role="img" alt=""></div>
       <div class="js-card__container">
        <div class="js-card__text">
          <h2>${item.title}</h2>
          <p>${item.author}</p>
          <p>${item.description}</p>
        </div>
       </div>
      </a>`
  } else {
    element.innerHTML = `<a href=${item.url}>
  <div class="js-card__img" style="background-image:url(${
    item.urlToImage
  })" role="img" alt=""></div>
       <div class="js-card__container">
        <div class="js-card__text">
          <h2>${item.title}</h2>
          <p>${item.author}</p>
        </div>
       </div>
      </a>`
  }

  listContainer.appendChild(element)
}

function renderArticles(data) {
  $('ul').html('')
  data.map((item, i) => {
    if (i === 0 || i === 5 || i === 10 || i === 15) {
      setTimeout(() => {
        createCard(item, 'span-half')
      }, 100 + i * 100)
    } else {
      setTimeout(() => {
        createCard(item, 'span-quarter')
      }, 100 + i * 100)
    }
  })
}

// date
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
  // $('.js-day').text(currentDay)
  return currentDay
}

function formFocus() {
  $('input:text:visible:first').focus()
}

// localstorage test
var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || []
let tempItems = oldItems
oldItems = []
console.log(tempItems)
var newItem = {
  test: 'hi'
  // 'product-name': itemContainer.find('h2.product-name a').text(),
  // 'product-image': itemContainer.find('div.product-image img').attr('src'),
  // 'product-price': itemContainer.find('span.product-price').text()
}

oldItems.push(newItem)

localStorage.setItem('itemsArray', JSON.stringify(oldItems))

oldItems.map(item => {
  $('[data-saved]').append(item.test)
})

$('.home-header__more').on('click', showFields)

function showFields() {
  let $form = $('.hidden-fields')
  // console.log(typeof $form.attr('data-isopen'))

  if ($form.attr('data-isopen') === 'false') {
    let text = 'less'
    $('.home-header__more__text').text(text)
    $form.toggleClass('screenreader-only--with-space')
    $form.attr('data-isopen', true)
    setTimeout(() => {
      $form.toggleClass('js-initialize-form')
      $form.addClass('js-transition')
    }, 50)
  } else if ($form.attr('data-isopen') === 'true') {
    let text = 'more'
    $('.home-header__more__text').text(text)
    $form.removeClass('js-transition')
    $form.toggleClass('screenreader-only--with-space')
    $form.attr('data-isopen', false)
    setTimeout(() => {
      $form.toggleClass('js-initialize-form')
    }, 50)
  }
}

$(setDate(), formFocus(), fetchQuery())
