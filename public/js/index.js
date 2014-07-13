'use strict';

$('document').ready(function(){
    var win = getDimensions(window);

    // set block dimensions to the window dimensions
    var $block = $('.slide-block');
    setDimension($block, win.width, win.height);

    // set image-full as background image of the .block element
    var $imageFull = $block.find('.slide-img-full');

    $imageFull.each(function(){
        var $image = $(this);
        var $container = $(this).closest('.slide-block');

        // hide image
        $image.hide();

        // set the image as background image of the .block container
        $container
            .css('background-image', "url('" + $image.attr('src') +"')")
            .addClass('slide-backgroundImage');
    });

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
        width:  $el.width(),
        height: $el.height(),
    }
}

function setDimension($els, width, height){
    if (!$els || !width || !height) throw new Error("you must pass an element, width and height as arguments");

    $els.width(width);
    $els.height(height);
}