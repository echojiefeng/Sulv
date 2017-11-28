var html = $('.android');

//获取界面动画对象
var interFaceAnimTool = hotelTools.toolsFactory('InterFaceAnim');
//获取日期界面对象
var dateInterfaceTool = hotelTools.toolsFactory('DateInterface');
//获取日期界面对象
var btnResetTool = hotelTools.toolsFactory('BtnReset');
//获取异步请求对象
var asyRequestTool = hotelTools.toolsFactory('AsyRequest');

//启动 FastClick
FastClick.attach(document.body);

$(".hotel-list-header>.icon").bind("click", function(e){
	e.stopPropagation();
	e.preventDefault();
	window.history.go(-1);
})

var hotelList = sessionStorage["hotelList"].split(";");
var has_load = false;  //是否能上拉加载
if(hotelList.length >= 10){
	has_load = true;
}
// console.log(has_load);
var stayTime = sessionStorage["stayTime"].split(",");

var checkin = dateFormat(stayTime[0]);
var checkout = dateFormat(stayTime[1]);

/*入住离开时间格式化方法*/
function dateFormat(arg){
	var _mouth = arg.split("-")[1];
	var _day = arg.split("-")[2];

	// if( parseInt(_mouth) < 10 ){
	// 	var _mouth = "0" + _mouth;
	// }

	// if(parseInt(_day) < 10){
	// 	var _day = "0" + _day;
	// }

	return _mouth + "-" + _day;
}

//设置入住酒店日期信息
$(".indate").attr("data-value", stayTime[0]).text(checkin);
$(".outdate").attr("data-value", stayTime[1]).text(checkout);
$(".total").text(stayTime[2]).append("<i></i>");

//设置城市名
$(".city").text(sessionStorage["city"]);

//如果酒店没有数据通知用户
console.log(hotelList[0]);
if(hotelList[0].indexOf("SQL") != -1 || hotelList[0] == ''){
	$(".nomore").attr("style", "display: none;");
	$(".list-noresult").attr("style", "display: block;");
}

