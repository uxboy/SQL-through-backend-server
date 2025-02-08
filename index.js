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

let users = [
  ["2", "ananya", "ananya@gmail.com", "abcmbsdfh"],
  ["3", "rahul", "abcrahul@gmail.com", "ncvjdsu67vc"]
];

try {
  const [results, fields] = await connection.query(q, [users]); // Pass users as a single array inside another array
  console.log(results);
} catch (err) {
  console.error(err);
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