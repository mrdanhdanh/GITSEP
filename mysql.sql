INSERT INTO air_quality_data_15min (date, time, value_ch4 , value_nm , value_no , value_no2 ,  value_nox , value_o3 , value_co , value_so2 , value_pm25)
 SELECT date,date_trunc('hour',time)+interval '15 minutes' as time,avg(value_ch4),avg(value_nm),avg(value_no),avg(value_no2),avg(value_nox),avg(value_o3),avg(value_co),avg(value_so2),avg(value_pm25)
 FROM air_quality_data_5min
 WHERE to_number(to_char(time,'MI'),'09')
 BETWEEN 0 AND 14
 GROUP BY date,date_trunc('hour',time)
 UNION ALL
 SELECT date,date_trunc('hour',time)+interval '30 minutes' as time,avg(value_ch4),avg(value_nm),avg(value_no),avg(value_no2),avg(value_nox),avg(value_o3),avg(value_co),avg(value_so2),avg(value_pm25)
 FROM air_quality_data_5min
 WHERE to_number(to_char(time,'MI'),'09')
 BETWEEN 15 AND 29
 GROUP BY date,date_trunc('hour',time)
 UNION ALL
 SELECT date,date_trunc('hour',time)+interval '45 minutes' as time,avg(value_ch4),avg(value_nm),avg(value_no),avg(value_no2),avg(value_nox),avg(value_o3),avg(value_co),avg(value_so2),avg(value_pm25)
 FROM air_quality_data_5min
 WHERE to_number(to_char(time,'MI'),'09')
 BETWEEN 30 AND 44
 GROUP BY date,date_trunc('hour',time)
 UNION ALL
 SELECT to_date(to_char(date_trunc('hour',date + time)+ interval '1 hour', 'YYYY-MM-DD'), 'YYYY-MM-DD') as date,
 interval '1 hour' * date_part('hour',date_trunc('hour',date + time)+ interval '1 hour') as time,avg(value_ch4),avg(value_nm),avg(value_no),avg(value_no2),avg(value_nox),avg(value_o3),avg(value_co),avg(value_so2),avg(value_pm25)
 FROM air_quality_data_5min
 WHERE to_number(to_char(time,'MI'),'09')
 BETWEEN 45 AND 59
 GROUP BY  date_trunc('hour',date + time),date_trunc('hour',time)
 ORDER BY  date,time;
 
