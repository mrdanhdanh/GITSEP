<?php
$database="host=localhost port=5432 dbname=postgres user=postgres password=root";
// Create connection
$db_conn=pg_connect("$database");
$update=$_POST["update"];
switch ($_POST["table"])
{
    case "raw":
        $dataview="air_quality_data_raw";
        break;
    case "1p":
        $dataview="air_quality_data_1min";
        break;
    case "5p":
        $dataview="air_quality_data_5min";
        break;
    case "15p":
        $dataview="air_quality_data_15min";
        break;    
    case "h":
        $dataview="air_quality_data_60min";
        break;
    case "d":
        $dataview="air_quality_data_day";
        break;
    case "w":
        $dataview="air_quality_data_week";
        break;
    case "m":
        $dataview="air_quality_data_month";
        break;
    dafault:
        $dataview="data_raw";
}
for ($i=0;$i<=(count($update)-1);$i++){
    $updata=$update[$i];
    pg_query($db_conn,"UPDATE $dataview SET value_ch4=$updata[2], value_nm=$updata[3], value_no=$updata[4], value_no2=$updata[5], value_nox=$updata[6], value_o3=$updata[7], value_co=$updata[8], value_so2=$updata[9], value_pm25=$updata[10]
    WHERE date='$updata[0]' AND time='$updata[1]'");
}
if ($update<>null) {
    echo json_encode(array('success'=>true));
}
else {
    echo json_encode(array('success'=>false));
}
    
?>