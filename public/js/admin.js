// 后台管理的 js

// ;(function () {
//   // options { data:{ name1:value1,name2:value2 }, urL:'/admin/doSomething' }
//   var sendForm = function (options) {
//     var formdata = new FormData();
//     var url = options.url;
//     if (options.data) {
//       for (var k in options.data) {
//         formdata.append(k, options.data[k]);
//       }
//     }
//     var xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function (e) {
//       // do somethings
//     };
//     xhr.open('POST', url, true);
//     xhr.setRequestHeader("Content-Type", "multipart/form-data");
//     xhr.send(formdata);
//   };
//
// })();

;(function($){

  /***
   * 侧栏菜单
   */
  $('.left.sidebar').first().sidebar('attach events', '.open-sidebar');

  /***
   * semantic ui 的下拉组件
   */
  $('select.dropdown').dropdown();

  /***
   * 首页菜单切换
   */
  $('.menu .item').tab({
    cache: false,
    apiSettings: {
      loadingDuration : 300,
      mockResponse    : function(settings) {
        var response = {
          // first  : 'AJAX Tab One',
          // second : 'AJAX Tab Two',
          // third  : 'AJAX Tab Three'
        };
        return response[settings.urlData.tab];
      }
    },
    context : 'parent',
    auto    : true,
    path    : './admin'
  });

  /***
   * 弹出层
   * .checkCommodity 商品审核
   * .editCommodity  商品管理
   * .editUser       用户管理
   */
  $('.checkCommodity').modal('attach events', '.goToCheck');
  $('.editCommodity').modal('attach events', '.goToEditCommodity');
  $('.editUser').modal('attach events', '.goToEditUser');
  // 审核不通过，商品下架，禁止用户， 显示理由输入框
  $('.fail').on('click', function(e) {
    $(this).parent().parent().transition('fade up');
    $(this).parent().parent().siblings('.fail-msg').transition('fade down');
    $(this).parent().parent().siblings('.fail-msg').removeClass('hide');
  });

  /***
   * 前端 表单验证
   */
  $('.ui.form').form({
    on: 'blur',
    fields: {
      empty: {
        identifier  : 'fail_msg',
        rules: [
          {
            type   : 'empty',
            prompt : '主人您还未输入任何理由，人家会伤心的。。。'
          }
        ]
      }
    }
  });
})(jQuery);
