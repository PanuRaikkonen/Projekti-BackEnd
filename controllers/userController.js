'use strict';
const { validationResult } = require('express-validator');
// userController
const { getAllUsers, getUser, deleteUser } = require('../models/userModel');
const { httpError } = require('../utils/errors');

const user_list_get = async (req, res, next) => {
  try {
    const users = await getAllUsers(next);
    if (users.length > 0) {
      res.json(users);
    } else {
      next('No users found', 404);
    }
  } catch (e) {
    console.log('user_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const user_get = async (req, res, next) => {
  try {
    const vastaus = await getUser(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus);
    } else {
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const user_delete = async (req, res, next) => {
  try {
    const vastaus = await deleteUser(
      req.params.id,
      req.user.id,
      req.user.role,
      next
    );
    if (vastaus.affectedRows > 0) {
      res.json({
        message: 'user deleted',
        id: vastaus.insertId,
      });
    } else {
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_delete error', e.message);
    next(httpError('internal server error', 500));
  }
};

const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};

module.exports = {
  user_list_get,
  user_get,
  user_delete,
  checkToken,
};
