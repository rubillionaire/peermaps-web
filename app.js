var app = require('choo')()
var html = require('choo/html')
var nextTick = process.nextTick

app.use(require('./store/params.js'))
app.use(require('./store/db.js'))
app.use(require('./store/settings.js'))
app.use(require('./store/search.js'))
app.use(require('./store/mixmap.js'))
app.use(require('./store/window.js'))

var view = {
  settings: require('./view/settings/index.js'),
  search: require('./view/search.js'),
}

app.route('*', function (state, emit) {
  nextTick(function () {
    state.map.draw()
  })
  var settings = state.settings
  return html`<body>
    <style>
      body {
        margin: 0px;
        overflow: hidden;
        font-family: monospace;
        color: white;
      }
      svg {
        fill: grey;
      }
      svg:hover {
        fill: white;
      }
      .ui-overlay {
        z-index: 2000;
      }

      .buttons {
        z-index: inherit;
      }
      .left-top-buttons {
        position: absolute;
        top: 0px;
        bottom: 0px;
        padding: 1em;
      }
      .right-top-buttons {
        position: absolute;
        top: 0px;
        bottom: 0px;
        right: ${settings.show ? settings.width + 20 : 20}px;
        padding: 1em;
      }
      .right-bottom-buttons {
        position: absolute;
        bottom: 2em;
        right: 2em;
        padding: 1em;
        z-index: 2001;
      }
      .buttons button {
        position: absolute;
        height: 2em;
        width: 2em;
        font-family: monospace;
        opacity: 30%;
        background-color: black;
        color: white;
        border: 0px;
        border-radius: 20px;
        padding: 0px;
      }
      .buttons .arrow {
        height: 3em;
        width: 3em;
        background: transparent;
        border-top: 5px solid black;
        border-right: 5px solid black;
        border-radius: 0px;
      }
      .buttons .north {
        transform: rotate(315deg);
        left: 4em;
      }
      .buttons .west {
        transform: rotate(225deg);
        top: 4em;
      }
      .buttons .east {
        transform: rotate(45deg);
        top: 4em;
        left: 6.5em;
      }
      .buttons .south {
        transform: rotate(135deg);
        top: 6.5em;
        left: 4em;
      }
      .buttons button:hover {
        opacity: 100%;
      }
      .hide {
        display: none;
      }
      .ui-overlay .search {
        position: absolute;
        bottom: 0em;
        top: 0em;
        right: 0em;
        width: 60ex;
        padding: 1em;
        background-color: white;
        color: black;
        z-index: inherit;
      }
      .ui-overlay .search form input[type=text] {
        width: calc(100% - 12ex);
        padding: 0.5em;
      }
      .ui-overlay .search form button {
        width: 8ex;
        padding: 0.5em;
      }
      .ui-overlay .search .results {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        top: 4em;
        padding: 1em;
        overflow-y: scroll;
      }
      .ui-overlay .search .result {
        padding-left: 1em;
        padding-right: 1em;
        padding-top: 0.5em;
        padding-bottom: 1em;
        margin-bottom: 1em;
      }
      .ui-overlay .search .result:nth-child(odd) {
        background-color: #e0e0e0;
      }
      .ui-overlay .search .result:nth-child(even) {
        background-color: #f0f0f0;
      }
      .ui-overlay .search .result .fullname {
        height: 2em;
      }
      .ui-overlay .search .result .name {
        display: inline-block;
      }
      .ui-overlay .search .result .admin {
        display: inline-block;
        float: right;
        background-color: #d0d0d0;
        padding: 0.3em;
      }
      .ui-overlay .search .result:nth-child(even) .admin {
        background-color: #e0e0e0;
      }
      .ui-overlay .search .result .lonlat {
        display: inline-block;
      }
      .ui-overlay .search .result .population {
        display: inline-block;
        background-color: #d0d0d0;
        float: right;
        padding: 0.3em;
      }
      .ui-overlay .search .result:nth-child(even) .population {
        background-color: #e0e0e0;
      }
    </style>
    <div class="ui-overlay">
      <div class="buttons left-top-buttons">
        <div><button class="arrow north" onclick=${panNorth}></button></div>
        <div><button class="arrow west" onclick=${panWest}></button></div>
        <div><button class="arrow east" onclick=${panEast}></button></div>
        <div><button class="arrow south" onclick=${panSouth}></button></div>
        <div><button style="top: 3em; left: 4.5em;" onclick=${zoomIn}>+</button></div>
        <div><button style="top: 6em; left: 4.5em;" onclick=${zoomOut}>-</button></div>
      </div>
      <div class="buttons right-top-buttons">
        <div><button class="toggle-settings" onclick=${toggleSettings}>${settings.show ? '>' : '<'}</button></div>
      </div>
      <div class="buttons right-bottom-buttons">
        <div><button onclick=${toggleSearch}>${state.search.visible ? 'x' : '?'}</button></div>
      </div>
      ${view.search(state, emit)}
      ${view.settings(state, emit)}
    </div>
    ${state.mix.render()}
    ${state.map.render({ width: state.width, height: state.height })}
  </body>`


  function zoomIn() { emit('map:zoom:add',+1) }
  function zoomOut() { emit('map:zoom:add',-1) }
  function panNorth() { emit('map:pan:lat',+1) }
  function panSouth() { emit('map:pan:lat',-1) }
  function panEast() { emit('map:pan:lon',+1) }
  function panWest() { emit('map:pan:lon',-1) }
  function toggleSettings() { emit('settings:toggle') }
  function toggleSearch() { emit('search:toggle') }
})
app.mount(document.body)
