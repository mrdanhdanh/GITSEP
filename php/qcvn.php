<?php
function transfer($value,$klr)
{
    global $unit_show;
    if ($unit_show==="microg/m3") $value=($value*$klr/24.45);
    else if ($unit_show==="ppm") $value=($value/$klr*24.45/1000);
    else if ($unit_show==="ppb") $value=($value/$klr*24.45);
    return round($value,3);
}
$database="host=localhost port=5432 dbname=postgres user=postgres password=root";
// Create connection
$db_conn=pg_connect("$database");

$sub=$_POST["sub"];
$unit=$_POST["unit"];
//Build qcvn line
$result = pg_query($db_conn, "SELECT * FROM qcvn WHERE id_qcvn=$sub");
$qcvn=0;
$row = pg_fetch_array($result);
$name=$row['name'];
if ($unit==="md") $unit_show=$row['unit_qt'];
else $unit_show=$row['unit'];
if ($row['klr']<>null and $row['one_hour']<>null)
    {
    $qcvn=$row['one_hour'];
    if ($unit==="md") $qcvn=transfer($qcvn,$row['klr']);
    };
$array=array(null);
$array[0]=$name;
$array[1]=$qcvn;
$array[2]=$unit_show;
echo json_encode($array);
?>