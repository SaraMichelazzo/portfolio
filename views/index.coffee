ENV = 'dev'

class AF
  @log: (msg) ->
    if typeof msg is 'string'
      console.log "#{@getFuncCaller()}: #{msg}"
    else
      console.log @getFuncCaller(), msg

  @getFuncCaller: ->
    thisFuncCaller = arguments.callee.caller

    thisFuncCaller.arguments.callee.caller.name

  @parseDataAttr: (el, dataAttr = "data-") ->
    dataRegEx = new RegExp("^#{dataAttr}")
    [].filter.call el.attributes, (at) ->
      dataRegEx.test(at.name)

  @CssPropCreate: (object) ->
    csonArr = []
    for own key, value of object
      csonArr.push "#{key}: #{value}"

    csonArr.join('; ')

  @CssPropParse: (cson) ->
    obj = {}
    parts = cson.split(';')
    parts.forEach (part) ->
      keyValue = part.split(':')
      obj[keyValue[0].trim()] = keyValue[1].trim()

    obj

  @hashes: 0
  @addHash: (el) ->
    el.hash = @hashes++

  @getOriginalProperties: (el, csonProps) ->
    properties = Object.keys(@CssPropParse(csonProps))

    originalProperties = {}

    style = window.getComputedStyle(el)

    properties.forEach (prop) ->
      originalProperties[prop] = style.getPropertyValue(prop)

    originalProperties

window.AF = AF

$(document).ready -> main()

main = ->
  createSlides()
  parallax()

createSlides = ->
  $blocks = $('.slide-block')
  AF.log($blocks)

  $blocks.each (i) ->
    $block = $(@)

    $block.css
      top: (i * 100) + "vh"


  # set image-full as background image of the .block element
  $imageFull = $blocks.find(".slide-img-full")
  $imageFull.each ->
    $image = $(this)
    $container = $(this).closest(".slide-block")

    # hide image
    $image.hide()

    # set the image as background image of the .block container
    $container.css("background-image", "url('" + $image.attr("src") + "')").addClass "slide-backgroundImage"

parallax = ->

  # set the height of the animate-container so it won't change in case of absolute classes
  $animateContainer = $('.animate-container')
  AF.log($animateContainer)
  AF.log("animateContainer height: #{$animateContainer.height()}")

  $animateContainerChildren = $animateContainer.find('.animate-block')
  AF.log($animateContainerChildren)

  $animateContainerChildren.each ->
    AF.log("animateContainerChildren height: #{$(this).height()}")
    $animateContainer.height($animateContainer.height() + $(this).height())

  AF.log("animateContainer new height: #{$animateContainer.height()}")


  # for each element create the actions
  $win = $(window)
  elements = []
  $animateContainerChildren.each ->
    $animate = $(@)
    @hash = AF.addHash(this)

    dataAttributes = AF.parseDataAttr(@, "data-parallax")
    AF.log(dataAttributes)

    dataAttributesObj =
      down: {}
      up: {}

    dataAttributes.forEach (obj) ->
      originalProperties = AF.CssPropCreate(AF.getOriginalProperties($animate[0], obj.value))

      key = obj.name.replace('data-parallax-', '')
      dataAttributesObj.down[key] = obj.value
      dataAttributesObj.up[key] = originalProperties

    AF.log('##########')
    AF.log('Data Attributes')
    AF.log(dataAttributesObj)
    AF.log('##########')

    elements.push
      dataAttributesObj: dataAttributesObj
      $animate: $animate

  lastScrollTop = parseInt($win.scrollTop() / $win.height() * 100)

  executeActionsArr(elements, $win, 'down', lastScrollTop)

  $win.on 'scroll', ->

    scrollDirection = ''

    winRatio = parseInt($win.scrollTop() / $win.height() * 100)

    if lastScrollTop < winRatio
      scrollDirection = 'down'
      otherDirection = 'up'
    else if lastScrollTop > winRatio
      scrollDirection = 'up'
      otherDirection = 'down'
    else
      return

    lastScrollTop = winRatio

    executeActionsArr(elements, $win, scrollDirection, winRatio)


executeActionsArr = (elements, $win, scrollDirection, winRatio)->
  elements.forEach (el) -> executeActions(el.dataAttributesObj, $win, el.$animate, scrollDirection, winRatio)

animations =
  down: {}
  up: {}

executeActions = (dataAttributesObj, $win, $animate, scrollDirection, winRatio) ->
  animateHash = $animate[0].hash

  otherDirection = if scrollDirection is 'up' then 'down' else 'up'

  for own activationPoint, cssActions of dataAttributesObj[scrollDirection]

    # if activationPoint > winTop the action should not be executed yet
    continue if parseInt(activationPoint) > winRatio and scrollDirection is 'down'
    continue if parseInt(activationPoint) < winRatio and scrollDirection is 'up'

    animations[scrollDirection][animateHash]

    continue if animations[scrollDirection][animateHash]?[activationPoint] is true

    animations[scrollDirection][animateHash] ?= {}
    animations[scrollDirection][animateHash][activationPoint] = true

    animations[otherDirection][animateHash] ?= {}
    animations[otherDirection][animateHash][activationPoint] = false

    AF.log("#{animateHash} -> cssAction: #{cssActions}")

    props = AF.CssPropParse(cssActions)

    AF.log(props)

    $animate.css(props)
