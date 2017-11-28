/******************     异步请求对象    ********************/
function AsyRequest(){
	this.name = 'AsyRequest'
}

/*首页post请求*/
AsyRequest.prototype.firstPagePost = function(url, cfg, Hotellist){
	$.post(url,cfg,function(data){
		sessionStorage["hotelList"] ="";
		$.each(data, function(index, item) {
			if(getLocationCTool.isLocation){
				if(item["hotelaccuracy"] != ""){
					var _lng = item["hotelaccuracy"].split("-")[0];
					var _lat = item["hotelaccuracy"].split("-")[1];
					if(getLocationCTool.isPointInCircle(_lng, _lat)){
						sessionStorage["hotelList"] +=  ";" + JSON.stringify(item);
						//alert(2);
					}
				}
			}else{
				sessionStorage["hotelList"] +=  ";" + JSON.stringify(item);
			}
			
		});
		// alert(2);
		sessionStorage["hotelList"] = sessionStorage["hotelList"].substr(1);
		 // console.log(sessionStorage["hotelList"]);
		// console.log(sessionStorage["hotelList"]);
		window.location.href = Hotellist;
		// console.log(sessionStorage["hotelList"]);
	},'json');
}

/*酒店列表post请求*/
AsyRequest.prototype.hotelListPost = function(url, cfg, setLiEvent, ergodicSetStyle, condition, num, creatHotelItem){

	var _ul = $('ul'+condition).children('li');

	$.post(url,cfg,function(data){
		// console.log(creatHotelItem);
			if(creatHotelItem == undefined){
				$("*"+condition).html(data);

				setLiEvent($('ul'+condition).children('li'), num);
				ergodicSetStyle($('ul'+condition).children('li'));
			}else{
				creatHotelItem(data, num);
			}

			if($('ul'+condition).children('li').length <= 3){

				$('ul'+condition).parent().parent().css('display', 'none');

			}

	},'json');
}

/******************     异步请求对象    ********************/

/******************     城市对象    ********************/
function HCity(){
	this.name = 'HCity',
	this.cityJsonUrl = "../addons/wqtgd_jiudian/template/mobile/data/cityJson.json",
	this.city_list_ul_bottom = 0,
	this.page_search_div = $(".advance-city>.page-search"), //搜索的城市列表
	this.page_select_div = $(".advance-city>.page-select"), //城市列表
	this.innerBtnResetTool = new BtnReset();  //内置按钮重置对象
	this.innerInterFaceAnim = new InterFaceAnim(); //内置界面动画对象
}

