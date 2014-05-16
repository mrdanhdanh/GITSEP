<?php
$date=date_create("2013-09-1 00:00:00");
$array=array("value_ch4","value_nmhc","value_o3","value_co2","value_so2","value_pm25");
$database="host=localhost port=5432 dbname=postgres user=postgres password=root";
// Create connection
$db_conn=pg_connect("$database");
$check=true;
while ($check) {
$time=date_format($date,"Y-m-d H");
for ($x=0; $x<=5; $x++)
{
    $result = pg_query($db_conn, "SELECT AVG($array[$x]) FROM data_raw WHERE to_char(time,'YYYY-MM-DD HH24')='$time'");    
    $val[$x] = pg_fetch_result($result, 0, 0);
}
if ($val[0]==null) break;
$time=date_format($date,"Y-m-d H:i:s");    
 pg_query($db_conn,"INSERT INTO data_one_hour(time,value_ch4,value_nmhc,value_o3,value_co2,value_so2,value_pm25)
    VALUES ('$time',$val[0],$val[1],$val[2],$val[3],$val[4],$val[5])");
date_add($date,date_interval_create_from_date_string("1 hour")); 
}
?>