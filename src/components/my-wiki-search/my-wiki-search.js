/**
 * The my-wiki-search web component module.
 *
 * @author Mats Loock <mats.loock@lnu.se>
 * @version 1.0.0
 */

const WIKI_SEARCH_URL = 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search='
const WIKI_EXTRACT_URL = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=200&explaintext&redirects=1&format=json&origin=*&titles='

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .hidden {
      display: none;
    }
  </style>
  <form>
    <input type="search" placeholder="Search Wikipedia" list="search-result-data-list" autocomplete="off" autofocus /> <input type="submit" value="Search" />
    <datalist id="search-result-data-list"></datalist>
  </form>
  <article id="result" class="hidden">
    <header>
      <h2 id="title"></h2>
    </header>
    <p id="extract"><a id="link">more</a></p>
  </article>
  <article id="no-results" class="hidden">
    <p>There were no results matching the query.</p>
  </article>
`

/**
 * Define custom element.
 */
customElements.define('my-wiki-search',
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the input, datalist and article elements in the shadow root.
      this._inputSearchElement = this.shadowRoot.querySelector('input[type="search"]')
      this._formElement = this.shadowRoot.querySelector('form')
      this._datalistElement = this.shadowRoot.querySelector('datalist')

      // Bind event handlers of child elements.
      this._onInput = this._onInput.bind(this)
      this._onSubmit = this._onSubmit.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._inputSearchElement.addEventListener('input', this._onInput)
      this._formElement.addEventListener('submit', this._onSubmit)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._inputSearchElement.removeEventListener('input', this._onInput)
      this._formElement.removeEventListener('submit', this._onSubmit)
    }

    /**
     * Handles input event.
     *
     * @param {InputEvent|Event} event - The input event.
     */
    async _onInput (event) {
      if (!(event instanceof InputEvent)) {
        // Close the datalist.
        this._inputSearchElement.blur()
        this._inputSearchElement.focus()
      }

      // Get the articles whose title matches the search string, and
      // populate the data list with the search result.
      const articles = await this._getWikiSearchResults(this._inputSearchElement.value)
      this._renderArticleOptions(articles)
    }

    /**
     * Handles submit event.
     *
     * @param {SubmitEvent} event - The submit event.
     */
    async _onSubmit (event) {
      // Do not submit the form!
      event.preventDefault()

      // If necessary be sure to close the datalist.
      if (this.shadowRoot.activeElement === this._inputSearchElement) {
        this._inputSearchElement.blur()
        this._inputSearchElement.focus()
      }

      // Get and render the selected article.
      const article = await this._getWikiArticleExtract(this._inputSearchElement.value)
      this._renderArticleExtract(article)
    }

    /**
     * Sends a GET request.
     *
     * @param {string} url - A string representing the URL to send the request to.
     * @param {string} searchString - A string with the search criteria.
     * @returns {Promise<object>} A Promise that resolves to a JavaScript object.
     */
    async _get (url, searchString) {
      const response = await window.fetch(`${url}${encodeURIComponent(searchString)}`)
      return response.json()
    }

    /**
     * ...
     *
     * @param {string} searchString - A string with the search criteria.
     * @returns {Promise<object>} A Promise that resolves to an article extract.
     */
    async _getWikiArticleExtract (searchString) {
      const result = await this._get(WIKI_EXTRACT_URL, searchString.trim())

      // Return the first page in the response.
      return Object.values(result.query.pages).shift()
    }

    /**
     * ...
     *
     * @param {string} searchString - A string with the search criteria.
     * @returns {Promise<object[]>} A Promise that resolves to an array with search results.
     */
    async _getWikiSearchResults (searchString) {
      const articles = []

      searchString = searchString.trim()
      if (searchString.length > 0) {
        // Just interested in the article names and URLs.
        const [, articleNames, , articleURLs] = await this._get(WIKI_SEARCH_URL, searchString)

        if (articleNames && articleURLs) {
          for (let i = 0; i < articleNames.length; i++) {
            articles.push({
              name: articleNames[i],
              url: articleURLs[i]
            })
          }
        }
      }

      return articles
    }

    /**
     * Renders a article extract.
     *
     * @param {object} articleExtract - The article extract to render.
     */
    _renderArticleExtract (articleExtract) {
      const articleResultElement = this.shadowRoot.querySelector('article#result')
      const articleNoResultsElement = this.shadowRoot.querySelector('article#no-results')

      if (articleExtract.extract) {
        articleResultElement.classList.remove('hidden')
        articleNoResultsElement.classList.add('hidden')

        const extractElement = articleResultElement.querySelector('#extract')
        const linkElement = articleResultElement.querySelector('#link')

        // title
        articleResultElement.querySelector('#title').textContent = articleExtract.title

        // extract
        if (extractElement.firstChild.nodeType === Node.TEXT_NODE) {
          extractElement.firstChild.remove()
        }
        extractElement.insertBefore(document.createTextNode(articleExtract.extract), linkElement)

        // link
        linkElement.href = this._datalistElement
          .querySelector(`option[value="${articleExtract.title}"]`)
          .getAttribute('data-url')
      } else {
        articleResultElement.classList.add('hidden')
        articleNoResultsElement.classList.remove('hidden')
      }
    }

    /**
     * Renders the datalist options.
     *
     * @param {object[]} articleOptions - The article options to render.
     */
    _renderArticleOptions (articleOptions) {
      // Remove existing data list options, if any.
      while (this._datalistElement.firstChild) {
        this._datalistElement.removeChild(this._datalistElement.lastChild)
      }

      // Populate the data list with the search result.
      if (articleOptions.length > 0) {
        const fragment = document.createDocumentFragment()
        for (const { name, url } of articleOptions) {
          const optionElement = document.createElement('option')
          optionElement.value = name
          optionElement.setAttribute('data-url', url)
          fragment.appendChild(optionElement)
        }
        this._datalistElement.appendChild(fragment)
      }
    }
  }
)
