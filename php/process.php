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
$view=$_POST["view"];
if (substr($_POST["date"],0,4) <> "")
{
    $time=substr($_POST["date"],0,4);
    $timeview="YYYY";
    if (substr($_POST["date"],5,2)<> "")
    {
        $time.="-".substr($_POST["date"],5,2);
        $timeview="YYYY-MM";
        if (substr($_POST["date"],8,2) <> "")
        {
            $time.="-".substr($_POST["date"],8,2);
            $timeview="YYYY-MM-DD";
            /*if ($_POST["time"]<>null)
            {   
                $time.=" ".substr($_POST["time"],0,2);;
                $timeview="YYYY-MM-DD HH24";
            };*/};};};



//Collect data value
switch ($view)
{
    case "raw":
        $dataview="data_raw";
        break;
    case "h":
        $dataview="data_one_hour";
        break;
    case "d":
        $dataview="data_one_day";
        $time=substr($time,0,7);
        $timeview="YYYY-MM";
        break;
    dafault:
        $dataview="data_raw";
}
$result = pg_query($db_conn, "SELECT * FROM $dataview WHERE to_char(time,'$timeview')='$time' ORDER BY time");
$count=0;
$countchart=0;
$total=0;
$data=array(array(null));
while ($row = pg_fetch_array($result)) {
    $data[$count][0]=$row[1];

    for ($i=1;$i<=6;$i++) {
        $data[$count][$i]=round($row[$i+1],3);
    }
    $count++;
}
echo json_encode(array('success'=>true,'subs'=>$_POST['subs'],'root'=>$data));
pg_close($db_conn);
?>

 