const Todo = require('./../models/todoModel');

// const todos = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/todos-simple.json`)
// );

exports.getAllTodos = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime
    // results: todos.length,
    // data: {
    //   todos
    // }
  });
};

exports.getTodo = (req, res) => {
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const todo = todos.find(el => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     todo
  //   }
  // });
};

exports.createTodo = async (req, res) => {
  try {
    // const newTodo = new Todo({});
    // newTodo.save();

    const newTodo = await Todo.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        todo: newTodo
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data send!'
    });
  }
};

exports.updateTodo = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      todo: '< Updated todo here ...>'
    }
  });
};

exports.deleteTodo = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
