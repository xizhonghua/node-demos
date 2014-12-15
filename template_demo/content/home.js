$(function(){
    var tmpl;
    tdata = {};

    var initPage = function() {
        $.get('/template/home.html', function(d){
            tmpl = d;
        });

        $.getJSON("/albums/chicago2014.json", function(d) {
            $.extend(tdata, d.data);
        });

        $(document).ajaxStop(function() {
            var html = Mustache.to_html(tmpl, tdata);
            $("body").html(html);
        });        
    }();
});