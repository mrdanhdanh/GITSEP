<?php
function server($dataview){
    global $db_conn, $date;
    global $result;
    global $time;
    global $data;
    if ($time==null) {$result=pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' ORDER BY date,time");}
    else  $result=pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' AND date_trunc('hour',time)='$time' ORDER BY date,time");
    $count=0;
    while ($row = pg_fetch_array($result)) {
        $data[$count][0]=$row[1];
        $data[$count][1]=$row[2];
        for ($i=2;$i<=10;$i++) {
            $data[$count][$i]=round($row[$i+1],4);
        }
        $count++;
    }
}
$database="host=localhost port=5432 dbname=postgres user=postgres password=root";
// Create connection
$db_conn=pg_connect("$database");

/* Check connection
$stat = pg_connection_status($db_conn);
  if ($stat === PGSQL_CONNECTION_OK) {
      echo 'Connection status ok' . '</br>';
  }
  else {
      echo 'Connection status bad';
  }
  */
//Set some variables
$data=[];
$date=$_POST["date"];
if (empty($_POST["time"])) {$time=null;}
else $time=$_POST["time"];
//Collect data value
switch ($_POST["view"])
{
    case "raw":
        server("air_quality_data_raw");
        break;
    case "1p":
        server("air_quality_data_1min");
        break;
    case "5p":
        server("air_quality_data_5min");
        break;
    case "15p":
        server("air_quality_data_15min");
        break;    
    case "h":
        server("air_quality_data_60min");
        break;
    case "d":
        $dataview="air_quality_data_day";
        $result = pg_query($db_conn, "SELECT * FROM $dataview WHERE date_trunc('month',date)=date_trunc('month',DATE '$date') ORDER BY date");
        $count=0;
        while ($row = pg_fetch_array($result)) {
            $data[$count][0]=$row[1];
            for ($i=1;$i<=9;$i++) {
                $data[$count][$i]=round($row[$i+1],4);
            }
            $count++;
        }
        break;
    case "w":
        $dataview="air_quality_data_week";
        $time=substr($time,0,7);
        $timeview="YYYY-MM";
        break;
    case "m":
        $dataview="air_quality_data_month";
        $result = pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' ORDER BY date,time");
        break;
    dafault:
        $dataview="data_raw";
}

pg_close($db_conn);
if ($data==null) {echo json_encode(array('success'=>false));}
else echo json_encode(array('success'=>true,'root'=>$data));
?>

 