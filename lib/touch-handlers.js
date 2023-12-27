const distance = require('gl-vec2/distance')
function noop () {}

module.exports = TouchHandlers

function TouchHandlers ({
  element,
  preventDefault=false,
  ontouchstart=noop,
  ontouchmove=noop,
  ontouchend=noop,
} = {}) {
  // panning
  let touch0 = [0, 0]
  let delta0 = [0, 0]
  let touch0id

  // zomming
  let touch1 = [0, 0]
  let touch1id
  let previousTouchDistance = 0

  let doubleTapTimer = null

  function touchstart (event) {
    if (preventDefault) event.preventDefault()

    let doubleTapped = false

    if (doubleTapTimer) {
      clearTimeout(doubleTapTimer)
      doubleTapTimer = null
      doubleTapped = true
    }
    else {
      doubleTapTimer = setTimeout(() => {
        doubleTapTimer = null
      }, 300)
    }

    let targetBbox = event.target.getBoundingClientRect()

    if (!touch0id) {
      touch0 = [event.targetTouches[0].clientX - targetBbox.left, event.targetTouches[0].clientY- targetBbox.top]
      touch0id = event.targetTouches[0].identifier
    }
    
    if (event.targetTouches.length > 1 && !touch1id) {
      touch1 = [event.targetTouches[1].clientX - targetBbox.left, event.targetTouches[1].clientY - targetBbox.top]
      touch1id = event.targetTouches[1].identifier
      ontouchstart({ event, touch0, touch1 })
    }
    else {
      ontouchstart({ event, touch0, doubleTapped })
    }
  }
  function touchmove (event) {
    if (preventDefault) event.preventDefault()
    let targetBbox = event.target.getBoundingClientRect()
    var _touch0 = [
      event.targetTouches[0].clientX - targetBbox.left,
      event.targetTouches[0].clientY - targetBbox.top,
    ]
    delta0 = [
      touch0[0] - _touch0[0],
      touch0[1] - _touch0[1]
    ]
    touch0 = _touch0

    if (event.targetTouches.length > 1) {
      touch1 = [
        event.targetTouches[1].clientX - targetBbox.left,
        event.targetTouches[1].clientY - targetBbox.top,
      ]

      var center = [
        (touch0[0] + touch1[0]) / 2,
        (touch0[1] + touch1[1]) / 2,
      ]
      var currentDistance = distance(touch0, touch1)
      let distanceDifference
      if (!isNaN(previousTouchDistance)) {
        distanceDifference = currentDistance - previousTouchDistance  
      }
      
      ontouchmove({ event, delta0, center, distanceDifference })

      previousTouchDistance = currentDistance
    } else {
      touch1 = [0, 0]
      previousTouchDistance = 0
      ontouchmove({ event, delta0 })
    }
  }
  function touchend (event) {
    if (preventDefault) event.preventDefault()

    // this implementation assumes that touch 1 is lifted before
    // touch 0. otherwise we might have to swap some touch 1 variables
    // in place for touch 0 variables since it conin

    if (!event.targetTouches[0]) {
      clearTouch0()
    }
    if (!event.targetTouches[1]) {
      clearTouch1()
    }

    ontouchend({ event })

    function clearTouch0 () {
      touch0 = [0, 0]
      delta0 = [0, 0]
      touch0id = null
    }

    function clearTouch1 () {
      touch1 = [0, 0]
      previousTouchDistance = 0
      touch1id = null
    }
  }

  if (element) {
    element.addEventListener('touchstart', touchstart)
    element.addEventListener('touchmove', touchmove)
    element.addEventListener('touchend', touchend)

    return function destroy () {
      element.removeEventListener('touchstart', touchstart)
      element.removeEventListener('touchmove', touchmove)
      element.removeEventListener('touchend', touchend)      
    }
  }

  return {
    ontouchstart: touchstart,
    ontouchmove: touchmove,
    ontouchend: touchend,
  }
}
