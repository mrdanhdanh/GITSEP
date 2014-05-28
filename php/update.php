<?php
$database="host=localhost port=5432 dbname=postgres user=postgres password=root";
// Create connection
$db_conn=pg_connect("$database");
$change=$_POST["change"];
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
for ($i=0;$i<=(count($change)-1);$i++){
    $data=$change[$i];
    if ($data[0]=='update') {
        $updata=$data[1];
        pg_query($db_conn,"UPDATE $dataview SET value_ch4=$updata[2], value_nm=$updata[3], value_no=$updata[4], value_no2=$updata[5], value_nox=$updata[6], value_o3=$updata[7], value_co=$updata[8], value_so2=$updata[9], value_pm25=$updata[10]
        WHERE date='$updata[0]' AND time='$updata[1]'");
    }
    if ($data[0]=='change') {
        $find=$data[1];
        $updata=$data[2];
        pg_query($db_conn,"UPDATE $dataview SET date='$updata[0]', time='$updata[1]', value_ch4=$updata[2], value_nm=$updata[3], value_no=$updata[4], value_no2=$updata[5], value_nox=$updata[6], value_o3=$updata[7], value_co=$updata[8], value_so2=$updata[9], value_pm25=$updata[10]
        WHERE date='$find[0]' AND time='$find[1]'");
    }
    if ($data[0]=='delete') {
        $delete=$data[1];
        pg_query($db_conn,"DELETE FROM $dataview WHERE date='$delete[0]' AND time='$delete[1]'");
    }
    if ($data[0]=='add')    {
        $updata=$data[1];
        pg_query($db_conn,"INSERT INTO $dataview (date, time, value_ch4, value_nm, value_no, value_no2, value_nox, value_o3, value_co, value_so2, value_pm25) VALUES ('$updata[0]','$updata[1]',$updata[2],$updata[3],$updata[4],$updata[5],$updata[6],$updata[7],$updata[8],$updata[9],$updata[10])");
    }
}
if ($change<>null) {
    echo json_encode(array('success'=>true));
}
else {
    echo json_encode(array('success'=>false));
}
    
?>