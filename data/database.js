const pkg  = require("pg");
const {Client} = pkg;

const client = new Client({
    host:"localhost",
    user:"admin",
    port:5432,
    password:'admin',
    database: "car_rental"
});

client.connect()
.then(()=>console.log("Database Connected"))
.catch((e)=>console.log(e));

exports.dbConnect = client;



// const getClient = (username, password) => {

//     const client = new Client({
//         host: "localhost",
//         user: username,
//         port: 5432,
//         password: password,
//         database: "car_rental"
//     });

//     client.connect()
//         .then(() => console.log("Database Connected"))
//         .catch((e) => console.log(e));

//     return client
// }

// exports.dbConnect = getClient;