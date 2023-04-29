const pkg  = require("pg");
const {Client} = pkg;

const client = new Client({
    host:"localhost",
    user:"admin",
    port:5432,
    password:'iitpkd',
    database: "car_rental"
});

client.connect()
.then(()=>console.log("Database Connected"))
.catch((e)=>console.log(e));


exports.dbConnect = client;
