// 后台管理的 js
;(function(){
// 管理目录
var firstNavList = document.querySelector('#firstNavList');
var addFirstNavBtn = document.querySelector('#addFirstNavBtn');
var addSecondNavBtn = document.querySelector('#addSecondNavBtn');

/*
* options {data:{name1:value1,name2:value2},urL:'/admin/doSomething'}
 */
// var sendForm = function(options){
// 	var formdata = new FormData();
// 	var url = options.url;
// 	if(options.data){
// 		for(var k in options.data){
// 			formdata.append(k,options.data[k]);
// 		}
// 	}
// 	console.log(options)
// 	var xhr = new XMLHttpRequest();
// 	xhr.onload = function(e){
// 		console.log(e)
// 	};
// 	xhr.open('POST',url,true);
// 	xhr.setRequestHeader("Content-Type", "multipart/form-data");
// 	xhr.send(formdata);
// };
//
if(firstNavList){
	firstNavList.addEventListener('click',function(e){
	},false)
}
// 添加一级目录
// if(addFirstNavBtn){
// 	addFirstNavBtn.addEventListener('click',function(e){
// 		e.preventDefault();
// 		e.stopPropagation();
// 		var newFirstNav = e.target.previousElementSibling.value;
// 		var options = {
// 			data:{
// 				firstNav:newFirstNav
// 			},
// 			url:'/admin/addFirstNav'
// 		};
// 		sendForm(options)
// 		return false
// 	},false)
// }

})();
