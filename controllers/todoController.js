const Todo = require('./../models/todoModel');

// const todos = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/todos.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`tour id is: ${val}`);
//   if (req.params.id * 1 > todos.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalide ID.'
//     });
//   }
//   next();
// };

/* 
  Create a checkBody middleware just to check comming data.
  I have selected here: name, price & summary. If not send 404. 
*/
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price || !req.body.summary) {
    return res.status(400).json({
      status: 'fail.',
      message: '☠️ Bad request: name, price or summary is missing.'
    });
  }
  next();
};

exports.getAllTodos = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: todos.length,
    // data: {
    //   todos
    // }
  });
};

exports.getTodo = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  // const todo = todos.find(el => el.id === id);


  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     todo
  //   }
  // });
};

exports.createTodo = (req, res) => {
  res.status(201).json({
    status: 'success'
  });
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
