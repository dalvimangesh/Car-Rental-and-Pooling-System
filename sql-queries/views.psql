create view pooling_cars as (
select user_id,model_name,registration_no,capacity,pickup_location,drop_location,start_time,end_time,cost_perday,latefee_perday
from booking natural join car natural join car_category 
where pooling_option = 1 and now()::date<start_time and booking.cancelled_status = 'No' 
and 
capacity >= 1 + (select get_count_bookingid(booking.booking_id))
);

/* ------------------------------------------------------------------------------------------------------------------------ */

-- create view pooling_cars as (
-- select booking.booking_id as book_id ,booking.user_id as b_user_id,pooling.user_id as p_user_id,model_name,mileage,registration_no,category_name,capacity,pickup_location,drop_location,start_time,end_time,cost_perday,latefee_perday
-- from booking natural join car natural join car_category left join pooling on booking.booking_id=pooling.booking_id
-- where pooling_option = 1 and now()::date<start_time and booking.cancelled_status = 'NO' and ( pooling.cancelled_status is null or pooling.cancelled_status = 'NO')
-- and 
-- capacity >= 1 + (select get_count_bookingid(booking.booking_id))
-- );

/*-----------------------------------------------------------------------------------------------------------------------------*/

create view available_cars as 
(
SELECT *
from car natural join car_category natural join location
where availability = 1
);

/*-----------------------------------------------------------------------------------------------------------------------------*/

CREATE VIEW location_car_count AS
SELECT 
    location.location_name,
    COUNT(DISTINCT CASE WHEN booking.cancelled_status = 'NO' AND booking.booking_id NOT IN (SELECT booking_id FROM billing) 
		  THEN booking.registration_no END) AS incoming_cars,
    COUNT(DISTINCT available_cars.registration_no) AS available_cars
FROM 
    location
    LEFT JOIN booking ON location.location_id = booking.drop_location
    LEFT JOIN available_cars ON location.location_id = available_cars.location_id
        AND available_cars.availability = 1
GROUP BY 
    location.location_name;
	
select * from location_car_count;


/*----------------------------------------------------------------------------------------------------------------------------*/
/*  This view shows all the bookings made by a particular customer, along with the booking details and car information  */

CREATE VIEW customer_booking AS
SELECT customer_info.first_name, customer_info.last_name, booking.booking_id, booking.start_time, booking.end_time, 
booking.pickup_location, booking.drop_location, booking.booking_date, booking.pooling_option, booking.insurance_option, 
car.model_name, car.registration_no, car_category.category_name, car_category.cost_perday, car_category.latefee_perday
FROM customer_info
JOIN booking ON customer_info.user_id = booking.user_id
JOIN car ON booking.registration_no = car.registration_no
JOIN car_category ON car.category_id = car_category.category_id order by customer_info.first_name;

/*----------------------------------------------------------------------------------------------------------------------------*/
/*  This view shows the most popular car categories based on the number of bookings made for each category  */

CREATE VIEW popular_car_category AS
SELECT car_category.category_name, COUNT(*) AS total_bookings
FROM booking
JOIN car ON booking.registration_no = car.registration_no
JOIN car_category ON car.category_id = car_category.category_id
GROUP BY car_category.category_name
ORDER BY total_bookings DESC;

/*------------------------------------------------------------------------------------------------------------------------------*/
