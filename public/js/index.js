(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/albertoforni/SideProjects/portfolioSara/coffee/af.coffee":[function(require,module,exports){
var AF,
  __hasProp = {}.hasOwnProperty;

AF = (function() {
  function AF() {}

  AF.parseDataAttr = function(el, dataAttr) {
    var dataRegEx;
    if (dataAttr == null) {
      dataAttr = "data-";
    }
    dataRegEx = new RegExp("^" + dataAttr);
    return [].filter.call(el.attributes, function(at) {
      return dataRegEx.test(at.name);
    });
  };

  AF.CssPropCreate = function(object) {
    var csonArr, key, value;
    csonArr = [];
    for (key in object) {
      if (!__hasProp.call(object, key)) continue;
      value = object[key];
      csonArr.push("" + key + ": " + value);
    }
    return csonArr.join('; ');
  };

  AF.CssPropParse = function(cson) {
    var obj, parts;
    obj = {};
    parts = cson.split(';');
    parts.forEach(function(part) {
      var keyValue;
      keyValue = part.split(':');
      return obj[keyValue[0].trim()] = keyValue[1].trim();
    });
    return obj;
  };

  AF.hashes = 0;

  AF.addHash = function(el) {
    return el.hash = this.hashes++;
  };

  AF.getOriginalProperties = function(el, csonProps) {
    var originalProperties, properties, style;
    properties = Object.keys(this.CssPropParse(csonProps));
    originalProperties = {};
    style = window.getComputedStyle(el);
    properties.forEach(function(prop) {
      return originalProperties[prop] = style.getPropertyValue(prop);
    });
    return originalProperties;
  };

  AF.percentage = function(value, base) {
    return parseInt(value / base * 100);
  };

  AF.getViewport = function() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  };

  return AF;

})();

module.exports = {
  AF: AF
};



},{}],"/Users/albertoforni/SideProjects/portfolioSara/coffee/index.coffee":[function(require,module,exports){
var $win, AF, actions, createSlides, dcss, executeActions, executeActionsArr, main,
  __hasProp = {}.hasOwnProperty;

AF = require('./af').AF;

window.AF = AF;

$(window).load(function() {
  return main();
});

$win = $(window);

$win.on('resize', function() {
  createSlides();
  return dcss();
});

main = function() {
  createSlides();
  dcss();
  return $('#mainFooter').addClass('hidden');
};

createSlides = function() {
  var $imageFull, $singleSlides, $slides, incremantalHeight, viewport;
  $slides = $('.slides');
  $singleSlides = $slides.find('.slide-block');
  $imageFull = $singleSlides.find(".slide-img-full");
  $imageFull.each(function() {
    var $container, $image;
    $image = $(this);
    $container = $(this).closest(".slide-block");
    $image.hide();
    return $container.css("background-image", "url('" + $image.attr("src") + "')").addClass("slide-backgroundImage");
  });
  $singleSlides.each(function() {
    return $slides.height($slides.height() + $(this).outerHeight());
  });
  incremantalHeight = 0;
  viewport = parseInt(AF.getViewport());
  return $singleSlides.each(function(i) {
    var $block, top;
    $block = $(this);
    top = AF.percentage(incremantalHeight, viewport);
    $block.css({
      top: "" + top + "vh"
    });
    return incremantalHeight = incremantalHeight += $block.outerHeight();
  });
};

dcss = function() {
  var $dcss, elements, lastScrollTop;
  $dcss = $('.dcss');
  elements = [];
  $dcss.each(function() {
    var $el, dataAttributes, dataAttributesObj;
    $el = $(this);
    this.hash = AF.addHash(this);
    dataAttributes = AF.parseDataAttr(this, "data-dcss");
    dataAttributesObj = {
      down: {},
      up: {}
    };
    dataAttributes.forEach(function(obj) {
      var key, originalProperties;
      originalProperties = AF.CssPropCreate(AF.getOriginalProperties($el[0], obj.value));
      key = obj.name.replace('data-dcss-', '');
      dataAttributesObj.down[key] = obj.value;
      return dataAttributesObj.up[key] = originalProperties;
    });
    return elements.push({
      dataAttributesObj: dataAttributesObj,
      $el: $el
    });
  });
  lastScrollTop = AF.percentage($win.scrollTop(), $win.height());
  executeActionsArr(elements, $win, 'down', lastScrollTop);
  return $win.on('scroll', function() {
    var scrollDirection, winRatio;
    scrollDirection = '';
    winRatio = AF.percentage($win.scrollTop(), $win.height());
    if (lastScrollTop < winRatio) {
      scrollDirection = 'down';
    } else if (lastScrollTop > winRatio) {
      scrollDirection = 'up';
    } else {
      return;
    }
    lastScrollTop = winRatio;
    return executeActionsArr(elements, $win, scrollDirection, winRatio);
  });
};

executeActionsArr = function(elements, $win, scrollDirection, winRatio) {
  return elements.forEach(function(el) {
    return executeActions(el.dataAttributesObj, $win, el.$el, scrollDirection, winRatio);
  });
};

actions = {
  down: {},
  up: {}
};

executeActions = function(dataAttributesObj, $win, $el, scrollDirection, winRatio) {
  var activationPoint, cssActions, elHash, otherDirection, props, _base, _base1, _ref, _ref1, _results;
  elHash = $el[0].hash;
  otherDirection = scrollDirection === 'up' ? 'down' : 'up';
  _ref = dataAttributesObj[scrollDirection];
  _results = [];
  for (activationPoint in _ref) {
    if (!__hasProp.call(_ref, activationPoint)) continue;
    cssActions = _ref[activationPoint];
    if (parseInt(activationPoint) > winRatio && scrollDirection === 'down') {
      continue;
    }
    if (parseInt(activationPoint) < winRatio && scrollDirection === 'up') {
      continue;
    }
    actions[scrollDirection][elHash];
    if (((_ref1 = actions[scrollDirection][elHash]) != null ? _ref1[activationPoint] : void 0) === true) {
      continue;
    }
    if ((_base = actions[scrollDirection])[elHash] == null) {
      _base[elHash] = {};
    }
    actions[scrollDirection][elHash][activationPoint] = true;
    if ((_base1 = actions[otherDirection])[elHash] == null) {
      _base1[elHash] = {};
    }
    actions[otherDirection][elHash][activationPoint] = false;
    props = AF.CssPropParse(cssActions);
    _results.push($el.css(props));
  }
  return _results;
};



},{"./af":"/Users/albertoforni/SideProjects/portfolioSara/coffee/af.coffee"}]},{},["/Users/albertoforni/SideProjects/portfolioSara/coffee/index.coffee"]);
