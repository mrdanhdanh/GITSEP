<?php

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
$date=$_POST["date"];
if (empty($_POST["time"])==false) $time=$_POST["time"];
//Collect data value
switch ($_POST["view"])
{
    case "raw":
        $dataview="air_quality_data_raw";
        $dateview="YYYY/MM/DD";
        break;
    case "1p":
        $dataview="air_quality_data_1min";
        $dateview="YYYY/MM/DD";
        break;
    case "5p":
        $dataview="air_quality_data_5min";
        $dateview="YYYY/MM/DD";
        break;
    case "15p":
        $dataview="air_quality_data_15min";
        $dateview="YYYY/MM/DD";
        break;    
    case "h":
        $dataview="air_quality_data_60min";
        break;
    case "d":
        $dataview="air_quality_data_day";
        $time=substr($time,0,7);
        $timeview="YYYY-MM";
        break;
    case "w":
        $dataview="air_quality_data_week";
        $time=substr($time,0,7);
        $timeview="YYYY-MM";
        break;
    case "m":
        $dataview="air_quality_data_month";
        $time=substr($time,0,7);
        $timeview="YYYY-MM";
        break;
    dafault:
        $dataview="data_raw";
}
$result = pg_query($db_conn, "SELECT * FROM $dataview WHERE to_char(date,'$dateview')='$date' ORDER BY date");
$count=0;
$countchart=0;
$total=0;
$data=array(array(null));
while ($row = pg_fetch_array($result)) {
    $data[$count][0]=$row[1];
    $data[$count][1]=$row[2];

    for ($i=2;$i<=10;$i++) {
        $data[$count][$i]=round($row[$i+1],4);
    }
    $count++;
}
echo json_encode(array('success'=>true,'subs'=>$_POST['subs'],'root'=>$data));
pg_close($db_conn);
?>

 