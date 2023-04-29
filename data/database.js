const pkg  = require("pg");
const {Client} = pkg;

const client = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:'595959',
    database: "students"
});

client.connect()
.then(()=>console.log("Database Connected"))
.catch((e)=>console.log(e));


exports.dbConnect = client;

