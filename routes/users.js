const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod");

const {
  registerUser,
  findUserByEmail,
  findUserById,
} = require("../database/users");

const router = express.Router();

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string().min(6),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(3),
});

router.post("/register", async (req, res) => {
  try {
    const user = UserSchema.parse(req.body);
    const hasEmailUsed = await findUserByEmail(user.email);

    if (hasEmailUsed) {
      return res.status(400).json({
        message: "E-mail já cadastrado",
      });
    }
    const hashPassword = bcrypt.hashSync(user.password, 10);

    user.password = hashPassword;

    const saveUser = await registerUser(user);
    delete saveUser.password;

    res.status(201).json({
      user: saveUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        message: error.errors,
      });
    }
    res.status(500).json({
      message: "server error",
    });
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = LoginSchema.parse(req.body);
    const user = await findUserByEmail(body.email);

    if (!user) return res.status(401).send();

    const isEqualsPassword = bcrypt.compareSync(body.password, user.password);
    if (!isEqualsPassword) return res.status(401).send();

    const secretKey = process.env.SECRET;
    const token = jwt.sign({ userId: user.id }, secretKey);

    res.status(200).json({
      message: "sucess",
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        message: error.errors,
      });
    }
    res.status(500).json({
      message: "server error",
    });
  }
});

module.exports = {
  router,
};
