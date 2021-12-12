"use strict";
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllPosts = async (next) => {
  try {
    const [rows] = await promisePool.execute(`
	SELECT 
	post.id,
	title, 
	content, 
	post.img,
  post.created,
	post.category,
	post.owner, 
	post.parent, 
	user.username as "Posted by" 
	FROM post 
	JOIN user ON 
	post.owner = user.id`);
    return rows;
  } catch (e) {
    console.error("getAllPosts error", e.message);
    next(httpError("Database error", 500));
  }
};

const getPost = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      `
	SELECT 
	id,
	title, 
	content, 
	img,
  created,
	category,
	owner, 
	parent, 
  user.username as Posted by 
	FROM post 
	JOIN user ON 
	post.owner = user.id
	WHERE post.id = ?`,
      [id]
    );
    return rows;
  } catch (e) {
    console.error("getPost error", e.message);
    next(httpError("Database error", 500));
  }
};

const addPost = async (title, content, img, created, next) => {
  try {
    const [rows] = await promisePool.execute(
      "INSERT INTO post (title, content, img, created) VALUES (?, ?, ?, ?)",
      [title, content, img, created]
    );
    return rows;
  } catch (e) {
    console.error("addPost error", e.message);
    next(httpError("Database error", 500));
  }
};

const modifyPost = async (title, content, img, id, role, next) => {
  let sql =
    "UPDATE post SET title = ?, content = ?, img = ? WHERE id = ? AND owner = ?;";
  let params = [title, content, img, id, owner];
  if (role === 0) {
    sql =
      "UPDATE post SET title = ?, content = ?, img = ? WHERE id = ? AND owner = ?;";
    params = [title, content, img, id, owner];
  }
  console.log("sql", sql);
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("addPost error", e.message);
    next(httpError("Database error", 500));
  }
};

const deletePost = async (id, owner_id, role, next) => {
  let sql = "DELETE FROM post WHERE id = ? AND owner = ?";
  let params = [id, owner_id];
  if (role === 0) {
    sql = "DELETE FROM post WHERE id = ?";
    params = [id];
  }
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("getPost error", e.message);
    next(httpError("Database error", 500));
  }
};

module.exports = {
  getAllPosts,
  getPost,
  addPost,
  modifyPost,
  deletePost,
};
