sessionStorage["ticketDetail"] = '';

// 隐藏的 div 的父节点
var hideDivP = $($('.ej-router-layer')[0]).next();

// 是否隐藏顶部title
var isHide = false;

// 是否正在开启界面
var isOpening = false;

// 页面数
var pageNum = 0;

// 是否有景点列表界面
var hasTicketList = false;

// 全局数组
var defaultArr = [];

// 是否上拉加载
var isPull = false;

// 搜界面滑动页数
var slickPageNum = 0;

// 是否在清除搜索历史状态
var isClearHistory = false;

// 是否打开至搜索界面
var isFromSearch = false;

// 打开门票列表的id
var navid = '';

// 判断从哪里进入门票列表
var content1 = '';

// 搜索类型
var searchType = 0;

// var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
// var Animate = isAndroid==true?'':'ej-router-animate'; 

//获取界面动画对象
var interFaceAnimTool = adTicketTools.toolsFactory('InterFaceAnim');
//获取城市对象
var hCityTool = adTicketTools.toolsFactory('HCity');
//获取门票列表对象
var ticksListTool = adTicketTools.toolsFactory('TicketsList');
//获取门票详情对象
var ticksDetailTool = adTicketTools.toolsFactory('TicketsDetail');
//获取异步请求对象
var asyRequestTool = adTicketTools.toolsFactory('AsyRequest');
//获取按钮状态对象
var btnStatesTool = adTicketTools.toolsFactory('BtnStates');
//获取日期对象
var dateInterfaceTool = adTicketTools.toolsFactory('DateInterface');
//获取公共方法对象
var publicFunctionTool = adTicketTools.toolsFactory('PublicFuction');
//获取定位对象
var getLocationCTool = adTicketTools.toolsFactory('GetLocationC');

/*初始化数据*/
 function init(){

 	$.each(hideDivP.children(), function(index, item){

	$(item).css('height', $(document.body).height());
	$(item).css('top', $(document.body).height() * (-1));

	});

	$.each($('.ej-swiper-item'), function(index, item){

		$(item).css('width', $(document.body).width());

	})

	var _cityInterfaceDiv = $('.citytypetag ').parent().parent().parent();
	_cityInterfaceDiv.css('top', $(window).height()*(-1) + 'px');

	//启动 FastClick
	FastClick.attach(document.body);

	//幻灯片
	 $('.ticket-nav').slick({
	        dots: true,
	        infinite: false,
	        speed: 300,
	        slidesToShow: 1,
	        slidesToScroll: 1
	    });

	 $('.searchListContainer').children('.ej-swiper-content').slick({
	 		dots: false,
	        infinite: false,
	        speed: 300,
	        slidesToShow: 1,
	        slidesToScroll: 1,
	        onAfterChange: function(item, index){

	        	var _className = 'text-selected';
	        	if(index == 0){

	        		_className = isClearHistory!=false?'':'text-selected';

	        	}

	        	publicFunctionTool.changeStyle(
	        		$('.tabContainer').children(),
	        		_className,
	        		$($('.tabContainer').children()[index])
	        		);

	        }
	 });
	 clearSearchHistory();

	 //设置城市数据
	 hCityTool.setCityData(asyRequestTool.getCityData, interFaceAnimTool.closeAnim);
	 hCityTool.getIndexNavPosition($('.index-middle>a'), hCityTool.rightNavPositions);

	 //创建日期界面
	dateInterfaceTool.createInterface($(hideDivP.children()[2]).find('.ej-css-q'), 0, true);

	//定位
	getLocationCTool.getLocation({
		$cityName: $('.city-name'),
		$beingPositioned: $('.being-positioned')
	},
	chooseCityD
	);

}

init();

// 打开景点搜索界面
$('.banner-box>.search').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	var _cfg = {
		openStyle1: {
			'webkitTransform':'translateY(0px)',
			'transform':'translateY(0px)'
		},
		openStyle2: {
			'webkitTransform':'translateX(0px)',
			'transform':'translateX(0px)'
		}
	}

	var _$elems = [
					$(hideDivP.children()[3]), 
					$($(hideDivP.children()[3]).children()[1])
					];

	interFaceAnimTool.openAnim(_$elems, _cfg);

});

// 景点搜索界面搜索按钮
$('.ej-css-d').find('.search').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	var _val = $(this).prev().prev().val();

	if(_val != '' && _val != undefined){

		chooseCityOrViewSpot(
		'', 
		$('#url').attr('searchbox'), 
		_val
		);

		$('.ej-css-d').find('.container').addClass('fn-hide');

	}

});

// 景点搜索界面搜索框获取焦点
$('.ej-css-d').find('.ej-tag-search-input').focus(function(){

	$('.ej-css-d').find('.container').removeClass('fn-hide');

});

// 景点搜索界面搜索框失去焦点
$('.ej-css-d').find('.container').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	$('.ej-css-d').find('.container').addClass('fn-hide');

});

