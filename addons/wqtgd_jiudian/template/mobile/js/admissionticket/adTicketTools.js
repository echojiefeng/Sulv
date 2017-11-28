/******************    公用方法对象   ********************/
function PublicFuction(){
	this.name = 'PublicFuction';
	this.imgUrl = $('#url').attr('img-url') + '/';
	this.regChinese = /^[\u2E80-\u9FFF]+$/;
	this.regTel = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
}

/**
 * [createHSVievSpotOrThemeItem 创建热搜景点或主题项]
 * @param  {Array} data  [数据对象数组]
 * @param  {jqueryObject} $elem [设置数据的标签]
 * @return {null}       []
 */
PublicFuction.prototype.createHSVievSpotOrThemeItem = function(data, $elem){


	$.each(data, function(index, item){

		var _listContainerDiv = $('<div class="list-container" jid='+ item.id +' onclick="fromSearchToTicketDetail(this)"><div class="itemContainer"><span class="item-name">'+ item.viewname +'</span><span class="item-type-txt">'+ item.theme +'</span></div><i class="splitline"></i></div>');
		$elem.append(_listContainerDiv);

	});

}

/**
 * [createSearchHistoryItem 创建搜索历史项]
 * @param  {Object} cfg [原数据对象]
 * @param  {jqueryObject} $elem   [jquery对象]
 * @param  {int} len   [用于判断]
 * @return {null}           []
 */
PublicFuction.prototype.createSearchHistoryItem = function(cfg, $elem, len){

	var _listContainerDiv = $('<div class="list-container" jid='+ cfg.jid +' onclick="fromSearchToTicketDetail(this)"><div class="itemContainer "><span class="item-name ">'+ cfg.name +'</span><span class="item-type-txt">'+ cfg.type +'</span></div><i class="splitline "></i></div>');
	$elem.before(_listContainerDiv);
	
}

/**
 * [openSearchHistory 打开搜索历史列表]
 * @param  {Object} $elems [封装jquery对象的对象]
 * @param  {Object} classNames    [类名对象]
 * @return {null}        []
 */
PublicFuction.prototype.openSearchHistory = function($elems, classNames){

	// $elems.$outer.removeClass(classNames.fnHide);
	$elems.$displayNone.attr('class', classNames.displayNone);
	$elems.$clearHistoryNone.addClass(classNames.clearHistory);
	$elems.$noResultTip.addClass(classNames.noResultTipHide);

}

/**
 * [closeSearchHistory 关闭搜索历史列表]
 * @param  {Object} $elems [封装jquery对象的对象]
 * @param  {Object} classNames    [类名对象]
 * @return {null}        []
 */
PublicFuction.prototype.closeSearchHistory = function($elems, classNames){

	$elems.$outer.addClass(classNames.fnHide);
	$elems.$displayNone.attr('class', classNames.displayNone);
	$elems.$clearHistoryNone.removeClass(classNames.clearHistory);
	$elems.$noResultTip.removeClass(classNames.noResultTipHide);

}

/**
 * [changeStyle 改变样式]
 * @param  {Array} elems       [dom对象数组]
 * @param  {string} className [类名]
 *  @param  {jquery} $elem [jquery对象]
 * @return {null}           [description]
 */
PublicFuction.prototype.changeStyle = function(elems, className, $elem){

	$.each(elems, function(index, item){

		$(item).removeClass(className);

	});

	$elem.addClass(className);

}

/*搜索匹配*/
PublicFuction.prototype.searchMatch = function($elem, value, className, type, listDiv){

	var _index = value.length - 1;
	var input_content = value.substring(_index).toLowerCase();
	var _reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
	//console.log(makePy(item)[0].toLowerCase().substring(cfg.index, cfg.index + 1));

	if(_reg.test(input_content)){

		$.each($elem.children('.ej-tag-a'), function(index, item){

			var _cFN = $(item).children().text().replace(',', '');
			var _cityFirstName = _cFN.substr(_index,_index).substr(0,1);
			if(_cityFirstName != input_content && type == 0){

				$(item).addClass(className);

			}else if(_cityFirstName == input_content && type == 0){

				$(item).removeClass(className);

			}else if(_cityFirstName == input_content && type == 1){

				if(_cFN.substr(0, _index+1) == value)
					$(item).removeClass(className);

			}

		});

	}else{

		$.each($elem.children('.ej-tag-a'), function(index, item){

			var _cFN = $(item).children().text().replace(',', '');
			console.log(_cFN);
			//console.log(makePy(_cityFirstName)[0].toLowerCase().substr(_index,_index).substr(0,1));
			_cityFirstName = makePy(_cFN)[0].toLowerCase().substr(_index,_index).substr(0,1)
			if(_cityFirstName != input_content && type == 0){

				$(item).addClass(className);

			}else if(_cityFirstName == input_content && type == 1){

				if(makePy(_cFN)[0].toLowerCase().substr(0, _index+1) == value)
					$(item).removeClass(className);

			}

		});

	}

	if($elem.children('.ej-tag-a').length == $elem.find('.fn-hide').length){

		listDiv.addClass(className);
		listDiv.next().removeClass(className);

	}else{

		listDiv.removeClass(className);
		listDiv.next().addClass(className);

	}

}

/*显示搜索城市与景点*/
PublicFuction.prototype.showSearchCityAndViewSpot = function(arr, val){

	var _listDiv = $('.ej-css-d').find('.list');
	var _contentDiv = $('<div class="ej-scroll-view-content">');

	_listDiv.removeClass('fn-hide');
	_listDiv.next().addClass('fn-hide');

	var _type = '';

	$.each(arr, function(index, item){

		var _cityOrViewSpot = '';

		if(item[1].indexOf('-') != -1){

			_cityOrViewSpot = item[1].split('-')[1] + ',' + item[1].split('-')[0];

		}else{

			_cityOrViewSpot = item[1];

		}

		if(item[0] == 'dz'){

			_type = '城市';

		}else{

			_type = item[4];

		}

		var _a = $('<a class="item ej-tag-a" jid='+ item[0] +' onclick="chooseCityOrViewSpot(this)"><span class="name ">'+ _cityOrViewSpot +'</span><span class="type ">'+ _type +'</span></a>');
		_contentDiv.append(_a);

	});


	_listDiv.append(_contentDiv);

	$.each(_listDiv.children(), function(index, item){

		if(index != 0){

			$(item).remove();

		}
		
	});

	if(_listDiv.children().children().length == 0){

		//没有数据
		_listDiv.addClass('fn-hide');
		_listDiv.next().removeClass('fn-hide');

	}

}

/*创建本周最热与当地必玩列表项*/
PublicFuction.prototype.createHotAndRecItems = function(data){

	var that = this;

	var _$HotListDiv = $('.weekHotsceneryHeader').next().find('.ej-scroll-view-content');
	var _$RecListDiv = $('.recommendscenery').next().find('.ej-scroll-view-content');

	$.each(data, function(index, item){

		var _hotItemDiv = that.createHotItem(item, (index+1));
		_$HotListDiv.append(_hotItemDiv);

		var _recItemDiv= that.createRecItem(item);
		_$RecListDiv.append(_recItemDiv);

	});

	_$HotListDiv.append('<div class="seeMoreHotScenery " onclick="moreHot()"><span class="seeMoreHotSceneryTxt ">查看更多</span><i class="icon "></i></div>');

	$('.weekHotsceneryHeader').parent().removeClass('fn-hide');
	$('.recommendscenery').parent().removeClass('fn-hide');

}

/*创建本周最热列表项*/
PublicFuction.prototype.createHotItem = function(obj, num){

	var _hotItemDiv = $('<div onclick="box(this, '+ obj.id +', 0)" class="weekHotScenery">');

	var _picDiv = $('<div class="pic "><span class="image ej-tag-img" style="background-image: url(&quot;'+ this.imgUrl + obj.viewphoto +'&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span><div class="hot_tag_container"><span class="top_txt ">TOP</span><span class="sortNum ">'+ num +'</span></div></div>')
	_hotItemDiv.append(_picDiv);

	var _weekHotInfoDiv = $('<div class="weekHotInfo"><span class="title ">'+ obj.viewname +'</span></div>');
	_hotItemDiv.append(_weekHotInfoDiv);

	var _priceContainerDiv = '';
	if(parseInt(obj.viewprice) == 0){

		_priceContainerDiv = $('<div class="price-container "><div class="curent-price "><i class="money "></i><span class="price ">暂无门票</span><span class="qi "></span></div><div class="origin-price origin-price-none"><del class="">￥</del></div></div>');

	}else{

		_priceContainerDiv = $('<div class="price-container "><div class="curent-price "><i class="money ">￥</i><span class="price ">'+ obj.viewprice +'</span><span class="qi ">起</span></div><div class="origin-price origin-price-none"><del class="">￥</del></div></div>');

	}
	_weekHotInfoDiv.append(_priceContainerDiv);


	return _hotItemDiv;

}

/*创建当地必玩列表项*/
PublicFuction.prototype.createRecItem = function(obj){

	var _recItemDiv = $('<div class="container" onclick="box(this, '+ obj.id +', 0)">');

	var _sceneryDiv = $('<div class="scenery">');
	_recItemDiv.append(_sceneryDiv);

	var _picDiv = $('<div class="pic "><span class="image ej-tag-img" style="background-image: url(&quot;'+ this.imgUrl + obj.viewphoto +'&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div>');
	_sceneryDiv.append(_picDiv);

	var _infoDiv = $('<div class="info"><span class="title ">'+ obj.viewname +'</span><span class="info-detail ">景点简介</span></div>');
	_sceneryDiv.append(_infoDiv);

	var _cityScoreDiv = '';

	if(parseInt(obj.score) != 0 && obj.score != undefined){

		_cityScoreDiv = $('<div class="city-score "> <span class="city ">'+ obj.dzB +'</span><span class="score"><!-- react-text: 292 -->'+ obj.score +'分<!-- /react-text --></span><span class="jibie fn-hide"><!-- react-text: 295 -->0<!-- /react-text --><!-- react-text: 296 -->'+ obj.viewlevel +'<!-- /react-text --></span></div>'); 

	}else{

		_cityScoreDiv = $('<div class="city-score "> <span class="city ">'+ obj.dzB +'</span><span class="score"><!-- react-text: 292 -->暂无评分<!-- /react-text --></span><span class="jibie fn-hide"><!-- react-text: 295 -->0<!-- /react-text --><!-- react-text: 296 -->'+ obj.viewlevel +'<!-- /react-text --></span></div>'); 

	}
	_infoDiv.append(_cityScoreDiv);
	
	var _distanceOriginDiv = $('<div class="distance-origin "><!--  <span class="juli ">距市中心32.5km</span> --><span class="originPrice originPrice-none"><del class="">￥</del></span></div>');
	_infoDiv.append(_distanceOriginDiv);

	var _biaoPriceDiv = '';
	if(parseInt(obj.viewprice) != 0){

		_biaoPriceDiv = $('<div class="biao-price "><span class="biao">'+ obj.viewnavname +'</span><span class="biao2 fn-hide">可订今日</span><div class="price "><i class="money ">￥</i><span class="realprice ">'+ obj.viewprice +'</span><span class="qi ">起</span></div></div>');

	}else{

		_biaoPriceDiv = $('<div class="biao-price "><span class="biao">'+ obj.viewnavname +'</span><span class="biao2 fn-hide">可订今日</span><div class="price "><i class="money "></i><span class="realprice ">暂无门票</span><span class="qi "></span></div></div>');

	}
	if(obj.viewnavname == ''){

		_biaoPriceDiv.find('.biao').addClass('fn-hide');

	}else{

		_biaoPriceDiv.find('.biao').removeClass('fn-hide');

	}
	_infoDiv.append(_biaoPriceDiv);

	return _recItemDiv;

}

/*重置本周最热与当地必玩列表*/
PublicFuction.prototype.resetHotAndRec = function(cfg){

	var _$Hot = cfg.$Hot;
	var _$Rec = cfg.$Rec;

	$.each(_$Hot.next().find('.weekHotScenery'), function(index, item){

		$(item).remove();

	});
	_$Hot.next().find('.seeMoreHotScenery').remove();

	_$Hot.parent().addClass(cfg.fnHide);

	$.each(_$Rec.next().find('.container'), function(index, item){

		$(item).remove();

	});

	_$Rec.parent().addClass(cfg.fnHide);

}

/*打开搜索列表*/
PublicFuction.prototype.openSearchList = function(cfg){

	var _$elems = cfg.$elems;
	var _classes = cfg.classes;

	_$elems.bgDiv.removeClass(_classes.bgShow);
	_$elems.contentDiv.removeClass(_classes.fnHide);
	// setTimeout(function(){

		_$elems.listDiv.removeClass(_classes.fnHide);

	    _$elems.noDataDiv.addClass(_classes.fnHide);

	// }, 250);
	
}

/*关闭搜索列表*/
PublicFuction.prototype.closeSearchList = function(cfg){

	var _$elems = cfg.$elems;
	var _classes = cfg.classes;

	_$elems.bgDiv.addClass(_classes.bgShow);
	_$elems.contentDiv.addClass(_classes.fnHide);
	_$elems.listDiv.addClass(_classes.fnHide);

	_$elems.noDataDiv.removeClass(_classes.fnHide);

}

