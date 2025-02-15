import express from 'express'; // ✅ Use ES Module syntax
import methodOverride from 'method-override';


const app = express();
const port = 8080;
import { dirname } from 'path';
import { fileURLToPath } from 'url';
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
const __dirname = dirname(fileURLToPath(import.meta.url));

import path from 'path';
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

import { faker } from '@faker-js/faker';
import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '26674870',
});
// inserting new data

const getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
}
// let q = "INSERT INTO user (id, username, email, password) VALUES ?;";
// let data = [];
// for(let i=1;i<=100;i++){
//   data.push(getRandomUser());
//   console.log(data)
// }
// try {
//   const [results] = await connection.query(q,[data]);
//   console.log(results);
// } catch (err) {
//   console.log(err);
// }
// connection.end();

app.get("/",async (req,res)=>{
  let q = 'SELECT COUNT(*) FROM user;';
  try {
  const [results, fields] = await connection.query(q); 
  let count = results[0]['COUNT(*)'];
  res.render("home.ejs",{ count });
} catch (err) {
  console.error(err);
  res.status(500).send("Internal Server Error");
}
})
app.get("/user",async (req,res)=>{
  let q = 'SELECT * FROM user;';
  try {
  const [results, fields] = await connection.query(q); 
  console.log(results);
  let peoples = results;
  res.render("users.ejs" , {peoples});
  // res.send(results);
} catch (err) {
  console.error(err);
  res.status(500).send("Internal Server Error");
}
})
app.get("/user/:id/edit",async (req,res)=>{
    let { id } = req.params;
    console.log(`User ID received: ${id}`);
    let q= `SELECT * FROM user WHERE id = '${id}'`
    try {
      const [results, fields] = await connection.query(q); 
      console.log(results);
      let user = results[0];
      res.render("edit.ejs" , {user});
      // res.send(results);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }

})
app.patch("/user/:id",(req,res)=>{
  res.send("updated");
})
app.listen(port , ()=>{
  console.log(`app is listening to port ${port}`);
})