/*搜索匹配*/
HCity.prototype.searchMatch = function(elems, value, className, type){

	var _index = value.length - 1;
	var input_content = value.substring(_index).toLowerCase();
	var _reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
	//console.log(makePy(item)[0].toLowerCase().substring(cfg.index, cfg.index + 1));

	if(_reg.test(input_content)){

		$.each(elems, function(index, item){

			var _cFN = $(item).text().replace(',', '');
			var _cityFirstName = _cFN.substr(_index,_index).substr(0,1);
			if(_cityFirstName != input_content && type == 0){

				$(item).addClass(className);

			}else if(_cityFirstName == input_content && type == 0
				&& value == _cFN.substr(0,_index+1)){

				$(item).removeClass(className);

			}else if(_cityFirstName == input_content && type == 1){

				if(_cFN.substr(0, _index+1) == value)
					$(item).removeClass(className);

			}

		});

	}else{

		$.each(elems, function(index, item){

			var _cFN = $(item).text().replace(',', '');
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

}

/*城市初始设置*/
HCity.prototype.cityInitSetup = function($city, $chooseCity){
	$city.text($chooseCity.text());
	$city.attr("addr", $chooseCity.text());
}

/*打开关闭搜索城市列表*/
HCity.prototype.setCitySearchList = function(elem1, elem2, isSearch){
	if(isSearch){
		elem1.attr("style", "display:block");
		elem2.attr("style", "display:none");
	}else{
		elem1.attr("style", "display:none");
		elem2.attr("style", "display:block");
	}
}

/*选择城市*/
HCity.prototype.chooseCity = function(elem, clearInput){
	$(".cityname").text(elem.text().replace (/市/, ''));
	$(".cityname").attr("addr", elem.text().replace (/市/, ''));
	this.innerBtnResetTool.selectedBtn(".city-list>ul>li");
	elem.parent().addClass("on");
	this.innerInterFaceAnim.closeAnim(html, $(".advance-city"), "plugin-show page-on-center", "", 0);
	getLocationCTool.isLocation = false;
	quan();
	clearInput($('.sea-box').next());
	clearInput($('.price-star-btn').next());

	sessionStorage['positionM'] = '';
	sessionStorage['lngM'] = '';
	sessionStorage['latM'] = '';

	return false;
}


/*创建城市搜索列表*/
HCity.prototype.creatCitySearchList = function(elem){
	
}

/*搜索城市列表项绑定的点击方法*/
HCity.prototype.citySearchItem = function(elem, clearInput){
	$(".cityname").text(elem.getAttribute("city-name").replace(/市/, ""));
	$(".cityname").attr("addr", $(elem).text().replace (/市/, ''));
	this.page_search_div.attr("style", "display:none");
	this.page_select_div.attr("style", "display:block");
	//调用重置按钮样式方法2
	this.innerBtnResetTool.selectedBtn(".city-list>ul>li");
	//启动关闭界面动画
	this.innerInterFaceAnim.closeAnim(html, $(".advance-city"), "plugin-show page-on-center", "", 0);
	this.setCitySearchList(this.page_search_div, this.page_select_div, false);
	getLocationCTool.isLocation = false;
	quan();
	clearInput($('.sea-box').next());
	clearInput($('.price-star-btn').next());
	
	return false;
}

/*字母搜索城市*/
HCity.prototype.letterSearchCity = function($elem){
	
}



/******************     城市对象    ********************/


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


/*坐标获取地址腾讯版*/
GetLocationC.prototype.getAddrTX = function(lat, lng, e){

	var that = this;

	  geocoder = new qq.maps.Geocoder({
	    complete:function(result){
	    	
	    	var _address = result.detail.address;
	    	if(isAddr){
	    		$(".cityname").text(_address.split('市')[1]);
	    		that.isLocation = true;
	    	}else{
	    		that.isLocation = false;
	    		$(".cityname").text(_address.substr(_address.indexOf('省')+1).split('市')[0]);
	    	}
		    that.city = _address.substr(_address.indexOf('省')+1).split('市')[0] + '市';
	        that.b = '';
	        that.c = _address.split('市')[1].split('区')[0] + '区';
	        that.lng = lng;
	        that.lat = lat;
	        $(".cityname").attr("addr", that.city.split('市')[0]);
	        sessionStorage['positionM'] =  that.city.substr(0, that.city.length-1);
	        sessionStorage['lngM'] = lng;
	        sessionStorage['latM'] = lat;

	        quan();

	        e.hideLoading();

	    }
	});
	var coord=new qq.maps.LatLng(lat, lng);
	geocoder.getAddress(coord);

}

/*地址解析成坐标*/
GetLocationC.prototype.addrFormatPoint = function(addr){
	var that = this;
	// 百度地图API功能
	var map = new BMap.Map("allmap");
	// 创建地址解析器实例
	var myGeo = new BMap.Geocoder();
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint(addr, function(point){
		if (point) {
			that.lng = point.lng;
			that.lat = point.lat;
			console.log(point.lng + " , " + point.lat);
		}else{
			alert("您选择地址没有解析到结果!");
		}
	}, "");

	$('#allmap').remove();

}

/*定位方法*/
GetLocationC.prototype.getLocation = function(e, getToHotelList){
	var that = this;

	// alert('定位');
	var geolocation = new BMap.Geolocation();

		if(navigator.onLine){

			 geolocation.getCurrentPosition(function (r) {
	            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
	      			
	                // console.log(r.point.lng + " ， " + r.point.lat);

	              	that.lng = r.point.lng;
	                that.lat = r.point.lat;

	                that.getAddr(r.point.lng, r.point.lat, e, getToHotelList);
	                
	            }

	        });

		}else{

			 e.hideLoading();
			 alert('请检查网络是否可用！');
		}

}

/*获取地址方法*/
GetLocationC.prototype.getAddr = function(lon, lat, e, getToHotelList){
	  var that = this;
	  var map = new BMap.Map("allmap");
      var point = new BMap.Point(lon, lat);
      var gc = new BMap.Geocoder();
      gc.getLocation(point, function(rs){
      var addComp = rs.addressComponents;
       // console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
       var addBusiness = '';
       //alert(rs.business == "");
       if(rs.business != ""){
       		if(rs.business.split(',').length > 1){
       			addBusiness = rs.business.split(',')[1];
       		}else{
       			addBusiness = rs.business;
       		}
       		$(".cityname").text(addBusiness);
       }else{
       		$(".cityname").text(addComp.district+addComp.street);
       }
     
       // console.log(lon + "  " + lat);
       
       that.city = addComp.city;
       that.b = '';
       that.c = addComp.district;
       $(".cityname").attr("addr", that.city.replace (/市/, ''));
       that.isLocation = true;

       quan();

       e.hideLoading();

       if(getToHotelList != undefined){
       		getToHotelList();
       }

     });
}

/*判断是否在半径内*/
GetLocationC.prototype.isPointInCircle = function(lng, lat){

	 var point = new BMap.Point(this.lng, this.lat);
   
      var mPoint = new BMap.Point(lng, lat);

      var circle = new BMap.Circle(mPoint, 14000)

      return  BMapLib.GeoUtils.isPointInCircle(point,circle);
}


/******************     界面动画对象    ********************/
function InterFaceAnim(){
	this.name = 'InterFaceAnim';
}

/*打开界面方法*/
InterFaceAnim.prototype.openAnim = function($html, $interface, addClassName, removeClassName, $maskLayer){
	$html.attr("style","overflow:hidden");
	$interface.addClass(addClassName);
	if (removeClassName != "") {
		$interface.removeClass(removeClassName);
	}
	if($maskLayer != undefined){
		$maskLayer.attr("style", "display: block;");
	}
	$interface.attr("style","position:fixed;");
}

/*关闭界面方法*/
InterFaceAnim.prototype.closeAnim = function($html, $interface, removeClassName, addClassName, givenObject, $maskLayer, setCitySearchList){
	//console.log(givenObject);
	switch(givenObject){

		case 0:
		$interface.animate({left:'100%'}, 200, function(){
			$interface.removeClass(removeClassName);
			if(addClassName != ""){
				$interface.addClass(addClassName);
			}
			$interface.attr("style", "position:absolute;");
				//清空input框
				$interface.children(".bar").children(".search-input1").children("input").val("");
				if(setCitySearchList != undefined){
					//清空搜索的城市列表
					setCitySearchList($interface.children(".page-search"), $interface.children(".page-select"), false);
				}
			
			});
		break;

		case 1:
		$interface.animate({top:'100%'}, 200, function(){
			$interface.removeClass(removeClassName);
			if(addClassName != ""){
				$interface.addClass(addClassName);
			}
			$interface.attr("style", "");
		});
		break;

		case 2:
		if($maskLayer != undefined){
			$maskLayer.attr("style", "display: none;");
		}
		$interface.removeClass(removeClassName);
		$interface.attr("style", "");
		break;

		case 3:
		$interface.animate({left:'100%'}, 200, function(){
			$interface.removeClass(removeClassName);
			if(addClassName != ""){
				$interface.addClass(addClassName);
			}
			//$interface.attr("style", "position:absolute;");
			
			});
		break;

	}

	$html.attr("style", "");
}
/******************     界面动画对象    ********************/


/******************     日期界面对象    ********************/
function DateInterface(){

	this.name = 'DateInterface';

	this.this_date = new Date();
	this.this_day = this.this_date.getDate();

	this.is_next_month = false;
	this.checkOut = true; //离开

	this.checkInDate = 0; //入住时间
	this.checkInTime = "";//入住时间毫秒值
	this.checkin_date = "";
	this.checkin_month = "";
	this.checkin_day = "";

	this.checkOutDate = 0; //离开时间
	this.checkOutTime = "";//离开时间毫秒值
	this.checkout_date = "";
	this.checkout_month = "";
	this.checkout_day = "";

	this.checkInObj		//入住对象
	this.checkOutObj; 	//离开对象
	

	this.this_li = "";
	this.next_li = "";

	this.innerBtnResetTool = new BtnReset();  //内置按钮重置对象
	this.innerInterFaceAnim = new InterFaceAnim(); //内置界面动画对象

}

/*初始化日期参数*/
DateInterface.prototype.init = function(stayTime0, stayTime1){
	this.checkin_date = new Date(stayTime0);
	this.checkout_date =  new Date(stayTime1);

	this.checkin_month = this.checkin_date.getMonth() + 1;
	this.checkin_day = this.checkin_date.getDate();
	if(isNaN(this.checkin_month)){
		this.checkin_month = this.this_date.getMonth() + 1;
		this.checkin_day = this.this_date.getDate();
	}

	this.checkout_month = this.checkout_date.getMonth() + 1;
	this.checkout_day = this.checkout_date.getDate();
	if(isNaN(this.checkout_month)){
		var next_date = new Date();
		next_date.setDate(next_date.getDate()+1);
		this.checkout_month = next_date.getMonth() + 1;
		this.checkout_day = next_date.getDate();
	}

}

/*初始化日期界面*/
DateInterface.prototype.setDateInterface = function($cld_item){
	var that = this;
	$cld_item.each(function(sIndex, sItem){

		var _mouth = new Date($(sItem).children(".cld-titleDate").text().replace("年", "/").replace("月", "/") + "1").getMonth() + 1;

            //入住
            if(that.checkin_month == _mouth){
            	$(sItem).children("ul").children("li").each(function(lIndex, lItem){
            		var _day = 0;
            		if($(this).children(".date-elem").text() != '' && !isNaN($(this).children(".date-elem").text()) && $(this).children(".date-elem").text() != undefined){
            			_day = parseInt($(this).children(".date-elem").text());
            		}else{
            			_day = parseInt($(this).find(".festival").text());
            		}
            		if(_day == that.checkin_day){
            			that.intoDate($(this), _day, "入住", 0);
            			that.this_li = $(this);
            			that.checkInTime = new Date($(this).attr("data-day").replace(/-/g, "/")).getTime();
            		}

            	})
            }
            //离店
            if(that.checkout_month == _mouth){
            	$(sItem).children("ul").children("li").each(function(lIndex, lItem){
            		var _day = 0;
            		if($(this).children(".date-elem").text() != '' && !isNaN($(this).children(".date-elem").text()) && $(this).children(".date-elem").text() != undefined){
            			_day = parseInt($(this).children(".date-elem").text());
            		}else{
            			_day = parseInt($(this).find(".festival").text());
            		}
            		if(_day == that.checkout_day){
            			that.intoDate($(this), _day, "离店", 1);
            			that.next_li = $(this);
            			that.checkOutTime = new Date($(this).attr("data-day").replace(/-/g, "/")).getTime();
            		}

            	})


            }
            that.setBetweenInAndOutStyle(that.checkInTime,that.checkOutTime);
        })
}

/*改变日期界面样式*/
DateInterface.prototype.intoDate = function(arg, day, text, num){
	arg.empty();
	if(num == 0){
		arg.addClass("active");
	}else{
		arg.addClass("active2");
	}
	arg.append("<div><span class='active'>" + day + "</span><span class='activeText'>" + text + "</span></div>");
}

/*创建日期列表*/
DateInterface.prototype.createDateList = function(arg, is_this_month){
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
			// var this_day = this_date.getDate();
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

			var dataInterface = $(".cld>.page-content");
			var section = $("<section class = 'cld-item'></section>");
			var h1 = $("<h1 class = 'cld-titleDate'></h1>").text(this_year + "年" + this_month + "月");
			var ul = $("<ul class = 'cld-day'></ul>");
			for(var i = 0;i < this_week;i++){
				li = $("<li></li>");
				ul.append(li);
			}
			for(var i = 1;i <= day;i++){
				if( day == this.this_day && is_this_month){
					this.is_next_month = true;
				}
				var li;
				if(i < this.this_day && is_this_month){
					li = $("<li class = 'disabled'><span class='date-elem'>" + i + "</span></li>");
				}else{
					this_month = this_month + '';
					i = i + '';
					if(this_month.length<2){
						this_month = '0' + this_month;
					}
					if(i.length<2){
						i = '0' + i;
					}
					var data_day = this_year + "-" + this_month + "-" + i;
					if(i == this.this_day && is_this_month){
						var div = $("<div><span class='active'>" + i + "</span><span class='activeText'>入住</span></div>");
						li = $("<li class = 'active'></li>").append(div);
					}else if((i - this.this_day) == 1 && is_this_month){
						var div = $("<div><span class='active'>" + i + "</span><span class='activeText'>离店</span></div>");
						li = $("<li class = 'active2' id = 'checkOut'></li>").append(div);
					}else{
						//li =_subElem = $("<span class='date-elem'>" + num + "</span>");
						li = $('<li></li>');
						li.append(this.setDataItemStyle(data_day, i));	
					}
					li.attr("data-day", data_day);			
				}
				ul.append(li);
			}
			section.append(h1);
			section.append(ul);
			dataInterface.append(section);
		}

		/*设置节日样式*/
		DateInterface.prototype.setDataItemStyle = function(data, num){
			var _data = data.substr(5);
			var _calendar = data.split('-');

			var _calendarObj = calendar.solar2lunar(parseInt(_calendar[0]), parseInt(_calendar[1]), parseInt(_calendar[2]));
			var _calendarData = _calendarObj.lMonth + '-' + _calendarObj.lDay;

			var _isCalendar = false;
			var _subElem;

			switch(_calendarData){
				case '12-31':
					_subElem = $('<div><span class="festival">'+ num +'</span><span class="festivalText">除夕</span></div>');
					_isCalendar = true;
				break;

				case '1-1':
					_subElem = $('<div><span class="festival">'+ num +'</span><span class="festivalText">春节</span></div>');
					_isCalendar = true;
				break;

				case '1-5':
					_subElem = $('<div><span class="festival">'+ num +'</span><span class="festivalText">元宵节</span></div>');
					_isCalendar = true;
				break;

				case '5-5':
					_subElem = $('<div><span class="festival">'+ num +'</span><span class="festivalText">端午节</span></div>');
					_isCalendar = true;
				break;

				case '7-7':
					_subElem = $('<div><span class="festival">'+ num +'</span><span class="festivalText">七夕</span></div>');
					_isCalendar = true;
				break;

				case '7-7':
					_subElem = $('<div><span class="festival">'+ num +'</span><span class="festivalText">七夕</span></div>');
					_isCalendar = true;
				break;

				case '8-15':
					_subElem = $('<div><span class="festival">'+ num +'</span><span class="festivalText">中秋节</span></div>');
					_isCalendar = true;
				break;

				case '9-9':
					_subElem = $('<div><span class="festival">'+ num +'</span><span class="festivalText">重阳节</span></div>');
					_isCalendar = true;
				break;

				default:
					_subElem = $("<span class='date-elem'>" + num + "</span>");

			}

			if(_isCalendar){
				return _subElem;
			}

			switch(_data){

				case '1-1':
					_subElem = $('<div><span class="festival">1</span><span class="festivalText">元旦节</span></div>');
				break;

				case '2-14':
					_subElem = $('<div><span class="festival">14</span><span class="festivalText">情人节</span></div>');
				break;

				case '3-8':
					_subElem = $('<div><span class="festival">8</span><span class="festivalText">妇女节</span></div>');
				break;

				case '4-5':
					_subElem = $('<div><span class="festival">5</span><span class="festivalText">清明节</span></div>');
				break;

				case '5-1':
					_subElem = $('<div><span class="festival">1</span><span class="festivalText">劳动节</span></div>');
				break;

				case '5-13':
					_subElem = $('<div><span class="festival">13</span><span class="festivalText">母亲节</span></div>');
				break;

				case '6-1':
					_subElem = $('<div><span class="festival">1</span><span class="festivalText">儿童节</span></div>');
				break;

				case '6-17':
					_subElem = $('<div><span class="festival">17</span><span class="festivalText">父亲节</span></div>');
				break;

				case '7-1':
					_subElem = $('<div><span class="festival">1</span><span class="festivalText">建党节</span></div>');
				break;

				case '8-1':
					_subElem = $('<div><span class="festival">1</span><span class="festivalText">建军节</span></div>');
				break;

				case '9-10':
					_subElem = $('<div><span class="festival">10</span><span class="festivalText">教师节</span></div>');
				break;

				case '10-1':
					_subElem = $('<div><span class="festival">1</span><span class="festivalText">国庆节</span></div>');
				break;

				case '12-22':
					_subElem = $('<div><span class="festival">22</span><span class="festivalText">冬至</span></div>');
				break;

				default:
					_subElem = $("<span class='date-elem'>" + num + "</span>");
			}

			return _subElem;
		}

		/*设置下个月状态*/
		DateInterface.prototype.nextMonthState = function(){
			if(this.is_next_month){
			// var _text = $(".cld>.page-content>.cld-item").eq(2).children(".cld-titleDate").text();
			// console.log(_text);
			var date_ul = $(".cld>.page-content>.cld-item").eq(1).children("ul");
			var date_li = $(date_ul[0]).children("li");
			$.each(date_li, function(index, value){
				var _data_day = $(value).attr("data-day");
				if(_data_day != undefined){
					var _day = _data_day.split("-")[2];
					if(_day == 1){
						$(value).empty();
						$(value).attr("class", "active");
						var _div = $("<div><span class='active'>" + 1 + "</span><span class='activeText'>离店</span></div>");
						$(value).attr("id", "checkOut");
						$(value).append(_div);
					}
				}
				
			});

		}
	}

	/*选择日期*/
	DateInterface.prototype.chooseDate = function($html, $cld_day_li, removeClassName, givenObject, saveType){
		var that = this;
		if(this.checkOut){
			var time =new Date($cld_day_li.attr("data-day").replace(/-/g, "/")).getTime() - new Date().getTime();
			if(time > -86400000){
				this.checkInObj = $cld_day_li;
				this.checkInDate = this.parseDateToTime($cld_day_li.attr("data-day").replace(/-/g, "/"));
					//调用清除入住日期按钮样式
					this.innerBtnResetTool.resetDateBtn($(".cld-day>li"), this.setDataItemStyle);
					$cld_day_li.append($("<div><div class='undo-select'><div class='icon-cross'></div></div><span class='active'>" + 
					$cld_day_li.attr("data-day").split("-")[2] + "</span><span class='activeText'>入住</span></div>"));
					$cld_day_li.addClass("active");
					this.setCheckInOrOutItemStyle($cld_day_li);
					
					// $($cld_day_li.children('div')[0]).remove();
					
					// $cld_day_li.addClass("active").children("span").remove();
					
					this.checkOut = false;
					this.innerBtnResetTool.resetDateBtn2($(".cld-day>li"));
				}
			}else if(!this.checkOut){
				this.checkOutObj = $cld_day_li;
				this.checkOutDate = this.parseDateToTime($cld_day_li.attr("data-day").replace(/-/g, "/"));
				var result = this.checkOutDate - this.checkInDate;
				var _checkoutDay = '';
				if(result > 0){
					if($($cld_day_li.children()[0]).children('.festival').length < 1){
						_checkoutDay = $cld_day_li.children(".date-elem").text();
					}else{
						_checkoutDay = $cld_day_li.children("div").children('.festival').text();
					}
					$cld_day_li.append($("<div><span class='active'>" + _checkoutDay + "</span><span class='activeText'>离店</span></div>"));
					$cld_day_li.addClass("active2");
					this.setCheckInOrOutItemStyle($cld_day_li);
					// $cld_day_li.addClass("active2").children("span").remove();
					this.checkOut = true;
					//调用保存入住离开时间方法
					if(saveType == 0){
						this.saveCheckInAndOutDate(this.checkInObj, this.checkOutObj);
					}else if(saveType == 1){
						this.saveCheckInAndOutDateL(this.checkInObj, this.checkOutObj);
					}else if(saveType == 2){
						this.saveCheckInAndOutDateR(this.checkInObj, this.checkOutObj);
					}
					this.setBetweenInAndOutStyle(new Date(this.checkInObj.attr("data-day").replace(/-/g, "/")).getTime(), new Date(this.checkOutObj.attr("data-day").replace(/-/g, "/")).getTime() );
					//启动关闭动画
					var roomlist_url = $("#roomlist_url").val();
					var input_hotelname = $(".input_hotelname").val();
					var input_indate = $(".input_indate").val();
					var input_outdate = $(".input_outdate").val();
					var input_checkday = $(".input_checkday").val();
					setTimeout(function(){
						that.innerInterFaceAnim.closeAnim($html, $(".cld"), removeClassName, "", givenObject);
						window.location.href = roomlist_url + "&hotelname=" + input_hotelname + "&checkin=" + input_indate + "&checkout=" + input_outdate + "&checkday=" + input_checkday;
					}, 300)
					
					
				}else{
					this.checkInObj = $cld_day_li;
					this.checkInDate = this.parseDateToTime($cld_day_li.attr("data-day").replace(/-/g, "/"));
					//调用清除入住日期按钮样式
					this.innerBtnResetTool.resetDateBtn($(".cld-day>li"), this.setDataItemStyle);
					if($($cld_day_li.children()[0]).children('.festival').length < 1){
						_checkoutDay = $cld_day_li.children(".date-elem").text();
					}else{
						_checkoutDay = $cld_day_li.children("div").children('.festival').text();
					}
					$cld_day_li.append($("<div><div class='undo-select'><div class='icon-cross'></div></div><span class='active'>" + 
						_checkoutDay  + "</span><span class='activeText'>入住</span></div>"));
					$cld_day_li.addClass("active");
					this.setCheckInOrOutItemStyle($cld_day_li);
				}
			}
		}

		/*设置入住时间项样式*/
		DateInterface.prototype.setCheckInOrOutItemStyle = function($elem){
			var _length = $($elem.children()[0]).children('.festival').length;
			if(_length == 0){
				$elem.children("span").remove();
			}else{
				$($elem.children('div')[0]).remove();
			}
		}	

		/*设置入住与离开的日期列表项样式*/
		DateInterface.prototype.setBetweenInAndOutStyle = function(in_time, out_time) {
			var date_list = $(".cld>.page-content>.cld-item");
			$.each(date_list, function(sIndex, sItem) {
				var _ul = $(sItem).children(".cld-day").children();
				$.each(_ul, function(index, item) {
					var _li = $(item);
					// console.log(_li);
					if(_li.attr("data-day") != undefined){
						var _time = new Date(_li.attr("data-day").replace(/-/g, "/")).getTime();
				// console.log(_li);
				if(_time > in_time && _time < out_time){
					$(this).addClass("active-during");
				}
			}
		});
			});
		}

		/*日期转化为毫秒值*/
		DateInterface.prototype.parseDateToTime = function(arg){
			return new Date(arg).getTime()
		}

		/*计算天数*/
		DateInterface.prototype.GetDateDiff = function(startDate,endDate){
			var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
			var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
			var dates = Math.abs((startTime - endTime))/(1000*60*60*24);     
			return  dates;    
		}

		/*从日期获取周*/
		DateInterface.prototype.getWeekFromDate = function(date){
			var arr_week = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
			return arr_week[new Date(date).getDay()];
		}

		/*格式化日期*/
		DateInterface.prototype.hFormatDate = function hFormatDate(date){
			return new Date(date).getMonth()+1 + "月" + new Date(date).getDate() + "日";
		}
		/*格式化日期L*/
		DateInterface.prototype.hFormatDateL = function hFormatDateL(date){
			var _mouth = new Date(date).getMonth()+1;
			var _day = new Date(date).getDate();

			if(parseInt(_mouth) < 10){
				_mouth = "0" + _mouth; 
			}
			if(parseInt(_day) < 10){
				_day = "0" + _day; 
			}

			return _mouth + '-' + _day;
		}

		/*日期转化为毫秒值*/
		DateInterface.prototype.parseDateToTime = function(arg){
			return new Date(arg).getTime();
		}

/*保存入住离开时间*/
DateInterface.prototype.saveCheckInAndOutDate = function(c1, c2){
	//入住
	$(".date>.d1>p:last-child>span:first-child").attr("data-value", c1.attr("data-day"));
	$(".date>.d1>p:last-child>span:first-child").text(this.hFormatDate(c1.attr("data-day").replace(/-/g, "/")));
	$(".date>.d1>p:last-child>span:last-child").text(this.getWeekFromDate(c1.attr("data-day").replace(/-/g, "/")));
	//离开
	// console.log(c2.attr("data-day"));
	$(".date>.d3>p:last-child>span:first-child").attr("data-value", c2.attr("data-day"));
	$(".date>.d3>p:last-child>span:first-child").text(this.hFormatDate(c2.attr("data-day").replace(/-/g, "/")));
	$(".date>.d3>p:last-child>span:last-child").text(this.getWeekFromDate(c2.attr("data-day").replace(/-/g, "/")));
	//住多少晚
	var distanceDay = this.GetDateDiff(c1.attr("data-day"), c2.attr("data-day")) + "晚";
	$(".date>.d4").text(distanceDay).append($("<i></i>"));
}

/*保存入住离开时间L*/
DateInterface.prototype.saveCheckInAndOutDateL = function(c1, c2){
	//入住
	$(".indate").text(this.hFormatDateL(c1.attr("data-day").replace(/-/g, "/")));
	//离开
	$(".outdate").text(this.hFormatDateL(c2.attr("data-day").replace(/-/g, "/")));
	//住多少晚
	var distanceDay = this.GetDateDiff(c1.attr("data-day"), c2.attr("data-day")) + "晚";
	$(".total").text(distanceDay).append($("<i></i>"));
} 

/*保存入住离开时间R*/
DateInterface.prototype.saveCheckInAndOutDateR = function(c1, c2){
	 //入住
	 $(".indate").text(c1.attr("data-day"));
	 $(".input_indate").val(c1.attr("data-day"));
            //离开
            $(".outdate").text(c2.attr("data-day"));
			$(".input_outdate").val(c2.attr("data-day"));
            //住多少晚
            var distanceDay = this.GetDateDiff(c1.attr("data-day"), c2.attr("data-day")) + "晚";
            $(".count_nmb").text(distanceDay);
			$(".input_checkday").val(this.GetDateDiff(c1.attr("data-day"), c2.attr("data-day")));

            //保存到 btn-submitde url属性
            var _btn = $(".btn-submit");
            if(_btn.attr("url2") == undefined){
                //alert("还没有房型");
            }
            //var url_arr2 = _btn.attr("url2").split("&");
            // console.log(_btn)
            $.each(_btn, function(index, item){
            	var url_arr2 = $(item).attr("url2").split("&");
            	url_arr2[10] = "checkin=" + c1.attr("data-day");
            	url_arr2[11] = "checkout=" + c2.attr("data-day");
            	url_arr2[12] = "checkday=" + distanceDay.substr(0, distanceDay.length-1);
            	$(item).attr("url2", url_arr2.join("&"));
            })
			
 }
/******************     日期界面对象    ********************/


/******************     按钮重置对象    ********************/
        function BtnReset(){
        	this.name = 'BtnReset';
        }

         /*设置列表项按钮状态*/
         BtnReset.prototype.setItemState = function($elem, condition){
         	if( condition == undefined){
				$.each($elem, function(index, item){
					var _toHide = $(item).attr("to-hide");
					if(_toHide != undefined){
						$(item).removeClass('hide');
						$(item).removeAttr('to-hide');
						$(item).attr('to-hide', '0');
					}
					if(index > 4){
						$(item).addClass('hide');
					}
				});
				if($elem.length > 6){
					$($elem[$elem.length-2]).removeClass('hide').addClass('oOpen');
				}else{
					$($elem[$elem.length-2]).removeClass('oOpen').addClass('hide');
				}
				
			}else{
				$.each($elem, function(index, item){
					var _nameCn = $(item).attr('name-cn');
					if(_nameCn != undefined){
						if(_nameCn.indexOf(condition) != -1){
							$(item).removeClass('hide');
						}else{
							console.log($(item).attr('class'));
							if($(item).attr('class') == undefined){
								$(item).attr('to-hide','0');
							}
							$(item).addClass('hide');
						}
					}else{
						$(item).addClass('hide');
					}	
				});
			}
         }

         /*设置列表项按钮状态*/
          BtnReset.prototype.resetItemState = function(){
          	//酒店列表
			var _hotelList = $('ul[name="hotellan"]').children();
			this.setItemState(_hotelList);

			//商圈列表
			var _business = $('ul[name="business"]').children();
			this.setItemState(_business);

			//机场、车站列表
			var _station = $('ul[name="station"]').children();
			this.setItemState(_station);

			//地铁站列表
			var _metro = $('ul[name="metro"]').children();
			this.setItemState(_metro);
          }

          /*打开列表*/
         BtnReset.prototype.openList = function($elem, num){
         	$elem.bind("click", function(e){
				e.stopPropagation();
				e.preventDefault();
				$(this).siblings().each(function(){
					if($(this).attr("class") != undefined ){
						if($(this).attr("class").indexOf("hide") != -1){
							$(this).removeClass("hide").addClass("oOpen");
					 	}
					}		
				});
				$(this).addClass("hide");
			})
         }

         /*关闭列表*/
         BtnReset.prototype.closeList = function($elem){
         	$elem.bind("click", function(e){
				e.stopPropagation();
				e.preventDefault();
				$(this).siblings().each(function(){
					if($(this).attr("class") != undefined){
						if($(this).attr("class").indexOf("oOpen") != -1){
							$(this).removeClass("oOpen").addClass("hide");
						}
					}
				});
				$(this).addClass("hide");
				$(this).prev().removeClass("hide");
			})
         }

        /*遍历设置样式*/
        BtnReset.prototype.ergodicSetStyle = function($elem){
        	var _length = $elem.length;
			$.each($elem, function(index, item){
				var _outText = $('.sea-box>input').val();
				var _inText = $(item).attr('name-cn');
				if(_outText.indexOf(_inText) == 0 && _outText.length == _inText.length
					){
					$(item).addClass('on');
				}
				if(_length >= 7){
					if(index >= 5){
						$(item).addClass("hide");
					}
				}
			});
			if(_length >= 7){
				$($elem[_length-2]).removeClass('hide');
			}
        }

        /*清除入住日期按钮样式*/
        BtnReset.prototype.resetDateBtn = function(arg, setDataItemStyle){
        	arg.each(function(index, item){
        		var _dayText = $(this).attr('data-day');
        		if($(this).attr("class") != undefined){
        			if($(this).attr("class").indexOf("active") != -1){
        				_dayText = $(this).attr('data-day');
        				$(this).append(setDataItemStyle(_dayText, _dayText.split('-')[2]));
        				if($(this).find('.festival').text() == undefined){
        					$(this).children("div").remove();
        				}else{
        					$($(this).children("div")[0]).remove();
        				}
        				$(this).removeClass("active");
        				$(this).removeClass("active2");
        			}else if($(this).attr("class").indexOf("active2") != -1){
        				_dayText = $(this).attr('data-day');
						//console.log("active2")
						$(this).append(setDataItemStyle(_dayText, _dayText.split('-')[2]));
						if($(this).find('.festival').text() == undefined){
        					$(this).children("div").remove();
        				}else{
        					$($(this).children("div")[0]).remove();
        				}
						$(this).removeClass("active2");
					}
					
				}
			});
        }
        /*清除入住日期按钮样式2*/
        BtnReset.prototype.resetDateBtn2 = function(arg){
        	arg.each(function(index, item){
        		var dayText = "";
        		if($(this).attr("class") != undefined){
        			if($(this).attr("class").indexOf("active-during") != -1){
        				$(this).removeClass("active-during");
        				$(this).children("span:last-child").remove();
        			}

        		}
        	});
        }

        /*重置城市、附近酒店按钮*/
        BtnReset.prototype.selectedBtn = function(arg){
        	$(arg).each(function(index,item){
        		$(this).removeClass("on");
        	});
        }

        /*重置星级、价格按钮样式*/
        BtnReset.prototype.resetPL = function resetPL(arg){
        	$(arg + ">li").each(function(index,item){
        		$(this).removeClass("on");
        	});
        	$(arg + ">li:first-child").addClass("on");
        }
/******************     按钮重置对象    ********************/


/*酒店工具对象*/
 var hotelTools = {
     CITY: 0,
  	 DATE: 1,
     STARANDPRICE: 2,
     COUPON: 3,

 /*工具工厂方法*/
 toolsFactory : function(toolsName){
    var tool = ""; 
	if(toolsName.indexOf('InterFaceAnim') == 0){  //界面动画对象
		tool = new InterFaceAnim();
	}else if(toolsName.indexOf('DateInterface') == 0){ //日期界面对象
		tool = new DateInterface();
	}else if(toolsName.indexOf('BtnReset') == 0){ //按钮重置对象 
		tool = new BtnReset();
	}else if(toolsName.indexOf('GetLocationC') == 0){ //定位对象
		tool = new GetLocationC();
	}else if(toolsName.indexOf('HCity') == 0){ //城市对象
		tool = new HCity();
	}else if(toolsName.indexOf('AsyRequest') == 0){ //异步请求对象
		tool = new AsyRequest();
	}

	return tool;
 }


}