/*验证输入*/
PublicFuction.prototype.Verification = function($elem, cfg){

	var _reg = '';
	var _length = 0;
	var _placeholder = '';

	if(cfg.type == 0){

		_reg = this.regChinese;
		_length = 2;
		_placeholder = cfg.placeholder;

	}else if(cfg.type == 1){

		_reg = this.regTel;
		_length = 11;

		if(cfg.text == ''){

			_placeholder = cfg.placeholder;

		}else{

			_placeholder = cfg.placeholder2;

		}

	}

	if(cfg.text.length < _length || !_reg.test(cfg.text)){

		$elem.val('');
		$elem.addClass(cfg.className);
		$elem.attr('placeholder' ,_placeholder);

	}

}

/*时间格式化*/
PublicFuction.prototype.dateFormat = function(date, fmt){

	 var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

}

/*获取日期：前天、昨天、今天、明天、后天*/
PublicFuction.prototype.GetDateStr = function(AddDayCount){

	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
	var d = dd.getDate(); 

	return y+"-"+m+"-"+d; 

} 

/******************    公用方法对象   ********************/



/******************     定位对象    ********************/
function GetLocationC(){
	this.name = 'GetLocationC';
	this.city = '';
	this.isLocation = false;
	this.lng = 0;
	this.lat = 0;
	this.e = {};
	this.b = '';  // 城市
	this.c = '';  // 区
}

/*定位方法*/
GetLocationC.prototype.getLocation = function($elems, chooseCityD, e){
	var that = this;

	// alert('定位');
	var geolocation = new BMap.Geolocation();

		if(navigator.onLine){

			 geolocation.getCurrentPosition(function (r) {
	            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
	      			
	                // console.log(r.point.lng + " ， " + r.point.lat);

	              	that.lng = r.point.lng;
	                that.lat = r.point.lat;

	                that.getAddr(r.point.lng, r.point.lat, $elems, chooseCityD, e);
	                
	            }

	        });

		}else{

			 alert('请检查网络是否可用！');
		}

}

/*获取地址方法*/
GetLocationC.prototype.getAddr = function(lon, lat, $elems, chooseCityD, e){
	  var that = this;
	  var map = new BMap.Map("allmap");
      var point = new BMap.Point(lon, lat);
      var gc = new BMap.Geocoder();
      gc.getLocation(point, function(rs){
	      var addComp = rs.addressComponents;
	       // console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
	       var _city = addComp.city.replace('市', '');
	     
	       // console.log(lon + "  " + lat);
	       $elems.$cityName.text(_city);
	       $elems.$beingPositioned.text(_city);

	       chooseCityD('', _city);
	     	

	       if(e!=null)
	       	e.hideLoading(addComp.city);

     });
}

/******************     定位对象    ********************/


/******************     日期界面对象    ********************/
function DateInterface(){
	this.name = 'DateInterface';
	this.playDay = 0;
	this.this_date = new Date();
	this.this_day = this.this_date.getDate();
	this.is_next_month = false;
}

/*设置隐藏日期界面选择的日期样式*/
DateInterface.prototype.setHideDateInterfaceChooseItemStyle = function(cfg){



}

/*设置隐藏日期界面样式*/
DateInterface.prototype.setHideDateInterfaceStyle = function(cfg){

	$.each(cfg.elems, function(index, item){

		if($(item).attr('class').indexOf('enable') != -1){

			$(item).removeClass('enable').addClass('disable');
			$(item).find('.info').text('不可订');

		}

	});

	$.each(cfg.elems, function(index, item){

		if(cfg.bookings != undefined){

			if($(item).attr('class').indexOf('disable') != -1){

				$.each(cfg.bookings, function(bIndex, bItem){

					if(bItem == $(item).attr('date')){

						$(item).removeClass('disable').addClass('enable');
						$(item).find('.info').text(cfg.price);

					}

				});

			}

		}else{

			if($(item).attr('class').indexOf('enable') != -1){

				$(item).removeClass('enable').addClass('disable');
				$(item).find('.info').text('不可订');

			}else if($(item).attr('class').indexOf('start') != -1){

				$(item).removeClass('start').addClass('disable');
				$(item).find('.info').text('不可订');

			}

		}

		if($(item).children('.day').text() == '今天'){

			$(item).removeClass('enable').addClass('disable');
			$(item).find('.info').text('不可订');

		}


	});

}

/*从日期获取周*/
DateInterface.prototype.getWeekFromDate = function(date){
	var arr_week = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
	return arr_week[new Date(date).getDay()];
}

/*创建 calenderItemDiv*/
DateInterface.prototype.createCalenderItemDiv = function(arg, is_this_month, cfg){

	var _calenderItemDiv = $('<div class="calender-item ej-css-s">');

	var _year = this.this_date.getFullYear();
	var _mon = this.this_date.getMonth();
	var _month = this.this_date.getMonth() + arg;
	arg = 1;
	if(_month == 13){
		_year += 1;
		_month = arg;
	}else if(_month == 14){
		_year += 1;
		_month = arg + 1;
	}else if(_month == 15){
		_year += 1;
		_month = arg + 2;
	}else if(_month == 16){
		_year += 1;
		_month = arg + 3;
	}else if(_month == 17){
		_year += 1;
		_month = arg + 4;
	}

	var this_date = new Date(_year + "/" + _month + "/1");
	var this_year = this_date.getFullYear();
	var this_month = this_date.getMonth() + 1;
	var this_week = this_date.getDay();
	var day = "";
	switch(this_month){
		case 4:
		case 6:
		case 9:
		case 11: day = 30; break;
		case 2:
		if (this_year%4==0 && this_year%100!=0 || this_year%400==0) {
			day = 29;
		}else{
			day = 28;
		}
		break;
		default: day = 31; break;
	}

	var _h1 = $("<h2 class = ''></h2>").text(this_year + "年" + this_month + "月");
	_calenderItemDiv.append(_h1);

	var _calenderItemContentDiv = $('<div class="calender-item-content">');
	_calenderItemDiv.append(_calenderItemContentDiv);

	for (var i = 0; i < this_week; i++) {
		
		var _a = $('<a class="ej-tag-a ej-css-v" style="width: 14.286%;"><span class="day "></span><!-- react-text: 42 --><!-- /react-text --><!-- react-text: 43 --><!-- /react-text --></a>');
		_calenderItemContentDiv.append(_a);

	}

	//能订景点门票的日期
	var _bookings = '';

	if(cfg.booking != undefined){

		_bookings = cfg.booking.split(',');

	}

	for(var i = 1; i <= day; i++){

		var _a;
		var data_day = this_year + "-" + this_month + "-" + i;

		if(i < this.this_day && is_this_month){

			_a = $('<a class="ej-tag-a disable ej-css-v" style="width: 14.286%;"><span class="day ">'+ i +'</span><span class="info "></span><!-- react-text: 909 --><!-- /react-text --></a>');

		}else if(i == this.this_day && is_this_month){
			
			_a = $('<a class="ej-tag-a disable ej-css-v" style="width: 14.286%;" date='+ data_day +'><span class="day ">今天</span><span class="info ">不可订</span><!-- react-text: 144 --><!-- /react-text --></a>');

		}else{

			if(_bookings != ''){

			  for(var j = 0; j < _bookings.length; j++){

				  if(_bookings[j] == data_day){

					_a = $('<a class="ej-tag-a enable ej-css-v" style="width: 14.286%;" date='+ data_day +'><span class="day ">'+ i +'</span><span class="info ">￥'+ cfg.price +'</span><!-- react-text: 144 --><!-- /react-text --></a>');

					break;

					}else{

					_a = $('<a class="ej-tag-a disable ej-css-v" style="width: 14.286%;" date='+ data_day +'><span class="day ">'+ i +'</span><span class="info ">不可订</span><!-- react-text: 144 --><!-- /react-text --></a>');

					}

				}

			}else{

				_a = $('<a class="ej-tag-a disable ej-css-v" style="width: 14.286%;" date='+ data_day +'><span class="day ">'+ i +'</span><span class="info ">不可订</span><!-- react-text: 144 --><!-- /react-text --></a>');

			}

		}

		if(_a.attr('class').indexOf('enable') != -1){

			_a.bind('click', function(e){

				e.stopPropagation();
				e.preventDefault();

				console.log(333);

			});

		}

		_calenderItemContentDiv.append(_a);

	}

	return _calenderItemDiv;

}

/*选择日期*/
DateInterface.prototype.chooseDate = function($elem){

	var _daySpan = $elem.children('.day');

	if($elem.attr('class').indexOf('enable') != -1){

		this.playDay = _daySpan.text();
		$elem.removeClass('enable').addClass('start');
		_daySpan.text('游玩');

	}else{
	
		$elem.addClass('enable').removeClass('start');
		_daySpan.text(this.playDay);
		this.playDay = 0;

	}

}


/*创建 ejScrollViewContentDiv*/
DateInterface.prototype.createEjScrollViewContentDiv = function(cfg){

	var _ejScrollViewContentDiv = $('<div class="ej-scroll-view-content">');
	var is_this_month = false;

	for(var i = 1; i <= 6; i++){

		if(i == 1){

			is_this_month = true;

		}else{

			is_this_month = false;

		}

		var _calenderItemDiv = this.createCalenderItemDiv(i, is_this_month, cfg);
		
		_ejScrollViewContentDiv.append(_calenderItemDiv);

	}

	
	return _ejScrollViewContentDiv;

}

/*创建 contentDiv*/
DateInterface.prototype.createContentDiv = function(cfg){

	var that = this;

	var _contentDiv = $('<div class="content">');

	var _tipsDiv = $('<div class="tips "><div class="back-btn "></div><div class="total "><span class="">请选择游玩日期</span></div><div class="" style="flex: 1 1 0%;"></div></div>');
	_contentDiv.append(_tipsDiv);

	var _h1 = $('<h1 class=""><span class="sunday ">周日</span><span class="">周一</span><span class="">周二</span><span class="">周三</span><span class="">周四</span><span class="">周五</span><span class="saturday ">周六</span></h1>');
	_contentDiv.append(_h1);

	var _calenderScrollDiv = $('<div class="calender-scroll ej-tag-scroll-view ej-scroll-view">');
	_contentDiv.append(_calenderScrollDiv);

	var _ejScrollViewContentDiv = that.createEjScrollViewContentDiv(cfg);
	_calenderScrollDiv.append(_ejScrollViewContentDiv);

	var _bottomDiv = $('<div class="bottom"><a class="ej-tag-a">确定</a></div>');
	_contentDiv.append(_bottomDiv);

	return _contentDiv

}

/*创建日期界面*/
DateInterface.prototype.createInterface = function($elem, cfg, hide){

	var that = this;

	if(hide == undefined){

		var _layerDiv = $('<div class="ej-router-layer ej-router-next ej-router-animate">');
		var _ejCss1bDiv = $('<div data-reactroot class="ej-css-1b">');
		_layerDiv.append(_ejCss1bDiv);

		var _calendermanageDiv = $('<div class="calendermanage" style="height: 623px;">');
		_calendermanageDiv.css('height', ($(document.body).height() - 44) + 'px');
		_ejCss1bDiv.append(_calendermanageDiv);

		var _uiCalenderDiv = $('<div class="ui-calender" id="ui-calender">'); 
		_calendermanageDiv.append(_uiCalenderDiv);

		var _contentDiv = that.createContentDiv(cfg);
		_uiCalenderDiv.append(_contentDiv);

		$elem.append(_layerDiv);

	}else{

		// $elem.parent().parent().parent().css('top', ($(document.body).height() - 44)*(-1) + 'px');

		var _calendermanageDiv = $('<div class="calendermanage" style="height: 623px;">');
		_calendermanageDiv.css('height', ($(document.body).height() - 44) + 'px');

		var _uiCalenderDiv = $('<div class="ui-calender" id="ui-calender">'); 
		_calendermanageDiv.append(_uiCalenderDiv);

		var _contentDiv = that.createContentDiv(cfg);
		_uiCalenderDiv.append(_contentDiv);

		$elem.append(_calendermanageDiv);

	}

	

}


/******************     日期界面对象    ********************/


/******************     门票详情对象   ********************/
function TicketsDetail(){
	this.name = 'TicketsDetail';
	this.innerDateInterfaceTool = new DateInterface();
	this.innerPublicFunctionTool = new PublicFuction();
}

/*设置景点图片界面的图片*/
TicketsDetail.prototype.createViewPhotoDuo = function($elem, cfg){

	var _photoMoreDiv = $('<div class="slider single-item photo-more">');

	$.each(cfg.viewphotoduo, function(index, item){

		var _ejSwiperItemDiv = $('<div class="ej-swiper-item">');
		_photoMoreDiv.append(_ejSwiperItemDiv);

		var _itemDiv = $('<div class="item " style="height:667px"><span class="ej-tag-img" style="background-image: url(&quot;'+ (cfg.imgUrl + '/' + item) +'&quot;); background-size: contain; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div>');
		_ejSwiperItemDiv.append(_itemDiv);	

	});

	$elem.append(_photoMoreDiv);

	$elem.next().text('1/' + cfg.viewphotoduo.length);

	_photoMoreDiv.slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
         onAfterChange: function(item, index){

        	$elem.next().text((index + 1) + '/' + cfg.viewphotoduo.length);

        }
    });

}

/*增加出行人信息*/
TicketsDetail.prototype.addPassengerItemContainer = function(){

	var _passengerListContainerDiv = $('.passengerListContainer');
	var _passengerItemContainerDiv = $('<div class="passengerItemContainer">');
	_passengerListContainerDiv.append(_passengerItemContainerDiv);

	var _passengerTitleContainerDiv = $('<div class="passenger_title_container "><span class="passengerItemTitle ">出行人信息1</span><span class="passenger_to_contact passenger_to_contact-none">设为联系人</span></div>');
	_passengerItemContainerDiv.append(_passengerTitleContainerDiv);

	var _passengerValueContainerDiv = $('<div class="passenger_value_container "><span class="passenger_value-none">点击添加出行人1</span><span alt="" class="passenger_info_arrowImg ej-tag-img" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/fillInOrder/pic/arrow_right.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div>');
	_passengerItemContainerDiv.append(_passengerValueContainerDiv);

} 

