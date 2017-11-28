<?php
session_start();
?>

<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	
</body>
<span id="url" state="<?=$_SESSION['user']['state']?>" url="<?=$_GET['url']?>" uniacid="<?=$_GET['uniacid']?>"></span>
<script src="/addons/wqtgd_jiudian/template/js/jquery.min.js?v=2.1.4"></script>
</html>
<script>
	//官方指定
    var state = $("#url").attr('state');
    var url = $("#url").attr('url');
    var uniacid = $("#url").attr('uniacid');
    if (state != '0') {
        alert('请使用官方指定核销系统');
        window.location= url + "app/index.php?i="+uniacid+"&c=entry&do=index&m=wqtgd_jiudian&flag=1";
    }else{
    	window.location= url + "app/index.php?&i="+ uniacid +"&c=entry&do=viewoff&m=wqtgd_jiudian&url=" + url ; 
    }
</script>