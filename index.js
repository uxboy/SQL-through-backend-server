import express from 'express'; // ✅ Use ES Module syntax

const app = express();
const port = 8080;

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
// connection.end();

app.get("/",async (req,res)=>{
  let q = 'SELECT COUNT(*) FROM user;';
  try {
  const [results, fields] = await connection.query(q); 
  console.log(results[0]['COUNT(*)']);
  res.send(String(results[0]['COUNT(*)']));
} catch (err) {
  console.error(err);
  res.status(500).send("Internal Server Error");
}
})
app.listen(port , ()=>{
  console.log(`app is listening to port ${port}`);
})