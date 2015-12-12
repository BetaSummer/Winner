;(function($){
    $('.ui.dropdown').dropdown();
    $('.mycommodity-card .image').dimmer({
        on: 'hover'
    });
    $('.popupele')
        .popup({
            position:'bottom center',
            variation:'tiny'
        })
    ;
    var um = UM.getEditor('richEditor',{
        autoHeightEnabled:true
    });

})(jQuery);