/*创建 常用旅客编辑 界面*/
TicketsDetail.prototype.createPassengerEditor = function($elem){

	var _layerDiv = $('<div class="ej-router-layer ej-router-next ej-router-animate">');
	var _bodyDiv = $('<div data-reactroot class="ej-tag-body ej-css-1l" style="margin-top:44px;">');
	var _mainDiv = $('<div class="main">');

	var _inputContainerDiv = $('<div class="input-container "><div class="passenger-input-item ej-css-1o"><span class="label-field">中文姓名</span><input type="text" class="input-field ej-tag-input" placeholder="需与证件上的姓名一致"></div><div class="passenger-input-item ej-css-1o"><span class="label-field">联系电话</span><input type="text" class="input-field ej-tag-input" placeholder="接受确认短信"></div><div class="passenger-input-item no-divider ej-css-1o"><span class="label-field">身份证</span><input type="text" class="input-field ej-tag-input" placeholder="请输入"></div></div>');
	_mainDiv.append(_inputContainerDiv);

	var _bottomContainerDiv = $('<div class="bottom-container "><div class="btn ">保 存</div><div class="btn fn-hide">删 除</div></div>');
	_mainDiv.append(_bottomContainerDiv);

	var _dialogDiv = $('<div class="dialog"><div class="ej-tag-body main ej-css-1m"><div class="mask "></div><div class="list"><div class="header "><span class="cancel "></span><span class="title ">选择证件类型</span><span class="cancel ">取消</span></div><div class="scrollview ej-tag-scroll-view ej-scroll-view"><div class="ej-scroll-view-content"><div class="item">身份证</div></div></div></div></div></div>');
	_mainDiv.append(_dialogDiv);

	_bodyDiv.append(_mainDiv);
	_layerDiv.append(_bodyDiv);
	$elem.append(_layerDiv);
}

/*设置评分的星星*/
TicketsDetail.prototype.setScoreStar = function(score){

	var _scoreLeft = score.split('.')[0];
	var _scoreRight = parseInt(score.split('.')[1]);

	var _commentHeader = $('.comment-header');

	_commentHeader.find('#hotel-star').remove();

	var _hotelStarDiv = '';
	switch(parseInt(_scoreLeft)){

		case 0:

			if(_scoreRight == 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="half "></b><b class="default "></b><b class="default "></b><b class="default "></b><b class="default "></b></div>');

			}else if(_scoreRight > 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="default "></b><b class="default "></b><b class="default "></b><b class="default "></b></div>');

			}else{

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="default "></b><b class="default "></b><b class="default "></b><b class="default "></b><b class="default "></b></div>');

			}

		break;

		case 1:

			if(_scoreRight == 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="half "></b><b class="default "></b><b class="default "></b><b class="default "></b></div>');

			}else if(_scoreRight > 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="default "></b><b class="default "></b><b class="default "></b></div>');

			}else{

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="default "></b><b class="default "></b><b class="default "></b><b class="default "></b></div>');

			}
			
		break;

		case 2:

			if(_scoreRight == 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="half "></b><b class="default "></b><b class="default "></b></div>');

			}else if(_scoreRight > 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="select "></b><b class="default "></b><b class="default "></b></div>');

			}else{

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="default "></b><b class="default "></b><b class="default "></b></div>');

			}

		break;

		case 3:

			if(_scoreRight == 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="select "></b><b class="half "></b><b class="default "></b></div>');

			}else if(_scoreRight > 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="select "></b><b class="select "></b><b class="default "></b></div>');

			}else{

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="select "></b><b class="default "></b><b class="default "></b></div>');

			}


		break;

		case 4:

			if(_scoreRight == 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="select "></b><b class="select "></b><b class="half "></b></div>');

			}else if(_scoreRight > 5){

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="select "></b><b class="select "></b><b class="select "></b></div>');

			}else{

				_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="select "></b><b class="select "></b><b class="default "></b></div>');

			}

		break;

		case 5:

			_hotelStarDiv = $('<div id="hotel-star" class="ej-css-e" style=""><b class="select "></b><b class="select "></b><b class="select "></b><b class="select "></b><b class="select "></b></div>');

		break;

	}


	_commentHeader.find('.jiantou').before(_hotelStarDiv);

}

/*设置门票详情数据*/
TicketsDetail.prototype.setTicketDetailData = function(obj, imgUrl, innerticksDetailTool){

	//设置背景图
	$('.cover-container>span').attr('style', 'background-image: url("' + imgUrl + '/' + obj.viewphoto + '"); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;');

	//设置景点名
	$('.cover-info-container>.info').text(obj.viewname);

	//设置评分
	var _score = obj.score + '分';
	_score = _score=='分'?'暂无评分':_score;
	$('.comment-header').find('.headerDesc').text(_score);

	innerticksDetailTool.setScoreStar(obj.score + '');

	//设置点评数
	$('.comment-header').find('.arrow-container').children('div').text(obj.scorenum + '个点评');
	$('.comment-header').find('.arrow-container').children('div').append($('<i class="icon-right "></i>'));

	//设置图片数量
	var _length = obj.viewphotoduo.split(',').length;
	$('.cover-info-container>.pic-num').text('共' + _length + '张');

	//设置详细地址名
	$('.map-header>.jiantou>.headerDesc').text(obj.dzA + obj.dzB + obj.dzC + obj.viewdetailed);

	//打开地图
	var _position = obj.viewaccuracy.replace('-',',');
	$('.map-header').bind('click', function(e){

		e.stopPropagation();
		e.preventDefault();

        var _lonAndLat = obj.viewaccuracy.split('-')[1] + ',' + obj.viewaccuracy.split('-')[0];
        var _hotelname = obj.viewname;
        var _addr = obj.dzA + obj.dzB + obj.dzC + obj.viewdetailed;
        var _url = "http://3gimg.qq.com/lightmap/v1/marker/?type=0&marker=coord:"+_lonAndLat+";title:"+_hotelname+";addr:"+_addr+"&key=4BCBZ-OGQWX-3PE4P-ZNP3C-EU77E-QGF3Z&referer=myelong"

        window.location.href = _url;

	});

	//设置门票类型与数量
	var _ininSideDiv2 = $('.ininSideDiv2');

	var _tickets = [
		obj.ticketa,
		obj.ticketb,
		obj.ticketc,
		obj.ticketd,
		obj.tickete,
		obj.ticketf,
		obj.ticketg,
		obj.ticketh,
		obj.ticketi,
		obj.ticketj
	];

	var _nyContainerDiv = innerticksDetailTool.createNyContainerDiv(_tickets, innerticksDetailTool);
    _ininSideDiv2.append(_nyContainerDiv);


}

/*创建景点特色界面*/
TicketsDetail.prototype.createScenicFeatures = function($elem, jsonObj){

	var _layerDiv = $('<div class="ej-router-layer ej-router-next ej-router-animate">');
	var _bodyDiv = $('<div data-reactroot class="ej-tag-body ej-css-1a" style="margin-top:44px;">');
	var _mainDiv = $('<div class="main">');
	var _loadingDiv = $('<div class="loading fn-hide ej-css-c"><span class="">努力加载中</span></div>');

	var _viewDiv = this.createSFViewDiv(jsonObj);
	_mainDiv.append(_viewDiv);

	_bodyDiv.append(_viewDiv);
	_bodyDiv.append(_loadingDiv);
	_layerDiv.append(_bodyDiv);
	$elem.append(_layerDiv);

}

/*创建SFViewDiv*/
TicketsDetail.prototype.createSFViewDiv = function(jsonObj){

	var _viewDiv = $('<div class="detail-container ej-tag-scroll-view ej-scroll-view">');
	var _contentDiv = $('<div class="ej-scroll-view-content">');
	_viewDiv.append(_contentDiv);

	var _descDiv1 = $('<div class="desc">');
	var _descTitleDiv = $('<div class="desc-title "><span class="shuLine "></span><!-- react-text: 10 -->景点特色<!-- /react-text --></div>');
	_descDiv1.append(_descTitleDiv);
	var _descContentDiv = $('<div class="desc-content">');
	var _contents = jsonObj.characteristic.split(',');
	if(_contents[0] != ""){

		for(var i = 0;i < _contents.length;i++){
		
			var _descItemDiv = this.createDescItem(_contents[i]);
			_descContentDiv.append(_descItemDiv);

		} 

	}
	_descDiv1.append(_descContentDiv);

	_contentDiv.append(_descDiv1);


	var _descDiv2 = $('<div class="desc">');
	_descTitleDiv = $('<div class="desc-title "><span class="shuLine "></span><!-- react-text: 25 -->景点介绍<!-- /react-text --></div>');
	_descDiv2.append(_descTitleDiv);
	_descContentDiv = $('<div class="desc-content">');
	// _descItemDiv = this.createDescItem();
	// _descContentDiv.append(_descItemDiv);
	_descItemDiv = this.createDescItem(jsonObj.viewdetails, true);
	_descContentDiv.append(_descItemDiv);
	_descDiv2.append(_descContentDiv);

	_contentDiv.append(_descDiv2);

	return _viewDiv;

}

/*创建DescItem*/
TicketsDetail.prototype.createDescItem = function(content, isIntroduce){

	var _descItemDiv = $('<div class="desc-item">');
	var _descListDiv = $('<div class="item-list">');

	if(!isIntroduce){

		var _span = $('<span class="ej-tag-img fn-hide" style="background-image: url(&quot;undefined&quot;); background-size: cover; background-position: 50% 50%; opacity: 0; transition: opacity 0.5s linear;"></span>');

		var _i = $('<i class="icon"></i>');
		var _descTextSpan = $('<span class="desc-text">' + content + '</span>');

	}else{

		var _span = content;
		var _i = $('<i class></i>');
		var _descTextSpan = $('<span class></span>');

	}
	
	_descListDiv.append(_i);
	_descListDiv.append(_descTextSpan);

	_descItemDiv.append(_descListDiv);
	_descItemDiv.append(_span);

	return _descItemDiv;

}

/*创建 ticketItemContainerDiv*/
TicketsDetail.prototype.createTicketItemContainerDiv = function(cfg){
	
	var _ticketNum = cfg.ticketnum>10?10:cfg.ticketnum;

	var _ticketItemContainerDiv = $('<div class="ticketItemContainer">');

	var _titleContainerDiv = $('<div class="titlecontainer "><span class="ticketTitle ">'+ cfg.ticketTitle +'</span><span class="deletebtn fn-hide"></span></div>');
	_ticketItemContainerDiv.append(_titleContainerDiv);

	var _priceTagPurchaseContainerDiv = $('<div class="price_tag_purchase_container fn-hide"><div class="price_tag_container "><span class="price_tag">￥</span><span class="ticketPrice ">'+ cfg.ticketPrice +'</span><span class="tag tag-none"></span><span class="tag tag-none"></span></div><div class="purchase_container "><span class="purchaseTxt ">购票须知</span><span alt="" class="arrowImg ej-tag-img" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/fillInOrder/pic/arrow_right.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div></div>');
	_ticketItemContainerDiv.append(_priceTagPurchaseContainerDiv);

	var _dividerLineI = $('<i class="dividerLine">');
	_ticketItemContainerDiv.append(_dividerLineI);

	var _warningContainerDiv = $('<div class="warning_container warning_container-none"><span class="warning_txt ">温馨提示</span><div class="warning_tip "><span alt="" class="warning_img ej-tag-img" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/fillInOrder/pic/warning.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span><span class="warning_txt "></span></div></div>');
	_ticketItemContainerDiv.append(_warningContainerDiv);

	var _chooseDateContainerDiv = $('<div class="choose_date_container "><span class="choose_date_label ">游玩日期</span><span class="choose_date_value">2017-05-23  星期二</span><div class="date_arrow_img_container "><span alt="" class="arrowImg ej-tag-img" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/fillInOrder/pic/arrow_right.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div></div>');
	_ticketItemContainerDiv.append(_chooseDateContainerDiv);

	var _purchaseNumberContainerDiv = $('<div class="purchase_number_container "><div class="purchase_number_label_container "><span class="purchase_number_label ">购买数量</span><span class="purchase_number_label2">(最多购买'+ cfg.ticketnum +'份)</span></div><div class="number_container "><span class="minus-enable minus-disable">-</span><input type="number" min="1" max="10" class="number_input ej-tag-input" value="1"><span class="plus-enable">+</span></div></div>');
	_ticketItemContainerDiv.append(_purchaseNumberContainerDiv);

	var _nyContainerDiv = $('<div class="ny-container fn-hide ej-css-1t"><div class="expandInfoListContainer "></div></div>');
	_ticketItemContainerDiv.append(_nyContainerDiv);

	// _nyContainerDiv = $('<div class="ny-container ej-css-1u"><div class="passengerListContainer "><div class="passengerItemContainer "><div class="passenger_title_container "><span class="passengerItemTitle ">出行人信息1</span><span class="passenger_to_contact passenger_to_contact-none">设为联系人</span></div><div class="passenger_value_container "><span class="passenger_value-none">点击添加出行人1</span><span alt="" class="passenger_info_arrowImg ej-tag-img" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/fillInOrder/pic/arrow_right.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div></div></div></div>');
	// _ticketItemContainerDiv.append(_nyContainerDiv);

	return _ticketItemContainerDiv;

}

