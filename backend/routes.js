const express = require('express');
const router = express.Router();
const boardController = require('./controllers/boardController');
const taskController = require('./controllers/taskController');

// Routes for tasks
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getAllTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.get('/tasks/board/:boardId', taskController.getTasksByBoardId);

// Routes for boards
router.post('/boards', boardController.createBoard);
router.get('/boards', boardController.getAllBoards);
router.get('/boards/:id', boardController.getBoardById);
router.put('/boards/:id', boardController.updateBoard);
router.delete('/boards/:id', boardController.deleteBoard);

module.exports = router;