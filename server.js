const express = require("express");
const server = express();
server.use(express.json());

const recipesRoute = require("./routes/recipes");
const usersRoutes = require("./routes/users");

server.use(recipesRoute.router);
server.use(usersRoutes.router);

module.exports = { server };
