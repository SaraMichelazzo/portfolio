'use strict';

$('document').ready(function(){
    var win = getDimensions(window);

    // set block dimensions to the window dimensions
    var $block = $('.slide-block');
    setDimension($block, win.width, win.height);

    $(window).on('resize', function(){
        win = getDimensions(window);

        setDimension($block, win.width, win.height);
    });
});

function getDimensions(el) {
    if (!el) throw new Error("you must pass an element as argument");

    var $el = $(el);

    if ($el.length === 0) throw new Error("the " + el + " is not in the DOM");

    return {
        width:      $el.width(),
        height:     $el.height(),
        scrollTop:  $el.scrollTop()
    }
}

function setDimension($els, width, height){
    if (!$els || !width || !height) throw new Error("you must pass an element, width and height as arguments");

    $els.width(width);
    $els.height(height);
}