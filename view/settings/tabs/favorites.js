var html = require('choo/html')
var css = require('sheetify')

module.exports = function (state, emit) {
  // TODO
  // var data = state.settings.getTabData('favorites')
  // if (!data) return
  var data = state.settings.favorites.data
  var l = state.settings.ui.lookup

  return html`<div class="search">
    <div class="results" style="top: 0px;">
      ${data.map(r => html`<div class="result" onclick=${() => jump(r)}>
        <div class="fullname">
          <div class="name">${r.name}</div>
          <div class="admin">${admin(r).join(' ')}</div>
        </div>
        <div class="fields">
          <div class="lonlat">
            ${r.longitude.toFixed(2)},${r.latitude.toFixed(2)}
          </div>
          <div class="population">
            ${r.population}
          </div>
        </div>
        <div class="favorite">
          <div title=${l('favorites_tab_delete_favorite')} class="emoji-icon-small" style="cursor: pointer;" onclick=${(e) => onDelete(e, r)}>🗑</div>
        </div>
      </div>`)}
    </div>
  </div>`

  function jump(r) {
    emit('map:center', [ r.longitude, r.latitude ])
  }

  function onDelete (ev, r) {
    ev.stopPropagation()
    emit('settings:favorites:delete', r)
  }
}

function admin(r) {
  return [r.admin1,r.admin2,r.admin3,r.admin4,r.countryCode].filter(x => x && !/^\d/.test(x))
}
