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
	$sql = "select * from ims_wqtgd_hotel_ticketorder where `uniacid` = :uniacid and `ordername` = :ordername";

	//四、发送冒号占位符的处理
	$stmt = $pdo->prepare($sql);

	//五、给参数定值
	$uniacid = $_SESSION['user']['uniacid'];

	$ordername = $_POST['offticket'];
	//六、参数绑定
	$data = [
		'uniacid' => $uniacid,
		'ordername'=> $ordername,
	];//ID进行替换(赋值)用数组形式
	//七、执行
	$res = $stmt->execute($data);
	//八、遍历出数组
	$list=$stmt->fetchAll(2);//5返回对象
	// PDO::FETCH_OBJ;//5(对象形式)
	// PDO::FETCH_ASSOC//2(数组形式)

	// $sqlupdate="update ims_wqtgd_hotel_ticketorder set order_status='已使用' where ordername = :ordername ";
	// $stmt = $pdo->prepare($sqlupdate);
	// //五、给参数定值
	// $ordername = 'view2017051809542597769775';
	// //六、参数绑定
	// $datas = [
	// 	'ordername'=> $ordername,
	// ];//ID进行替换(赋值)用数组形式
	// $stmt->execute($data);
	
		if (empty($list)) {
			echo json_encode('no');
			exit;
		}else{
			if ( md5( $list[0]['viewname'] . $list[0]['viewid'] ) == $_SESSION['user']['viewname'] ) {
				switch($list[0]['order_status']){
	                    case '已付款' :
	                    	$statustime = time();
	                    	$sqlupdate="update ims_wqtgd_hotel_ticketorder set order_status='已使用',statustime={$statustime} where ordername = :ordername ";
							$stmt = $pdo->prepare($sqlupdate);
							//五、给参数定值
							$ordername = $_POST['offticket'];
							//六、参数绑定
							$datas = [
								'ordername'=> $ordername,
							];//ID进行替换(赋值)用数组形式
							$stmt->execute($datas);
							echo json_encode('ok');
	                        break;
	                    case '未付款' :
	                    	echo json_encode('未付款');
	                    	break;
	                    case '已使用' :
	                    	echo json_encode('已使用');
	                    	break;
	                    case '已退款' :
	                    	echo json_encode('已退款');
	                    	break;
	                   	case '申请退款' :
	                    	echo json_encode('申请退款');
	                    	break;
	                    case '驳回退款' :
	                    	echo json_encode('驳回退款');
	                    	break;
	                    case '退款失败' :
	                    	echo json_encode('退款失败');
	                    	break;

	            }
	        }else{
	        	echo json_encode('viewname-' . $list[0]['viewname']);
	        }

			
		}