// 景点搜索界面输入框搜索城市和景点
$('.ej-css-d').find('.ej-tag-search-input').bind('input propertychange', function(){

	var _listDiv = $('.ej-css-d').find('.list');
	
	var _val = $(this).val();

	if(_val.length > 0 && _val.length <= 1){

		_listDiv.children('.ej-scroll-view-content').remove();
		_listDiv.removeClass('fn-hide');

		asyRequestTool.getCityOrViewSpotDataS(publicFunctionTool, _val, $('#url').attr('search'));

	}else if(_val.length <= 0){

		_listDiv.addClass('fn-hide');
		_listDiv.next().addClass('fn-hide');

	}else{

		publicFunctionTool.searchMatch(
			$('.history').next().find('.ej-scroll-view-content'),
			$(this).val(),
			'fn-hide',
			searchType,
			$('.history').next().find('.list')
			);

	}

});

// 清除搜索历史
$('.clearHistory-none').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	$('.outer').removeClass('fn-hide');

})

// 关闭是否清除所有搜索历史提示框
$('.outer').find('.cancel').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	$('.outer').addClass('fn-hide');

})

/**
 * [clearSearchHistory 清除搜索历史]
 * @return {null} []
 */
function clearSearchHistory(){

	isClearHistory = true;

	$('.history-list-container').find('.list-container').remove();

	var _$elems = {
		$outer: $('.outer'),
		$displayNone: $('.tabContainer').children('.display-none'),
		$clearHistoryNone: $('.clearHistory-none'),
		$noResultTip: $('.history-list-container').find('.no-result-tip')
	};

	var classNames = {
		fnHide: 'fn-hide',
		displayNone: 'display-none',
		clearHistory: 'clearHistory',
		noResultTipHide: 'no-result-tip-hide'
	};

	publicFunctionTool.closeSearchHistory(_$elems, classNames);

	slickPageNum = 1;
	$('.searchListContainer').children('.ej-swiper-content').slickGoTo(slickPageNum);

}

/**
 * [setSearchHistory 设置搜索历史]
 * @param  {dom} elem [dom节点]
 */
function setSearchHistory(elem){

	isClearHistory = false;

	publicFunctionTool.changeStyle(
		$('.tabContainer').children(),
		'text-selected',
		$($('.tabContainer').children()[0])
		);

	var _$elems = {
		// $outer: $('.outer'),
		$displayNone: $('.tabContainer').children('.display-none'),
		$clearHistoryNone: $('.clearHistory-none'),
		$noResultTip: $('.history-list-container').find('.no-result-tip')
	};

	var classNames = {
		// fnHide: 'fn-hide',
		displayNone: 'display-none text text-selected',
		clearHistory: 'clearHistory',
		noResultTipHide: 'no-result-tip-hide'
	};

	publicFunctionTool.openSearchHistory(_$elems, classNames);


	var _listContainer = $('.history-list-container').find('.list-container');
	var _isSame = false;

	var _len = _listContainer.length;
	if(_len == 10){

		$(_listContainer[_listContainer.length-1]).remove();

	}
	var _$elem = '';
	if(_len == 0){

		_$elem = $('.history-list-container').find('.clearHistory-none');

	}else{

		_$elem = $($('.history-list-container').find('.list-container')[0]);

	}
	
	publicFunctionTool.createSearchHistoryItem(
		{
			jid: $(elem).attr('jid'),
			name: $(elem).children('.name').text(),
			type: $(elem).children('.type').text()
		}, 
		_$elem
		);

	slickPageNum = 0;
	$('.searchListContainer').children('.ej-swiper-content').slickGoTo(slickPageNum);

}

/**
 * [fromSearchToTicketDetail 从搜索界面跳转到门票详情界面]
 * @param  {dom} elem [dom节点]
 * @param  {string} id  [dom节点的jid]
 * @return {null}     []
 */
