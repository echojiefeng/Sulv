<?php
	session_start();
	try//里面的报错都进入catch里面的区间
	{	//1.数据源
		$dsn = 'mysql:charset=utf8;host=114.215.120.110;dbname=we7ceshi1;port=3306';//(字符集;本地连接;数据库库名;接口3306)
	//一、.得到对象
		$pdo = new PDO($dsn,'ims','dpCumEGhqx8Ubweu');//(连接,账号,密码)
	}catch(Exception $e){
		print($e->getMessage());//输出报错信息
	}
	//二、设置错误模式
	$pdo->setAttribute(3,1);

	//三、准备SQL语句
	$sql = "select * from ims_wqtgd_hotel_viewpass where `uniacid` = :uniacid ";

	//四、发送冒号占位符的处理
	$stmt = $pdo->prepare($sql);

	//五、给参数定值
	$uniacid = $_POST['uniacid'];

	//六、参数绑定
	$data = [
		'uniacid' => $uniacid,
	];//ID进行替换(赋值)用数组形式

	//七、执行
	$res = $stmt->execute($data);
	//八、遍历出数组
	$row=$stmt->fetchAll(2);//5返回对象
	// PDO::FETCH_OBJ;//5(对象形式)
	// PDO::FETCH_ASSOC//2(数组形式)

	//存储路径C:\xampp\tmp;
	
	if ($row[0]['user'] == $_POST['user'] && $row[0]['pass'] == $_POST['pass']) {
		$_SESSION['user'] = [
			'state' =>'0',
			'uniacid'=>$_POST['uniacid'],
			'viewname' => $_POST['viewname'],
		];
		echo json_encode('ok');
	}else{
		echo json_encode('no');
	}

