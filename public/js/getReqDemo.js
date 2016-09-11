(function($) {
  var getDateByGet = function(url, cb) {
    $.get(url, function(data) {
      return cb(data);
    });
  };
  window.getDateByGet = getDateByGet;
})(jQuery);
