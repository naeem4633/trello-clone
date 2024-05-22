const Board = require('../models/boardModel');
const Task = require('../models/taskModel')

exports.createBoard = async (req, res) => {
  try {
    const { name, tasks } = req.body;

    const existingBoard = await Board.findOne({ name });
    if (existingBoard) {
      return res.status(400).json({ message: 'Board with this name already exists' });
    }

    const newBoard = new Board({ name });
    // await newBoard.save();

    for (const task of tasks) {
      const newTask = new Task({ ...task, boardId: newBoard._id });
      await newTask.save();
      newBoard.tasks.push(newTask._id);
    }

    await newBoard.save();
    res.json(newBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find().populate('tasks'); 
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate('tasks'); 
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
