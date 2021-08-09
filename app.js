//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _=require("lodash")
const app = express();
const mongoose = require("mongoose");

var uri = "mongodb://localhost:27017/todolist";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

const listSchema = new mongoose.Schema(
  {
    name:String
  },
  {collection:"list"}
)
 const List = mongoose.model("list",listSchema)
 const list1 = new List({
   name:"Welcome to your todolist"
 })
 const list2 = new List({
   name:"hahaha"
 })
 const list3 = new List({
   name:"hihihi"
 })
 const array = [list1,list2,list3]
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  List.find({},function(err,list){
    if(err){console.log(err)}
    else{ 
      if(list.length===0){  List.insertMany(array,function(err){
        if(err){
          console.log(err)
        }
        else{
          console.log("Succes")
        }
      })
      res.redirect("/")
    }else{res.render("list", {listTitle:"Today",newListItems:list})}
      
      }
  })

 
});

app.post("/", function(req, res){
  const item = req.body.newItem;
  const listTitle = req.body.listTitle
  const item1 = new List({
    name: item
  })
  item1.save()
  if (listTitle === "Today"){
  res.redirect("/")}else{res.redirect("/"+listTitle)}
  
});
app.post("/delete",function(req,res){
 const a = req.body.checkbox
 console.log(a)

List.findByIdAndRemove(a,function(err){
  const listTitle = req.body.listTitle
  if(!err){console.log("succesfully")
  if (listTitle === "Today"){
    res.redirect("/")}else{res.redirect("/"+listTitle)}}
  else{console.log(err)}
})





})
app.get("/:name",function(req,res){
  const route = _.upperFirst(req.params.name)
  console.log(route)
  List.find({},function(err,list){
    if(err){console.log(err)}
    else{ 
      if(list.length===0){  List.insertMany(array,function(err){
        if(err){
          console.log(err)
        }
        else{
          console.log("Succes")
        }
      })
      res.redirect("/"+route)
    }else{res.render("list", {listTitle:route,newListItems:list})}
      
      }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
