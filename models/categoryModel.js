'use strict';
//categroyModel
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllCategory = async (next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT id, name, description FROM category'
    );
    return rows;
  } catch (e) {
    console.error('getAllCategory error', e.message);
    next(httpError('Database error', 500));
  }
};

const getCategory = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT id, name, description FROM category WHERE id = ?',
      [id]
    );
    return rows;
  } catch (e) {
    console.error('getCategory error', e.message);
    next(httpError('Database error', 500));
  }
};
module.exports = {
  getAllCategory,
  getCategory,
};