//打开关闭筛选框
var scrollAction = {x: 'undefined', y: 'undefined'};
var myScrollEvent=function(elem){
	if(elem.scrollTop() > 700){//显示回到顶部按钮
		$(".list-top").attr("style", "display: block;");
	}else{//隐藏回到顶部按钮
		$(".list-top").attr("style", "display: none;");
	}

	if (scrollAction.y == 'undefined') {
		scrollAction.y = elem.scrollTop();
	}
	var diffY = scrollAction.y - elem.scrollTop();
	// console.log(diffY);
	if (diffY < 0) {
    				// Scroll down
    				if(elem.scrollTop() > 95){
    					$(".search-field").removeClass("showout").addClass("hidein");
    				}
    			} else if (diffY > 0) {
   					 // Scroll up
   					 if($(".search-field").attr("class").indexOf("hidein") != -1){
   					 	$(".search-field").removeClass("hidein").addClass("showout");
   					 }

   					}

   					scrollAction.y = elem.scrollTop();

   				}
   		//上拉加载
		var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)  
        var nScrollTop = 0;   //滚动到的当前位置  
        var nDivHight = $(".page-content").height();  
   			// 监听酒店事件列表滚动
   			$(".page-content").scroll(function () {

				// console.log('bottom!!');
				myScrollEvent($(this));
				//上拉加载
				nScrollHight = $(this)[0].scrollHeight;  
				nScrollTop = $(this)[0].scrollTop;  
				if(nScrollTop + nDivHight >= nScrollHight)  
					loadMoreHotel($(".nomore").children());					
			});

			//回到顶部
			$(".backtop").bind("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				$(".page-content").scrollTop(0);
			})
			var sc_url = $("#hotel_url").attr("data-url");  //七牛路径
			// console.log(sc_url);
			/*创建酒店列表项标签方法*/
			function creatHotelItem(hotelList,num){

				$.each(hotelList, function(index, item){
					if(num == 0){
						item = JSON.parse(item);
					}
					var hotel_price = parsePriceNum(item.price);
					var hotel_type = parseTypeNum(item.hoteltype);
					var hotel_photo = "";
					if(item["hotelphotoDuo"] != ""){
						hotel_photo = sc_url + "/" + item["hotelphoto"];
					}else{
						hotel_photo = item["hotelphoto"];
					}

					var hotel_item = $("<li onclick='inRoomList(this)' class='hotel-item' id='{$roomlist}'/>");
				//图片
				hotel_item.append($("<div class='pic'><img src=" + hotel_photo + "></div>"));
				//中间内容
				var info_div = $("<div class='info'/>");
				info_div.append($("<p class='name'> <em>" + item.hotelname + "</em>  </p>"));
				//info_div.append($("<p class='comt'>  <span class='comt_no'><b>4.8</b>分</span>   <span class='comt_nmb'>385条点评</span>  </p>"));
				info_div.append($("<p class='fac'> <span>" + hotel_type + "</span>  </p>"));
				info_div.append($("<p class='district' style='margin-top:5px;'>  <span class='d1'>" + item.dzB + "</span>   <span class='d3'>" + item.dzC + "</span>   </p>"));
				// console.log(sessionStorage['searchState']);
				if ( sessionStorage['searchState'] == '1' || sessionStorage['searchState'] == "-1" || sessionStorage['searchState'] == "0") {
					info_div.append($("<p class='district' style='margin-top:5px;'>  <span class='d1'>商圈</span>   <span class='d3'>" + item.business + "</span>   </p>"));
				}else{
					//<p class="district">  <span class="d1">广州</span>   <span class="d3">海珠区</span>   </p>
					info_div.append($("<p class='district' style='margin-top:5px;'><span class='d2' style='border-left: 0px; padding-left: 0px;'>距离" + stringFormat(sessionStorage['position'], item.metro) + '  ' + stringFormat(sessionStorage['position'],item.station) +"</span> </p>"));
				}

				function stringFormat(format, str){
					var str_list = str.split(',');
					var text = '';
					// console.log(str.indexOf(format));
					$.each(str_list, function(index, item){
						if(item.indexOf(format) != -1){
							var _km = item.split('-')[0] + '公里';
							var _addr = item.split('-')[1];
							text = _addr + _km;
						}
					});
					return text;
				}

				//右边内容
				var right_wrap_div = $("<div class='right-wrap'/>");
				var r_tab = $("<div class='r-tab'/>");
				//小恒恒
				if(item.price == "0" || item.price == ''){
					
					r_tab.append($("<p class='pri'> <b>  </b> <span><i></i>" + "暂无房型" + "</span> </p>"));
				}else{
					r_tab.append($("<p class='pri'> <b>  </b> <span><i></i><font style='font-size: 12px'>￥ </font>" + item.price  + "</span> </p>"));
				}				
				//r_tab.append($("<p class='tags'>   <span style='color:#ff5555;border:1px solid #ff5555'>APP新客折扣</span>    <span style='color:#FF5555;border:1px solid #FF5555'>返</span>    </p>"));
				right_wrap_div.append(r_tab);

				hotel_item.append(right_wrap_div);
				hotel_item.append(info_div);
				$(".hotel-list").append(hotel_item);

			})

			}

//调用创建酒店列表项标签方法
// creatHotelItem(hotelList);
// creatHotelItem(hotelList);
// creatHotelItem(hotelList);
// creatHotelItem(hotelList);
// creatHotelItem(hotelList);
// creatHotelItem(hotelList);
// creatHotelItem(hotelList);
if(hotelList[0] != '')
	creatHotelItem(hotelList, 0);

if(!has_load){
	$(".nomore>p").text("没有更多酒店了");
}

//点击加载更多
$(".nomore").bind("click", function(e){
	e.preventDefault();
	e.stopPropagation();
	if(has_load){
		loadMoreHotel($(this).children());
	}
})

/*加载更多酒店数据*/
function loadMoreHotel(elem){
	elem.addClass("moretext");
	elem.text("正在加载更多酒店");


	HotelRefresh = $('#lujin').attr('HotelRefresh');
	$.post(HotelRefresh,function(data){
		// console.log(data);
		if(data["message"] == undefined){
			creatHotelItem(data, 1);
			elem.removeClass("moretext");
			elem.text("点击加载更多酒店");
		}else{
			elem.removeClass("moretext");
			elem.text("没有更多酒店了");
			has_load = false;
		}

	},'json');
	


}

