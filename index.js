import { faker } from '@faker-js/faker';
import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '26674870',
});
let q = 'SHOW TABLES';
// A simple SELECT query
try {
  const [results, fields] = await connection.query(q);
  console.log(results);
  console.log(results.length); // results contains rows returned by server
  console.log(results[0]);
  console.log(results[1]);
  console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
  console.log(err);
}
connection.end();


const createRandomUser = () => {
    return {
      id: faker.string.uuid(),
      username: faker.internet.username(), // before version 9.1.0, use userName()
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }
  // console.log(createRandomUser());