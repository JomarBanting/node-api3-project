const User = require("../users/users-model");
const Post = require("../posts/posts-model");

function logger(req, res, next) {
  // DO YOUR MAGIC
  const protocol = req.protocol;
  const host = req.hostname;
  const url = req.originalUrl;
  const port = 9000;
  const timestamp = new Date().toLocaleString()
  console.log(`${req.method} ${protocol}://${host}:${port}${url} ${timestamp}`)
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const user = await User.getById(req.params.id);
    if (user) {
      req.user = user;
      next();
    } else {
      next({
        status: 404,
        message: "user not found"
      })
    }
  } catch (err) {
    next(err);
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  try {
    const { name } = req.body;
    if (name !== undefined && typeof name === "string" && name.length && name.trim()) {
      next();
    } else {
      next({
        status: 400,
        message: "missing required name field"
      })
    }
  } catch (err) {
    next(err);
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  if (!text || !text.trim()) {
    next({
      status: 400,
      message: "missing required text field"
    })
  } else {
    req.text = text.trim();
    next();
  }
}



// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
};
