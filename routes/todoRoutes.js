const express = require('express');

const todoController = require('./../controllers/todoController');
const router = express.Router();

//router.param('id', todoController.checkID);

router
  .route('/top-5-cheap')
  .get(todoController.aliasTopTodo, todoController.getAllTodos);

router.route('/todo-stats').get(todoController.getTodoStats);
router.route('/monthly-plan/:year').get(todoController.getMonthlyPlan);

router
  .route('/')
  .get(todoController.getAllTodos)
  .post(todoController.createTodo);

router
  .route('/:id')
  .get(todoController.getTodo)
  .patch(todoController.updateTodo)
  .delete(todoController.deleteTodo);

module.exports = router;
