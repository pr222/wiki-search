/**
 * A wiki-search web conponent.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const urlSearch = 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search='
const urlExtract = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=200&origin=*&format=json&titles='

/**
 * Html-template for this component.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>

  .hidden {
    display: none;
  }

  datalist {
    display: block;
  }

</style>
<h1>Wiki-search</h1>
<form>
  <label for="wikiSearch">Search:</label>
  <input type="search" id="wikiSearch" name="wikiSearch" autocomplete="off" list="search-suggestion-list" autofocus>
  <input type="submit" value="Search now">  
  <datalist id="search-suggestion-list" class="hidden"></datalist>
</form>

<div id="article">
</div>
`

/**
 * Search component with autocomplete.
 */
customElements.define('wiki-search',
/**
 * Anonymous class extending HTMLElement.
 */
  class extends HTMLElement {
  /**
   * Calling the constructor.
   */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this._inputField = this.shadowRoot.querySelector('#wikiSearch')
      this._submitButton = this.shadowRoot.querySelector('form')
      this._datalist = this.shadowRoot.querySelector('#search-suggestion-list')

      this._onInput = this._onInput.bind(this)
      this._onSubmit = this._onSubmit.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._inputField.addEventListener('input', this._onInput)
      this._submitButton.addEventListener('submit', this._onSubmit)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._inputField.removeEventListener('input', this._onInput)
      this._submitButton.removeEventListener('submit', this._onSubmit)
    }

    /**
     * Take care of input events.
     *
     * @param {*} event - Input event.
     */
    async _onInput (event) {
      const input = this._inputField.value
      console.log('Ready to get options: ' + input)

      // // Make options visible if list is hidden.
      // if (input.length > 0 && this._datalist.classList.contains('hidden')) {
      //   this._datalist.classList.remove('hidden')
      // }
      // // Make sure to hide when no text in search field.
      // if (input.length < 1) {
      //   this._datalist.classList.add('hidden')
      // }

      const options = await this._getSearchOptions(input)
      console.log('awaited for options before display')
      this._displayOptions(options)
      console.log('dispayed')
    }

    /**
     * Take care of submit search event.
     *
     * @param {*} event - Submitting the search.
     */
    async _onSubmit (event) {
      console.log('prevent default?')
      event.preventDefault()

      const input = this._inputField.value
      console.log('Ready to get extract: ' + input)

      const extract = await this._getExtract(input)

      this._displayExtract(extract)
    }

    /**
     * Doing the GET request.
     *
     * @param {string} url - The base url.
     * @param {string} searchInput - The searched text.
     * @returns {Promise<object>} - a response in JSON.
     */
    async _getSomething (url, searchInput) {
      const response = await fetch(`${url}${searchInput}`)
      const result = await response.json()
      return result
    }

    /**
     * Getting the search options...
     *
     * @param {*} searchInput - Search input in input field.
     * @returns {Promise} options array of objects.
     */
    async _getSearchOptions (searchInput) {
      const options = []
      console.log('_getSearchOptions-function start')
      // Not interested in search-results with only 1 word.
      if (searchInput.length > 0) {
        const [, option, , link] = await this._getSomething(urlSearch, searchInput)
        console.log(option)
        for (let i = 0; i < option.length; i++) {
          options.push({
            name: option[i],
            link: link[i]
          })
        }
      }
      console.log('Options-array: ')
      console.log(options)
      return options
    }

    /**
     * Getting the extract...
     *
     * @param {string} searchInput - Search input in input field.
     * @returns {Promise<object>} - the extract object response in JSON.
     */
    async _getExtract (searchInput) {
      console.log('_getExtract-function start')

      const extract = await this._getSomething(urlExtract, searchInput.trim())
      console.log(extract)
      console.log(Object.values(extract.query.pages).shift())
      const o = Object.values(extract.query.pages).shift()
      console.log(o)
      console.log(o.title)
      console.log(o.extract)
      return o
    }

    /**
     * Display search suggestions.
     *
     * @param {object[]} options - Displays suggestions.
     */
    _displayOptions (options) {
      // this._datalist - Add
      console.log(`Display ${options}?`)
      console.log(options.length)
      while (this._datalist.childElementCount) {
        this._datalist.removeChild(this._datalist.firstChild)
      }

      for (const { name, link } of options) {
        const option = document.createElement('option')
        // option.value = name
        option.setAttribute('data-url', link)
        option.append(`${name}`)
        this._datalist.appendChild(option)
      }
    }

    /**
     * Display the extracted article.
     *
     * @param {*} extract - Extract.
     */
    _displayExtract (extract) {
      console.log('Display Extract')
      console.log(extract.title)
      console.log(extract.extract)
    }
  }
)
