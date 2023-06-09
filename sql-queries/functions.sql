create or replace function check_no_overlap(userid int,start_date timestamp without time zone,end_date timestamp without time zone)
returns boolean 
  AS $res$
  declare 
  row booking%rowtype;
  res boolean;
  max_l timestamp without time zone;
  min_r timestamp without time zone;
 begin
 res := true;
 	for row in select * from booking where user_id = userid and cancelled_status = 'NO' and end_time>=now() loop
 	if (start_date>=row.start_time) then
		max_l = start_date;
	else max_l = row.start_time;
	end if;
	if (end_date<=row.end_time) then
		min_r = end_date;
	else min_r = row.end_time;
	end if;
	if (max_l <= min_r) then
		res = false;
	end if;
	end loop;
	return res;
end;
 $res$ LANGUAGE plpgsql;


/*-------------------------------------------------------------------------------------------------------------------------------------------*/

/* Number of people who are pooling a car - same as number of pooling_id for a booking_id*/
/* Add 1 if finding total capacity of the car */
create or replace function get_count_bookingid(bookingid int)
returns integer as
$cnt$
declare cnt integer;
begin
	if exists (select * from pooling where pooling.booking_id = bookingid and pooling.cancelled_status = 'NO') then 
	cnt = (select count(pooling.booking_id) from pooling where pooling.cancelled_status = 'NO' and
	pooling.booking_id = bookingid
	group by pooling.booking_id ); 
	else cnt =  0; 
	end if ;
	return cnt;
end;
$cnt$ LANGUAGE plpgsql;

/* --------------------------------------------------------------------------------------------------------------------------------*/
create or replace function get_car_rating(reg_no varchar(50))
returns numeric as 
$car_rating$
declare car_rating numeric;
begin
	if exists (select * from rating where registration_no = reg_no) then
		car_rating = (select avg(rating_given) from rating group by registration_no);
	else car_rating = 0;
	end if;
	return car_rating;
end;
$car_rating$ language plpgsql;


/* returns all possible cars for the user
there can be at max 1 active booking for user and not able to pool if there is upcoming booking or current booking
other users can pool multiple cars but will not pull same car two or more times
*/
/*-------------------------------------------------------------------------------------------------------------------------------------------------*/
CREATE OR REPLACE FUNCTION get_pooling_cars(session_user_id integer)
RETURNS TABLE (
    book_id integer,
    pooling_id integer,
    puserid integer,
    model_name varchar(50),
    mileage integer,
    registration_no varchar(50),
    category_name varchar(50),
    capacity integer,
    pickup_location integer,
    drop_location integer,
    start_time timestamp,
    end_time timestamp,
    cost_perday integer,
    latefee_perday integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (booking.booking_id)
        booking.booking_id as book_id,
        pooling.pooling_id,
        COALESCE(pooling.user_id, -1) as puserid,
        car.model_name,
        car.mileage,
        car.registration_no,
        car_category.category_name,
        car.capacity,
        booking.pickup_location,
        booking.drop_location,
        booking.start_time,
        booking.end_time,
        car_category.cost_perday,
        car_category.latefee_perday
    FROM booking
    JOIN car ON booking.registration_no = car.registration_no
    JOIN car_category ON car.category_id = car_category.category_id
    LEFT JOIN pooling ON booking.booking_id = pooling.booking_id
    WHERE booking.cancelled_status = 'NO'
    AND booking.user_id <> session_user_id
    AND car.capacity > (
        SELECT count(*) FROM booking
        WHERE booking.registration_no = car.registration_no
        AND booking.cancelled_status = 'NO'
    )
    AND booking.start_time > now()
    AND (pooling.user_id IS NULL OR pooling.user_id <> session_user_id)
    AND booking.booking_id NOT IN (
        SELECT booking_id FROM pooling WHERE user_id = session_user_id
    );
END;
$$ LANGUAGE plpgsql;

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------*/
create or replace function get_bill_amount_book(userid int, bookingid int,arrival_date timestamp without time zone)
returns integer as 
$amount$
declare
amount integer;
start_date timestamp without time zone;
end_date timestamp without time zone;
insuranceoption int;
ismember int;
peopleCount int;
costpday int;
latefeepday int;
begin
	amount = 0;
	select cost_perday,latefee_perday into costpday , latefeepday from booking natural join
	car natural join car_category;
	
	if exists (select * from membership where user_id = userid and arrival_date<=expiry_date) then
	ismember = 1;
	else ismember = 0;
	end if;
	
	select start_time,end_time,insurance_option into start_date,end_date,insuranceoption
	from booking where booking_id = bookingid;
	
	if (arrival_date <= end_date) then
	amount := costpday*(end_date::date - start_date::date + 1);
	else amount := costpday*(end_date::date - start_date::date +1) + latefeepday*(arrival_date::date - end_date::date);
	end if;
	
	if ismember = 1 then
	amount:= 0.9*amount;
	end if;
	
	peopleCount =  1+get_count_bookingid(bookingid);
	amount := amount/peopleCount;
	if insuranceoption = 1 then
	amount = amount + 1000;
	end if;
	
	amount = amount  - 2000;
	return amount;
	
end
$amount$ language plpgsql;

/*-----------------------------------------------------------------------------------------------------------------------------------*/

create or replace function get_bill_amount_pool(userid int,bookingid int, poolingid int,arrival_date timestamp without time zone)
returns integer as 
$amount$
declare
amount integer;
start_date timestamp without time zone;
end_date timestamp without time zone;
insuranceoption int;
ismember int;
peopleCount int;
costpday int;
latefeepday int;
begin
	amount = 0;
	select cost_perday,latefee_perday into costpday , latefeepday from booking natural join
	car natural join car_category;
	
	if exists (select * from membership where user_id = userid and arrival_date<=expiry_date) then
	ismember = 1;
	else ismember = 0;
	end if;
	
	select start_time,end_time into start_date,end_date
	from booking where booking_id = bookingid;
	
	select insurance_option into insuranceoption from pooling where pooling_id = poolingid;
	
	if (arrival_date <= end_date) then
	amount := costpday*(end_date::date - start_date::date + 1);
	else amount := costpday*(end_date::date - start_date::date +1) + latefeepday*(arrival_date::date - end_date::date);
	end if;
	
	if ismember = 1 then
	amount:= 0.9*amount;
	end if;
	
	peopleCount =  1+get_count_bookingid(bookingid);
	amount := amount/peopleCount;
	
	if insuranceoption = 1 then
	amount = amount + 1000;
	end if;
	
	return amount;
	
end
$amount$ language plpgsql;

/* ------------------------------------------------------------------------------------------------------------------- */
create or replace function get_bill_latefee(bookingid int,arrival_date timestamp without time zone)
returns integer as 
$amount$
declare
amount integer;
start_date timestamp without time zone;
end_date timestamp without time zone;
latefeepday int;
begin
	amount = 0;
	select latefee_perday into latefeepday from booking natural join
	car natural join car_category;

	select start_time,end_time into start_date,end_date
	from booking where booking_id = bookingid;
	
	if (arrival_date <= end_date) then
	amount := 0;
	else amount := latefeepday*(arrival_date::date - end_date::date);
	end if;
	
	return amount;
	
end
$amount$ language plpgsql;