/*创建 fillInListContainerDiv*/
TicketsDetail.prototype.createFillInItemContainerDiv = function(cfg){

	var fillInItemContainerDiv = $('<div class="fillInItemContainer">');

	if(cfg != undefined){

		var _nyContainerDiv = $('<div class="ny-container ej-css-1s">');
		fillInItemContainerDiv.append(_nyContainerDiv);

		var _ticketListContainerDiv = $('<div class="ticketListContainer">');
		_nyContainerDiv.append(_ticketListContainerDiv);

		var _ticketItemContainer = this.createTicketItemContainerDiv(cfg);
		 _ticketListContainerDiv.append(_ticketItemContainer);

	}else{

		var bottomItemDiv = $('<div class="bottom_item "><div class="add_ticket_btn fn-hide"><span class="add_ticket_img "></span><span class="add_ticket_tip ">同时购买该景区其他票</span></div><div class="ny-container ej-css-1p"><span class="contactTitle ">联系人信息</span><div class="contactListContainer "><div class="itemContainer "><div class="itemTitleText "><div class="itemTitleRealContainer "><span class="itemTitle ">姓名 (中文)</span><span alt="" class="ej-tag-img contactArrowIcon contactArrowIcon-none" style="background-image: url(&quot;&quot;); background-size: cover; background-position: 50% 50%; opacity: 0; transition: opacity 0.5s linear;"></span></div></div><input type="text" value="'+ $('#url').attr('name') +'" class="ej-tag-input input-field" placeholder="需与证件上姓名一致"><div class="rightIconContainer rightIconContainer-none"><i class="verticalDividerLine "></i><span alt="" class="contactIcon ej-tag-img" style="background-image: url(&quot;&quot;); background-size: cover; background-position: 50% 50%; opacity: 0; transition: opacity 0.5s linear;"></span></div></div><div class="itemContainer "><div class="itemTitleText "><div class="itemTitleRealContainer "><span class="itemTitle ">中国大陆(+86)</span><span alt="" class="ej-tag-img contactArrowIcon contactArrowIcon-none" style="background-image: url(&quot;&quot;); background-size: cover; background-position: 50% 50%; opacity: 0; transition: opacity 0.5s linear;"></span></div></div><input type="tel" value="'+ $('#url').attr('tle') +'" class="ej-tag-input input-field" placeholder="接收确认短信"><div class="rightIconContainer rightIconContainer-none"><i class="verticalDividerLine "></i><span alt="" class="contactIcon ej-tag-img" style="background-image: url(&quot;&quot;); background-size: cover; background-position: 50% 50%; opacity: 0; transition: opacity 0.5s linear;"></span></div></div></div></div></div>');
		fillInItemContainerDiv.append(bottomItemDiv);

	}

	return fillInItemContainerDiv;

}

/*创建填写订单界面*/
TicketsDetail.prototype.createEditOrder = function($elem, cfg){

	var _layerDiv = $('<div class="ej-router-layer ej-router-next ej-router-animate">');
	var _bodyDiv = $('<div data-reactroot class="ej-tag-body ej-css-1n">');
	var _mainDiv = $('<div class="main" style="overflow-y: scroll;">');
	var _loadingDiv = $('<div class="loading fn-hide ej-css-c"><span class="">努力加载中</span></div>');

	var _fillInListContainerDiv = $('<div class="fillInListContainer ej-tag-scroll-view ej-scroll-view">');
	_mainDiv.append(_fillInListContainerDiv);

	var _nyContainerDiv = $('<div class="ny-container ej-css-1s">');
	_fillInListContainerDiv.append(_nyContainerDiv);

	var _fillInItemContainerDiv = this.createFillInItemContainerDiv(cfg);
	_nyContainerDiv.append(_fillInItemContainerDiv);

	_fillInItemContainerDiv = this.createFillInItemContainerDiv();
	_nyContainerDiv.append(_fillInItemContainerDiv);

	var _credit = '';
	if(cfg.credit2 == '0'){

		_credit = '赠送 ' + cfg.credit1 + ' 积分';

	}else if(cfg.credit1 == '0'){

		_credit = '赠送 ' + cfg.credit2  + ' 余额';

	}else{

		_credit = '';

	}
	var _purchaseContainerDiv = $('<div class="purchaseContainer"><div class="total1"><div class="orderprice return">￥<span id="wborderprice">'+ cfg.ticketPrice +'</span></div><div class="returnprice"><div class="coupontext" style="display: block;">'+ _credit +'</div></div></div><div class="detail-order-container "><div class="detail-order-up-container fn-hide"><i class="detail-order-up "></i><span class="detail-order ">明细</span></div><span class="submit-fill-order ">提交订单</span></div></div>');
	_mainDiv.append(_purchaseContainerDiv);

	var _listDialogDiv = $('<div class="list-dialog"><div class="ej-tag-body main ej-css-1q"><div class="mask "></div><div class="list"><div class="header "><span class="cancel "></span><span class="title "></span><span class="cancel ">取消</span></div><div class="scrollview ej-tag-scroll-view ej-scroll-view"><div class="ej-scroll-view-content"></div></div></div></div></div>');
	_mainDiv.append(_listDialogDiv);

	var _outerDiv = $('<div class="outer fn-hide ej-css-1r"><div class="mask"></div><div class="container "><div class="up_row ">是否删除此门票</div><div class="down_row "><div class="display-none cancel"><a class="ej-tag-a">取消</a></div><div class="spi "></div><div class="confirm "><a class="ej-tag-a">删除</a></div></div></div></div>');
	_mainDiv.append(_outerDiv);

	_bodyDiv.append(_mainDiv);
	_bodyDiv.append(_loadingDiv);
	_layerDiv.append(_bodyDiv);
	$elem.append(_layerDiv);

}

/*创建界面*/
TicketsDetail.prototype.createInterface = function($elem){

	var that = this;

	var _layerDiv = $('<div class="ej-router-layer ej-router-next ej-router-animate">');
	var _bodyDiv = $('<div data-reactroot class="ej-tag-body ej-css-1g">');
	var _mainDiv = $('<div class="main" style="overflow-y: scroll;">');
	var _loadingDiv = $('<div class="loading ej-css-c"><span class="">努力加载中</span></div>');

	var _dnDiv = $('<div class="display-none"><div class="switchTabSimulate "><a class="ej-tag-a unSelected selected">预订门票</a><a class="ej-tag-a unSelected">查看评价</a><a class="ej-tag-a unSelected">购买须知</a></div><div class="ej-tag-scroll-view display-none bottomFilter ej-scroll-view ej-scroll-view-h"><div class="ej-scroll-view-content ej-scroll-view-h-content"><div class="tagItem-unselected">套票</div></div></div></div>');
	_mainDiv.append(_dnDiv);

	var _viewDiv = this.createDetail();
	_mainDiv.append(_viewDiv);

	var _maskDiv = $('<div class="mask"></div>');
	_mainDiv.append(_maskDiv);

	_maskDiv.bind('click', function(){

		closePlayData();

	});

	var _1kDiv = $('<div class="ej-tag-body fn-hide ej-css-1k" style="margin-top: 102%;"><div class="dateChooseView"><span class="titleView ">【上午场】北京故宫门票（成人）（旺季）</span><div class="bottomView "><span class="subTitle ">选择游玩日期</span><div class="btnsView "><div class="bookingbtn "><span class="disablebooking ">今日不可订</span></div><div class="bookingbtn "><div class="bookingtimearea "><span class="bookingDay ">明天</span><span class="money "><!-- react-text: 1276 -->￥<!-- /react-text --><!-- react-text: 1277 -->60.00<!-- /react-text --></span></div><span class="bookingtime ">2017-05-23</span></div><div class="bookingbtn ">其他日期</div></div><div class="Tips "><i class="warning-icon "></i><span class="tipcontent ">最晚需提前1天23:30前订票</span></div></div></div></div>');
	_mainDiv.append(_1kDiv);

	_bodyDiv.append(_mainDiv);
	_bodyDiv.append(_loadingDiv);
	_layerDiv.append(_bodyDiv);
	$elem.append(_layerDiv);

}

/*创建门票详情标签*/
TicketsDetail.prototype.createDetail = function(){

	var _viewDiv = $('<div class="detail-container ej-tag-scroll-view ej-scroll-view">');
	var _contentDiv = $('<div class="ej-scroll-view-content">');
	_viewDiv.append(_contentDiv);

	var _outSideDiv = $('<div>');
	_contentDiv.append(_outSideDiv);

	var _inSideDiv = $('<div>');
	_outSideDiv.append(_inSideDiv);
	var _detailCommentDiv = $('<div class="detailComment-container">');
	_outSideDiv.append(_detailCommentDiv);
 
 	//_ininSideDiv1
 	var _ininSideDiv1 = $('<div>');
 	_inSideDiv.append(_ininSideDiv1);

 	var _coverDiv = $('<div class="cover-container "><span alt="景点图片" class="ej-tag-img" style="background-image: url(&quot;&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span><div class="cover-info-container "><div class="info "></div><div class="pic-num"><!-- react-text: 20 --><!-- /react-text --></div></div></div>');
 	_ininSideDiv1.append(_coverDiv);

 	var _inininSideDiv = this.createInininSideDiv();
 	_ininSideDiv1.append(_inininSideDiv);

 	// var _filterBackViewDiv = $('<div class="filterBackView "><div class="switchTab "><a class="ej-tag-a unSelected selected">预订门票</a><a class="ej-tag-a unSelected">查看评价</a><a class="ej-tag-a unSelected">购买须知</a></div><div class="ej-tag-scroll-view display-none bottomFilter ej-scroll-view ej-scroll-view-h"><div class="ej-scroll-view-content ej-scroll-view-h-content"><div class="tagItem-unselected">套票</div></div></div></div>');
 	// _ininSideDiv1.append(_filterBackViewDiv);

 	//_ininSideDiv2
 	var _ininSideDiv2 = $('<div class="ininSideDiv2">')
 	_inSideDiv.append(_ininSideDiv2);

	return _viewDiv;

}

/*创建NyContainerDiv*/
TicketsDetail.prototype.createNyContainerDiv = function(tickets, innerticksDetailTool){

	var _nyContainerDiv = $('<div class="ny-container ej-css-1e">');
	var _ticketContainerDiv = $('<div class="ticket-container">');

	var _len = 0;
 	$.each(tickets, function(outIndex, outItem){

 		if(outItem != undefined){

 			_len++;

 			var _containerDiv = $('<div class="container">');
			_ticketContainerDiv.append(_containerDiv);

			var _ticketGroupDiv = innerticksDetailTool.createTicketGroupDiv(innerticksDetailTool, outItem);
			_containerDiv.append(_ticketGroupDiv);

 		}

 	});

 	if(!_len){

 		$('.detail-container').append('<center style="background-color:#F2F2F2;"><img src="../addons/wqtgd_jiudian/template/img/null1.png" style="width:100px;height:100px;margin-top:10px;"></center>');
 		$('.detail-container').append('<div class="prompt1" style="padding-top:10px;background-color:#F2F2F2;"><center> <a class="weui-form-preview-btn weui-form-preview-btn-primary" href="" style="margin-top:15px;width:100%;color:black;font-size:17px;color:lightgray;text-align:center;">暂无门票</a></center></div>');

 	}
 
 	$('.detail-container').append('<section class="tool"><div class="copy">Copyright &copy; 2008-2017 欢乐拆包版权所有</div></section>');

	_nyContainerDiv.append(_ticketContainerDiv);

	return _nyContainerDiv;

}

/*创建ticketGroupDiv*/
TicketsDetail.prototype.createTicketGroupDiv = function(innerticksDetailTool, tickets){



	var _ticketType = '';

	if(tickets[0] != null){

		switch(parseInt(tickets[0].tickettype)){

		case 0:

			_ticketType = '成人票';

		break;

		case 1:

			_ticketType = '儿童票';

		break;

		case 2:

			_ticketType = '学生票';

		break;

		case 3:

			_ticketType = '家庭票';

		break;

		case 4:

			_ticketType = '老人票';

		break;

		case 5:

			_ticketType = '联票';

		break;

		case 6:

			_ticketType = '园内餐饮票';

		break;

		case 7:

			_ticketType = '园内其他票';

		break;

		case 8:

			_ticketType = '其他景点名票';

		break;

		case 9:

			_ticketType = '优待票';

		break;

		}


		var _ticketGroupDiv = $('<div class="ticketGroup">');

		_ticketGroupDiv.append($('<div class="divider divider-none"></div>'));

		var _ejTagA = $('<a class="ej-tag-a" onclick="openOrCloseTicketsList(this)"><div class="groupContainer "><div class="sectionGroupTitle "><span class=""></span><!-- react-text: 163 -->'+ _ticketType +'<!-- /react-text --></div><span class="arrowIcon ej-tag-img" alt="" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/detail/pic/arrow_up.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div></a>');
		_ticketGroupDiv.append(_ejTagA);

		var _ticketListDiv = $('<div class="ticketList">');
		_ticketGroupDiv.append(_ticketListDiv);

		$.each(tickets, function(index, item){

			var _ticketContainerDiv = innerticksDetailTool.createTicketContainerDiv(item);
			_ticketListDiv.append(_ticketContainerDiv);

		});

		var _splitGrouplineI = $('<i class="splitGroupline">');
		_ticketGroupDiv.append(_splitGrouplineI);
		
	}

	return _ticketGroupDiv;

}

