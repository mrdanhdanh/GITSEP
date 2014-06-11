SELECT date,date_trunc('minute',time),(avg(value_ch4)/2*1.0286+0.0134),(avg(value_nm)/2*1.0879+0.0108),avg(value_no)/2,avg(value_no2)/2,avg(value_nox)/2,avg(value_o3)*2,(avg(value_co)*0.961+0.060),(avg(value_so2)*5*0.901+0.411),avg(value_pm25)*100
FROM air_quality_data_raw WHERE to_number(to_char(time,'SS'),'99')
BETWEEN 0 AND 59
GROUP BY date,date_trunc('minute',time)
ORDER BY date,date_trunc('minute',time)