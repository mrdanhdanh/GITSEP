<?php
	$database="host=localhost port=5432 dbname=postgres user=postgres password=root";
	// Create connection
	$db_conn=pg_connect("$database");
	$config = parse_ini_file("C:\wamp\www\GITSEP\data\seek.ini", true);
    $seek=$config['seek'];
	$file = new SplFileObject('C:\wamp\www\GITSEP\data\air.csv');
	$file->setFlags(SplFileObject::READ_CSV);
	$file->seek($seek);
	$i=0;
	while ((!$file->eof()) and ($i<=99)) {
		$ar=$file->fgetcsv();
		$into='';
		$value='';
		$intoar=array('value_ch4', 'value_nm', 'value_no', 'value_no2', 'value_nox', 'value_o3', 'value_co', 'value_so2', 'value_pm25');
		for ($y=3;$y<=11;$y++){
			if ($ar[$y]<>' +++++++' and $ar[$y]>0) {
				$into.=','.$intoar[$y-3];
				$value.=','.$ar[$y];
			}
		}
		if ($ar<>null) {
		$datetime=date_create($ar[1]);
		$date=date_format($datetime,'Y/m/d');
		$time=date_format($datetime,'H:i:s');
		pg_query($db_conn,"INSERT INTO air_quality_data_raw (date, time $into) VALUES ('$date','$time' $value)");
		}
		$i++;
		$file->next();
	}
	if ($file->eof()) $i--;
	
	$seek=$seek+$i;
	$file = new SplFileObject('seek.ini', 'w');
	$file->fwrite('seek='.$seek);
	pg_close($db_conn);
?>