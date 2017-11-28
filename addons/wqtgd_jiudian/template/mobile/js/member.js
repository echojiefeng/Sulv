 
 //密码可见JS
       
      $(".the_eyes").click(function(){
       	     if($("#password").attr('type') == 'password'){
       	     	$("#password").attr('type','text');
       	     	$(".the_eyes").css({'background-image':'url(../addons/wqtgd_member/template/mobile/img/icon_open_eyes.png)'});
       	     }else{
       	     	$("#password").attr('type','password');
       	     	$(".the_eyes").css({'background-image':'url(../addons/wqtgd_member/template/mobile/img/icon_close_eyes.png)'});
       	     }
       });
	      $(".the_eyes1").click(function(){
       	     if($("#password1").attr('type') == 'password'){
       	     	$("#password1").attr('type','text');
       	     	$(".the_eyes1").css({'background-image':'url(../addons/wqtgd_member/template/mobile/img/icon_open_eyes.png)'});
       	     }else{
       	     	$("#password1").attr('type','password');
       	     	$(".the_eyes1").css({'background-image':'url(../addons/wqtgd_member/template/mobile/img/icon_close_eyes.png)'});
       	     }
       });

 //jq清除input内容

(function($){
  $.fn.extend({
    addClear: function(options) {
      var options =  $.extend({
        closeSymbol: "&#10006;",
        color: "rgb(255, 255, 255);",
        top: 13,
        right: 4,
        returnFocus: false,
        showOnLoad: true,
        onClear: null
      }, options);

      $(this).wrap("<span style='position:relative;' class='add-clear-span'>");
      $(this).after("<a href='#clear'>"+options.closeSymbol+"</a>");
      $("a[href='#clear']").css({
        color: '#FFF',
        'text-decoration': 'none',
        display: 'none',
        'line-height': 1,
        overflow: 'hidden',
        position: 'absolute',
        right: options.right,
        top: options.top
      }, this);

      if($(this).val().length >= 1 && options.showOnLoad === true) {
        $(this).siblings("a[href='#clear']").show();
      }

      $(this).keyup(function() {
        if($(this).val().length >= 1) {
          $(this).siblings("a[href='#clear']").show();
        } else {
          $(this).siblings("a[href='#clear']").hide();
        }
      });

      $("a[href='#clear']").click(function(){
        $(this).siblings("input").val("");
        $(this).hide();
        if(options.returnFocus === true){
          $(this).siblings("input").focus();
        }
        if (options.onClear){
          options.onClear($(this).siblings("input"));
        }
        return false;
      });
      return this;
    }
  });
})(jQuery);


	
	  
// 弹窗JS 

