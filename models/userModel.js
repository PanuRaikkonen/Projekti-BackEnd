"use strict";
const e = require("express");
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT id, username, email, role FROM user"
    );
    return rows;
  } catch (e) {
    console.error("getAllUsers error", e.message);
    next(httpError("Database error", 500));
  }
};

const getUser = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT id, username, email, role FROM user WHERE id = ?",
      [id]
    );
    return rows;
  } catch (e) {
    console.error("getUser error", e.message);
    next(httpError("Database error", 500));
  }
};

const addUser = async (name, email, password, next) => {
  try {
    const [rows] = await promisePool.execute(
      "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    return rows;
  } catch (e) {
    console.error("addUser error", e.message);
    next(httpError("Database error", 500));
  }
};

const deletePost = async (id, owner_id, role, next) => {
  let sql = "DELETE FROM user WHERE id = ? AND owner = ?";
  let params = [id, owner_id];
  if (role === 0) {
    sql = "DELETE FROM user WHERE id = ?";
    params = [id];
  }
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("deletePost error", e.message);
    next(httpError("Database error", 500));
  }
};

const getUserLogin = async (params) => {
  try {
    console.log("getUserLogin", params);
    const [rows] = await promisePool.execute(
      "SELECT * FROM user WHERE username = ?;",
      params
    );
    return rows;
  } catch (e) {
    console.log("getUserLogin error", e.message);
    next(httpError("Database error", 500));
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  deletePost,
  getUserLogin,
};
