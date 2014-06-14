<?php
$haveqcvn=array(4,6,7,8,9);
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

$sub=4;
$index=array_search($sub,$haveqcvn);
if ($index<>null){
    $result = pg_query($db_conn, "SELECT * FROM qcvn WHERE id=($index+1)");
    $ar = pg_fetch_array($result);
    if ($ar[$view]<>null) {
        $qcvn=$ar[$view]/$ar['klr'];
    } else $qcvn=0;
} else $qcvn=0;
?>