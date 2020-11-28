/**
 * A wiki-search web conponent.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Html-template for this component.
 */
const template = document.createElement('template')
template.innerHTML = `
<h1>Wiki-search</h1>
<form>
  <label for="wsearch">Search:</label>
  <input type="search" id="wsearch" name="wsearch">
  <datalist id="search-result-list"></datalist>
  <input type="submit" value="Search now">
</form>
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
    }
  }
)
