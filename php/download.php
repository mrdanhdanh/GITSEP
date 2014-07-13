<?php
/**
 * PHPExcel
 *
 * Copyright (C) 2006 - 2014 PHPExcel
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @category   PHPExcel
 * @package    PHPExcel
 * @copyright  Copyright (c) 2006 - 2014 PHPExcel (http://www.codeplex.com/PHPExcel)
 * @license    http://www.gnu.org/licenses/old-licenses/lgpl-2.1.txt	LGPL
 * @version    1.8.0, 2014-03-02
 */
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
$data=[];
$date=$_GET["date"];
$time=$_GET["time"];
$choose=$_GET["choose"];
//Collect data value
switch ($_GET["view"])
{
    case "raw":
        $dataview="air_quality_data_raw";
        if ($time=="null") {$result=pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' ORDER BY date,time");}
        else  $result=pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' AND date_trunc('hour',time)='$time' ORDER BY date,time");
    $count=0;
    while ($row = pg_fetch_array($result)) {
        $data[$count][0]=$row[1];
        $data[$count][1]=$row[2];
            for ($i=2;$i<=10;$i++) {
                if ($choose[$i-2]=='true') {
                    $data[$count][$i]=round($row[$i+1],3);
                }
            }
        $count++;
    }
        break;
    case "5p":
        $dataview="air_quality_data_5min";
        if ($time=="null") {$result=pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' ORDER BY date,time");}
        else  $result=pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' AND date_trunc('hour',time)='$time' ORDER BY date,time");
    $count=0;
    while ($row = pg_fetch_array($result)) {
        $data[$count][0]=$row[1];
        $data[$count][1]=$row[2];
            for ($i=2;$i<=10;$i++) {
                if ($choose[$i-2]=='true') {
                    $data[$count][$i]=round($row[$i+1],3);
                }
            }
        $count++;
    }
        break;
    case "15p":
        $dataview="air_quality_data_15min";
        if ($time=="null") {$result=pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' ORDER BY date,time");}
    else  $result=pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' AND date_trunc('hour',time)='$time' ORDER BY date,time");
    $count=0;
    while ($row = pg_fetch_array($result)) {
        $data[$count][0]=$row[1];
        $data[$count][1]=$row[2];
        $y=2;
            for ($i=1;$i<=9;$i++) {
                if ($choose[$i-1]=='true') {
                    $data[$count][$y]=round($row[($i-1)*6+3],3);
                    $y++;
                }
            }
        $count++;
    }
        break;    
    case "h":
        $dataview="air_quality_data_60min";
        $result=pg_query($db_conn, "SELECT * FROM $dataview WHERE date='$date' ORDER BY date,time");
    $count=0;
    while ($row = pg_fetch_array($result)) {
        $data[$count][0]=$row[1];
        $data[$count][1]=$row[2];
        $y=2;
            for ($i=1;$i<=9;$i++) {
                if ($choose[$i-1]=='true') {
                    $data[$count][$y]=round($row[($i-1)*6+3],3);
                    $y++;
                }
            }
        $count++;
    }
        break;
    case "d":
        $dataview="air_quality_data_day";
        $result = pg_query($db_conn, "SELECT * FROM $dataview WHERE date_trunc('month',date)=date_trunc('month',DATE '$date') ORDER BY date");
        $count=0;
        while ($row = pg_fetch_array($result)) {
            $data[$count][0]=$row[1];
            $y=1;
            for ($i=1;$i<=9;$i++) {
                if ($choose[$i-1]=='true') {
                    $data[$count][$y]=round($row[($i-1)*6+2],3);
                    $y++;
                }
            }
            $count++;
        }
        break;
    case "m":
        $dataview="air_quality_data_month";
        $result = pg_query($db_conn, "SELECT * FROM $dataview WHERE (month=date_part('month',DATE '$date') AND year=date_part('year',DATE '$date')) ORDER BY month,year");
        $count=0;
    while ($row = pg_fetch_array($result)) {
        $data[$count][0]=$row[1];
        $data[$count][1]=$row[2];
        $y=2;
            for ($i=1;$i<=9;$i++) {
                if ($choose[$i-1]=='true') {
                    $data[$count][$y]=round($row[($i-1)*6+3],3);
                    $y++;
                }
            }
        $count++;
    }
        break;
}
pg_close($db_conn);

/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('Asia/Saigon');

if (PHP_SAPI == 'cli')
	die('This example should only be run from a Web Browser');

/** Include PHPExcel */
require_once dirname(__FILE__) . '/PHPExcel.php';


// Create new PHPExcel object
$objPHPExcel = new PHPExcel();

// Set document properties
$objPHPExcel->getProperties()->setCreator("SEP")
							 ->setLastModifiedBy("SEP")
							 ->setTitle("Dữ liệu theo yêu cầu")
							 ->setSubject("")
							 ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
							 ->setKeywords("data date time")
							 ->setCategory("");

// Add data
$headraw=array('CH4 (ppm)','NMHC (ppm)','NO (ppb)','NO2 (ppb)','NOx (ppb)','O3 (ppb)','CO (ppm)','SO2 (ppb)','PM25 (ug/Nm3)');
if ($_GET["view"]=="d") {$head=array('Date');}
else if ($_GET["view"]=="m") {$head=array('Month','Year');}
else $head=array('Date','Time');
for ($i=0;$i<=8;$i++) {
    if ($choose[$i]=='true') {array_push($head,$headraw[$i]);}
}

$objPHPExcel->getActiveSheet()->getStyle('A')->getFill()->applyFromArray(
    array(
        'type'     => PHPExcel_Style_Fill::FILL_SOLID,
        'rotation'   => 0,
        'startcolor' => array(
            'rgb' => '00B050'
        )
    )
);
$objPHPExcel->getActiveSheet()->getStyle('A')->getFont()->getColor()->setRGB('FFFFFF');

if ($_GET["view"]<>"d") {
$objPHPExcel->getActiveSheet()->getStyle('B')->getFill()->applyFromArray(
    array(
        'type'     => PHPExcel_Style_Fill::FILL_SOLID,
        'rotation'   => 0,
        'startcolor' => array(
            'rgb' => '7030A0'
        )
    )
);
    $objPHPExcel->getActiveSheet()->getStyle('C1:Z1')->getFill()->applyFromArray(
    array(
        'type'     => PHPExcel_Style_Fill::FILL_SOLID,
        'rotation'   => 0,
        'startcolor' => array(
            'rgb' => '00B0F0'
        )
    )
	);
$objPHPExcel->getActiveSheet()->getStyle('B')->getFont()->getColor()->setRGB('FFFFFF');
$objPHPExcel->getActiveSheet()->getStyle('C1:Z1')->getFont()->getColor()->setRGB('FFFFFF');
} else {
    $objPHPExcel->getActiveSheet()->getStyle('B1:Z1')->getFill()->applyFromArray(
    array(
        'type'     => PHPExcel_Style_Fill::FILL_SOLID,
        'rotation'   => 0,
        'startcolor' => array(
            'rgb' => '00B0F0'
        )
    )
	);
$objPHPExcel->getActiveSheet()->getStyle('B1:Z1')->getFont()->getColor()->setRGB('FFFFFF');
}

$objPHPExcel->setActiveSheetIndex(0)
            ->fromArray($head,NULL, 'A1')
            ->fromArray($data,NULL, 'A2');
// Set style

// Rename worksheet
$objPHPExcel->getActiveSheet()->setTitle('Data');


// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);


// Redirect output to a client’s web browser (Excel2007)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="01simple.xlsx"');
header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
header('Cache-Control: max-age=1');

// If you're serving to IE over SSL, then the following may be needed
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header ('Pragma: public'); // HTTP/1.0

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');
exit;
