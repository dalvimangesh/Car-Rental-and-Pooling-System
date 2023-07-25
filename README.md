# Car-Rental-and-Pooling-System
DBMS Project


![image](https://github.com/dalvimangesh/Car-Rental-and-Pooling-System/assets/75742776/68a6fb6f-4cfc-4d1e-ba30-d99d842ae0f0)

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

