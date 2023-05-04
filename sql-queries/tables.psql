create table car_category(
	category_id serial primary key not null,
	category_name varchar(50) not null,
	cost_perday integer not null,
	latefee_perday integer not null,
	bootspace integer not null
);

create table location(
	location_name varchar(50) not null,
	location_id serial primary key not null,
	city varchar(50) not null,
	state varchar(50) not null,
	street varchar(50) not null,
	pincode int not null
);

create table car(
	model_name varchar(50) not null,
	registration_no varchar(50) primary key not null,
	capacity int not null,
	mileage int not null,
	availability int not null,
	category_id int not null,
	location_id int not null,
	CONSTRAINT fk_category_id
  	FOREIGN KEY(category_id)
  	REFERENCES car_category(category_id),
	CONSTRAINT fk_location_id
  	FOREIGN KEY(location_id)
  	REFERENCES location(location_id)
);

create table maintenance(
	registration_no varchar(50) primary key not null,
	total_distance_travelled int not null,
	last_service_date date not null,
	under_maintenance int not null,
	 CONSTRAINT fk_registration_no
  FOREIGN KEY(registration_no)
  REFERENCES car(registration_no)
);

create table customer_info(
	user_id serial primary key not null,
	first_name varchar(50) not null,
	last_name varchar(50) not null,
	phone_no bigint not null,
	driving_license_id varchar(50) not null,
	password varchar(50) not null,
	user_name varchar(50) not null
);

create table login_info(
	user_id int primary key not null,
	user_name varchar(50) not null,
	password varchar(50) not null,
	 CONSTRAINT fk_user_id
  FOREIGN KEY(user_id)
  REFERENCES customer_info(user_id)
);


create table membership(
	membership_id serial primary key not null,
	user_id int not null,
	start_date date,
	expiry_date date,
	CONSTRAINT fk_user_id
  FOREIGN KEY(user_id)
  REFERENCES customer_info(user_id)
);


create table booking(
	booking_id serial primary key not null,
	user_id int not null, 
	start_time timestamp not null,
	end_time timestamp not null,
	pickup_location int not null,
	drop_location int not null,
	booking_date timestamp not null,
	pooling_option int not null,
	insurance_option int not null,
	registration_no varchar(50) not null,
	cancelled_status varchar(50) not null,
	advance_paid varchar(50) not null,
	CONSTRAINT fk_user_id
  FOREIGN KEY(user_id)
  REFERENCES customer_info(user_id),
	CONSTRAINT fk_location_id
  FOREIGN KEY(pickup_location)
  REFERENCES location(location_id),
	CONSTRAINT fk_location_id1
  FOREIGN KEY(drop_location)
  REFERENCES location(location_id),
	CONSTRAINT fk_registration_no
  FOREIGN KEY(registration_no)
  REFERENCES car(registration_no)
);



create table pooling(
	pooling_id serial primary key not null,
	user_id int not null,
	booking_id int not null,
	cancelled_status varchar(50) not null,
	CONSTRAINT fk_user_id
  FOREIGN KEY(user_id)
  REFERENCES customer_info(user_id),
	CONSTRAINT fk_booking_id
  FOREIGN KEY(booking_id)
  REFERENCES booking(booking_id)
);


 create table rating(
 	user_id int not null,
	booking_id int not null,
	rating_given int not null,
	registration_no varchar(50) not null,
	constraint pk_rating primary key (user_id,booking_id),
	constraint fk_userid foreign key (user_id) references customer_info(user_id),
	constraint fk_bookingid foreign key (booking_id) references booking(booking_id),
	constraint registration_no foreign key (registration_no) references car(registration_no)
 );
 

alter table pooling add column insurance_option integer;

create table billing(
	booking_id int not null,
	user_id int not null,
	people_count int not null,
	arrival_date timestamp without time zone not null,
	bill_status varchar(50) not null,
	bill_amount int not null,
	total_late_fees int not null,
	CONSTRAINT fk_user_id
  FOREIGN KEY(user_id)
  REFERENCES customer_info(user_id),
	CONSTRAINT fk_booking_id
  FOREIGN KEY(booking_id)
  REFERENCEs booking(booking_id),
	primary key (booking_id,user_id)
)
