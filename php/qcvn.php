<?php
/*function transfer($value,$klr)
{
    global $unit_show;
    if ($unit_show==="microg/m3") $value=($value*$klr/24.45);
    else if ($unit_show==="ppm") $value=($value/$klr*24.45/1000);
    else if ($unit_show==="ppb") $value=($value/$klr*24.45);
    return round($value,3);
}*/
header("Content-Type: application/json");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
$database="host=localhost port=5432 dbname=postgres user=postgres password=root";
// Create connection
$db_conn=pg_connect("$database");

$row=$_POST["row"];
switch ($_POST["view"])
{
    case "h":
        $view='avg_1hour';
        break;
    case "d":
        $view='avg_24hour';
        break;
    dafault:
        $view=null;
}
if ($view<>null){
    $result = pg_query($db_conn, "SELECT * FROM qcvn WHERE id=($row+1)");
    $ar = pg_fetch_array($result);
    if ($ar[$view]<>null) {
        $qcvn=$ar[$view];
        $klr=$ar['klr'];
    } else $qcvn=0;
} else $qcvn=0;
if ($qcvn==0) {echo json_encode(array('success'=>false));}
else echo json_encode(array('success'=>true,'value'=>$qcvn,'klr'=>$klr));
pg_close($db_conn);
?>