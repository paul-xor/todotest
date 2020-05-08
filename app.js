const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log("Hello from middleware!");
    next();
});

const todos = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/todos.json`)
);

const getAllTodos = (req, res) => {
    res.status(200).json({
        status: "success",
        results: todos.length,
        data: {
            todos
        }
    });
};

const getTodo = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;

    const todo = todos.find(el => el.id === id);

    // if (id > todos.length) {
    if (!todo) {
        res.status(404).json({
            status: "fail",
            message: "Ivalid ID."
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            todo
        }
    });
};

const createTodo = (req, res) => {
    // console.log(req.body);
    const newId = todos[todos.length - 1].id + 1;
    const newTodo = Object.assign({ id: newId }, req.body);

    todos.push(newTodo);
    fs.writeFile(
        `${__dirname}/dev-data/data/todos.json`,
        JSON.stringify(todos),
        err => {
            res.status(201).json({
                status: "success",
                data: {
                    todo: newTodo
                }
            });
        }
    );
};

const updateTodo = (req, res) => {
    if (req.params.id * 1 > todos.length) {
        res.status(404).json({
            status: "fail",
            message: "Ivalid ID."
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            todo: "< Updated todo here ...>"
        }
    });
};

const deleteTodo = (req, res) => {
    if (req.params.id * 1 > todos.length) {
        res.status(404).json({
            status: "fail",
            message: "Ivalid ID."
        });
    }
    res.status(204).json({
        status: "success",
        data: null
    });
};

app.get("/api/v1/todos", getAllTodos);
app.post("/api/v1/todos", createTodo);
app.get("/api/v1/todos/:id", getTodo);
app.patch("/api/v1/todos/:id", updateTodo);
app.delete("/api/v1/todos/:id", deleteTodo);

// app
//   .route("api/v1/todos")
//   .get(getAllTodos)
//   .post(createTodo);

// app
//   .route("api/v1/todos/:id")
//   .get(getTodo)
//   .patch(updateTodo)
//   .delete(deleteTodo);

const port = 7777;
app.listen(port, () => {
    console.log(`Server running on PORT:${port} ...`);
});
