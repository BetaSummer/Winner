// 后台管理的 js
/*
;(function () {
  // options { data:{ name1:value1,name2:value2 }, urL:'/admin/doSomething' }
  var sendForm = function (options) {
    var formdata = new FormData();
    var url = options.url;
    if (options.data) {
      for (var k in options.data) {
        formdata.append(k, options.data[k]);
      }
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
      // do somethings
    };
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(formdata);
  };

})();
*/
