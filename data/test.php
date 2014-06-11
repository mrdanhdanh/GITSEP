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
	while ((!$file->eof()) and ($i<=300)) {
		$ar=$file->fgetcsv();
		for ($y=0;$y<=count($ar)-1;$y++){
			if ($ar[$y]=='+++++++') $ar[$y]=0;
		}
		if ($ar<>null) {
		$datetime=date_create($ar[1]);
		$date=date_format($datetime,'Y/m/d');
		$time=date_format($datetime,'H:i:s');
		pg_query($db_conn,"INSERT INTO air_quality_data_raw (date, time, value_ch4, value_nm, value_no, value_no2, value_nox, value_o3, value_co, value_so2, value_pm25) VALUES ('$date','$time',$ar[3],$ar[4],$ar[5],$ar[6],$ar[7],$ar[8],$ar[9],$ar[10],$ar[11])");
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