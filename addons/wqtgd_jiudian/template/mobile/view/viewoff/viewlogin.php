
<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0,minimal-ui" /> 

    <title>多商家酒店核销系统</title>

    <link rel="shortcut icon" href="favicon.ico"> 
    <link href="/addons/wqtgd_jiudian/template/css/bootstrap.min.css?v=3.3.6" rel="stylesheet">


    <link href="/addons/wqtgd_jiudian/template/css/animate.css" rel="stylesheet">
    <link href="/addons/wqtgd_jiudian/template/css/style.css?v=4.1.0" rel="stylesheet">
    <!--[if lt IE 9]>
    <meta http-equiv="refresh" content="0;ie.html" />
    <![endif]-->

    <script>if(window.top !== window.self){ window.top.location = window.location;}</script>
</head>

<body class="gray-bg">

    <div class="middle-box text-center loginscreen  animated fadeInDown">
        <div>
            <h3>欢迎登录多商家酒店核销系统</h3>

                <div class="form-group">
                    <input id="user" type="text" class="form-control" placeholder="用户名" required="">
                </div>
                <div class="form-group">
                    <input id="pass" type="password" class="form-control" placeholder="密码" required="">
                </div>
                <button  onclick="ok()" class="btn btn-primary block full-width m-b">登 录</button>


        </div>
    </div>

    <!-- 全局js -->
    <script src="/addons/wqtgd_jiudian/template/js/jquery.min.js?v=2.1.4"></script>
    <script src="/addons/wqtgd_jiudian/template/js/bootstrap.min.js?v=3.3.6"></script>
    


    <span id="url" uniacid="<?=$_GET['uniacid']?>" viewname="<?=$_GET['viewname']?>" url="<?=$_GET['url']?>"></span>
</body>
<script>
    function ok() {
        
        var user = $('#user').val();
        var pass = $('#pass').val();
        var uniacid = $('#url').attr('uniacid');
        var viewname = $('#url').attr('viewname');
        var url = $("#url").attr('url');
        
        
        $.post('./loginajax.php',{'user':user,'pass':pass,'uniacid':uniacid,'viewname':viewname},function(data){

            if (data == "ok") {
                window.location= url + "app/index.php?&i="+ uniacid +"&c=entry&do=viewoff&m=wqtgd_jiudian&url=" + url + "&sentence=ok" ; 
            }else{
                alert('账号或密码错误');

            }
        },'json');
    }
</script>

</html>
