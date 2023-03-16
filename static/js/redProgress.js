$({property: 0}).animate({property: 100}, {
    duration: 3000,
    step: function() {
        var percentage = Math.round(this.property);

        $('#progress').css('width',  percentage+"%");
        if(percentage == 100) {
            $("#progress").addClass("done");
        }
    }
});