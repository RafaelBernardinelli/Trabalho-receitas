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

const router = express.Router();

const RecipesSchema = z.object({
  name: z
    .string({
      require_error: "Name must be required",
      invalid_type_error: "Name must be a string",
    })
    .min(3),
  description: z.string({
    require_error: "description must be required",
    invalid_type_error: "description must be a string",
  }),
  preparationTime: z.number(),
});

router.get("/recipes", auth, async (req, res) => {
  const list = await getAllRecipes(req.userId);
  if (!list.length)
    res.status(400).json({
      message: "no recipe found",
    });

  list.forEach((it) => delete it.user.password);

  res.json({
    list,
  });
});

router.get("/recipes/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  const listOne = await getOneRecipe(req.userId, id);
  if (!listOne)
    return res.status(404).json({
      message: `User with ${req.userId} is not the owner of this recipe`,
    });

  delete listOne.user.password;

  res.json({
    listOne,
  });
});

router.post("/create-recipes", auth, async (req, res) => {
  try {
    const recipes = RecipesSchema.parse(req.body);
    const userId = req.userId;
    const savedRecipes = await createRecipes(recipes, userId);
    res.status(201).json({
      message: "Recipe created",
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
    const user = await getOneRecipe(req.userId, id);

    if (!user)
      return res.status(401).json({
        message: `User with ${req.userId} is not the owner of this recipe`,
      });

    const changeRecipe = await updateRecipes(id, recipes);

    res.json({
      message: "Recipe updated",
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

    const user = await getOneRecipe(req.userId, id);
    if (!user)
      return res.status(404).json({
        message: `User with ${req.userId} is not the owner of this recipe`,
      });
    await deleteRecipes(id);

    res.json({
      message: `Recipe with id ${id} successfully deleted`,
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