function fromSearchToTicketDetail(elem){
	isFromSearch = true;

	var _cfg = {
		closeStyle1: {
			'webkitTransform':'translateY(' + $(window).height() + 'px)',
			'transform':'translateY(' + $(window).height() + 'px)'
		},
		closeStyle2: {
			'webkitTransform':'translateX(10000px)',
			'transform':'translateX(10000px)'
		}
	}

	var _$elems = [
			$($(hideDivP.children()[3]).children()[1]),
			$(hideDivP.children()[3])
			];

	interFaceAnimTool.closeAnim(_$elems, _cfg);

	if($(elem).find('.item-type-txt').text() == '城市'){

		chooseCityOrViewSpot(elem, undefined, $(elem).find('.item-name').text());

	}else{

		interFaceAnimTool.closeTicksAnim($($('.ej-router-layer')[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
		 	text: '景点门票',
		 	className1: 'ej-css-z',
			className: 'ej-css-23',
			num: 0 
		 });

		box(elem, $(elem).attr('jid'), 9);

	}

}

/**
 * [changeSearchBarState 改变搜索栏状态]
 * @param  {[type]} elem [domd对象]
 * @return {null}      []
 */
function changeSearchBarState(elem){

	publicFunctionTool.changeStyle(
		$('.tabContainer').children(),
		'text-selected',
		$(elem)
		);

	var _text = $(elem).text();
	var _index = 0;

	if(_text == '搜索历史'){

		_index = 0;

	}else if(_text == '热搜景点'){

		_index = 1;

	}else if(_text == '热搜主题'){

		_index = 2;

	}

	$('.searchListContainer').children('.ej-swiper-content').slickGoTo(_index);

}

/*选择城市或景点*/
function chooseCityOrViewSpot(elem, url, val){

	var _loading = '';
	if(hasTicketList){

		_loading = $('.ej-router-current').find('.loading');
		_loading.removeClass('fn-hide');

	}

	var _cfg = {
		closeStyle1: {
			'webkitTransform':'translateY(' + $(window).height() + 'px)',
			'transform':'translateY(' + $(window).height() + 'px)'
		},
		closeStyle2: {
			'webkitTransform':'translateX(10000px)',
			'transform':'translateX(10000px)'
		}
	}

	var _$elems = [
			$($(hideDivP.children()[3]).children()[1]),
			$(hideDivP.children()[3])
			];

	interFaceAnimTool.closeAnim(_$elems, _cfg);

	var _name = '';
	if(val != undefined){

		_name = val;

	}else{

		_name =  $(elem).children('.name').text();

	}

	var _viewSpot = '';
	if(_name.indexOf(',') != -1){

		_viewSpot = _name.split(',')[1] + '-' + _name.split(',')[0];

	}else{

		_viewSpot = _name;

	}

	var _cfg = {

  	type: 0,
  	
  	objs:[
  		$($('.ej-router-layer')[1]),
  		$('.ej-navbar>.ej-navbar-layer:last-child')
  	],

  	upScrollLoad: upScrollLoad

  }

  

  var _interface = $($('.ej-router-layer')[1]).children();

  if(_interface.length <= 1){

  	 openTicketList();
  	 _loading =  $('.ej-router-next').find('.loading');

  }else{

  	// 清空门票列表
  	$.each($(_interface[1]).find('.contain'), function(index, item){

  		$(item).remove();

  	});

  }

  var _url = '';
  var _obj = '';
  if(url == undefined){

  	_url = $('#url').attr('viewspot');
  	_obj = {'viewspot': _viewSpot};

  }else{

  	_url = url;
  	_obj = {'value': _viewSpot};

  }

	asyRequestTool.getTicketData(
  	_url, 
  	$('#url').attr('img-url'),
  	_obj,
  	ticksListTool.createTicksListItem,
  	_cfg,
  	_loading
  	);

	// 清空输入框
  	$('.ej-css-d>.search-bar>.input').val('');
	// 重置景点搜索界面
	$($('.ej-css-d')[1]).find('.container').find('.ej-scroll-view-content').remove();
	$($('.ej-css-d')[1]).find('.list').addClass('fn-hide');
	$($('.ej-css-d')[1]).find('.list').next().addClass('fn-hide');

	var _isSame = false;
	$.each($('.history-list-container').find('.list-container'),function(fIndex, fItem){

		if($(elem).children('.name').text() == $(fItem).find('.item-name').text()){

			_isSame = true;

		}

	});

	if(!_isSame){

		setSearchHistory(elem);

	}
	
}

//城市搜索框焦点获取事件
$(hideDivP.children()[0]).find('input').focus(function(){

	var _cfg = {
		fnHide: 'fn-hide',
		show: 'show',
		bgShow: 'bg-show'
	};

	var _$elems = [
		$(this).next(),
		$(this).next().next(),
		$(hideDivP.children()[0]).find('.search-match'),
		$(hideDivP.children()[0]).find('.bg')
	];

	hCityTool.changeSearchStatus(_$elems, _cfg, 0);

})

//城市搜索框焦点失去事件
$('.search-match').find('.bg').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	var _cfg = {
		fnHide: 'fn-hide',
		show: 'show',
		bgShow: 'bg-show'
	};

	var _$elems = [
		$(hideDivP.children()[0]).find('input').next(),
		$(hideDivP.children()[0]).find('input').next().next(),
		$(hideDivP.children()[0]).find('.search-match'),
		$(hideDivP.children()[0]).find('.bg')
	];

	hCityTool.changeSearchStatus(_$elems, _cfg, 1);

	$('.cancel').prev().prev().val('');

})

/*关闭搜索城市界面*/
function closeSearchListD(searchMatchDiv, $elems){

	publicFunctionTool.closeSearchList({

		$elems:{
		 contentDiv: searchMatchDiv.find('.content'),
		 listDiv: searchMatchDiv.find('.list'),
		 noDataDiv: searchMatchDiv.find('.no-data'),
		 bgDiv: searchMatchDiv.children('.bg')
		},
		classes: {
			fnHide: 'fn-hide',
			bgShow: 'bg-show'
		}

	});

	searchMatchDiv.find('.ej-scroll-view-content').remove();
	$('.cancel').prev().prev().val('');

	var _cfg = {
		fnHide: 'fn-hide',
		show: 'show',
		bgShow: 'bg-show'
	};


	hCityTool.changeSearchStatus($elems, _cfg, 1);

}

