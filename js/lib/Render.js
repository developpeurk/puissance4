/**
 * Created by gerald on 16/04/2014.
 */

var Render = {

  renderTo: function(domObj, twigfile, data) {
    Render.render(twigfile, data, function(data) {
      $(domObj).html(data);
    });
  },

  render: function(twigfile, data, callback) {
    $.get(twigfile)
      .done(function(twigdata) {
        var template = twig({
          data: twigdata
        });

        var html = template.render(data);

        /*var regexpForInclude = new RegExp('<include file=\"(.*)\"\/>', "");
        var occurence = regexpForInclude.exec(html);


        if (occurence && occurence.length > 0) {
          var stringtoreplace = occurence[0];
          var filetoLoad = occurence[1];

          if (filetoLoad) {
            Render.render(filetoLoad, {}, function(datainclude) {

              var htmlinclude="";
              datainclude.each(function(idx,obj){
                htmlinclude+=obj.outerHTML;
              });

              html = html.replace(stringtoreplace, htmlinclude);
              callback($(html));
            });
          }
        } else */callback($(html));
      });
  }


}