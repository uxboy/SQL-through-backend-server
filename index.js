import { faker } from '@faker-js/faker';
import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '26674870',
});
// inserting new data
let q = 'INSERT INTO user (id, username, email, password) VALUES ?';

let data = [];

const getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
}
for(let i=1;i<=100;i++){
  data.push(getRandomUser());
}


try {
  const [results, fields] = await connection.query(q, [data]); // Pass users as a single array inside another array
  console.log(results);
} catch (err) {
  console.error(err);
}

connection.end();

