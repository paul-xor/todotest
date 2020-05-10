/* eslint-disable no-console */
const Todo = require('./../models/todoModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTodo = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTodos = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Todo.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const todos = await features.query;

    // SEND RESPONCE
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
      message: err
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

exports.deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data send!'
    });
  }
};


exports.getTodoStats = async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } }
      },
      {
        // $group: {
        //   _id: { $toUpper: '$difficulty' },
        //   numTodos: { $sum: 1 },
        //   numRatings: { $sum: '$ratingsQuantity' },
        //   avgRating: { $avg: '$ratingsAverage' },
        //   avgPrice: { $avg: '$price' },
        //   minPrice: { $min: '$price' },
        //   maxPrice: { $max: '$price' }
        // }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Todo.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTodoStarts: { $sum: 1 },
        todos: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTodoStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
};
