class AF
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

  @percentage: (value, base) ->
    parseInt(value / base * 100)

  @getViewport: ->
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

module.exports = {AF}
