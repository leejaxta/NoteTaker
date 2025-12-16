const notesService = require("../services/notes.service");
const { success } = require("../utils/apiResponse");

exports.getNotes = async (req, res, next) => {
  try {
    const data = await notesService.getNotes(req.user.id, req.query);
    success(res, data);
  } catch (err) {
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await notesService.getNoteById(req.user.id, req.params.id);
    success(res, note);
  } catch (err) {
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const note = await notesService.createNote(req.user.id, req.body);
    success(res, note, "Note created");
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const note = await notesService.updateNote(
      req.user.id,
      req.params.id,
      req.body
    );
    success(res, note, "Note updated");
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    await notesService.deleteNote(req.user.id, req.params.id);
    success(res, null, "Note deleted");
  } catch (err) {
    next(err);
  }
};
