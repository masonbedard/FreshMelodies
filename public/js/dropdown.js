

var maxHeight = 200;

$(function(){

    $(".dropdown > li").hover(function() {
         var $container = $(this),
             $list = $container.find("ul"),
             height = $list.height() * .86,       // make sure there is enough room at the bottom
             multiplier = height / maxHeight;     // needs to move faster if list is taller

        // need to save height here so it can revert on mouseout
        $container.data("origHeight", $container.height());

        // so it can retain it's rollover color all the while the dropdown is open
        $list.addClass("hover");

        // make sure dropdown appears directly below parent list item
        $list
            .show()
            .css({
                paddingTop: 0
            });

        // don't do any animation if list shorter than max
        if (multiplier > 1) {
            $container
                .css({
                    height: maxHeight,
                    overflow: "hidden"
                })
                .mousemove(function(e) {
                    var offset = $container.offset();
                    var relativeY = ((e.pageY - offset.top) * multiplier) - ($container.data("origHeight") * multiplier);
                    if (relativeY > $container.data("origHeight")) {
                        $list.css("top", -relativeY + $container.data("origHeight"));
                    };
                });
        }

    }, function() {

        var $el = $(this);

        // put things back to normal
        $el
            .height(20)
            .find("ul").removeClass("hover")
            .css({ top: 0 })
            .hide();

    });

    // Add down arrow only to menu items with submenus
    $(".dropdown > li:has('ul')").each(function() {
        $(this).find("a:first").append("<img src='down-arrow.png' />");
    });


});

$(".genre").bind('click', function() {
    $("#g_select").height(20).find('ul').removeClass("hover").css({top:0}).hide().end();
    document.getElementById("g_text").textContent = this.textContent;
});
