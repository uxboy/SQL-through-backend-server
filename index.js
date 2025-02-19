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
  // console.log(results);
  let peoples = results;
  res.render("users.ejs" , {peoples});
  // res.send(results);
} catch (err) {
  console.error(err);
  res.status(500).send("Internal Server Error");
}
})



app.get("/user/add",(req,res)=>{
  res.render("adduser.ejs");
})


app.post("/user",async(req,res)=>{
  const getusersID = () => {
    return [
      faker.string.uuid(),
    ];
  }
  let userId = getusersID();
  let user = req.body;
  console.log(user);
  console.log(userId);
  let q = `INSERT INTO user (id, password, username, email) VALUES ("${userId[0]}", "${user.password}", "${user.username}", "${user.email}");`;
  try {
    const [results, fields] = await connection.query(q); 
    console.log(results);
    // res.send("form submmited");
    res.redirect("/user");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})


let existingName = [];
app.get("/user/:id/edit",async (req,res)=>{
    let { id } = req.params;
    // console.log(`User ID received: ${id}`);
    let q= `SELECT * FROM user WHERE id = '${id}'`
    try {
      const [results, fields] = await connection.query(q); 
      // console.log(results);
      let user = results[0];
      existingName.push(user);
      res.render("edit.ejs" , {user});
      // res.send(results);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }

})




app.patch("/user/:id",async(req,res)=>{
  console.log(req.body); //req.body
  let { username} = req.body;
  let newName = { username}.username;
  console.log(newName); //new name
  console.log(existingName); //user array
  console.log(existingName[0].password); //array password
  console.log(req.body.password);
  let q = `UPDATE user SET username  = REPLACE(username , '${existingName[0].username}', '${newName}') WHERE id = '${existingName[0].id}';`;
  if (existingName[0].password == req.body.password) {
    try {
      const [results, fields] = await connection.query(q); 
      // console.log(results);
      existingName.length = 0;
  
      // res.send("updated");
      res.redirect("/user");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
    
  } else {
    res.send("wrong password");
  }

})

app.get("/user/:id/delete" , (req,res)=>{
  let {id} = req.params;
  res.render("deleteuser.ejs", {id});
})
// app.delete("/user/:id" ,async(req,res)=>{
//   let {id} = req.params; // id from link
//   let formUser = req.body;  // form info print
//   console.log(id);
//   console.log(formUser);
//   let q1 = `SELECT * FROM user WHERE id ='${id}';`;
//   try {
//     const [results, fields] = await connection.query(q1); 
//     const databaseUser = results[0];
//     console.log(databaseUser);
//     if (databaseUser.email == formUser.email && databaseUser.password == formUser.password) {
//   try {
//     let q2 = `DELETE FROM user WHERE id = '${id}';`;
//     const [results, fields] = await connection.query(q2); 
//     console.log(results);
//     res.redirect("/user");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// } else {
//       res.send("password is incorrect please try again");
// }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }

// })
app.delete("/user/:id", async (req, res) => {
  let { id } = req.params; // Get user ID from URL
  let { email, password } = req.body; // Extract email & password from body

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  try {
    // Use parameterized queries to prevent SQL injection
    let q1 = `SELECT * FROM user WHERE id = ?`;
    const [results] = await connection.query(q1, [id]);

    if (results.length === 0) {
      return res.status(404).send("User not found.");
    }

    const databaseUser = results[0];

    if (databaseUser.email === email && databaseUser.password === password) {
      let q2 = `DELETE FROM user WHERE id = ?`;
      await connection.query(q2, [id]);
      return res.redirect("/user");
    } else {
      return res.status(401).send("Password is incorrect, please try again.");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(port , ()=>{
  console.log(`app is listening to port ${port}`);
})
