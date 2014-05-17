 SELECT date,avg(value_ch4),avg(value_nm) FROM air_quality_data_5min WHERE to_number(to_char(time,'MI'),'99') BETWEEN 0 AND 15 GROUP BY date,to_char(time,'HH24')
