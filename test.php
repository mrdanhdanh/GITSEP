<?php
$date=$_POST['date'];
$time=$_POST['time'];
$a=array('success'=>true,'root'=>array($date,$time));
echo json_encode($a);
?>