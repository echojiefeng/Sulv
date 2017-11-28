 /**
  * zepto插件：向左滑动删除动效
  * 使用方法：$('.itemWipe').touchWipe({itemDelete: '.item-delete'});
  * 参数：itemDelete  删除按钮的样式名
  */
 ;
 (function($) {
   $.fn.touchWipe = function(option) {
     var defaults = {
       itemDelete: '.item-delete', //删除元素
     };
     var opts = $.extend({}, defaults, option); //配置选项
 
     var delWidth = $(opts.itemDelete).width();
 
     var initX; //触摸位置
     var moveX; //滑动时的位置
     var X = 0; //移动距离
     var objX = 0; //目标对象位置
     $(this).on('touchstart', function(event) {
       event.preventDefault();
       var obj = this;
       initX = event.targetTouches[0].pageX;
       objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
       if (objX == 0) {
         $(this).on('touchmove', function(event) {
           event.preventDefault();
           var obj = this;
           moveX = event.targetTouches[0].pageX;
           X = moveX - initX;
           if (X >= 0) {
             obj.style.WebkitTransform = "translateX(" + 0 + "px)";
           } else if (X < 0) {
             var l = Math.abs(X);
             obj.style.WebkitTransform = "translateX(" + -l + "px)";
             if (l > delWidth) {
               l = delWidth;
               obj.style.WebkitTransform = "translateX(" + -l + "px)";
             }
           }
         });
       } else if (objX < 0) {
         $(this).on('touchmove', function(event) {
           event.preventDefault();
           var obj = this;
           moveX = event.targetTouches[0].pageX;
           X = moveX - initX;
           if (X >= 0) {
             var r = -delWidth + Math.abs(X);
             obj.style.WebkitTransform = "translateX(" + r + "px)";
             if (r > 0) {
               r = 0;
               obj.style.WebkitTransform = "translateX(" + r + "px)";
             }
           } else { //向左滑动
             obj.style.WebkitTransform = "translateX(" + -delWidth + "px)";
           }
         });
       }
 
     })
     $(this).on('touchend', function(event) {
       event.preventDefault();
       var obj = this;
       objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
       if (objX > -delWidth / 2) {
         obj.style.transition = "all 0.2s";
         obj.style.WebkitTransform = "translateX(" + 0 + "px)";
         obj.style.transition = "all 0";
         objX = 0;
       } else {
         obj.style.transition = "all 0.2s";
         obj.style.WebkitTransform = "translateX(" + -delWidth + "px)";
         obj.style.transition = "all 0";
         objX = -delWidth;
       }
     })
 
     //链式返回
     return this;
   };
 
 })(Zepto);