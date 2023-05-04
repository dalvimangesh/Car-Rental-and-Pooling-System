/* for >= condition */

CREATE INDEX car_capacity_brin_idx
ON car USING BRIN (capacity);

-- for start time
CREATE INDEX booking_start_time_btree_idx
ON booking USING BTREE (start_time);

-- for end time
CREATE INDEX booking_end_time_btree_idx
ON booking USING BTREE (end_time);



CREATE INDEX booking_id_hash_idx
ON booking USING HASH (booking_id);


CREATE INDEX pooling_booking_id_hash_idx
ON pooling USING HASH (booking_id);


CREATE INDEX pooling_pooling_id_hash_idx
ON pooling USING HASH (pooling_id);


/* user_name should be unique but it is not a primary key so using index */

CREATE UNIQUE INDEX login_info_user_name_unique ON login_info(user_name);

/*--------------------------------------------------------------------------------------------*/

/*Multi column*/
CREATE INDEX username_pass_login_info ON login_info (user_name, password);