//取消按钮
$(hideDivP.children()[0]).find('.cancel').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	var _$elems = [
		$('.cancel').prev(),
		$('.cancel'),
		$(hideDivP.children()[0]).find('.search-match'),
		$(hideDivP.children()[0]).find('.bg')
	];

	closeSearchListD($('.search-match'), _$elems);

})

// 输入框搜索城市
$(hideDivP.children()[0]).find('input').bind('input propertychange', function(){

	var _searchMatchDiv = $('.search-match');

	var _val = $(this).val();

	if(_val.length > 0 && _val.length <= 1){

		_searchMatchDiv.find('.ej-scroll-view-content').remove();

		asyRequestTool.getCityOrViewSpotDataS(hCityTool, _val);

	}else if(_val.length <= 0){

		_searchMatchDiv.find('.ej-scroll-view-content').remove();

		publicFunctionTool.closeSearchList({

			$elems:{
			 contentDiv: _searchMatchDiv.find('.content'),
			 listDiv: _searchMatchDiv.find('.list'),
			 noDataDiv: _searchMatchDiv.find('.no-data'),
			 bgDiv: _searchMatchDiv.children('.bg')
			},
			classes: {
				fnHide: 'fn-hide',
				bgShow: 'bg-show'
			}

		});

	}else{

		publicFunctionTool.searchMatch(
			$('.search-match').find('.ej-scroll-view-content'),
			$(this).val(),
			'fn-hide',
			searchType,
			$('.search-match').find('.list')
			);

		// console.log($(this).val());

	}

})

// 监听键盘按下事件
$(document).keydown(function (event) {

      //alert(event.keyCode);
      //判断当event.keyCode 为37时（即左方面键），执行函数to_left();
      //判断当event.keyCode 为39时（即右方面键），执行函数to_right();
      // alert(event.keyCode);
      if(event.keyCode == 8){

      	searchType = 1;

      }else if(event.keyCode>=65 || event.keyCode<=90){

      	searchType = 0;

      }

  });


// 当前位置按钮
$('.currentP').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	chooseCityD('', $(this).children('.being-positioned').text());

})

//字母搜索城市
$('.index-middle').bind('click', function(e){

 	e.stopPropagation();
 	e.preventDefault();

 	var oEvent = e;
        var x = Number(oEvent.clientX); //页面触点X坐标
        var y = Number(oEvent.clientY); //页面触点Y坐标

      // console.log(x + '  ' +y);

      hCityTool.indexLocation([x, y]);

 })

 $('.index-middle').bind('touchmove', function(e){

 	e.stopPropagation();
 	e.preventDefault();

 	var touch = e.originalEvent.targetTouches[0];
        var x = Number(touch.pageX); //页面触点X坐标
        var y = Number(touch.pageY); //页面触点Y坐标

      // console.log(x + '  ' +y);

      hCityTool.indexLocation([x, y]);

 })

//打开选择城市界面
$('.city-box').bind("click", function(e){

	e.stopPropagation();
	e.preventDefault();


	var _cfg = {
		openStyle1: {
			'webkitTransform':'translateY(0px)',
			'transform':'translateY(0px)'
		},
		openStyle2: {
			'webkitTransform':'translateX(0px)',
			'transform':'translateX(0px)'
		}
	}

	var _$elems = [
					$('.citytypetag ').parent().parent(), 
					$('.citytypetag ').parent().parent().parent()
					];

	interFaceAnimTool.openAnim(_$elems, _cfg);

})

//关闭选择城市界面
$('.close').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	var _cfg = {
		closeStyle1: {
			'webkitTransform':'translateY(' + $(window).height() + 'px)',
			'transform':'translateY(' + $(window).height() + 'px)'
		},
		closeStyle2: {
			'webkitTransform':'translateX(10000px)',
			'transform':'translateX(10000px)'
		}
	}

	var _$elems = [
					$('.citytypetag ').parent().parent(), 
					$('.citytypetag ').parent().parent().parent()
					];

	interFaceAnimTool.closeAnim(_$elems, _cfg);

})

//选择城市
 $('.city-panel>.ej-tag-scroll-view').find('.ej-tag-a').bind('click', function(e){

 	e.stopPropagation();
 	e.preventDefault();

 	chooseCityD(this);

 })

/*选择城市*/
function chooseCityD(elem, cityName){

	$('#url').attr('viewvalue', $('.city-name').text());

	publicFunctionTool.resetHotAndRec({
		$Hot: $('.weekHotsceneryHeader'),
		$Rec: $('.recommendscenery '),
		fnHide: 'fn-hide'
	});

	var _cityName = '';
	if(cityName != undefined){

		_cityName = cityName;

	}else{

		_cityName = $(elem).text().split(',')[0].replace('市', '');

	}

	hCityTool.chooseCity($('.city-name'), _cityName);

	var _cfg = {
		closeStyle1: {
			'webkitTransform':'translateY(' + $(window).height() + 'px)',
			'transform':'translateY(' + $(window).height() + 'px)'
		},
		closeStyle2: {
			'webkitTransform':'translateX(10000px)',
			'transform':'translateX(10000px)'
		}
	}

	var _$elems = [
					$('.citytypetag ').parent().parent(), 
					$('.citytypetag ').parent().parent().parent()
					];

	interFaceAnimTool.closeAnim(_$elems, _cfg, closeSearchListD);

	// 显示加载中的图片
	var _loading = $('.ej-router-current').find('.loading');
	_loading.removeClass('fn-hide');

	asyRequestTool.post(
 		$('#url').attr('viewhot'),
 		{dzB: $('.city-name').text()},
 		_loading
 		);

	asyRequestTool.getHSVievSpotOrThemeData(
		$("#url").attr("viewreshotj"),
		{'value':$('.city-name').text()},
		$('.scenic-list-container').children('.ej-scroll-view-content')
		);

	asyRequestTool.getHSVievSpotOrThemeData(
		$("#url").attr("viewreshotz"),
		{'value':$('.city-name').text()},
		$('.theme-list-container').children('.ej-scroll-view-content')
		);

}

