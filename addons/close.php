<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>网站正在维护...</title>
 <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
  <link rel="stylesheet" href="/addons/wqtgd_jiudian/template/mobile/css/weui/weui.css"/>
  <link rel="stylesheet" href="/addons/wqtgd_jiudian/template/mobile/css/weui/weui2.css"/>

</head>
<body ontouchstart="" style="background-color: #f8f8f8;">
<div class="weui_icon_area" style="    padding-top: 36px;
    text-align: center;margin-bottom: 30px;"><i class="weui_icon_msg weui_icon_warn"></i></div>
        <div class="weui_text_area" style="    margin-bottom: 25px;
    padding: 0 20px;">
            <center><h2 class="weui_msg_title" style="    margin-bottom: 5px;
    font-weight: 400;
    font-size: 20px;">网站维护中<br /><?= $_GET['set_close_reason']; ?></h2><br />
            </center>
        </div>
        <div class="weui_opr_area">
            <p class="weui_btn_area">
                <a href="tel:<?= $_GET['set_fuwutel']; ?>" class="weui_btn weui_btn_primary">联系客服</a>
				<a href="javascript:WeixinJSBridge.call('closeWindow');" class="weui_btn weui_btn_default">关闭窗口</a>
            </p>
        </div>
        <div class="weui_extra_area">
            
   
    </div>
<br /><br />
 <div class="weui-footer">
          
            <p class="weui-footer-text">Copyright &copy; 2008-2017 <?= $_GET['uniaccount']; ?> 版权所有</p>
        </div>

</body>
</html>

