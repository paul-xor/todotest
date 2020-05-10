const Todo = require('./../models/todoModel');

// const todos = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/todos-simple.json`)
// );

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: todos.length,
      data: {
        todos
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        todo
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
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

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        todo: todo
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data send!'
    });
  }
};

exports.deleteTodo = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