/*创建TicketContainerDiv*/
TicketsDetail.prototype.createTicketContainerDiv = function(jsonObj){

	var that = this;

	var _ticketContainerDiv = $('<div class="ticketContainer">');

	var _ticketItemDiv = $('<div class="ticketItem">');
	_ticketContainerDiv.append(_ticketItemDiv);

	var _ticketLeftDiv = $('<div class="ticketLeft " ><span class="ticketName ">'+ jsonObj.ticketname +'</span><div class="noticeContainer "><span class="bookingNotice ">'+ jsonObj.booking +'</span><span class="biao fn-hide"></span><span class="biao2 fn-hide"></span></div><div class="purchaseRules "><span class="rules ">购票须知</span><i class="arrowRight "></i></div></div>');
	_ticketItemDiv.append(_ticketLeftDiv);

	_ticketLeftDiv.bind('click', function(){

		openReserveDetail(jsonObj);

	});

	var _ticketRightDiv = $('<div class="ticketRight " ticketnum="'+  jsonObj.ticketnum +'" ticketid="'+ jsonObj.id +'" credit1="'+ jsonObj.credit1 +'" credit2="'+ jsonObj.credit2 +'" booking="'+ jsonObj.choice +'"><div class="priceContainer "><span class="originPrice"><del class="">￥'+ jsonObj.ticketprice +'</del></span><span class="currentPrice">￥'+ jsonObj.saleprice +'</span></div><i class="bookIcon "></i></div>');
	_ticketItemDiv.append(_ticketRightDiv);

	_ticketRightDiv.bind('click', function(){

		$('.ej-router-current').find('.loading').removeClass('fn-hide');

		$.post($("#url").attr("delday"),{'id':jsonObj.id},function(data){

			$('.ej-router-current').find('.loading').addClass('fn-hide');

		    _ticketRightDiv.attr('booking', data);

		    openPlayData({
				ticketName: _ticketLeftDiv.children('.ticketName').text(),
				ticketPrice: _ticketRightDiv.find('.currentPrice').text()
			});

			if(data == ''){

				$($('.bookingbtn')[1]).addClass('fn-hide');
				$($('.bookingbtn')[2]).addClass('fn-hide');
				$('.disablebooking').text('没有票了');
		 		

		    }else{

		   		$($('.bookingbtn')[1]).removeClass('fn-hide');
				$($('.bookingbtn')[2]).removeClass('fn-hide');
				$('.disablebooking').text('今天不可订');

				var _date = data.split(',')[0];
				$($('.bookingbtn')[1]).find('.bookingtime').text(_date);
				var _tDate = that.innerPublicFunctionTool.GetDateStr(1);
				if(_date == _tDate){

					$($('.bookingbtn')[1]).find('.bookingDay').text('明天');

				}else{

					$($('.bookingbtn')[1]).find('.bookingDay').text(
						that.innerDateInterfaceTool.getWeekFromDate(_date.replace(/-/g, "/"))
						);

				}

		    }

			$($('.bookingbtn')[2]).attr('booking', data);
			$($('.bookingbtn')[1]).attr('ticketid', _ticketRightDiv.attr('ticketid'));
			$($('.bookingbtn')[1]).attr('ticketnum', _ticketRightDiv.attr('ticketnum'));
			$($('.bookingbtn')[1]).attr('credit1', _ticketRightDiv.attr('credit1'));
			$($('.bookingbtn')[1]).attr('credit2', _ticketRightDiv.attr('credit2'));
			$('.tipcontent').text('最晚需提前1天'+ jsonObj.booking +'前订票');

			//设置隐藏日期界面样式
			that.innerDateInterfaceTool.setHideDateInterfaceStyle({
				elems: $(hideDivP.children()[2]).find('.ej-tag-a'),
				bookings: _ticketRightDiv.attr('booking').split(','),
				price: '￥'+jsonObj.saleprice
			});

		  },'json');

	});

	var _splitTicketlineI = $('<i class="splitTicketline">');
	_ticketContainerDiv.append(_splitTicketlineI);

	return  _ticketContainerDiv;

}

/*创建InininSideDiv*/
TicketsDetail.prototype.createInininSideDiv = function(){

	var _inininSideDiv = $('<div class style="background: white;">');

	var _commentHeaderDiv = this.createCommentHeaderDiv();
	_inininSideDiv.append(_commentHeaderDiv);

	var _topLineDiv = $('<div class="" style="height: 1px;background: rgb(235, 235, 235);margin-left: 32px;"></div>');
	_inininSideDiv.append(_topLineDiv);

	var _mapHeaderDiv = this.createMapHeaderDiv();
	_inininSideDiv.append(_mapHeaderDiv);

	var _bottomLineDiv = $('<div class="" style="height: 1px;background: rgb(235, 235, 235);margin-left: 32px;"></div>');
	_inininSideDiv.append(_bottomLineDiv);

	var _scenery = this.createSceneryDiv();
	_inininSideDiv.append(_scenery);

	return _inininSideDiv;

}

/*创建SceneryDiv*/
TicketsDetail.prototype.createSceneryDiv = function(){

	var _scenery = $('<div class="scenery-special-header">');

	var _firstDiv = $('<div class="" style="vertical-align: middle;"><span alt="" class="header-icon ej-tag-img" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/detail/pic/icon_scenic_feature.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div>');
	_scenery.append(_firstDiv);

	var _jiantouDiv = $('<div class="jiantou "><span class="headerDesc ">景点特色</span><div class="arrow-container "><div class="" style="vertical-align: middle;"><span alt="" class="right-arrow-icon ej-tag-img" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/detail/pic/arrow_right.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div></div></div>');
	_scenery.append(_jiantouDiv);

	return _scenery

}

/*创建MapHeaderDiv*/
TicketsDetail.prototype.createMapHeaderDiv = function(){

	var _mapHeaderDiv = $('<div class="map-header yan2">');

	var _firstDiv= $('<div class="" style="vertical-align: middle;"><span alt="" class="map-header-icon ej-tag-img" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/detail/pic/icon_map.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div>');
	_mapHeaderDiv.append(_firstDiv);

	var _jiantouDiv = $('<div class="jiantou "><span class="headerDesc "></span></div>');
	_mapHeaderDiv.append(_jiantouDiv);

	_mapHeaderDiv.append('<i class="icon-right2 "></i>');

	return _mapHeaderDiv;

}

/*创建CommentHeaderDiv*/
TicketsDetail.prototype.createCommentHeaderDiv = function(){

	var _commentHeaderDiv = $('<div class="comment-header">');

	var _firstDiv = $('<div class="" style="vertical-align: middle;"><span alt="" class="header-icon ej-tag-img" style="background-image: url(&quot;http://m.elongstatic.com/static/webapp/scenery/sceneryweb/online/v1.0.0/assets/views/detail/pic/pingfen.png&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div>');
	_commentHeaderDiv.append(_firstDiv);

	// var _hotelStar = $('<div id="hotel-star" class="ej-css-e" style=""><b class="default default  "></b><b class="default  "></b><b class="default  "></b><b class="default  "></b><b class="default  "></b></div>');
	// _commentHeaderDiv.append(_hotelStar);

	var jiantouDiv = $('<div class="jiantou "><span class="headerDesc "></span><div class="arrow-container"><div class="" style="display: flex; color: rgb(51, 51, 51); font-size: 12px; overflow: hidden; text-overflow: ellipsis; align-items: center; white-space: nowrap;"><!-- react-text: 32 --><!-- /react-text --><i class="icon-right "></i></div></div></div>');
	_commentHeaderDiv.append(jiantouDiv);

	return _commentHeaderDiv;

}

/******************     门票详情对象   ********************/


/******************     门票列表对象   ********************/
function TicketsList(){
	this.name = 'TicketsList',
	this.loc = 0,
	this.sort = 1,
	this.filter = 2
}

/*创建门票列表项*/
TicketsList.prototype.createTicksListItem = function(jsonObj, imgUrl){

	var _containDiv = $('<div class="contain" onclick = "box(this, '+ jsonObj.id +')">');
	var _sceneryDiv = $('<div class="scenery">');

	//设置图片
	var _picDiv = $('<div class="pic "><span class="image ej-tag-img" style="background-image: url(&quot;' + imgUrl + '/' + jsonObj.viewphoto + '&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div>');
	_sceneryDiv.append(_picDiv);

	//设置内容
	var _infoDiv = $('<div class="info">');

	var _titleSpan = $('<span class="title ">' + jsonObj.viewname + '</span>');
	_infoDiv.append(_titleSpan);

	var _infoDetailSpan = $('<span class="info-detail ">' + jsonObj.simple + '</span>');
	_infoDiv.append(_infoDetailSpan);

	var _cityScoreDiv = $('<div class="city-score "><span class="city ">' + jsonObj.dzB + '</span><span class="jibie"><!-- react-text: 102 --><!-- /react-text --><!-- react-text: 103 -->' + jsonObj.viewlevel + '<!-- /react-text --></span></div>');
	_infoDiv.append(_cityScoreDiv);

	var _biaoPriceDiv = '';
	if(jsonObj.viewprice == '0'){

		_biaoPriceDiv = $('<div class="biao-price "><span class="biao">'+ jsonObj.viewnavname +'</span><span class="biao2 fn-hide">可订今日</span><div class="price "><i class="money "></i><span class="realprice ">暂无门票</span><span class="qi "></span></div></div>'); 

	}else{

		_biaoPriceDiv = $('<div class="biao-price "><span class="biao">'+ jsonObj.viewnavname +'</span><span class="biao2 fn-hide">可订今日</span><div class="price "><i class="money ">￥</i><span class="realprice ">' + jsonObj.viewprice + '</span><span class="qi ">起</span></div></div>'); 

	}
	if(jsonObj.viewnavname == ''){

		_biaoPriceDiv.children('.biao').addClass('fn-hide');

	}else{

		_biaoPriceDiv.children('.biao').removeClass('fn-hide');

	}
	_infoDiv.append(_biaoPriceDiv);

	_sceneryDiv.append(_infoDiv);
	_containDiv.append(_sceneryDiv);

	return _containDiv;	

}

