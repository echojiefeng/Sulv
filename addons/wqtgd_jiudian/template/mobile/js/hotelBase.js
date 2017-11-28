
var html = $('.android');
// var bgback = $('.bgback');

//获取界面动画对象
var interFaceAnimTool = hotelTools.toolsFactory('InterFaceAnim');
//获取日期界面对象
var dateInterfaceTool = hotelTools.toolsFactory('DateInterface');
//获取日期界面对象
var btnResetTool = hotelTools.toolsFactory('BtnReset');
//获取定位对象
var getLocationCTool = hotelTools.toolsFactory('GetLocationC');
//获取城市对象
var hCityTool = hotelTools.toolsFactory('HCity');
//获取异步请求对象
var asyRequestTool = hotelTools.toolsFactory('AsyRequest');

var isAddr = false;

//启动 FastClick
FastClick.attach(document.body);

/*选择城市界面*/
		//打开选择城市界面
		$('.addr>.cityname').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault(); 

			// 启动打开界面动画
			interFaceAnimTool.openAnim(html, $(".advance-city"), "plugin-show page-on-center", "page-on-right");
		})
		//关闭选择城市页面
		$('#city').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault(); 

			//启动关闭界面动画
			interFaceAnimTool.closeAnim(html, $(".advance-city"), "plugin-show page-on-center", "page-on-right", hotelTools.CITY);
			//清空搜索的城市列表
			hCityTool.setCitySearchList(hCityTool.page_search_div, hCityTool.page_select_div, false);
		})
		//选择城市
		$(".city-list>ul>li").bind("click", function(e){
			e.stopPropagation();
			e.preventDefault(); 
			$(".cityname").text($(this).children('span').text());
			getLocationCTool.isLocation = hCityTool.chooseCity($(this).children('span'), clearInput);
			
		})
		hCityTool.cityInitSetup($(".cityname"), $(".hot-city>.city-list>ul>.on>span"));
	
		var page_search_div = $(".advance-city>.page-search"); //搜索的城市列表
		var page_select_div = $(".advance-city>.page-select"); //城市列表
		var city_list_ul_bottom = 0;
		//首字母搜索城市按钮
		$(".letter-list>ul>li").bind("click", function(e){
			e.stopPropagation();
			e.preventDefault(); 

			city_list_ul_bottom = page_select_div.scrollTop();
			$(".city-list-ul").attr("style", "margin-bottom:" + city_list_ul_bottom + "px");

			$(".letter-list>ul>li").removeClass("on");
			$(this).addClass("on");
			var ul = $(".city-list-ul");

			var url = hCityTool.cityJsonUrl;
			var letter = $(this).text();

			ul.empty();
			$.getJSON(url, function(data){
				$.each(data.result, function(pIndex, pItem){
					$.each(pItem["city"], function(cIndex, cItem){
						var first_text =  makePy(cItem["name"])[0].substring(0,1);
						if(letter.indexOf(first_text) != -1){
							//+ "," + pItem["privince"];
							var cityAndPrivince = cItem["name"]; 
							var li = $("<li city-id=" + cItem["id"] + " area-type area-id sug-origin onclick='getLocationCTool.isLocation = hCityTool.chooseCity($(this).children(), clearInput)'><span>" + cityAndPrivince + "</span></li>");
							ul.append(li);
						}
					});
				});

				//增加滚动高度
				page_select_div.scrollTop(405);
				$(".city-list-ul").attr("style", "margin-bottom: 0px");

			});		
			

		})

		var searchType = 0;
		//城市搜索
		$('.advance-city>.bar>.search-input1>input').bind('input propertychange', function() { 
			var ul = $("<ul></ul>");

			var _val = $(this).val();

			if(_val.length > 0 && _val.length <= 1){

				page_search_div.children().remove();

				var url = hCityTool.cityJsonUrl;
				var input_content = $(this).val().substring(0, 1);
				var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
				if(reg.test(input_content)){
				 	hCityTool.setCitySearchList(page_search_div, page_select_div, true);
					$.getJSON(url, function(data){
						$.each(data.result, function(pIndex, pItem){
							$.each(pItem["city"], function(cIndex, cItem){
								var first_text = cItem["name"].substring(0,1);
								if(input_content.indexOf(first_text) != -1){
									var cityAndPrivince = cItem["name"] + "," + pItem["name"];
									var li = $("<li onclick='getLocationCTool.isLocation=hCityTool.citySearchItem(this, clearInput)' city-id='' type='0' city-name=" + cItem['name'] + " keyword='' area-type='' area-id='' sug-origin='0'>" + cityAndPrivince + "<span>城市</span></li>");
									ul.append(li);
								}
							});
						});
					});

					page_search_div.append(ul);
					
				}else{
					hCityTool.setCitySearchList(page_search_div, page_select_div, true);
					$.getJSON(url, function(data){
						$.each(data.result, function(pIndex, pItem){
							$.each(pItem["city"], function(cIndex, cItem){
								var first_text = makePy(cItem["name"])[0].toLowerCase().substring(0,1);
								if(input_content.indexOf(first_text) != -1){
									var cityAndPrivince = cItem["name"] + "," + pItem["name"];
									var li = $("<li onclick='getLocationCTool.isLocation=hCityTool.citySearchItem(this, clearInput)' city-id='' type='0' city-name=" + cItem['name'] + " keyword='' area-type='' area-id='' sug-origin='0'>" + cityAndPrivince + "<span>城市</span></li>");
									ul.append(li);
								}
							});
						});
					});

					page_search_div.append(ul);

				}

			}else if(_val.length == 0){
				hCityTool.setCitySearchList(page_search_div, page_select_div, false);
			}else{

				var _arr = [];
				$.each($('.page-search').find('li'), function(index, item){
					if($(item).attr('city-name') != undefined){
						_arr.push(item);
					}
				})

				hCityTool.searchMatch(
					_arr,
					$(this).val(),
					'fn-hide',
					searchType
				);

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


		/*入住日期界面*/
		//打开入住日期界面
		$('.date').bind("click", function(e){
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
		//设置下个月的状态
		dateInterfaceTool.nextMonthState();
		//保存入住离开时间
		dateInterfaceTool.saveCheckInAndOutDate($(".cld>.page-content>.cld-item>ul>.active") ,$(".cld>.page-content>.cld-item>ul>#checkOut"));
		//入住离开时间
		$(".cld-day>li").bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			dateInterfaceTool.chooseDate(html, $(this), "cld-active plugin-show", hotelTools.DATE, 0);
		})

		/*附近酒店界面*/
		//打开附近酒店界面
		$('.sea-box').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			// 启动打开界面动画
			interFaceAnimTool.openAnim(html, $('.list-pop-city'), "plugin-show page-on-center", "page-on-right");
		})
		//关闭附近酒店页面
		$('#nearHotel').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			// closeCityAndNearAnimat(".list-pop-city");
			// 启动关闭界面动画
			interFaceAnimTool.closeAnim(html, $('.list-pop-city'), "plugin-show page-on-center", "page-on-right", hotelTools.CITY);
		})
		//选择附近酒店
		$(".keyword-list>ul>li>span").bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			$(".sea-box>input").attr("value",$(this).text());
			//调用重置按钮样式方法2
			btnResetTool.selectedBtn(".keyword-list>ul>li");
			$(this).parent().addClass("on");
			$(".sea-box").parent().addClass("on");
			// 启动关闭界面动画
			interFaceAnimTool.closeAnim(html, $('.list-pop-city'), "plugin-show page-on-center", "page-on-right", hotelTools.CITY);
		})
		//搜索确定
		$(".list-pop-city>.bar>.search-btn").bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			$(".sea-box>input").attr("value", $(".list-pop-city>.bar>.search-input>input").val());
			$(".list-pop-city>.bar>.search-input>input").val("");
			//closeCityAndNearAnimat(".list-pop-city");
			// 启动关闭界面动画
			interFaceAnimTool.closeAnim(html, $('.list-pop-city'), "plugin-show page-on-center", "page-on-right", hotelTools.CITY);
		})

		//清除选择附近酒店与星级价格input框
		function clearInput($elem, isStar){
			var $elem = $elem.prev();
			$elem.parent().removeClass("on");
			$elem.children("input").attr("value", "");
			if(isStar != undefined){
				if(!isStar){
					btnResetTool.selectedBtn(".keyword-list>ul>li");
				}else{
					btnResetTool.resetPL('.star-list');
					btnResetTool.resetPL(".price-list");
				}
			}
		}

		/*星级价格选择界面*/
		//打开星级价格选择界面
		$('.price-star-btn').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			// 启动打开界面动画
			interFaceAnimTool.openAnim(html, $('.filter-sp'), "filter-sp-active plugin-show", "", $(".mask-layer"));
		})
		//关闭星级价格选择界面
		$(".mask-layer").bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			// 启动关闭界面动画
			interFaceAnimTool.closeAnim(html, $('.filter-sp'), "filter-sp-active plugin-show", "", hotelTools.STARANDPRICE, $(".mask-layer"));
		})
		//选择星级
		$('.star-list').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			var li = $(e.target).closest("li");
			var firstLi= $(".star-list li:first-child");
			if(li.text().indexOf("不限") == 0){
				//重置按钮
				btnResetTool.resetPL(".star-list");
			}else{
				if(li.attr("class").indexOf("on") == 0){
					li.removeClass("on");
					if(isAllNotChoose($(".star-list>li")))
						firstLi.addClass("on");
				}else{
					li.addClass("on");
					firstLi.removeClass("on");
				}
			}
		})
		//先择价格
		$('.price-list').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			var li = $(e.target).closest("li");
			var firstLi= $(".price-list li:first-child");
			if(li.text().indexOf("不限") == 0){
				// 重置按钮
				btnResetTool.resetPL(".price-list");
			}else{
				if(li.attr("class").indexOf("on") == 0){
					li.removeClass("on");
					if(isAllNotChoose($(".price-list>li")))
						firstLi.addClass("on");
				}else{
					// 重置按钮
					btnResetTool.selectedBtn(".price-list>li");
					li.addClass("on");
					firstLi.removeClass("on");
				}
			}
		})
		//重置按钮
		$('#filter-reset').bind("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			//重置按钮
			btnResetTool.resetPL(".star-list");
			btnResetTool.resetPL(".price-list");
		})
		//确定按钮
		$("#starprice-submit").bind("click", function(e){
			e.stopPropagation();
			saveStarAndPrice();
			$(".price-star-btn").parent().addClass("on");
			// 启动关闭界面动画
			interFaceAnimTool.closeAnim(html, $('.filter-sp'), "filter-sp-active plugin-show", "", hotelTools.STARANDPRICE, $(".mask-layer"));
		})

		/*搜索按钮*/
		function getToHotelList(){
			sessionStorage["rb"] = getLocationCTool.b;
			sessionStorage["rc"] = getLocationCTool.c;
			sessionStorage["position"] = $(".sea-box>input").val();
			//window.location.href="hotelList.html";
			//window.location.href="../addons/wqtgd_jiudian/template/mobile/hotelList.html";
			var cityName = '';
 			if(getLocationCTool.isLocation){
 				cityName = getLocationCTool.city.substr(0, getLocationCTool.city.length-1);
 				// console.log(cityName.substr(0, cityName.length-1));
 			}else {
 				cityName = $(".cityname ").text();
 				// console.log(cityName);
 			}
			
			
			var checkInTime = $(".d1>p:last-child>.indate").attr("data-value");
			var checkOutTime = $(".d3>p:last-child>.outdate").attr("data-value");
			// var checkOutTime = '2017-4-1';
			var hotelNameOrAddress = $(".sea-box>input").val();
			var titlePhone = $(".title-phone").val();
			var roomPrice = "";
			var roomType = "" ;
			// console.log(titlePhone.length);
			if(titlePhone.length == 0 || titlePhone == undefined || titlePhone.indexOf("价格星级不限") == 0){
				roomPrice = 0;
				roomType = 0;
			}else{
				roomPrice = titlePhone.split(",")[0].substr(1)
				.replace("格不限", "0")
				.replace("0-150", "1")
				.replace("150-300", "2")
				.replace("300-450", "3")
				.replace("450-700", "4")
				.replace("700以上", "5");

				roomType = titlePhone.split(",")[1]
				.replace("星级不限", "0")
				.replace("经济/客栈", "1")
				.replace("三星/舒适", "3")
				.replace("四星/高档", "4")
				.replace("五星/豪华", "5")
				.replace(/、/g, ",");
				
			}

			var day = $(".date>.d4").text();

		/*	console.log("cityName:" + cityName + "  checkInTime:" + checkInTime + "  checkOutTime:" + checkOutTime +
				"  hotelNameOrAddress:" + hotelNameOrAddress + "  roomPrice:" + roomPrice + "  roomType:" + roomType);
				*/
			// sessionStorage["serchHotelJson"] = "cityname=" + cityName + "&checkin=" + checkInTime + "&checkout=" + checkOutTime +
			// "&hotelNameOrAddress=" + hotelNameOrAddress + "&price=" + roomPrice + "&roomType=" + roomType + "&day=" + day;
			var hotel = $('#lujin').attr('hotel');
			// console.log(hotel_url);

// 			$.ajax({
// 				url: hotel_url,
// 				type:'post',
// 				dataType:'json',
// 				data:sessionStorage["serchHotelJson"],
// 				success:function(result){
//       			//alert($(result).find("code"));
//       			console.log(result);
//       		},
//       		error: function(XMLHttpRequest, textStatus, errorThrown) {
//  // alert(XMLHttpRequest.status);
//  // alert(XMLHttpRequest.readyState);
//  // alert(errorThrown.description);
//  // alert(textStatus);
// }
// });
 // console.log("roomType: " + roomType);
 // console.log("roomPrice: " + roomPrice);
 var _checkin = $(".indate").attr("data-value");   //入住时间
 var _checkout = $(".outdate").attr("data-value"); //离开时间
 var _staytime = $(".d4").text();	//住店时间
 sessionStorage["city"] = "";
 sessionStorage["city"] = cityName;
 sessionStorage["stayTime"] = "";
 sessionStorage["stayTime"] = [_checkin, _checkout, _staytime];
var Hotellist = $('#lujin').attr('Hotellist');//手机列表地址
var cfg = {'cityname':cityName,'checkin':checkInTime,'checkout':checkOutTime,'hotelNameOrAddress':hotelNameOrAddress,'price':roomPrice,'roomType':roomType,'day':day};
//调用异步请求方法
asyRequestTool.firstPagePost(hotel, cfg, Hotellist);
// console.log(cfg);
}

