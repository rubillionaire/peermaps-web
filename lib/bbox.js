function centerViewbox (lonlat) {
  var dx = 0.01
  var dy = 0.005
  return [
    lonlat[0]-dx, lonlat[1]-dy,
    lonlat[0]+dx, lonlat[1]+dy
  ]
}

exports.centerViewbox = centerViewbox

function chatgptZoomToPosition (bbox, position, zoom) {
  var dx = bbox[2] - bbox[0]
  var dy = bbox[3] - bbox[1]
  var cx = (bbox[2] + bbox[0]) / 2
  var cy = (bbox[3] + bbox[1]) / 2
  var scale = Math.pow(2, zoom)
  console.log({scale})
  var newDx = dx / scale
  var newDy = dy / scale
  var aspectRatio = dx / dy
  var newAspectRatio = newDx / newDy
  if (newAspectRatio > aspectRatio) {
    // adjust new width to match aspect ratio of current bounding box
    newDy = newDx / aspectRatio
  } else {
    // adjust new height to match aspect ratio of current bounding box
    newDx = newDy * aspectRatio
  }
  var newCx = cx + (position[0] - 0.5) * dx - (newDx / 2)
  var newCy = cy + (position[1] - 0.5) * dy - (newDy / 2)
  var newBbox = [
    newCx - newDx / 2,
    newCy - newDy / 2,
    newCx + newDx / 2,
    newCy + newDy / 2
  ]
  return newBbox
}

exports.chatgptZoomToPosition = chatgptZoomToPosition

var ln360 = Math.log2(360)

function zoomToPosition (bbox,position,zoom) {
  var dx = bbox[2] - bbox[0]
  var dy = bbox[3] - bbox[1]
  var d = Math.pow(2, ln360 - zoom)
  var x = (bbox[2] + bbox[0]) * 0.5 + (dx * (position[0] - 0.5))
  var y = (bbox[3] + bbox[1]) * 0.5 + (dy * (position[1] - 0.5))
  var sx = dx < dy ? dx / dy : 1
  var sy = dy < dx ? dy / dx : 1
  bbox[0] = x - d * sx
  bbox[1] = y - d * sy
  bbox[2] = x + d * sx
  bbox[3] = y + d * sy
  return bbox
}

exports.zoomToPosition = zoomToPosition