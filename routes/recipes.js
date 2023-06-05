const express = require("express");
const {
  createRecipes,
  getAllRecipes,
  updateRecipes,
  deleteRecipes,
  getOneRecipe,
} = require("../database/recipes");

const z = require("zod");
const auth = require("../middlewares/auth");
const { findUserById } = require("../database/users");
const { users } = require("../database/prisma");

const router = express.Router();

const RecipesSchema = z.object({
  name: z.string(),
  description: z.string(),
  preparationTime: z.string(),
});

router.get("/recipes", auth, async (req, res) => {
  const user = await findUserById(req.userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  const list = await getAllRecipes();
  res.json({
    list,
  });
});

router.get("/recipes/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  const listOne = await getOneRecipe(id);

  res.json({
    listOne,
  });
});

router.post("/create-recipes", auth, async (req, res) => {
  try {
    const recipes = RecipesSchema.parse(req.body);
    const user = await findUserById(res.userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    const savedRecipes = await createRecipes(recipes, user.userId);
    res.status(201).json({
      recipes: savedRecipes,
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

router.put("/update-recipes/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const recipes = RecipesSchema.parse(req.body);
    const user = await findUserById(res.userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const changeRecipe = await updateRecipes(id, recipes, user.userId);

    res.json({
      changeRecipe,
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

router.delete("/delete-recipe/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await findUserById(res.userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    await deleteRecipes(id);

    res.json({
      message: `Receita com id ${id} deletada com sucesso`,
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
