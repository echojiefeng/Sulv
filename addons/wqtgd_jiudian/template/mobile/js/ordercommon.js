new function (){
   var _self = this;
   _self.width = 640;//设置默认最大宽度
   _self.fontSize = 100;//默认字体大小
   _self.widthProportion = function(){var p = (document.body&&document.body.clientWidth||document.getElementsByTagName("html")[0].offsetWidth)/_self.width;return p>1?1:p<0.5?0.5:p;};
   _self.changePage = function(){
       document.getElementsByTagName("html")[0].setAttribute("style","font-size:"+_self.widthProportion()*_self.fontSize+"px");
   }
   _self.changePage();
   window.addEventListener('resize',function(){_self.changePage();},false);
};

$(function(){

});

function getScrollTop()
{
    var scrollTop=0;
    if(document.documentElement&&document.documentElement.scrollTop)
    {
        scrollTop=document.documentElement.scrollTop;
    }
    else if(document.body)
    {
        scrollTop=document.body.scrollTop;
    }
    return scrollTop;
}

$(window).load(function() {
	$("#status").fadeOut();
	$("#preloader").delay(150).fadeOut("slow");
})

$(".home_cp_tit a").click(function(){
			    $('.home_cp_tit a').removeClass('change_c')
                $(this).addClass("change_c");
               var index = $(".home_cp_tit a").index($(this));
               $(".home_all_box").css("display","none");
               $(".home_all_box").eq(index).css("display","block");
           });
$(".yy_jl_tit a").click(function(){
			    $('.yy_jl_tit a').removeClass('change_c')
                $(this).addClass("change_c");
               var index = $(".yy_jl_tit a").index($(this));
               $(".yy_jl_box").css("display","none");
               $(".yy_jl_box").eq(index).css("display","block");
           });

jQuery(document).ready(function($){
	//open popup
	$('#m_go_gua').on('click', function(event){
		event.preventDefault();
		$('.cd-popup').addClass('is-visible');
	});
	
	//close popup
	$('.cd-popup').on('click', function(event){
		if( $(event.target).is('.cd-popup-container') || $(event.target).is('.cd-top-close') ) {
			event.preventDefault();
			$(this).removeClass('is-visible');
		}
	});
	
});