/*解析酒店价格数字*/
function parsePriceNum(num){

	var hotel_price = "";

	switch(num){
		case '1': hotel_price = "0-150";break;
		case '2': hotel_price = "150-300";break;
		case '3': hotel_price = "300-450";break;
		case '4': hotel_price = "450-700";break;
		case '5': hotel_price = "700以上";break;
	}

	return hotel_price;
}

/*解析酒店类型数字*/
function parseTypeNum(num){

	var hotel_type = "";

	switch(num){
		case '1': hotel_type = "商务型";break;
		case '6': hotel_type = "舒适型";break;
		case '7': hotel_type = "豪华型";break;
		case '3': hotel_type = "三星级";break;
		case '4': hotel_type = "四星级";break;
		case '5': hotel_type = "五星级";break;	
	}

	return hotel_type;
}


// 点击酒店列表项，跳转到相应房型界面
function inRoomList(elem){

	var hotel_name = $(elem).children(".info").children(".name").children().text();
	var hotel_url = $("#hotel_url").val();

	// console.log(hotel_url);
	var _checkin = $($(".cld>.page-content>.cld-item>ul>li[class*='active']")[0]).attr("data-day");
	// if(_checkin == undefined)
	// 	_checkin = stayTime[0];

	var _checkout = $($(".cld>.page-content>.cld-item>ul>li[class*='active2']")[0]).attr("data-day");
	// if(_checkout)
	// 	_checkout = stayTime[1];

	var _checkday = $(".total").text().substr(0, $(".total").text().length-1);
	
	window.location.href = hotel_url +  hotel_name + "&checkin=" + _checkin + "&checkout=" + _checkout + "&checkday=" + _checkday;

}

//打开酒店名称选择酒店列表
$(".sea-box").bind("click", function(e){
	e.preventDefault();
	e.stopPropagation();
	$(".list-pop-city").removeClass("page-on-right").addClass("plugin-show page-on-center");
	$(".list-pop-city").attr("style", "position:fixed;");
})
//关闭酒店名称选择酒店列表
$("#nearHotel").bind("click", function(e){
	e.preventDefault();
	e.stopPropagation();
	interFaceAnimTool.closeAnim(html, $('.list-pop-city'), "plugin-show page-on-center", "page-on-right", hotelTools.CITY);
})

//选择酒店
$(".keyword-group>.keyword-list>ul>li[type-id='5']").bind("click", function(e){
	e.preventDefault();
	e.stopPropagation();
	var _cityname = $(this).attr("name-cn");
	//调用筛选城市方法
	screenCity(_cityname);
	interFaceAnimTool.closeAnim(html, $('.list-pop-city'), "plugin-show page-on-center", "page-on-right", hotelTools.CITY);
	// console.log($(this).attr("name-cn"));
})
/*筛选城市*/
function screenCity(cityname){
	var _citylist = $(".hotel-list>li");
	$.each(_citylist, function(index, item){
		var _cityname = $(item).children(".info").children(".name").children("em").text();
		if(_cityname.indexOf(cityname) == -1){
			$(item).attr("style", "display: none;");
		}else{
			$(item).attr("style", "display: block;");
		}
		// console.log($(item).children(".info").children(".name").children("em").text());
	});
	// console.log(_citylist);
}