var myScrollEvent=function(elem){

	if(elem.scrollTop() > 700){//显示回到顶部按钮
		$('.back-top').addClass('back-top-show');
	}else{//隐藏回到顶部按钮
		$('.back-top').removeClass('back-top-show');
	}

}

var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)  
var nScrollTop = 0;   //滚动到的当前位置  
var nDivHight = 0;  
//上拉加载
function upScrollLoad(){

	// 监听酒店事件列表滚动
	$('.dn').next().scroll(function () {

		// console.log('bottom!!');
		myScrollEvent($(this));
		//上拉加载
		nScrollHight = $(this)[0].scrollHeight;  
		nScrollTop = $(this)[0].scrollTop;
		if(nScrollTop + nDivHight >= nScrollHight){

			if(asyRequestTool.isLoading){

				isPull = true;

				asyRequestTool.isLoading = false;

				$('.load-more-tip').removeClass('fn-hide');

				 var _cfg = {

				  	type: 0,
				  	
				  	objs:[
				  		$($('.ej-router-layer')[1]),
				  		$('.ej-navbar>.ej-navbar-layer:last-child')
				  	],


				  }

				var _navajaxshua = $('#url').attr('navajaxshua');
				var _ticketid = $('#url').attr('ticketid');
				var _num = Number($('#url').attr('num')) + 10;
				var _imgurl = $('#url').attr('img-url');

				var sea = $('#url').attr('sea');
    			var viewvalue = $('#url').attr('viewvalue');
    			var state = $('#url').attr('state');
    			state = state==undefined?'':state;
				$('#url').attr('num',_num);

				 asyRequestTool.getTicketData(
				  	_navajaxshua, 
				  	_imgurl, 
				  	{'value':viewvalue,'sea':sea,'num': _num,'state':state}, 
				  	ticksListTool.createTicksListItem,
				  	_cfg
				 );

			}
		

		}  
						
	});

}

/*获取门票详情数据*/
function box(obj, id, type) {

  hasTicketList = type==undefined?true:false;	

  openTicketDetail(type);	

  var _cfg = {

  	type: 1,
  	
  	objs:[
  		$($('.ej-router-layer')[1]),
  		$('.ej-navbar>.ej-navbar-layer:last-child')
  	]


  }

  var _viewdetails =  $('#url').attr('viewdetails');
  var _imgurl = $('#url').attr('img-url');

  asyRequestTool.getTicketData(
  	_viewdetails, 
  	_imgurl, 
  	{'id':id}, 
  	ticksDetailTool.setTicketDetailData,
  	_cfg,
  	$('.ej-router-next').find('.loading')
  	);

}

/*获取酒店列表数据*/
function navbox(obj,id) {

	asyRequestTool.isLoading = true;

	content1 = 'viewnav';
	navid = id;

	openTicketList();

	//
	$("#url").attr('sea','viewnav');
  	$("#url").attr("viewvalue",id);

	$("#url").attr('ticketid',id);
	$('#url').attr('num',0);
	var _cfg = {

  	type: 0,
  	
  	objs:[
  		$($('.ej-router-layer')[1]),
  		$('.ej-navbar>.ej-navbar-layer:last-child')
  	],

  	upScrollLoad: upScrollLoad

  }

	var _navajax = $('#url').attr('navajax');
	var _imgurl = $('#url').attr('img-url');
	asyRequestTool.getTicketData(
  	_navajax, 
  	_imgurl, 
  	{'id':id,'dzB':$('.city-name ').text()}, 
  	ticksListTool.createTicksListItem,
  	_cfg,
  	$('.ej-router-next').find('.loading')
  	);
	
}

/*打开或关闭门票列表项*/
function openOrCloseTicketsList(elem){

	var _groupContainerDiv = $(elem).children('.groupContainer');
	var _ticketListDiv = $(elem).next();

	if(_ticketListDiv.attr('class').indexOf('ticketList-none') == -1){

		_ticketListDiv.addClass('ticketList-none');
		_groupContainerDiv.children('.arrowIcon').remove();
		_groupContainerDiv.append('<span class="arrowIcon ej-tag-img" alt="" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/detail/pic/arrow_down.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span>');

	}else{

		_ticketListDiv.removeClass('ticketList-none');
			_groupContainerDiv.children('.arrowIcon').remove();
		_groupContainerDiv.append('<span class="arrowIcon ej-tag-img" alt="" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/detail/pic/arrow_up.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span>');

	}

}

