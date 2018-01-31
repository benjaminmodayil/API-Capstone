let newsAPIKey = 'ed14c7ddee15497fb440c9369baf1371'

// add items to saved.html page
// article colors

const el = document.querySelector('data-index')
class ArticlePage {
  constructor(el) {
    this.el = el
    this.setupDOM()
    // this.bindEvents()
    console.log('constructed')
  }

  setupDOM() {
    console.log('setupDom')
    this.categories = [
      'business',
      'entertainment',
      'general',
      'health',
      'science',
      'sports',
      'technology'
    ]

    this.indexPage = document.querySelector('[data-index]')
    this.container = this.indexPage.querySelector('.container')

    $(this.container).append(`<div class="js-button-container"></div>
    <h2 class="h2 js-headline-and-search-results"><span class="js-headline-and-search-results__pre-text">Headlines for</span> <span class="js-result-title">${setDate()}</span></h2>
    <ul></ul>`)

    this.categories.forEach(item =>
      $('.js-button-container').append(`
    <button class="js-category" data-category="${item}">${item}</button>
    `)
    )

    this.data = []
    this.currentArticles = []

    $('.home-page').on('click', '[data-category]', this.categoryFetch.bind(this))
    $('form').on('submit', this.handleForm.bind(this))
  }

  fetchQuery(query) {
    var myHeaders = new Headers()
    var myInit = { method: 'GET', headers: myHeaders, mode: 'cors', cache: 'default' }

    let currentDay = new Date()
    currentDay = currentDay.toISOString().substring(0, 10)

    fetch(
      query
        ? query
        : `https://newsapi.org/v2/everything?q=from=${currentDay}&language=en&sortBy=popularity&apiKey=${newsAPIKey}`,
      myInit
    )
      .then(function(response) {
        return response.json()
      })
      .then(response => {
        this.data = response.articles
        this.data = unique(this.data, e => e.title)
        this.currentArticles = this.data
        return this.data
      })
      .then(data => {
        this.renderArticles(data)
      })
  }

  categoryFetch(e) {
    let category = e.currentTarget.dataset.category
    $('.js-headline-and-search-results__pre-text').text('News related to')
    $('.js-result-title').text(category)
    category = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${newsAPIKey}`
    articlePage.fetchQuery(category)
    document
      .querySelector('.js-headline-and-search-results')
      .scrollIntoView({ behavior: 'smooth' })
  }

  renderArticles(data) {
    $('ul').html('')
    data.map((item, i) => {
      let type = i % 5 === 0 ? 'span-half' : 'span-quarter'

      let element = createCard(item, type)
      element.style.animationDelay = `${i * 5 / 50}s`

      listContainer.appendChild(element)
    })

    $('.js-card').on('click', $('.js-add-to-saved'), function(e) {
      let title = $(e.currentTarget)
        .find('h2')
        .text()
      let description = $(e.currentTarget)
        .find('.js-card__description')
        .text()

      let author = $(e.currentTarget)
        .find('.js-card__author')
        .text()

      let url = $(e.currentTarget).find('a')[0].href

      let urlToImage = $(e.currentTarget)
        .find('.js-card__img')[0]
        .style.backgroundImage.slice(4, -1)
        .replace(/"/g, '')

      editLocalStorage({ title, description, author, url, urlToImage })
    })
  }

  handleForm(e) {
    e.preventDefault()
    let $queryValue = $('input[name="query"]').val() || ''
    let $date1Value = $('input[name="date-1"').val()
      ? `&from=${$('input[name="date-1"').val()}`
      : ''
    let $date2Value = $('input[name="date-2"')
      ? `&to=${$('input[name="date-2"').val()}`
      : ''
    let $selectValue = `&category=${$('select').val()}` || ''
    let $URL = `
  https://newsapi.org/v2/everything?q=${$queryValue}${$date1Value}&sortBy=popularity&apiKey=${newsAPIKey}
  `

    $('.js-headline-and-search-results__pre-text').text('News related to')
    $('.js-result-title').text($queryValue)

    this.fetchQuery($URL)
    document
      .querySelector('.js-headline-and-search-results')
      .scrollIntoView({ behavior: 'smooth' })
  }
}

let articlePage = new ArticlePage()

let listContainer = document.querySelector('ul')
listContainer.classList.add('js-news-list')

function formFocus() {
  $('input:text:visible:first').focus()
}

$('.home-header__more').on('click', showFields)

function showFields() {
  let $form = $('.hidden-fields')

  if ($form.attr('data-isopen') === 'false') {
    $('.home-header__more__text').text('less')
    $form.toggleClass('screenreader-only--with-space')
    $form.attr('data-isopen', true)
    setTimeout(() => {
      $form.toggleClass('js-initialize-form')
      $form.addClass('js-transition')
    }, 50)
  } else if ($form.attr('data-isopen') === 'true') {
    $('.home-header__more__text').text('more')
    $form.removeClass('js-transition')
    $form.toggleClass('screenreader-only--with-space')
    $form.attr('data-isopen', false)
    setTimeout(() => {
      $form.toggleClass('js-initialize-form')
    }, 50)
  }
}

$(setDate(), formFocus(), articlePage.fetchQuery())