/*入住日期界面*/
		//打开入住日期界面
		$('.sea-date').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			// 启动打开界面动画
			interFaceAnimTool.openAnim(html, $('.cld'), "cld-active plugin-show", "");
		})
		//关闭入住日期界面
		$('#chooseDate').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			//启动关闭动画
			interFaceAnimTool.closeAnim(html, $('.cld'), "cld-active plugin-show", "", hotelTools.DATE);
		})
		//创建日期列表
		dateInterfaceTool.createDateList(1, true);
		dateInterfaceTool.createDateList(2, false);
		dateInterfaceTool.createDateList(3, false);
		dateInterfaceTool.createDateList(4, false);
		dateInterfaceTool.createDateList(5, false);
		dateInterfaceTool.createDateList(6, false);
		//重置日期界面按钮
		btnResetTool.resetDateBtn($(".cld-item").children("ul").children("li"), dateInterfaceTool.setDataItemStyle);
		//初始化日期参数
		dateInterfaceTool.init(stayTime[0].replace(/-/g, "/"), stayTime[1].replace(/-/g, "/"));
		//初始化日期界面
		dateInterfaceTool.setDateInterface($(".cld-item"));
		//选择入住离开时间
		$(".cld-day>li").bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			dateInterfaceTool.chooseDate(html, $(this), "cld-active plugin-show", hotelTools.DATE, 1);
		})

		//搜索
	
	function sou(obj) {

		var indexSou = $('#lujin').attr('indexSou');
		var souInput = $('#souInput').val();
		if (souInput != '') {
			searchHotel(souInput);
		}
	}

	
	//quan();
	
	/*按条件搜索酒店*/
	function searchHotel(condition){

		//酒店列表
		var _hotelList = $('ul[name="hotellan"]').children();
		btnResetTool.setItemState(_hotelList, condition);

		//商圈列表
		var _business = $('ul[name="business"]').children();
		btnResetTool.setItemState(_business, condition);

		//机场、车站列表
		var _station = $('ul[name="station"]').children();
		btnResetTool.setItemState(_station, condition);

		//地铁站列表
		var _metro = $('ul[name="metro"]').children();
		btnResetTool.setItemState(_metro, condition);

	}

	$('.keyword-group').css('display', 'none');

	function quan() {

		if($($('.list-noresult')[0]).css('display') != 'block'){

			$('.keyword-group').css('display', 'block');

			diz = $('.city').text();//地址
			var cfg = {'dzB':diz,'rb':sessionStorage["rb"],'rc':sessionStorage["rc"]};//参数

			//酒店名
			var business = $('#lujin').attr('business');
			asyRequestTool.hotelListPost(
				business,
				cfg,
				setLiEvent,
				btnResetTool.ergodicSetStyle,
				"[name='business']",
				1
				);

			//商圈
			var Hotellan = $('#lujin').attr('Hotellan');
			asyRequestTool.hotelListPost(
				Hotellan,
				cfg,
				setLiEvent,
				btnResetTool.ergodicSetStyle,
				"[name='hotellan']",
				0
				);

			//地铁站
			var hotelmetro = $('#lujin').attr('hotelmetro');
			asyRequestTool.hotelListPost(
				hotelmetro,
				cfg,
				setLiEvent,
				btnResetTool.ergodicSetStyle,
				"[name='metro']",
				2
				);
			
			//机场/车站
			var hotelstation = $('#lujin').attr('hotelstation');
			asyRequestTool.hotelListPost(
				hotelstation,
				cfg,
				setLiEvent,
				btnResetTool.ergodicSetStyle,
				"[name='station']",
				2
				);

		}

	}


	function setLiEvent($elem, num){
			$.each($elem, function(index, item){
				$(item).bind('click', function(){
					// $(".sea-box>input").attr("value",$(this).text());
					sb($(item));
					//调用重置按钮样式方法2
					btnResetTool.selectedBtn(".keyword-list>ul>li");
					$(this).addClass("on");
					$(".sea-box").parent().addClass("on");
					interFaceAnimTool.closeAnim(html, $('.list-pop-city'), "plugin-show page-on-center", "page-on-right", hotelTools.CITY);
					sessionStorage["searchState"] = num;

					btnResetTool.resetItemState();

				})
			})

			var _length = $elem.length;
			$($elem[_length-1]).unbind();
			btnResetTool.closeList($($elem[_length-1]));
			$($elem[_length-2]).unbind();
			btnResetTool.openList($($elem[_length-2]));
		}

	function sb($elem) {
		$('.hotel-list').empty();

		var Hotel = $('#lujin').attr('Hotel');//手机列表地址
		var cityName = $('.city').text();
		var checkInTime = $('.indate').attr('data-value');
		var checkOutTime = $('.outdate').attr('data-value');
		var hotelNameOrAddress = $elem.attr('name-cn');
		var roomPrice = '0';
		var roomType = '0';
		var day = $('.total').text().substr(0, $('.total').text().length-1);

		var cfg = {'cityname':cityName,'checkin':checkInTime,'checkout':checkOutTime,'hotelNameOrAddress':hotelNameOrAddress,'price':roomPrice,'roomType':roomType,'day':day};

		asyRequestTool.hotelListPost(
			Hotel,
			cfg,
			null,
			null,
			null,
			1,
			creatHotelItem
		);
	}
		
		