var PostbirdAlertBox={containerClass:"postbird-box-container active",textTemplate:{title:"提示信息",content:"提示内容",okBtn:"好的",cancelBtn:"取消",contentColor:"#000000",okBtnColor:"#0e90d2",promptTitle:"请输入内容",promptOkBtn:"确认",},getAlertTemplate:function(){var temp='<div class="postbird-box-dialog">'+'<div class="postbird-box-content">'+'<div class="postbird-box-header">'+'<span class="postbird-box-close-btn">×</span>'+'<span class="postbird-box-title">'+"<span ></span>"+"</span>"+"</div>"+'<div class="postbird-box-text">'+'<span style="color:'+this.textTemplate.contentColor+';">'+this.textTemplate.content+"</span>"+"</div>"+'<div class="postbird-box-footer">'+'<button class="btn-footer btn-block-footer btn-footer-ok" style="color:'+this.textTemplate.okBtnColor+';">'+this.textTemplate.okBtn+"</button>"+"</div>"+"</div>"+"</div>";return temp},getConfirmTemplate:function(){return'<div class="postbird-box-container">'+'<div class="postbird-box-dialog">'+'<div class="postbird-box-content">'+'<div class="postbird-box-header">'+'<span class="postbird-box-close-btn">×</span>'+'<span class="postbird-box-title">'+"<span ></span>"+"</span>"+"</div>"+'<div class="postbird-box-text">'+'<span style="color:'+this.textTemplate.contentColor+';">'+this.textTemplate.content+"</span>"+"</div>"+'<div class="postbird-box-footer">'+'<button class="btn-footer btn-left-footer btn-footer-cancel" style="color:'+this.textTemplate.cancelBtnColor+';">'+this.textTemplate.cancelBtn+"</button>"+'<button class="btn-footer btn-right-footer btn-footer-ok"  style="color:'+this.textTemplate.okBtnColor+';">'+this.textTemplate.okBtn+"</button>"+"</div>"+"</div>"+"</div>"+"</div>"},getPromptTemplate:function(){return'<div class="postbird-box-container">'+'<div class="postbird-box-dialog">'+'<div class="postbird-box-content">'+'<div class="postbird-box-header">'+'<span class="postbird-box-close-btn">×</span>'+'<span class="postbird-box-title">'+"<span >"+this.textTemplate.title+"</span>"+"</span>"+"</div>"+'<div class="postbird-box-text">'+'<input type="text" class="postbird-prompt-input" autofocus="true" >'+"</div>"+'<div class="postbird-box-footer">'+'<button class="btn-footer btn-left-footer btn-footer-cancel" style="color:'+this.textTemplate.cancelBtnColor+';">'+this.textTemplate.cancelBtn+"</button>"+'<button class="btn-footer btn-right-footer btn-footer-ok"  style="color:'+this.textTemplate.okBtnColor+';">'+this.textTemplate.okBtn+"</button>"+"</div>"+"</div>"+"</div>"+"</div>"},alert:function(opt){this.textTemplate.title=opt.title||this.textTemplate.title;this.textTemplate.content=opt.content||this.textTemplate.content;this.textTemplate.okBtn=opt.okBtn||this.textTemplate.okBtn;this.textTemplate.okBtnColor=opt.okBtnColor||this.textTemplate.okBtnColor;this.textTemplate.contentColor=opt.contentColor||this.textTemplate.contentColor;var box=document.createElement("div"),_this=this;box.className=this.containerClass;box.innerHTML=this.getAlertTemplate();document.body.appendChild(box);var btn=document.getElementsByClassName("btn-footer-ok");btn[btn.length-1].onclick=function(){if(opt.onConfirm){opt.onConfirm()}_this.removeBox(box)}},confirm:function(opt){this.textTemplate.title=opt.title||this.textTemplate.promptTitle;this.textTemplate.promptPlaceholder=opt.promptPlaceholder||this.textTemplate.promptPlaceholder;this.textTemplate.okBtn=opt.okBtn||this.textTemplate.promptOkBtn;this.textTemplate.okBtnColor=opt.okBtnColor||this.textTemplate.okBtnColor;this.textTemplate.cancelBtn=opt.cancelBtn||this.textTemplate.cancelBtn;this.textTemplate.cancelBtnColor=opt.cancelBtnColor||this.textTemplate.cancelBtnColor;this.textTemplate.content=opt.content||this.textTemplate.content;var box=document.createElement("div"),_this=this;box.className=this.containerClass;box.innerHTML=this.getConfirmTemplate();document.body.appendChild(box);var okBtn=document.getElementsByClassName("btn-footer-ok");okBtn[okBtn.length-1].onclick=function(){if(opt.onConfirm){opt.onConfirm()}_this.removeBox(box)};var cancelBtn=document.getElementsByClassName("btn-footer-cancel");cancelBtn[cancelBtn.length-1].onclick=function(){if(opt.onCancel){opt.onCancel()}_this.removeBox(box)}},prompt:function(opt){this.textTemplate.title=opt.title||this.textTemplate.title;this.textTemplate.content=opt.content||this.textTemplate.content;this.textTemplate.contentColor=opt.contentColor||this.textTemplate.contentColor;this.textTemplate.okBtn=opt.okBtn||this.textTemplate.okBtn;this.textTemplate.okBtnColor=opt.okBtnColor||this.textTemplate.okBtnColor;this.textTemplate.cancelBtn=opt.cancelBtn||this.textTemplate.cancelBtn;this.textTemplate.cancelBtnColor=opt.cancelBtnColor||this.textTemplate.cancelBtnColor;var box=document.createElement("div"),_this=this;box.className=this.containerClass;box.innerHTML=this.getPromptTemplate();document.body.appendChild(box);var promptInput=document.getElementsByClassName("postbird-prompt-input");promptInput=promptInput[promptInput.length-1];promptInput.focus();var okBtn=document.getElementsByClassName("btn-footer-ok");var inputData=promptInput.value;okBtn[okBtn.length-1].onclick=function(){if(opt.onConfirm){opt.onConfirm(promptInput.value)}_this.removeBox(box)};var cancelBtn=document.getElementsByClassName("btn-footer-cancel");cancelBtn[cancelBtn.length-1].onclick=function(){if(opt.onCancel){opt.onCancel(promptInput.value)}_this.removeBox(box)}},removeBox:function(box){var box=document.getElementsByClassName(this.containerClass);document.body.removeChild(box[box.length-1])}};


