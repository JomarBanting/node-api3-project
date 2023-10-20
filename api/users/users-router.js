const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required


const Users = require("./users-model");
const Post = require("../posts/posts-model");

const { validateUserId, validateUser, validatePost, } = require("../middleware/middleware")
const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.status(200).json(users);
    }).catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const { name } = req.body;
  Users.insert({ "name": name })
    .then(user => {
      res.status(201).json(user)
    }).catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, { "name": req.body.name })
    .then(updatedUser => {
      res.status(200).json(updatedUser);
    })
    .catch(next);
});

router.delete('/:id', validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.remove(req.params.id)
    .then(userID => {
      res.status(200).json(req.user);
    }).catch(next)
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(next)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Post.insert({
    "user_id": req.params.id,
    "text": req.text
  }).then(post => {
    res.status(201).json(post)
  }).catch(next)
});

router.use((error, req, res, next) => { //eslint-disable-line
  res.status(error.status || 500).json({
    message: error.message,
    customMessage: "Something bad happened inside the user router"
  })
})

// do not forget to export the router
module.exports = router;