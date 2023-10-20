const express = require('express');

const server = express();
const userRouter = require("./users/users-router");
const { logger } = require("./middleware/middleware");

// remember express by default cannot parse JSON in request bodies
server.use(express.json());
server.use(logger);
server.use('/api/users', userRouter)


// global middlewares and the user's router need to be connected here

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("*", (req, res) => {
  res.status(404).json({
    message: `${req.method} ${req.baseUrl} not found!`
  })
})

module.exports = server;