/*创建界面*/
TicketsList.prototype.createInterface = function($elem, hCityTool, publicFunctionTool){

	var _layerDiv = $('<div class="ej-router-layer ej-router-next ej-router-animate">');
	var _bodyDiv = $('<div data-reactroot class="ej-tag-body ej-css-23">');
	var _mainDiv = $('<div class="main ej-css-d">');
	var _loadingDiv = $('<div class="loading ej-css-c"><span class="">努力加载中</span></div>');

	var _searchDiv = $('<div class="search "><div class="searchbar"><i class="searchIcon"></i><span class="">输入城市/景点/游玩主题</span></div><div class="cha-contain fn-hide"><i class="cha "></i></div></div>');
	_mainDiv.append(_searchDiv);

	// 打开景点搜索界面
	_searchDiv.children('.searchbar').bind('click', function(e){

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

	var _viewDiv = $('<div class="ej-tag-scroll-view fn-hide ej-scroll-view" style="padding-bottom: 30px;"><div class="ej-scroll-view-content"><div class="nosearch-container ej-css-22"><div class="back-search "><div class="backPic "></div><span class="no-result ">没有搜索结果</span></div><div class="nosearch fn-hide"><div class="local-scenery "><i class="line "></i><i class="point "></i><!-- react-text: 19 -->当地热门景点<!-- /react-text --><i class="point "></i><i class="line "></i></div><div class="margin-T "></div><div class="more "><!-- react-text: 24 -->这儿有更多热门<!-- /react-text --><i class="icon "></i></div></div><div class="nosearch fn-hide"><div class="local-scenery "><i class="line "></i><i class="point "></i><!-- react-text: 30 -->附近热门景点<!-- /react-text --><i class="point "></i><i class="line "></i></div><div class="margin-T "></div><div class="more "><!-- react-text: 35 -->这儿有更多附近<!-- /react-text --><i class="icon "></i></div></div></div></div></div>');
	_mainDiv.append(_viewDiv);

	var _filterbarDiv = $('<div class="filterbar"><a class="ej-tag-a arrow-down fn-hide" pos="0">距离</a><a class="split ej-tag-a"></a><a class="ej-tag-a arrow-down" pos="2">排序</a><a class="split ej-tag-a"></a><a class="ej-tag-a arrow-down fn-hide" pos="4">主题筛选</a></div>');
	_mainDiv.append(_filterbarDiv);

	var _orderSaleDiv = $('<div class="order-sale fn-hide"><div class="order">可订今日</div><div class="sale">特价</div></div>');
	_mainDiv.append(_orderSaleDiv);

	var _dnDiv = $('<div class="dn" style="height: 100%; width: 100%;"><div class="filter-container ej-css-21"><span class="filter-icon "></span><p class="tips1 ">没有筛选结果</p><p class="tips2 "></p><div class="buttonContainer fn-hide"><div class="btn "><!-- react-text: 730 -->30km<!-- /react-text --><span class=""></span></div></div></div></div>');
	_mainDiv.append(_dnDiv);

	var _viewDiv2 = this.createTicksList();
	_mainDiv.append(_viewDiv2);

	var _loadFailDiv = $('<div class="all-load-fail net-error fn-hide ej-css-l"><i class="img "></i><p class="">抱歉!房子和网被风刮走了，请重试</p><a class="ej-tag-a">重新加载</a></div>');
	_mainDiv.append(_loadFailDiv);

	var _backTopDiv = $('<div class="back-top"><div class="up  "></div><div class="txt  ">顶部</div></div>');
	_mainDiv.append(_backTopDiv);

	var _maskDiv = $('<div class="mask"><div class="bg "></div></div>');
	_mainDiv.append(_maskDiv);

	var _locDiv = $('<div class="loc"><div id="distance-fliter" class="ej-tag-body ej-css-4"><div class="filter-wrap "><div class="filter-item tit "><div class="filter-tit page-content ej-tag-scroll-view ej-scroll-view"><div class="ej-scroll-view-content"><ul class=""><li class="on">附近</li><li class="">周边城市</li></ul></div></div></div><div class="filter-item con2 con3 "><div class="filter-con2 page-content ej-tag-scroll-view ej-scroll-view"><div class="ej-scroll-view-content"><ul class="filter-list-radio page-content "><li class=""><!-- react-text: 710 -->不限<!-- /react-text --><div class="radiobox ej-css-7"><div class=""></div></div></li><li class=""><!-- react-text: 714 -->5km<!-- /react-text --><div class="radiobox ej-css-7"><div class=""></div></div></li><li class=""><!-- react-text: 718 -->10km<!-- /react-text --><div class="radiobox ej-css-7"><div class=""></div></div></li><li class=""><!-- react-text: 722 -->15km<!-- /react-text --><div class="radiobox ej-css-7"><div class=""></div></div></li><li class=""><!-- react-text: 726 -->30km<!-- /react-text --><div class="radiobox ej-css-7"><div class=""></div></div></li></ul></div></div></div></div><ul class="filter-bottom fn-hide"><li class="filter-reset ">清空选择</li><li class="filter-submit ">确定</li></ul></div></div>');
	_mainDiv.append(_locDiv);

	var _sortDiv = $('<div class="sort"><div id="hotel-sort" class="ej-tag-body ej-css-i"><ul class=""><li class="on" onclick="conditionSort(0)">智能排序</li><li class="" onclick="conditionSort(1)">价格从低到高</li><li class="" onclick="conditionSort(2)">价格从高到低</li><li class="fn-hide">景区等级从高到低</li><li class="" onclick="conditionSort(3)">好评率从高到低</li><li class="" onclick="conditionSort(4)">销量从高到低</li><li class="fn-hide">距离从近到远</li></ul></div></div>');
	_mainDiv.append(_sortDiv);

	var _filterDiv = $('<div class="filter"><div id="theme-filter" class="ej-tag-body ej-css-6"><ul class=""><li class="on" style="width: 31%;">不限</li><li class="" style="width: 31%;">自然风光</li><li class="" style="width: 31%;">动植物园</li><li class="" style="width: 31%;">踏青</li><li class="" style="width: 31%;">赏花</li><li class="" style="width: 31%;">古迹遗址</li><li class="" style="width: 31%;">古镇古村</li><li class="" style="width: 31%;">城市观光</li><li class="" style="width: 31%;">温泉</li><li class="" style="width: 31%;">拜佛祈福</li><li class="" style="width: 31%;">室内娱乐</li><li class="" style="width: 31%;">滑雪</li><li class="" style="width: 31%;">户外拓展</li><li class="" style="width: 31%;">农家乐</li><li class="" style="width: 31%;">主题乐园</li><li class="" style="width: 31%;">亲子</li><li class="" style="width: 31%;">博物馆</li><li class="" style="width: 31%;">科技馆</li><li class="" style="width: 31%;">水上世界</li><li class="" style="width: 31%;">避暑</li><li class="" style="width: 31%;">海洋馆</li><li class="" style="width: 31%;">展览演出</li><li class="" style="width: 31%;">漂流</li><li class="" style="width: 31%;">游船</li><li class="" style="width: 31%;">夜游</li></ul></div></div>');
	_mainDiv.append(_filterDiv);

	_bodyDiv.append(_mainDiv);
	_bodyDiv.append(_loadingDiv);
	_layerDiv.append(_bodyDiv);

	$elem.append(_layerDiv);

}

/*创建门票列表标签*/
TicketsList.prototype.createTicksList = function(){

	var _viewDiv = $('<div class="ej-tag-scroll-view ej-scroll-view">');
	var _contentDiv = $('<div class="ej-scroll-view-content">');

	// var _containDiv = $('<div class="contain">');
	// var _sceneryDiv = $('<div class="scenery">');

	// var _picDiv = $('<div class="pic "><span class="image ej-tag-img" style="background-image: url(&quot;//pavo.elongstatic.com/i/AH200_200/0006SMzd.jpg&quot;); background-size: cover; background-position: 50% 50%; opacity: 1; transition: opacity 0.5s linear;"></span></div>');
	// _sceneryDiv.append(_picDiv);
	// var _infoDiv = $('<div class="info "><span class="title ">七彩蝶园</span><span class="info-detail ">七彩蝶园是一个美妙的蝴蝶世界，分为蝴蝶观赏区、蝴蝶科普世界、蝴蝶文化区、蝴蝶放飞广场、DIY体验区等多个区域。</span><div class="city-score "><span class="city ">北京</span><span class="score"><!-- react-text: 99 -->4.0<!-- /react-text --><!-- react-text: 100 -->分<!-- /react-text --></span><span class="jibie fn-hide"><!-- react-text: 102 -->0<!-- /react-text --><!-- react-text: 103 -->A级景区<!-- /react-text --></span></div><div class="distance-origin "><span class="juli ">距市中心32.5km</span><span class="originPrice originPrice-none"><del class="">￥</del></span></div><div class="biao-price "><span class="biao">动植物园</span><span class="biao2">可订今日</span><div class="price "><i class="money ">￥</i><span class="realprice ">60</span><span class="qi ">起</span></div></div></div>');
	// _sceneryDiv.append(_infoDiv);

	// _containDiv.append(_sceneryDiv);
	// _contentDiv.append(_containDiv);
	_viewDiv.append(_contentDiv);

	return _viewDiv;

}

/******************     门票列表对象   ********************/


/******************     城市对象   ********************/
function HCity(){
	this.name = 'HCity',
	this.cityJsonUrl = "../addons/wqtgd_jiudian/template/mobile/data/cityJson.json",
	this.letterDtPositions = [],
	this.rightNavPositions = [],
	this.city_list_ul_bottom = 0
}

/*显示搜索城市*/
HCity.prototype.showSearchCity = function(jsonArr, val, publicFunctionTool){

	var _arr =[];

	var _searchMatchDiv = $('.search-match');
	var _contentDiv = $('<div class="ej-scroll-view-content">');
	var input_content = val.substring(0, 1).toLowerCase();
	var _reg = new RegExp("[\\u4E00-\\u9FFF]+","g");

	if(_reg.test(input_content)){

			$.each(jsonArr.result, function(pIndex, pItem){
				$.each(pItem["city"], function(cIndex, cItem){
					var first_text = cItem["name"].substring(0,1);
					if(input_content.indexOf(first_text) != -1){
						var _cityAndPrivince = '';
						if(pItem["name"] == cItem["name"]){
							_cityAndPrivince = cItem["name"];
						}else{
							_cityAndPrivince = cItem["name"] + "," + pItem["name"];
						}						
						var _a = $('<a class="item ej-tag-a" onclick="chooseCityD(this)"><span class="">'+ _cityAndPrivince +'</span></a>');
						_contentDiv.append(_a);

						_arr.push(_cityAndPrivince);
					}
				});
			});

	}else{

		$.each(jsonArr.result, function(pIndex, pItem){
				$.each(pItem["city"], function(cIndex, cItem){
					var first_text = makePy(cItem["name"])[0].toLowerCase().substring(0,1);
					if(input_content.indexOf(first_text) != -1){
						var _cityAndPrivince = '';
						if(pItem["name"] == cItem["name"]){
							_cityAndPrivince = cItem["name"];
						}else{
							_cityAndPrivince = cItem["name"] + "," + pItem["name"];
						}						
						var _a = $('<a class="item ej-tag-a" onclick="chooseCityD(this)"><span class="">'+ _cityAndPrivince +'</span></a>');
						_contentDiv.append(_a);

						_arr.push(_cityAndPrivince);
					}
				});
			});

		defaultArr.push(_arr);

	}

	_searchMatchDiv.find('.list').append(_contentDiv);

	publicFunctionTool.openSearchList({

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

	var _items = _searchMatchDiv.find('.ej-scroll-view-content').children();
	if(_items.length == 0){

		// setTimeout(function(){

			_searchMatchDiv.find('.ej-scroll-view-content').remove();

			_searchMatchDiv.find('.no-data').removeClass('fn-hide');


		// }, 255);

	}

	$.each(_searchMatchDiv.find('.ej-scroll-view-content'), function(index, item){

		if(index != 0){

			$(item).remove();

		}
		
	});

}

/*改变搜索状态*/
HCity.prototype.changeSearchStatus = function($elems, cfg, type){

	switch(type){

		case 0:

			if($elems[0] != '')
				$elems[0].addClass(cfg.fnHide);
			if($elems[1] != '')
				$elems[1].removeClass(cfg.fnHide);
			$elems[2].addClass(cfg.show);
			$elems[3].addClass(cfg.bgShow);

		break;

		case 1:
			if($elems[1] != '')
				$elems[1].addClass(cfg.fnHide);
			if($elems[0] != '')
				$elems[0].removeClass(cfg.fnHide);
			$elems[2].removeClass(cfg.show);
			$elems[3].removeClass(cfg.bgShow);

		break;

	}

	
}

/*选择城市*/
HCity.prototype.chooseCity = function($elem, city){

	$elem.text(city);

}

/*设置城市信息*/
HCity.prototype.setCityData = function(getCityData, closeAnim){

	var _elems = [
		$('h3:contains("当前位置")')[0],
		$('h3:contains("热门城市")')[0]
	];
	this.getIndexNavPosition(_elems, this.letterDtPositions);

	getCityData(this.cityJsonUrl, this.getIndexNavPosition, this.letterDtPositions, this.chooseCity, closeAnim);

}

/*获取右边导航栏元素坐标*/
HCity.prototype.getIndexNavPosition = function($elems, positions){

	var that = this;

	$.each($elems, function(index, item){

		var _position = {};

		_position.text = $(item).text();
		_position.top = $(item).offset().top - 667;
		_position.height = $(item).outerHeight();

		positions.push(_position);

	})

}

/*索引定位*/
HCity.prototype.indexLocation = function(position){

	var that = this;
	var _y = position[1];

	$.each(that.rightNavPositions, function(index, item){

		if(_y >= item.top && _y <= (item.top + item.height)){

			$.each(that.letterDtPositions, function(lIndex, lItem){

				if(lItem.text.indexOf(item.text) != -1){

					var _scrollDiv = $('h3:contains("当前位置")').parent().parent();
					_scrollDiv.scrollTop((lItem.top - 150));

				}

			})

		}

	})

}

/******************     城市对象   ********************/



/******************     异步请求对象    ********************/
function AsyRequest(){
	this.name = 'AsyRequest',
	this.isLoading = true,
	this.hideDivP = $($('.ej-router-layer')[0]).next(), // 隐藏的 div 的父节点
	this.innerticksDetailTool = new TicketsDetail(),
	this.innerInterFaceAnimTool = new InterFaceAnim(),
	this.innerPublicFunctionTool = new PublicFuction(),
	this.innerDateInterfaceTool = new DateInterface(),
	this.innerBtnStatesTool = new BtnStates();
}

/*获取门票详情数据*/
AsyRequest.prototype.getTicketData = function(arg, imgUrl, obj, foc, cfg, loading){

	 var that = this;

	 switch(cfg.type){

	 	case 0:

	 		$.post(arg, obj, function(data){
	 			var _contentDiv = $('.dn').next().find('.ej-scroll-view-content');
	 			_contentDiv.children('.load-more-tip').remove();
				console.log(data);

				$('.dn').removeClass('filterNoDataShow');
				if(data.length == 0 && !isPull){

					$('.dn').addClass('filterNoDataShow');
					isPull = false;

				}

				if(loading){

					loading.addClass('fn-hide');

				}

				for(var i=0;i<data.length;i++){

				 	var _containDiv = foc(data[i], imgUrl);
				 	_contentDiv.append(_containDiv);

				}



				nDivHight = $('.dn').next().height() + 1;
				_contentDiv.append($('<p class="load-more-tip more-tip-show ">稍等一小会，发现更多</p>'));

				if(cfg.upScrollLoad != undefined){

					cfg.upScrollLoad();

				}

				that.isLoading = true;

				var _nScrollHight = $('.dn').next()[0].scrollHeight;  
				var _nScrollTop = $('.dn').next()[0].scrollTop;

				if(data.length == 0 || _nScrollTop < _nScrollHight){

					_contentDiv.children('.load-more-tip').addClass('fn-hide');
				    // that.isLoading = false;

				}
				
			},'json');

	 	break;


	 	case 1:

	 		 $.post(arg ,obj ,function(data){

			  	   console.log(data);
				   foc(data, imgUrl, that.innerticksDetailTool);

				   if(loading){

				   		loading.addClass('fn-hide');

				   }

				   	//设置日期
					$('.bookingtime').text(
						that.innerPublicFunctionTool.GetDateStr(1)
						);

				   //设置景点图片界面的图片
				   var _viewphotoduo = data.viewphotoduo.split(',');
		   			that.innerticksDetailTool.createViewPhotoDuo($('.photos'), {
		   				imgUrl: imgUrl,
		   				viewphotoduo: _viewphotoduo
		   			});	


		   			// 打开景点特色界面
				   $('.scenery-special-header').bind('click', function(e){

				   		that.innerticksDetailTool.createScenicFeatures(cfg.objs[0], data);
				   		setTimeout(function(){
							that.innerInterFaceAnimTool.openTicksAnim(cfg.objs[0], cfg.objs[1], {
								text: data.viewname,
								className1: 'ej-css-1g',
								className2: 'ej-css-1a',
								num: 1 
							});

						}, 50);

				   });

				   //打开景点图片界面
				   $('.cover-container').bind('click', function(e){

				   		e.stopPropagation();
				   		e.preventDefault();

				   		var _cfg = {
							openStyle1: {
								'webkitTransform':'translateX(0px)',
								'transform':'translateX(0px)'
							},
							openStyle2: {
								'webkitTransform':'translateX(0px)',
								'transform':'translateX(0px)'
							}
						}

				   		var _$elems = [
							$($(that.hideDivP.children()[1]).children()[1]),
							$(that.hideDivP.children()[1])
							];

				   		that.innerInterFaceAnimTool.openAnim(_$elems, _cfg);

				   });

				   //关闭景点图片界面
				   $('.photos').parent().children('.close').bind('click', function(e){

				   		e.stopPropagation();
				   		e.preventDefault();

				   		var _cfg = {
							closeStyle1: {
								'webkitTransform':'translateX(' + $(window).width() + 'px)',
								'transform':'translateX(' + $(window).width() + 'px)'
							},
							closeStyle2: {
								'webkitTransform':'translateX(10000px)',
								'transform':'translateX(10000px)'
							}
						}

						var _$elems = [
										$('.photos').parent().parent(), 
										$('.photos').parent().parent().parent()
										];

						that.innerInterFaceAnimTool.closeAnim(_$elems, _cfg);

				   });

				   //跳转到评论界面
				   $('.comment-header').bind('click', function(e){

				   		var _url = $('#url').attr('viewevalist') + '&viewid=' + data.id;

				   		window.location.href = _url;

				   });

				   //打开日期界面
				   $($('.bookingbtn')[2]).bind('click', function(e){

				   		var _openDate = this;

				   		e.stopPropagation();
				   		e.preventDefault();

				   		if(!isOpening){

				   			isOpening = true;

				   			isHide = true;

					   		that.innerDateInterfaceTool.createInterface(
					   			$($('.ej-router-layer')[1]),
					   			{
					   			  price: $(this).prev().find('.money').text().substr(1),
					   			  booking: $(_openDate).attr('booking')
					   			}
					   			);

					   		setTimeout(function(){

								closePlayData();

								that.innerInterFaceAnimTool.openTicksAnim($($('.ej-router-layer')[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
									className: 'ej-navbar-hide',
									hide: true,
									num: 1 
								});

								isOpening = false;

							}, 50);

					   		//关闭日期界面
					   		$('.calendermanage').find('.back-btn').bind('click', function(e){

					   			e.stopPropagation();
					   			e.preventDefault();

					   			pageNum--;

					   			isHide = false;

					   			that.innerInterFaceAnimTool.closeTicksAnim($($('.ej-router-layer')[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
									className: 'ej-navbar-hide',
									hide: true,
									num: pageNum
								});

					   		});

					   		//选择游玩日期
					   		$($('.calender-scroll')[0]).find('.ej-tag-a').bind('click', function(e){

					   			e.stopPropagation();
					   			e.preventDefault();

					   			if(that.innerDateInterfaceTool.playDay != 0 && $(this).attr('class').indexOf('start') == -1){

					   				var _startA = $($('.calender-scroll')[0]).find('.start');

					   				_startA.children('.day').text(that.innerDateInterfaceTool.playDay);

					   				that.innerBtnStatesTool.resetBtn({
						   				$elem: _startA,
						   				addClass: 'enable',
						   				removeClass: 'start'
						   			});

					   			}

					   			if($(this).attr('class').indexOf('disable') == -1){

					   				that.innerDateInterfaceTool.chooseDate($(this));

					   			}

					   			if($(this).attr('class').indexOf('start') != -1){

									openBookingInterface(true);

					   				//设置日期
									var _date = $(this).attr('date');
									$('.choose_date_value').text(
										_date + 
										'  ' +
										that.innerDateInterfaceTool.getWeekFromDate(_date.replace(/-/g, "/"))
										 );

					   				setTimeout(function(){

										closePlayData();

										that.innerInterFaceAnimTool.openTicksAnim($($('.ej-router-layer')[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
											text: '填写订单',
											className: 'ej-navbar-hide',
											className1: 'ej-css-z',
											className2: 'ej-css-23',
											hide: true,
											num: 2 
										});

									}, 50);

					   			}

					   		});

				   		}

				   		

				   });

				   /*打开订票界面*/
				   function openBookingInterface(isOpen){

				   		if(isFromSearch){

				   			pageNum++;

				   		}

						that.innerticksDetailTool.createEditOrder($($('.ej-router-layer')[1]),{
							ticketTitle: $('.dateChooseView').children('.titleView').text(),
							ticketPrice: $('.dateChooseView').find('.money').text().substr(1),
							ticketnum: $($('.bookingbtn')[1]).attr('ticketnum'),
							credit1: $($('.bookingbtn')[1]).attr('credit1'),
							credit2: $($('.bookingbtn')[1]).attr('credit2')
						});

						//设置日期
						$('.choose_date_value').text(
							$($('.bookingbtn')[1]).find('.bookingtime').text() + '  ' +
							$($('.bookingbtn')[1]).find('.bookingDay').text()
							);

						//打开日期界面
						$('.choose_date_value').bind('click', function(e){

							e.stopPropagation();
							e.preventDefault();

							var _cfg = {
								openStyle1: {
									'webkitTransform':'translateY(44px)',
									'transform':'translateY(44px)'
								},
								openStyle2: {
									'webkitTransform':'translateX(0px)',
									'transform':'translateX(0px)'
								}
							}

					   		var _$elems = [
								$($(hideDivP.children()[2]).children()[1]),
								$(hideDivP.children()[2])
								];

					   		that.innerInterFaceAnimTool.openAnim(_$elems, _cfg);

						});


						//关闭日期界面1
						$(hideDivP.children()[2]).find('.tips').bind('click', function(e){

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
									$($(hideDivP.children()[2]).children()[1]),
									$(hideDivP.children()[2])
									];

							that.innerInterFaceAnimTool.closeAnim(_$elems, _cfg);	

						});

						//关闭日期界面2
						$($(hideDivP.children()[2]).children('div')[0]).bind('click', function(e){

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
									$($(hideDivP.children()[2]).children()[1]),
									$(hideDivP.children()[2])
									];

							that.innerInterFaceAnimTool.closeAnim(_$elems, _cfg);	

						});

						//提交订单
						$('.submit-fill-order').bind('click', function(e){

							e.stopPropagation();
							e.preventDefault();

							var _$nameInput = $($('.itemContainer')[0]).children('input');
							var _$telInput = $($('.itemContainer')[1]).children('input');

							var _name = _$nameInput.val();
							var _tel = _$telInput.val();

							//验证名字输入
							that.innerPublicFunctionTool.Verification(_$nameInput, {
								text: _name,
								className: 'input-field-warning',
								placeholder: '姓名应在2~27个字以内，且不包含数字和标点符号',
								type: 0
							});

							//验证手机输入
							that.innerPublicFunctionTool.Verification(_$telInput, {
								text: _tel,
								className: 'input-field-warning',
								placeholder: '手机号不能为空',
								placeholder2: '手机号格式不正确',
								type: 1
							});

							if(_$nameInput.attr('class').indexOf('input-field-warning') != -1 ||
								_$telInput.attr('class').indexOf('input-field-warning') != -1)
								return;

							that.submit({
								$bookingbtn: $($('.bookingbtn')[1]),
								$url: $('#url')
							},	
								data
							);

						});

						var _ticketNum = $($('.bookingbtn')[1]).attr('ticketnum');
						_ticketNum = _ticketNum>10?10:_ticketNum;
						//设置购买数量input框数据
						$('.number_input').blur(function(){

							var _value = parseInt($(this).val());

							var _ticketPrice = parseFloat($('.price_tag').next().text());
							var _totalPrice = '';
							var $totalPrice = $('#wborderprice');

							if($(this).val() == ''){

								_value = 1;
								$(this).attr('value', _value);
								$(this).val(_value);
								$('.minus-enable').addClass('minus-disable');
								$('.plus-enable').removeClass('plus-disable');

								// _totalPrice = '￥' + _ticketPrice;
								$totalPrice.text(_totalPrice);

								return;

							}

							if ($(this).val().indexOf('.') != -1) {

								_value = parseInt($(this).val());
								$(this).attr('value', _value);
								$(this).val(_value);

							}

							if(_value <= 0 || _value > _ticketNum){

								_value = 1;
								$(this).attr('value', _value);
								$(this).val(_value);
								$('.minus-enable').addClass('minus-disable');
								$('.plus-enable').removeClass('plus-disable');

							}else if(_value == _ticketNum){

								$('.minus-enable').removeClass('minus-disable');
								$('.plus-enable').addClass('plus-disable');

								$(this).attr('value', _value);

							}else{

								$(this).attr('value', _value);
								$('.minus-enable').removeClass('minus-disable');

							}

							_totalPrice = (_ticketPrice * parseFloat($('.number_input').val()));
							$totalPrice.text(_totalPrice);

						});

						//增加购买数量
						$('.plus-enable').bind('click', function(e){

							e.stopPropagation();
							e.preventDefault();

							var _value = parseInt($(this).prev().attr('value'));

							if(_value < _ticketNum){

								_value++;

								$(this).prev().attr('value', _value);
								$(this).prev().val(_value);
								$('.minus-enable').removeClass('minus-disable');

								var _ticketPrice = $('.price_tag').next().text();
								var _totalPrice = $('#wborderprice').text();
								_totalPrice =(parseFloat(_ticketPrice) + parseFloat(_totalPrice));
								$('#wborderprice').text(_totalPrice);

								// that.innerticksDetailTool.addPassengerItemContainer();

								if(_value == _ticketNum){

									$(this).addClass('plus-disable');

								}

							}

						});

						//减少购买数量
						$('.minus-enable').bind('click', function(e){

							e.stopPropagation();
							e.preventDefault();

							var _value = parseInt($(this).next().attr('value'));

							if(_value > 1){

								_value--;

								$(this).next().attr('value', _value);
								$(this).next().val(_value);
								$('.plus-enable').removeClass('plus-disable');

								var _ticketPrice = $('.price_tag').next().text();
								var _totalPrice = $('#wborderprice').text();
								_totalPrice =(parseFloat(_totalPrice) - parseFloat(_ticketPrice));
								$('#wborderprice').text(_totalPrice);

								//$($('.passengerItemContainer')[$('.passengerItemContainer').length-1]).remove();

								if(_value == 1){

									$(this).addClass('minus-disable');

								}

							}

						});					

						//打开 常用旅客编辑 界面
						$('.passenger_value_container').bind('click', function(e){

							e.stopPropagation();
							e.preventDefault();

							that.innerticksDetailTool.createPassengerEditor($($('.ej-router-layer')[1]));
							setTimeout(function(){

								that.innerInterFaceAnimTool.openTicksAnim($($('.ej-router-layer')[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
									text: '常用旅客编辑',
									className1: 'ej-css-z',
									className2: 'ej-css-23',
									num: 2
								})

						}, 50);


						});

						if(isOpen == undefined){

							setTimeout(function(){

								closePlayData();

								that.innerInterFaceAnimTool.openTicksAnim($($('.ej-router-layer')[1]), $('.ej-navbar>.ej-navbar-layer:last-child'), {
									text: '填写订单',
									className1: 'ej-css-z',
									className2: 'ej-css-23',
									num: 1 
								});


							}, 50);

						}

				   }

				   //打开订票界面
					$($('.bookingbtn')[1]).bind('click', function(e){

						e.stopPropagation();
						e.preventDefault();

						openBookingInterface();

					});

			 },'json');

	 	break;

	 	case 2:



	 	break;

	 }

	 

}

/*提交订单*/
AsyRequest.prototype.submit = function($elems, jsonObj){

	var _url = 
	$elems.$url.attr('submit-url') + 
	'&tickeid=' + $elems.$bookingbtn.attr('tickeid') + 
	'&credit1=' + $elems.$bookingbtn.attr('credit1') + 
	'&credit2=' + $elems.$bookingbtn.attr('credit2') +
	'&num=' + $('.number_input').val() + 
	'&ticketprice=' + $('.price_tag_container').children('.ticketPrice').text() + 
	'&totalprice=' + $('#wborderprice').text() + 
	'&username=' + $($('.itemTitleText')[0]).next().val() + 
	'&usertel=' + $($('.itemTitleText')[1]).next().val() + 
	'&ticketname=' + $('.ticketTitle').text() + 
	'&viewid=' + jsonObj.id +
	'&viewname=' + jsonObj.viewname + 
	'&viewphoto=' + jsonObj.viewphoto +
	'&time=' + $elems.$bookingbtn.children('.bookingtime').text() +
	'&ordername=' + $('#url').attr('ordername')
	;

	// console.log(_url);

	window.location.href = _url;

}

/*获取国内城市*/
AsyRequest.prototype.getCityData = function(url, getIndexNavPosition, letterDtPositions, chooseCity, closeAnim){

	$.getJSON(url, function(data){
		$.each(data.result, function(pIndex, pItem){
			$.each(pItem["city"], function(cIndex, cItem){

				var first_text = makePy(cItem["name"])[0].substring(0,1);
				
				var _dd = $('<dd onclick="chooseCityD(this)">').append($('<a class="ej-tag-a"><span class="">'+ cItem["name"].replace('市', '') +'</span></a>'));
				$('.indexs>dt:contains('+ first_text +')').after(_dd);

			});
		});

		getIndexNavPosition($('.indexs>dt'), letterDtPositions);

	});

}

/*获取国内城市景点（搜索版）*/
AsyRequest.prototype.getCityOrViewSpotDataS = function(obj, val, url){

	var that = this;

	if(url == undefined){

		$.getJSON(hCityTool.cityJsonUrl, function(data){

			console.log(data);

			obj.showSearchCity(data, val, that.innerPublicFunctionTool);

		});

	}else{

		$.post(url,{"value":val},function(data){
			console.log(data);

			if(data == null)
				data = [];

			obj.showSearchCityAndViewSpot(data, val);

		},'json');

	}

}

AsyRequest.prototype.post = function(url, obj, loading){

	var that = this;

	 $.post(url ,obj ,function(data){

	 	console.log(data);

	 	if(data.length > 0){

	 		that.innerPublicFunctionTool.createHotAndRecItems(data);
	 		
	 	}

	 	if(loading){

	 		loading.addClass('fn-hide');

	 	}

	 },'json');

}

/**
 * [getHSVievSpotOrThemeData 获取热搜景点或主题数据]
 * @param  {string} url     [请求路径]
 * @param  {object} arg     [请求参数]
 * @param  {jqueryObject} $elem   [设置数据的标签]
 * @return {null}         []
 */
AsyRequest.prototype.getHSVievSpotOrThemeData = function(url, arg, $elem){

	var that = this;

	 $.post(url ,arg ,function(data){

	 	console.log(data);

	 	$elem.children('.list-container').remove();
	 	if(data.length > 0){

	 		
	 		that.innerPublicFunctionTool.createHSVievSpotOrThemeItem(data, $elem);
	 		$elem.children('.no-result-tip').addClass('no-result-tip-hide');
	 		
	 	}else{

	 		$elem.children('.no-result-tip').removeClass('no-result-tip-hide');

	 	}

	 },'json');

}

/******************     异步请求对象    ********************/



/******************     界面动画对象    ********************/
function InterFaceAnim(){

	this.name = 'InterFaceAnim';

}

/*打开界面方法*/
InterFaceAnim.prototype.openAnim = function($elems, cfg){

	if(cfg.maskshow == undefined){

		$elems[0].css(cfg.openStyle1);
		$elems[1].css(cfg.openStyle2);
		$elems[0].bind('webkitTransitionEnd', function(){
			$elems[1].css(cfg.openStyle2);
			$elems[0].unbind('webkitTransitionEnd');
		});
		$elems[0].bind('transitionEnd', function(){
			$elems[0].css(cfg.openStyle2);
			$elems[0].unbind('transitionEnd');
		});

	}else{

		$elems[0].addClass(cfg.maskshow);
		$elems[1].removeClass(cfg.fnhide);

	}

}

/*关闭界面方法*/
InterFaceAnim.prototype.closeAnim = function($elems, cfg, closeSearchListD){

	if(cfg.maskshow == undefined){

		$elems[0].css(cfg.closeStyle1);

		var _$elems = [
			$($('.cancel')[0]).prev(),
			$($('.cancel')[0]),
			$(hideDivP.children()[0]).find('.search-match'),
			$(hideDivP.children()[0]).find('.bg')
		];

		$elems[0].bind('webkitTransitionEnd', function(){
			$elems[1].css(cfg.closeStyle2);
			$elems[0].unbind('webkitTransitionEnd');

			if(closeSearchListD != undefined && typeof closeSearchListD === "function"){

				closeSearchListD($('.search-match'), _$elems);

			}

		});
		$elems[0].bind('transitionEnd', function(){
			$elems[1].css(cfg.closeStyle2);
			$elems[0].unbind('transitionEnd');

			if(closeSearchListD != undefined && typeof closeSearchListD === "function"){

				closeSearchListD($('.search-match'), _$elems);

			}
			
		});

	}else{

		$elems[0].removeClass(cfg.maskshow);
		$elems[1].addClass(cfg.fnhide);

	}

	
}

/*打开界面方法*/
InterFaceAnim.prototype.openTicksAnim = function($layerDiv, $navbarDiv, cfg){
	pageNum++;

	if(cfg.hide == undefined){

		$navbarDiv.addClass('ej-navbar-layer-animate');
		$navbarDiv.children().children('.ej-tag-title').text(cfg.text);

		$($layerDiv.children()[pageNum-1]).removeClass('ej-router-current').addClass('ej-router-prev');
		$($layerDiv.children()[pageNum]).removeClass('ej-router-next').addClass('ej-router-current');
		$($layerDiv.children()[pageNum]).bind('webkitTransitionEnd', function(){
			$navbarDiv.removeClass('ej-navbar-layer-animate');
			$navbarDiv.children().removeClass(cfg.className1).addClass(cfg.className2);
			// this.unbind('webkitTransitionEnd');
		});
		$($layerDiv.children()[1]).bind('transitionEnd', function(){
			$navbarDiv.removeClass('ej-navbar-layer-animate');
			$navbarDiv.children().removeClass(cfg.className1).addClass(cfg.className2);
			// this.unbind('transitionEnd');
		});

	}else{

		if(cfg.text != undefined){

			$navbarDiv.removeClass(cfg.className);
			$navbarDiv.addClass('ej-navbar-layer-animate');
			$navbarDiv.children().children('.ej-tag-title').text(cfg.text);

			$($layerDiv.children()[pageNum-1]).removeClass('ej-router-current').addClass('ej-router-prev');
			$($layerDiv.children()[pageNum]).removeClass('ej-router-next').addClass('ej-router-current');
			$($layerDiv.children()[pageNum]).bind('webkitTransitionEnd', function(){
				$navbarDiv.removeClass('ej-navbar-layer-animate');
				$navbarDiv.children().removeClass(cfg.className1).addClass(cfg.className2);
				// this.unbind('webkitTransitionEnd');
			});
			$($layerDiv.children()[1]).bind('transitionEnd', function(){
				$navbarDiv.removeClass('ej-navbar-layer-animate');
				$navbarDiv.children().removeClass(cfg.className1).addClass(cfg.className2);
				// this.unbind('transitionEnd');
			});

		}else{

			$($layerDiv.children()[pageNum-1]).removeClass('ej-router-current').addClass('ej-router-prev');
			$($layerDiv.children()[pageNum]).removeClass('ej-router-next').addClass('ej-router-current');

			$navbarDiv.addClass(cfg.className);

		}

	}

}

/*关闭界面方法*/
InterFaceAnim.prototype.closeTicksAnim = function($layerDiv, $navbarDiv, cfg){

	if(cfg.hide == undefined){

		$navbarDiv.addClass('ej-navbar-layer-animate');
		$navbarDiv.children().children('.ej-tag-title').text('');
		$navbarDiv.children().children('.ej-tag-title').append(cfg.text);

		$($layerDiv.children()[cfg.num]).removeClass('ej-router-prev').addClass('ej-router-current');
		$($layerDiv.children()[cfg.num+1]).removeClass('ej-router-current').addClass('ej-router-next');
		$($layerDiv.children()[cfg.num+1]).bind('webkitTransitionEnd', function(){
			$navbarDiv.removeClass('ej-navbar-layer-animate');
			$navbarDiv.children().removeClass(cfg.className2).addClass(cfg.className1);
			// this.unbind('webkitTransitionEnd');
			this.remove();
		});
		$($layerDiv.children()[cfg.num+1]).bind('transitionEnd', function(){
			$navbarDiv.removeClass('ej-navbar-layer-animate');
			$navbarDiv.children().removeClass(cfg.className2).addClass(cfg.className1);
			// this.unbind('transitionEnd');
			this.remove();
		});

	}else{

		if(cfg.text != undefined){

			$navbarDiv.addClass(cfg.className);

			$navbarDiv.addClass('ej-navbar-layer-animate');
			$navbarDiv.children().children('.ej-tag-title').text('');
			$navbarDiv.children().children('.ej-tag-title').append(cfg.text);

			$($layerDiv.children()[cfg.num]).removeClass('ej-router-prev').addClass('ej-router-current');
			$($layerDiv.children()[cfg.num+1]).removeClass('ej-router-current').addClass('ej-router-next');
			$($layerDiv.children()[cfg.num+1]).bind('webkitTransitionEnd', function(){
				$navbarDiv.removeClass('ej-navbar-layer-animate');
				$navbarDiv.children().removeClass(cfg.className2).addClass(cfg.className1);
				// this.unbind('webkitTransitionEnd');
				this.remove();
			});
			$($layerDiv.children()[cfg.num+1]).bind('transitionEnd', function(){
				$navbarDiv.removeClass('ej-navbar-layer-animate');
				$navbarDiv.children().removeClass(cfg.className2).addClass(cfg.className1);
				// this.unbind('transitionEnd');
				this.remove();
			});

		}else{

			$($layerDiv.children()[cfg.num]).removeClass('ej-router-prev').addClass('ej-router-current');
			$($layerDiv.children()[cfg.num+1]).removeClass('ej-router-current').addClass('ej-router-next');
			
			$navbarDiv.removeClass(cfg.className);

			$($layerDiv.children()[cfg.num+1]).bind('webkitTransitionEnd', function(){
			
				this.remove();
			});
			$($layerDiv.children()[cfg.num+1]).bind('transitionEnd', function(){
				
				this.remove();

			});

		}

	}

}

/*弹出筛选框*/
InterFaceAnim.prototype.filterBox = function($mask, $elem, $thisElem, texts, height){

	var _className = $elem.attr('class').split(' ')[0] + 'show';

	if($mask.attr('class').indexOf('maskshow') == -1){

		$mask.addClass('maskshow');
		$elem.addClass(_className);
		$thisElem.removeClass('arrow-down arrow').addClass('arrow-up');

		if(height != undefined){

			$elem.attr('style', height);

		}

	}else{

		$mask.removeClass('maskshow');
		$elem.removeClass(_className);
		$elem.attr('style', "");

		if($thisElem.text().indexOf(texts[0]) == 0 || $thisElem.text().indexOf(texts[1]) == 0){

			$thisElem.removeClass('arrow-up').addClass('arrow-down');

		}else{

			$thisElem.removeClass('arrow-up').addClass('arrow-down arrow');

		}

	}

}

/*重置筛选框*/
InterFaceAnim.prototype.resetFilterBox = function($arrowUp, $mask, $elems){

	if($arrowUp.text().indexOf('距离') != -1 || $arrowUp.text().indexOf('排序') != -1 || $arrowUp.text().indexOf('主题筛选') != -1){

		$arrowUp.removeClass('arrow-up').addClass('arrow-down');

	}else{

		$arrowUp.removeClass('arrow-up').addClass('arrow-down arrow');

	}
	
	$mask.removeClass('maskshow');
	$.each($elems, function(index, $item){

		var _text = $item.attr('class').split(' ')[1];
		if(_text != undefined){

			$item.removeClass(_text);
			$item.attr('style', '');

		}

	});

}

/******************     界面动画对象    ********************/



/******************     按钮状态对象    ********************/
function BtnStates(){

	this.name = 'BtnStates';

}

/*重置按钮状态*/
BtnStates.prototype.resetBtn = function(cfg){

	if(cfg.$elem != undefined || cfg.$elem != ''){

		cfg.$elem.removeClass(cfg.removeClass).addClass(cfg.addClass);

	}

}

/*filterBar列表项设置*/
BtnStates.prototype.filterBarItemSet = function(texts, $a){

	if(texts[0].indexOf(texts[1]) != 0){

		$a.addClass('arrow');

	}else{

		$a.text(texts[2]);

	}

}

/*筛选列表项状态重置*/
BtnStates.prototype.filterListItemReset = function($ul, type){

	switch(type){

		case 0:

			$ul.find('.check').removeClass('check');

			$.each($ul.children('li'), function(index, item){

				$(item).removeClass('on');

			});

		break;

		case 1:
		case 2:

			$.each($ul.children('li'), function(index, item){

				$(item).removeClass('on');

			});

		break;

	}
	

}

/*选择筛选列表项*/
BtnStates.prototype.filterListItemChoose = function($li, $ul, type){

	this.filterListItemReset($ul, type);
	var _text = '';

	switch(type){

		case 0:

			$li.addClass('on');
			$li.children('.radiobox').children('div').addClass('check');
			_text = $li.text();

		break;

		case 1:
		case 2:

			$li.addClass('on');
			_text = $li.text();

		break;

	}

	$('.filterbar').find('.arrow-up').text(_text);
	
}

/******************     按钮状态对象    ********************/



/*门票页面工具对象*/
var adTicketTools = {

	/*工具工厂方法*/
 toolsFactory : function(toolsName){

    var tool = ""; 
	
	if(toolsName.indexOf('InterFaceAnim') == 0){  //界面动画对象

		tool = new InterFaceAnim();

	}else if(toolsName.indexOf('HCity') == 0){ //城市对象

		tool = new HCity();

	}else if(toolsName.indexOf('AsyRequest') == 0){ //异步请求对象

		tool = new AsyRequest();

	}else if(toolsName.indexOf('TicketsList') == 0){ //门票列表对象

		tool = new TicketsList();

	}else if(toolsName.indexOf('TicketsDetail') == 0){ //门票列表对象

		tool = new TicketsDetail();

	}else if(toolsName.indexOf('BtnStates') == 0){ //按钮状态对象

		tool = new BtnStates();

	}else if(toolsName.indexOf('DateInterface') == 0){ //日期对象

		tool = new DateInterface();

	}else if(toolsName.indexOf('PublicFuction') == 0){ //公共方法对象

		tool = new PublicFuction();

	}else if(toolsName.indexOf('GetLocationC') == 0){ //定位方法对象

		tool = new GetLocationC();

	}

	return tool;
 }

}