//查看附件酒店
$($('.get-city')[1]).bind('click', function(e){
	e.stopPropagation();
	e.preventDefault();

	$.showLoading();

	getLocationCTool.getLocation($, getToHotelList);
	// getLocationTX($, getLocationCTool);
})

if(sessionStorage['positionM']!=undefined && sessionStorage['positionM']!=''
	&& sessionStorage['positionM']!=null){

	$(".cityname").text(sessionStorage['positionM']);
	getLocationCTool.lat = sessionStorage['latM'];
	getLocationCTool.lng = sessionStorage['lngM'];
	if(sessionStorage['positionM'].indexOf('区') == -1){
		getLocationCTool.isLocation = false;
	}else{
		getLocationCTool.isLocation = true;
	}
}else{
		//$.showLoading();
		//getLocationTX($, getLocationCTool); // 460，461这两行是显示首页定位所在的默认城市
}

/*定位*/
$('.isnearby').bind('click', function(e){
	e.stopPropagation();
	e.preventDefault();

	$.showLoading();

	isAddr = true;

	//getLocationCTool.getLocation($);
	
	getLocationTX($, getLocationCTool);
	
})

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

	// 酒店品牌、商圈、地铁站、机场/车站
	function sou(obj) {
		var indexsou = $('#lujin').attr('indexsou');
		var souInput = $('#souInput').val();
		if (souInput != '') {
			searchHotel(souInput);
	
			//没有酒店的时候提示
		// if($("#sou_name1>li").length <= 0){
		// 	$(".list-noresult").attr("style", "display: block;text-align: center;");
		// 	$(".list-noresult>p").text("抱歉，这个酒店没入驻");
		// }else{
		// 	$(".list-noresult").attr("style", "display: none;text-align: center;");
		// }

		}else{
			// location.reload();
		}

		
	}

	sessionStorage["searchState"] = -1;

	function quan() {

		$('.keyword-group').css('display', 'block');
		$('.list-noresult').css('display', 'none');

		diz = $('#diz').attr('addr');//地址
		console.log(getLocationCTool.isLocation);
		if(!getLocationCTool.isLocation){
			getLocationCTool.b = $('.cityname').text();
			getLocationCTool.c = '';
		}
		// console.log(getLocationCTool.b);
		var cfg = {'dzB':diz,'rb':getLocationCTool.b,'rc':getLocationCTool.c};//参数;

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

		setTimeout(function(){

			var _count = 0;
			$.each($('.keyword-group'), function(index, item){

				if($(item).css('display') == 'none'){

					_count++;

				}

			});

			if(_count == 4){

				$('.list-noresult').css('display', 'block');

			}

		}, 1300);

	}

	function setLiEvent($elem, num){
			$.each($elem, function(index, item){
				$(item).bind('click', function(){
					// $(".sea-box>input").attr("value",$(this).text());
					// sb($(item));
					$(".sea-box>input").attr("value",$(this).text());
					//调用重置按钮样式方法2
					btnResetTool.selectedBtn(".keyword-list>ul>li");
					$(this).addClass("on");
					$(".sea-box").parent().addClass("on");
					// closeCityAndNearAnimat(".list-pop-city");
					interFaceAnimTool.closeAnim(
						html, 
						$('.list-pop-city'), 
						"plugin-show page-on-center", 
						"page-on-right", 
						hotelTools.CITY, 
						hCityTool.setCitySearchList
						);
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

	
	quan();



 // var Hotellist = $('#lujin').attr('Hotellist');//手机列表地址

 /***************** 方法区 ************************/

 /*保存选择的星级与价格数据*/
 function saveStarAndPrice(){
 	var starText = ergodicStarOrPriceList(".star-list>li");
 	var priceText = ergodicStarOrPriceList(".price-list>li");
 	if(priceText.indexOf("价格不限") != 0){
 		priceText = "￥" + priceText;
 	}
 	var text = "";
 	if(starText.indexOf("星级不限") == 0 && priceText.indexOf("价格不限") == 0){
 		text = "价格星级不限";
 	}else{
 		text = priceText + "  , " + starText;
 	}
			// console.log(text);

			$(".title-phone").attr("value", text);

		}
		/*遍历星级或列表中的数据*/
		function ergodicStarOrPriceList(arg){
			var text = "";
			$(arg).each(function(){
				if($(this).text().indexOf("不限") == -1 && $(this).attr("class").indexOf("on") == 0){
					text += "、"+$(this).text();
				}
			});
			if (text.length < 1) {
				if(arg.indexOf(".star-list>li") == 0)
					text = ",星级不限";
				else
					text = ",价格不限";
			}				

			return text.substring(1);
		} 


		/*判断星级或价格列表是否全不选*/
		function isAllNotChoose(element){
			var b=true;
			element.each(function(index,item){
				//alert($(this).attr("class"))
				if ($(this).attr("class").indexOf("on") == 0) {
					b=false;
				}
			})
			return b;
		}
		/*重置星级或价格列表数据*/
		function unlimited(arg){
			$(arg+">li").each(function(index,item){
				$(this).removeClass("on");
			});
			$(arg+">li:first-child").addClass("on");
		}

	
