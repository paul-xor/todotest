/* eslint-disable no-console */
const Todo = require('./../models/todoModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTodo = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTodos = catchAsync(async (req, res, next) => {
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
});

exports.getTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);
  // Todo.findOne({ _id: req.params.id })

  if (!todo) {
    return next(new AppError('No todo found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      todo
    }
  });
});

exports.createTodo = catchAsync(async (req, res, next) => {
  const newTodo = await Todo.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      todo: newTodo
    }
  });
});

exports.updateTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!todo) {
    return next(new AppError('No todo found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      todo: todo
    }
  });
});

exports.deleteTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (!todo) {
    return next(new AppError('No todo found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getTodoStats = catchAsync(async (req, res, next) => {
  const stats = await Todo.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTodos: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});
