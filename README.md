# Car-Rental-and-Pooling-System
Car rental and pooling web app with authentication, membership, car management, bookings, billing, maintenance, pooling, and ratings. Ensured data consistency and trigger-based updates. Admin access for maintenance and billing. Advanced billing calculations with member discounts. Efficient and user-friendly car rental system.

ER Diagram
![image](https://github.com/dalvimangesh/Car-Rental-and-Pooling-System/assets/75742776/68a6fb6f-4cfc-4d1e-ba30-d99d842ae0f0)

## [Full Report](https://docs.google.com/document/d/1niNyUGddNhm6nEXvJxJXbUQmn-krr5x5UKTleay-T4M/edit)

## Steps to start server

1. Install PostgreSQL 12.x (https://www.postgresql.org/)
2. Inside ./data/database.js, set the host, password, database, and port according to your runtime environment.
3. Please make sure that database have relational model as given in `er-diagram.png`. Inside `./sql-queries` you will find all `psql` queries to create database with required relational model.
4. Install Node.js based on your operating system. Visit the website (https://nodejs.org) and download the LTS version 19.9.x of Node.js along with version 9.6.x of npm.
5. Install all required dependencies

        npm install

6. start server using following in dev mode
    
        npm start
        
7. To close server

        ./close.sh

