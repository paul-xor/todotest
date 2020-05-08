const fs = require('fs');

const todos = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/todos.json`)
);

exports.getAllTodos = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: todos.length,
    data: {
      todos
    }
  });
};

exports.getTodo = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  const todo = todos.find(el => el.id === id);

  // if (id > todos.length) {
  if (!todo) {
    res.status(404).json({
      status: 'fail',
      message: 'Ivalid ID.'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      todo
    }
  });
};

exports.createTodo = (req, res) => {
  // console.log(req.body);
  const newId = todos[todos.length - 1].id + 1;
  const newTodo = Object.assign({ id: newId }, req.body);

  todos.push(newTodo);
  fs.writeFile(
    `${__dirname}/dev-data/data/todos-simple.json`,
    JSON.stringify(todos),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          todo: newTodo
        }
      });
    }
  );
};

exports.updateTodo = (req, res) => {
  if (req.params.id * 1 > todos.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Ivalid ID.'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      todo: '< Updated todo here ...>'
    }
  });
};

exports.deleteTodo = (req, res) => {
  if (req.params.id * 1 > todos.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Ivalid ID.'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};
