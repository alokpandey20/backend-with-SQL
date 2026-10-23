
  
const { faker } = require('@faker-js/faker');
const mysql =require("mysql2");

const express= require("express");
const app=express(); 

require("dotenv").config();


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "delta_app",
    password: process.env.DB_PASSWORD
});


// let q ="SHOW TABLES";
// try{
//     connection.query(q,(err,result)=>{
//     if(err) throw err;
//     console.log(result);
// })
// }
// catch(err){
//     console.log(err);
// }
// connection.end(); // to close the connection


// inserting using placeholders 
// let q ="INSERT INTO user (id, username,email,password) VALUES (?,?,?,?)";
// let user=['4','alok','alok@gmail.com','1234'];

// let q ="INSERT INTO user (id, username,email,password) VALUES ? ";
// let user=[['5','shlok','shlok@gmail.com','12354'],
// ['6','prince','prince@gmail.com','12345']];
// try{
//     connection.query(q, [user], (err,result)=>{
//     if(err) throw err;
//     console.log(result);
// })
// }
// catch(err){
//     console.log(err);
// }
// connection.end(); // to close the connection
// let  getRandomUser = ()=> {
//   return {
//     id: faker.string.uuid(),
//     username: faker.internet.username(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
  
//   };
// }
// // console.log(getRandomUser());



// // inserting 100 datas by using faker 
// let  getRandomUser = ()=> {
//   return [
//      faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//      faker.internet.password(),
  
//   ];
// }
// let q ="INSERT INTO user (id, username,email,password) VALUES ? ";
// let data=[];
// for(let i=0;i<100;i++){
//   data.push(getRandomUser());
// }
// try{
//     connection.query(q, [data], (err,result)=>{
//     if(err) throw err;
//     console.log(result);
// })
// }
// catch(err){
//     console.log(err);
// }
// connection.end();




// setting up an express app 


const port =8080;
const path=require("path");
const { v4: uuidv4 } = require("uuid");

app.listen(port,()=>{
  console.log(`app is listening on ${port}`);
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

 const methodOverride=require("method-override");
 app.use(methodOverride("_method"));

app.get("/",(req,res)=>{
  let q=`select count(*) from user`;
 try{
    connection.query(q, (err,result)=>{
    if(err) throw err;
    // res.send(result[0]["count(*)"]);
    let count=result[0]["count(*)"];
    res.render("home.ejs",{count});
})
}
catch(err){
    console.log(err);
    res.send(" some error are there "); 
}

});

// registration route 
app.get("/register",(req,res)=>{
    res.render("post.ejs");
})
app.post("/user",(req,res)=>{
    let q= `insert into user (id,username,email,password) Values (?,?,?,?) `;
    const id=uuidv4();
     const {username,email,password}=req.body;
     const values=[id,username,email,password];
try{
    connection.query(q,values,(err,result)=>{
    if(err){
        if(err.code=="ER_DUP_ENTRY"){
            return res.status(409).send("ID or email already exists")
        } 
        throw err;
    } 
   
    res.redirect("/");
})
}
catch(err){
    console.log(err);
    res.send(" some error are there ");
}

});

// show route 
app.get("/users",(req,res)=>{
    let q=`select * from user`;
    try{
    connection.query(q,(err,result)=>{
    if(err){
        throw err;
    } 
  
    res.render("show.ejs",{users : result}); 
})
}
catch(err){
    console.log(err);
    res.send(" some error are there ");
} 
});

// edit route 
app.get("/user/:id/edit",(req,res)=>{
   
    let {id}=req.params;
      let q=`select * from user where id='${id}'`;
          try{
    connection.query(q,(err,result)=>{
    if(err){
        throw err;
    } 
    let user=result[0];
    res.render("edit.ejs",{user}); 
})
}
catch(err){
    console.log(err);
    res.send(" some error are there ");
} 

})

app.patch("/user/:id",(req,res)=>{
    let {username:newUsername ,password:formpass} =req.body;
    
    let {id}=req.params;
   
      let q=`select * from user where id='${id}'`;
              try{
    connection.query(q,(err,result)=>{
    if(err){
        throw err;
    } 
     user=result[0];
    if(formpass!=user.password){
        res.send("wrong password");
    }
   else{
    let q=`update user set username='${newUsername}' where id='${id}'`;
            try{
    connection.query(q,(err,result)=>{
    if(err){
        throw err;
    } 
   
    res.redirect("/users"); 
})
}
catch(err){
    console.log(err);
    res.send(" some error are there ");
} 
   }

})
}
catch(err){
    console.log(err);
    res.send(" some error are there ");
} 
});

// delete route 
app.get("/user/:id/delete" ,(req,res)=>{
    let {id} =req.params;
    let q =`delete from user where id='${id}'`;
         try{
    connection.query(q,(err,result)=>{
    if(err){
        throw err;
    } 
    res.redirect("/"); 
})
}
catch(err){
    console.log(err);
    res.send(" some error are there ");
} 
})
 