(function(){

	//弹窗公共部分js，所有弹窗已经写好，调用时按照页面中注释方法使用即可
	var $oMasking;
	var $oWindowContainer;
	//打开弹窗方法
	$.fn.openWindow = function(setTitle,setContents,setButton){
		
		//拼接弹窗内容，并且在调用打开弹窗方法时将内容塞进body
		var _html ='<div class="window-masking"></div>'+
		'<div class="window-container fix" id="addNew">'+
			'<h2></h2>'+
			'<div class="window-content">'+
				'<p class="window-text"></p>'+
			'</div>'+
			'<div class="window-btn fix">'+
				'<a class="cancel-button fl" href="javascript:;"></a>'+
				'<a class="confirm-button fr" href="javascript:;"></a>'+
				'<a class="ack-button fr" href="javascript:;"></a>'+
			'</div>'+
		'</div>'; 
		//将拼接好的html塞进body里面
		$('body').append(_html);
		$oMasking = $('.window-masking');
		$oWindowContainer = $('.window-container');
		//点击取消按钮关闭弹窗
		$('.cancel-button,.window-masking,.ack-button').on('click',function(){
			closeWindow();
		});
		//设置蒙版展示
		modal = new Modal();
		console.log(setButton+","+setContents+","+setButton)
		modal.setTitle(setTitle);
		modal.setContents(setContents);
				//设置按钮个数和链接
		modal.setButton(setButton);
		$oMasking.show();
		//设置弹窗面板展示
		$oWindowContainer.show();
	}
	//关闭弹窗方法
	function closeWindow(){
		$oMasking = $('.window-masking');
		$oWindowContainer = $('.window-container');
		//关闭弹窗的时候将蒙版和html从页面中移除掉
		$oMasking.remove();
		$oWindowContainer.remove();
	}
	//初始化
	var Modal = function () {
	    thismodal = $('#addNew');
	};
	//修改内容方法
	Modal.prototype = {
		setContents:function(obj){
			//找到需要修改内容的标签p，获取调用中设置的提示语
	    	thismodal.find('p.window-text').html(obj);   
		},
		setTitle:function(obj){
			//找到需要修改的弹窗标题，获取调用中设置的弹窗标题
			if(obj!=""){
				thismodal.find('h2').show().html(obj); 
			}
	    	
		},
		setButton: function (obj){
			console.log(obj)
		    //解析传过来的参数json
		    var json=eval(obj);
		   
		    
		    if(json.length==1){
		    	//一个按钮
		    	thismodal.find('a.ack-button').show().html(json[0]);
		    }
		    if(json.length==2){
		    	//两个按钮
		    	thismodal.find('a.cancel-button').show().html(json[0]); 
		    	thismodal.find('a.confirm-button').show().html(json[1]);

		    }
		}
	}
	
	})()
	
	