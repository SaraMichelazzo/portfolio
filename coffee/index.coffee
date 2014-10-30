{AF} = require './af'

window.AF = AF

$(window).load -> main()

$win = $(window)

$win.on 'resize', ->
  createSlides()
  dcss()

main = ->
  createSlides()
  dcss()
  $('#mainFooter').addClass('hidden')

createSlides = ->
  # set the height of the animate-container
  # so it won't change in case of absolute classes
  $slides = $('.slides')

  $singleSlides = $slides.find('.slide-block')

  # set image-full as background image of the .block element
  $imageFull = $singleSlides.find(".slide-img-full")
  $imageFull.each ->
    $image = $(this)
    $container = $(this).closest(".slide-block")

    # hide image
    $image.hide()

    # set the image as background image of the .block container
    $container.css("background-image", "url('" + $image.attr("src") + "')").addClass "slide-backgroundImage"

  $singleSlides.each ->
    $slides.height($slides.height() + $(this).outerHeight())

  incremantalHeight = 0
  viewport = parseInt(AF.getViewport())
  $singleSlides.each (i) ->
    $block = $(@)

    top = AF.percentage(incremantalHeight, viewport)
    $block.css
      top: "#{top}vh"

    incremantalHeight = incremantalHeight += $block.outerHeight()

dcss = ->

  # set the height of the animate-container so it won't change in case of absolute classes
  $dcss = $('.dcss')

  # for each element create the actions
  elements = []
  $dcss.each ->
    $el = $(@)
    @hash = AF.addHash(this)

    dataAttributes = AF.parseDataAttr(@, "data-dcss")

    dataAttributesObj =
      down: {}
      up: {}

    dataAttributes.forEach (obj) ->
      originalProperties = AF.CssPropCreate(AF.getOriginalProperties($el[0], obj.value))

      key = obj.name.replace('data-dcss-', '')
      dataAttributesObj.down[key] = obj.value
      dataAttributesObj.up[key] = originalProperties

    elements.push
      dataAttributesObj: dataAttributesObj
      $el: $el

  lastScrollTop = AF.percentage($win.scrollTop(), $win.height())

  executeActionsArr(elements, $win, 'down', lastScrollTop)

  $win.on 'scroll', ->

    scrollDirection = ''

    winRatio = AF.percentage($win.scrollTop(), $win.height())

    if lastScrollTop < winRatio
      scrollDirection = 'down'
    else if lastScrollTop > winRatio
      scrollDirection = 'up'
    else
      return

    lastScrollTop = winRatio

    executeActionsArr(elements, $win, scrollDirection, winRatio)


executeActionsArr = (elements, $win, scrollDirection, winRatio)->
  elements.forEach (el) -> executeActions(el.dataAttributesObj, $win, el.$el, scrollDirection, winRatio)

actions =
  down: {}
  up: {}

executeActions = (dataAttributesObj, $win, $el, scrollDirection, winRatio) ->
  elHash = $el[0].hash

  otherDirection = if scrollDirection is 'up' then 'down' else 'up'

  for own activationPoint, cssActions of dataAttributesObj[scrollDirection]

    # if activationPoint > winTop the action should not be executed yet
    continue if parseInt(activationPoint) > winRatio and scrollDirection is 'down'
    continue if parseInt(activationPoint) < winRatio and scrollDirection is 'up'

    actions[scrollDirection][elHash]

    continue if actions[scrollDirection][elHash]?[activationPoint] is true

    actions[scrollDirection][elHash] ?= {}
    actions[scrollDirection][elHash][activationPoint] = true

    actions[otherDirection][elHash] ?= {}
    actions[otherDirection][elHash][activationPoint] = false

    props = AF.CssPropParse(cssActions)

    $el.css(props)
