<?php
$database="postgres";
// Create connection
$db_conn=pg_connect("host=localhost port=5432 dbname=$database user=postgres password=root");

// Check connection
$stat = pg_connection_status($db_conn);
  if ($stat === PGSQL_CONNECTION_OK) {
      echo 'Connection status ok' . '</br>';
  }
  else {
      echo 'Connection status bad';
  }    

$qu = pg_query($db_conn, "SELECT * FROM data_raw");


while ($data = pg_fetch_object($qu)) {
  echo $data->id . " (";
  echo $data->time . "): ";
  echo $data->value_O3 . "<br />";
}

pg_free_result($qu);
pg_close($db_conn);
?>