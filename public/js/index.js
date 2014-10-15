(function(){
'use strict';

$('document').ready(function(){
    var win = getDimensions(window);

    // set block dimensions to the window dimensions
    var $block = $('.slide-block');
    setDimension($block, win.width, win.height);

    // first is fixed
    firstFixed($block);

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

        firstFixed($block);
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

function firstFixed($block) {
    $block.first().css({
        position: 'fixed',
        'z-index': -10,
        top: 0,
        left: 0
    });

    $block.eq(1).css({
        marginTop: $block.first().height()
    });
}
})();