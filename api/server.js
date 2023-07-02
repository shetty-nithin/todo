const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

var todos = [];

app.get("/todos", (req, res) => {
    return res.json(todos);
});

app.get("/todos/:id", (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    return res.json(todos[todoIndex]);
});

app.post("/todos", (req, res) => {
    const newTodo = {
        id: Math.floor(Math.random()*1000000),
        title: req.body.title,
        description: req.body.description,
        backGroundColor: "rgb(215, 113, 76)"
    };
    todos.push(newTodo);
    return res.status(201).json(newTodo);
});

app.put("/todos/:id", (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if(todoIndex === -1){
        return res.status(404).send();
    }
    else{
        todos[todoIndex].title = req.body.title;
        todos[todoIndex].description = req.body.description;
        return res.status(200).send(todos[todoIndex]);
    }
});

app.put("/todos/done/:id", (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if(todoIndex === -1){
        return res.status(404).send();
    }
    else{
        todos[todoIndex].title = req.body.title;
        todos[todoIndex].description = req.body.description;
        todos[todoIndex].backGroundColor = req.body.backGroundColor;
        return res.status(200).send(todos[todoIndex]);
    }
});

app.delete("/todos/:id", (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if(todoIndex === -1){
        return res.status(404).send();
    }
    else{
        todos.splice(todoIndex, 1);
        return res.status(200).send();
    }
});


app.listen(3000, () => {
    console.log("listening at the port 3000")
})