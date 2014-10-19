(function(){
'use strict';

$('document').ready(function(){
    var $win = $(window);
    var win = getDimensions(window);

    // set block dimensions to the window dimensions
    var $blocks = $('.slide-block');
    // var $blocksContainer = $blocks.parent();
    // $blocksContainer.css({
    //     height: ($blocks.length * win.height) + 'px'
    // });
        
    // set image-full as background image of the .block element
    var $imageFull = $blocks.find('.slide-img-full');

    $imageFull.each(function(){
        var $image = $(this);
        var $container = $(this).closest('.slide-block');

        // hide image
        $image.hide();

        // set the image as background image of the .block container
        $container
            .css('background-image', 'url(\'' + $image.attr('src') +'\')')
            .addClass('slide-backgroundImage');
    });

    createParallax($blocks, $win, win);

    // $win.on('resize', function(){
    //     win = getDimensions(window);

    //     setDimension($blocks, win.width, win.height);
    // });
});

function doAction($block, $nextBlock) {
    var nextBlockZindex = Number($nextBlock.data('parallax-zindex'));
    var currentBlockZindex = Number($block.data('parallax-zindex'));

    if (currentBlockZindex > nextBlockZindex) {
        $nextBlock.css({
            position: "absolute",
            top: $(window).scrollTop
        });
        $nextBlock.css({
            position: "fixed",
            top: 0
        });
    } else {
        $block.css({
            position: "fixed",
            top: 0
        });
    }
}

function createParallax ($blocks, $win, win) {
    if (!$blocks || !$win || !win) throw new Error('you must both $blocks, $win and win');

    doAction($($blocks[0]), $($blocks[1]));

    $blocks.each(function(i){
        var $block = $(this);
        var zIndex = Number($block.data('parallax-zindex'));
        // var speed = Number($block.data('parallax-speed'));
        
        $block.css({
            top: (i * 100) + "vh",
            zIndex: zIndex
        });

        var blockOffsetTop = $block.offset().top;

        $win.on('scroll', function(){
            if ($win.scrollTop() === blockOffsetTop) {
                console.log('doAction');
                doAction($block, $($block[i + 1]));
            }

        // $win.on('scroll', function(){
        //     if (zIndex === 0 && ) {
        //     }


        //     // var winScrollTop = $win.scrollTop();

        //     // var previousBlock = $blocks[i - 1];

        //     // if ($block.scrollTop() ) {

        //     // }

        //     // var previousBlock = $blocks[i - 1];
        //     // if (previousBlock) {
        //     //     var $previousBlock = $(previousBlock);
        //     //     var previousBlockTop = $previousBlock.position().top;
        //     //     if (previousBlockTop > 0 ) {
        //     //         return
        //     //     }
        //     // }

        //     // var elementScrollTop = Number(initialTopPosition - winScrollTop * speed);

        //     // $block.css({
        //     //     top: elementScrollTop
        //     // });
        });
    });
}

function isElementAboveView (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top < 0
    );
}

function getDimensions(el) {
    if (!el) throw new Error('you must pass an element as argument');

    var $el = $(el);

    if ($el.length === 0) throw new Error('the ' + el + ' is not in the DOM');

    return {
        width:      $el.width(),
        height:     $el.height(),
        scrollTop:  $el.scrollTop()
    };
}

function setDimension($els, width, height){
    if (!$els || !width || !height) throw new Error('you must pass an element, width and height as arguments');

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