 SELECT date,date_trunc('hour',time)+interval '15 minutes',avg(value_ch4),avg(value_nm)
 FROM air_quality_data_5min
 WHERE to_number(to_char(time,'MI'),'09')
 BETWEEN 0 AND 14
 GROUP BY date,date_trunc('hour',time)
 ORDER BY date,date_trunc('hour',time);
 