/*打开门票列表*/
function openTicketList(){

	hasTicketList = true;

	var _layerDiv = $('.ej-router-layer');

	ticksListTool.createInterface($(_layerDiv[1]), hCityTool, publicFunctionTool);
	setTimeout(function(){
		interFaceAnimTool.openTicksAnim($(_layerDiv[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
			text: '门票列表',
			className1: 'ej-css-z',
			className2: 'ej-css-23',
			num: pageNum 
		});

		bindFilterBarEvent();

		var $mask =  $('.loc').prev();
		//距离的列表项点击
		$('.filter-list-radio>li').bind('click', function(e){

			e.stopPropagation();
			e.preventDefault();

			btnStatesTool.filterListItemChoose(
				$(this), 
				$('.filter-list-radio'), 
				ticksListTool.loc
				);

			interFaceAnimTool.filterBox(
				$mask, 
				$('.loc'), 
				$('.filterbar>.arrow-up'), 
				['距离', '不限']
				);

			btnStatesTool.filterBarItemSet(
				[$(this).text(), '不限', '距离'], 
				$($('.filterbar>a')[0])
				);

		});

		//排序的列表项点击
		$('#hotel-sort>ul>li').bind('click', function(e){

			e.stopPropagation();
			e.preventDefault();

			btnStatesTool.filterListItemChoose(
				$(this), 
				$(this).parent(), 
				ticksListTool.sort
				);

			interFaceAnimTool.filterBox(
				$mask, 
				$('.sort'), 
				$('.filterbar>.arrow-up'), 
				['排序', '智能排序']
				);

			btnStatesTool.filterBarItemSet(
				[$(this).text(), '智能排序', '排序'], 
				$($('.filterbar>a')[2])
			);

		});

		//主题筛选的列表项点击
		$('#theme-filter>ul>li').bind('click', function(e){

			e.stopPropagation();
			e.preventDefault();

			btnStatesTool.filterListItemChoose(
				$(this), 
				$(this).parent(), 
				ticksListTool.filter
				);

			interFaceAnimTool.filterBox(
				$mask, 
				$('.filter'), 
				$('.filterbar>.arrow-up'), 
				['主题筛选', '不限']
				);

			btnStatesTool.filterBarItemSet(
				[$(this).text(), '不限', '主题筛选'], 
				$($('.filterbar>a')[4])
			);

		});

		//回到顶部
		$('.back-top').bind('click', function(e){

			e.preventDefault();
			e.stopPropagation();
			$('.dn').next().scrollTop(0);
			
		});

		
	}, 50);

}

/*为类名为 filterbar 的元素的子类，绑定事件*/
function bindFilterBarEvent(){
	
	$('.filterbar>a:nth-child(odd)').bind('click', function(e){

		e.stopPropagation();
		e.preventDefault();

		var $mask =  $('.loc').prev();
		var _pos = $(this).attr('pos');

		if($(this).attr('class').indexOf('arrow-up') == -1){

			interFaceAnimTool.resetFilterBox(
			$('.arrow-up'), 
			$mask,
			[$('.loc'), $('.sort'),  $('.filter')]
			);

		}

		switch(_pos) {

			case '0':
				interFaceAnimTool.filterBox($mask, $('.loc'), $(this), ['距离', '不限']);
			break;

			case '2':
				interFaceAnimTool.filterBox($mask, $('.sort'), $(this), ['排序', '智能排序']);
			break;

			case '4':
				interFaceAnimTool.filterBox(
					$mask, 
					$('.filter'), 
					$(this),
					['主题筛选', '不限'], 
					'height: 354px;'
					);
			break;

		}

	})

}

/**
 * [conditionSort 按条件排序]
 * @param  {int} state [条件]
 * @return {[type]}           [description]
 */
function conditionSort(state){

	if($('.dn').attr('class').indexOf('filterNoDataShow') == -1){

		$('.ej-router-current').find('.loading').removeClass('fn-hide');
		$($('.ej-router-layer')[3]).find('.contain').remove();

		var _state = '';

		switch(state){

			case 0:
				_state = 'salesdesc';
			break;

			case 1:
				_state = 'priceasc';
			break;

			case 2:
				_state = 'pricedesc';
			break;

			case 3:
				_state = 'scoredesc';
			break;

			case 4:
				_state = 'salesdesc';
			break;

		}


		$("#url").attr('sea', content1);
		$("#url").attr('state', _state);
	    $('#url').attr('num',0);

		var _cfg = {

	  	type: 0,
	  	
	  	objs:[
	  		$($('.ej-router-layer')[1]),
	  		$('.ej-navbar>.ej-navbar-layer:last-child')
	  	],

	  	upScrollLoad: upScrollLoad

	  }

		var _imgurl = $('#url').attr('img-url');
		asyRequestTool.getTicketData(
	  	$('#url').attr('viewsortajax'), 
	  	_imgurl, 
	  	{"dzB":$('.city-name').text(),'content':content1,'navid':navid,'state':_state}, 
	  	ticksListTool.createTicksListItem,
	  	_cfg,
	  	$('.ej-router-current').find('.loading')
	  	);

	}

}

/*关闭界面*/
$('.ej-tag-back').bind('click', function(e){

	isFromSearch = false;

	if(pageNum != 0)
		pageNum--;

	e.stopPropagation();
	e.preventDefault();

 	var _layerDiv = $('.ej-router-layer');
	var _title = $('.navbar-title').text();
 
	if (_title.indexOf('门票列表') == 0 ) {

		 interFaceAnimTool.closeTicksAnim($(_layerDiv[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
		 	text: '景点门票',
		 	className1: 'ej-css-z',
			className: 'ej-css-23',
			num: 0 
		 });

		 hasTicketList = false;

	}else if(_title == '景点门票' ){

		window.history.back();

	}else if (_title.indexOf('门票详情') == 0) {

		var _text = '';
		
		if(hasTicketList){

			_text = '门票列表';

		}else{

			_text = '景点门票';

		}

		 interFaceAnimTool.closeTicksAnim($(_layerDiv[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
		 	text: _text,
		 	className1: 'ej-css-z',
			className2: 'ej-css-1g',
			num: pageNum 
		 });

		 $('.photos').children().remove();

	}else{

		if(_title.indexOf('景点门票') == -1 && _title.indexOf('常用旅客编辑') == -1){

			if(!isHide){

				interFaceAnimTool.closeTicksAnim($(_layerDiv[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
					text: '门票详情',
					className1: 'ej-css-1g',
					className2: 'ej-css-1a',
					num: pageNum 
				});

			}else{

				interFaceAnimTool.closeTicksAnim($(_layerDiv[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
					text: '门票详情',
					className: 'ej-navbar-hide',
					className1: 'ej-css-1g',
					className2: 'ej-css-1a',
					hide: true,
					num: pageNum 
				});

			}

		
		}else if(_title.indexOf('景点门票') == -1 && _title.indexOf('常用旅客编辑') == 0){

			interFaceAnimTool.closeTicksAnim($(_layerDiv[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
				text: '填写订单',
				className1: 'ej-css-1g',
				className2: 'ej-css-1a',
				num: pageNum 
			});

		}
		
	}

})

/*打开门票详情界面*/
function openTicketDetail(type){

	var _layerDiv = $('.ej-router-layer');

	ticksDetailTool.createInterface($(_layerDiv[1]));

	setTimeout(function(){
		interFaceAnimTool.openTicksAnim($(_layerDiv[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
			text: '门票详情',
			className1: 'ej-css-z',
			className2: 'ej-css-1g',
			num: pageNum
		});

		pageNum = type==9?0:pageNum;

	}, 50);
	
}

//关闭门票预定详情界面
$(hideDivP.children()[hideDivP.children().length-1]).find('.close').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	var _cfg = {
		closeStyle1: {
			'webkitTransform':'translateY(' + $(window).height() + 'px)',
			'transform':'translateY(' + $(window).height() + 'px)'
		},
		closeStyle2: {
			'webkitTransform':'translateX(10000px)',
			'transform':'translateX(10000px)'
		}
	}

	var _$elems = [
					$(this).parent().parent().parent().parent(), 
					$(this).parent().parent().parent().parent().parent()
					];

	interFaceAnimTool.closeAnim(_$elems, _cfg);

})

//打开隐藏日期界面
$(hideDivP.children()[2]).find('.ej-tag-a').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	if(dateInterfaceTool.playDay != 0 && $(this).attr('class').indexOf('start') == -1){

		var _startA = $(this).parent().find('.start');

		_startA.children('.day').text(dateInterfaceTool.playDay);

		btnStatesTool.resetBtn({
			$elem: _startA,
			addClass: 'enable',
			removeClass: 'start'
		});

	}

	if($(this).attr('class').indexOf('disable') == -1){

		dateInterfaceTool.chooseDate($(this));

	}


	if($(this).attr('class').indexOf('start') != -1){

			//设置日期
		var _date = $(this).attr('date');
		$('.choose_date_value').text(
			_date + 
			'  ' +
			dateInterfaceTool.getWeekFromDate(_date.replace(/-/g, "/"))
			 );

		var _cfg = {
			closeStyle1: {
				'webkitTransform':'translateY(' + $(window).height() + 'px)',
				'transform':'translateY(' + $(window).height() + 'px)'
			},
			closeStyle2: {
				'webkitTransform':'translateX(10000px)',
				'transform':'translateX(10000px)'
			}
		}

		var _$elems = [
				$($(hideDivP.children()[2]).children()[1]),
				$(hideDivP.children()[2])
				];

		interFaceAnimTool.closeAnim(_$elems, _cfg);

	}

})

/*打开门票预定详情界面*/
function openReserveDetail(jsonObj){

	var _pannelDiv = $(hideDivP.children()[hideDivP.children().length-1]).find('.ticket_info_pannel');
	_pannelDiv.children('.pannel_title').children('p').text(jsonObj.ticketname);
	
	var _viewContentDiv = _pannelDiv.find('.ej-scroll-view-content');
	$(_viewContentDiv.children()[0]).find('.rulescontent').text(jsonObj.include);
	$(_viewContentDiv.children()[1]).find('.rulescontent').text(jsonObj.use);
	$(_viewContentDiv.children()[2]).find('.rulescontent').text('最晚需提前1天'+ jsonObj.booking +'前订票，请提前预订以免耽误行程。');
	$(_viewContentDiv.children()[3]).find('.rulescontent').text(jsonObj.import);
	$(_viewContentDiv.children()[4]).find('.rulescontent').text(jsonObj.change);

	_pannelDiv.children('.ticket_bottom').find('.price').text(jsonObj.saleprice);
	_pannelDiv.children('.ticket_bottom').find('.booking').attr('ticketid', jsonObj.id);

	var _cfg = {
		openStyle1: {
			'webkitTransform':'translateY(0px)',
			'transform':'translateY(0px)'
		},
		openStyle2: {
			'webkitTransform':'translateX(0px)',
			'transform':'translateX(0px)'
		}
	}

	var _$elems = [
					$(hideDivP.children()[hideDivP.children().length-1]), 
					$($(hideDivP.children()[hideDivP.children().length-1]).children()[1])
					];

	interFaceAnimTool.openAnim(_$elems, _cfg);

}

//预定详细信息界面的立即预定按钮
$(hideDivP.children()[hideDivP.children().length-1]).find('.booking').bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	var that = this;

	$.each($('.ticketRight'), function(index, item){

		if($(that).attr('ticketid') == $(item).attr('ticketid')){

			var _cfg = {
				closeStyle1: {
					'webkitTransform':'translateY(' + $(window).height() + 'px)',
					'transform':'translateY(' + $(window).height() + 'px)'
				},
				closeStyle2: {
					'webkitTransform':'translateX(10000px)',
					'transform':'translateX(10000px)'
				}
			}

			var _$elems = [
							$(that).parent().parent().parent().parent(), 
							$(that).parent().parent().parent().parent().parent()
							];

			interFaceAnimTool.closeAnim(_$elems, _cfg);

			setTimeout(function(){

				$(item).trigger('click');

			}, 300);

		}

	});

})


/*打开选择游玩日期界面*/
function openPlayData(ticketObj){

	$('.dateChooseView').children('.titleView ').text(ticketObj.ticketName);
	$('.dateChooseView').find('.money').text(ticketObj.ticketPrice);

	var _cfg = {
		maskshow: 'maskshow',
		fnhide: 'fn-hide'
	}

	var _$elems = [
					$('.dateChooseView').parent().prev(), 
					$('.dateChooseView').parent()
					];

	interFaceAnimTool.openAnim(_$elems, _cfg);

}

/*关闭选择游玩日期界面*/
function closePlayData(){

	var _cfg = {
		maskshow: 'maskshow',
		fnhide: 'fn-hide'
	}

	var _$elems = [
					$('.dateChooseView').parent().prev(), 
					$('.dateChooseView').parent()
					];

	interFaceAnimTool.closeAnim(_$elems, _cfg);

}

/*更多热门景点*/
function moreHot(){

	content1 = 'other';
	navid = '';

	openTicketList();

	$("#url").attr('sea','hot');
    var _viewhot = $('#url').attr('viewhot');
    $('#url').attr('num',0);

	var _cfg = {

  	type: 0,
  	
  	objs:[
  		$($('.ej-router-layer')[1]),
  		$('.ej-navbar>.ej-navbar-layer:last-child')
  	],

  	upScrollLoad: upScrollLoad

  }
	var _imgurl = $('#url').attr('img-url');
	asyRequestTool.getTicketData(
  	_viewhot, 
  	_imgurl, 
  	{dzB: $('.city-name').text()}, 
  	ticksListTool.createTicksListItem,
  	_cfg,
  	$('.ej-router-next').find('.loading')
  	);

}

// 打开热门景点列表
$('.weekHotsceneryHeader').next().next().bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	moreHot();

})

// 打开当地必玩景点列表
$('.recommendscenery').next().next().bind('click', function(e){

	e.stopPropagation();
	e.preventDefault();

	content1 = 'other';
	navid = '';

	openTicketList();

	$("#url").attr('sea','dz');
    var _viewregion = $('#url').attr('viewregion');
    var _value = $('.city-name').text();
    var _viewvalue = $('#url').attr('viewvalue',_value);
    $('#url').attr('num',0);

	var _cfg = {

  	type: 0,
  	
  	objs:[
  		$($('.ej-router-layer')[1]),
  		$('.ej-navbar>.ej-navbar-layer:last-child')
  	],

  	upScrollLoad: upScrollLoad

  }
	var _imgurl = $('#url').attr('img-url');
	asyRequestTool.getTicketData(
  	_viewregion, 
  	_imgurl, 
  	{"region":_value}, 
  	ticksListTool.createTicksListItem,
  	_cfg,
  	$('.ej-router-next').find('.loading')
  	);

})


	






	


