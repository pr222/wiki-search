# WikiSök

Du ska skriva en webbkomponent där användaren skriver in en fras i ett textfält och klickar på en sökknapp för att hitta en artikel på Wikipedia vars rubrik motsvarande den angivna frasen.

För att hjälpa användaren att hitta artiklar ska textfältet erbjuda "autocomplete"-funktionalitet. Så fort användaren börjar skriva i textfältet ska en lista med artiklars rubriker, filtrerade utifrån det användaren hittills skrivit i textfältet, presenteras. Väljer användaren en artikel ur listan ska textfältet uppdateras med artikelns rubrik.

Då användaren klickar på sökknappen ska ett utdrag, om cirka 200 tecken, av artikeln presenteras samt en länk till den fullständiga artikeln. Hittas ingen artikel ska användaren informeras på lämpligt sätt.

## API:er

För att söka och hämta information om artiklar på Wikipedia kan du använda [English Wikipedia API](https://en.wikipedia.org/w/api.php).

### Söka efter artiklar

För att söka efter artiklar kan "OpenSearch"-protokoll användas genom ["opensearch"](https://en.wikipedia.org/w/api.php?action=help&modules=opensearch).

Du kan genomföra en sökning efter artiklar vars rubrik inleds med ordet `javascript` genom https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=javascript.

Som svar får du JSON tillbaka innehållande sökordet, tio rubriker och länkar. Rubriker och länkar kommer till användning då en lista med artiklar ska presenteras för användaren.

```json
[
  "javascript",
  ["JavaScript", "JavaScript syntax", "JavaScript engine", "JavaScript InfoVis Toolkit", 
   "JavaScript library", "JavaScript Style Sheets", "JavaScript templating", "JavaScriptMVC",
   "JavaScript OSA", "JavaScript Object Notation"],
  ["", "", "", "", "", "", "", "", "", ""],
  ["https://en.wikipedia.org/wiki/JavaScript", "https://en.wikipedia.org/wiki/JavaScript_syntax",
   "https://en.wikipedia.org/wiki/JavaScript_engine", "https://en.wikipedia.org/wiki/JavaScript_InfoVis_Toolkit", 
   "https://en.wikipedia.org/wiki/JavaScript_library", "https://en.wikipedia.org/wiki/JavaScript_Style_Sheets"
   "https://en.wikipedia.org/wiki/JavaScript_templating", "https://en.wikipedia.org/wiki/JavaScriptMVC",
   "https://en.wikipedia.org/wiki/JavaScript_OSA", "https://en.wikipedia.org/wiki/JavaScript_Object_Notation"]
]
```

### Hämta utdrag av en artikel

Data om en artikel kan hämtas genom ["query"](https://en.wikipedia.org/w/api.php?action=help&modules=query).

Du kan hämta ett utdrag av en artikel med rubriken `JavaScript` genom https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=200&explaintext&redirects=1&format=json&origin=*&titles=JavaScript.

Som svar får du JSON tillbaka innehållande bland annat "extract" innehållande utdraget, om cirka 200 tecken, avslutat med tre punkter för att indikera att utdraget omfattar fler tecken.

```json
{
  "batchcomplete": "",
  "query": {
    "pages": {
      "9845": {
        "pageid": 9845,
        "ns": 0,
        "title": "JavaScript",
        "extract": "JavaScript (), often abbreviated as JS, is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled, and multi-paradigm. It has curly..."
      }
    }
  }
}
```

## Tips!

### Använd formulär

Du får en hel del funktionalitet du borde vara intresserad av genom att göra textfält och sökknapp som en del av ett formulär.

Genom händelsen `submit`, knuten till formuläret, får du reda på när användaren valt att skicka formuläret (som inte ska skickas vidare).

### Autocomplete-funktionalitet

För att skapa en lista användaren kan välja artiklar från är det enklast att använda ett input-element tillsammans med ett datalist-element. Funktionaliteten denna kombination erbjuder är fullt tillräcklig i detta fall.

Tänk på att då du skapar listan med artiklar även kan lägga till attribut innehållande länken till respektive artikel.

Genom händelsen `input` får du reda på när användaren har valt något i listan.

Listan visas tills användaren väljer något ur listan, stänger den genom att trycka på Esc-tangenten eller se till att textfältet förlorar fokus. Om du vill att listan inte ska visas trots att textfältet har fokus kan du gör det genom att låta textfältet förlora fokus (`blur()`) för att omedelbart där efter få fokus (`focus()`).

## Exempel

```html
<my-wiki-search></my-wiki-search>
```

![Example](./.readme/example.gif)
