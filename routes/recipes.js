const express = require("express");
const {
  createRecipes,
  getAllRecipes,
  updateRecipes,
  deleteRecipes,
  getOneRecipe,
} = require("../database/recipes");

const router = express.Router();

router.get("/recipes", async (req, res) => {
  const list = await getAllRecipes();
  res.json({
    list,
  });
});

router.get("/recipes/:id", async (req, res) => {
  const id = Number(req.params.id);

  const listOne = await getOneRecipe(id);

  res.json({
    listOne,
  });
});

router.post("/create-recipes", async (req, res) => {
  const recipes = {
    name: req.body.name,
    description: req.body.description,
    preparationTime: req.body.preparationTime,
  };
  await createRecipes(recipes);
  res.json({
    recipes: recipes,
  });
});

router.put("/update-recipes/:id", async (req, res) => {
  const id = Number(req.params.id);

  const recipe = {
    name: req.body.name,
    description: req.body.description,
    preparationTime: req.body.preparationTime,
  };

  const changeRecipe = await updateRecipes(id, recipe);

  res.json({
    changeRecipe,
  });
});

router.delete("/delete-recipe/:id", async (req, res) => {
  const id = Number(req.params.id);

  await deleteRecipes(id);

  res.json({
    message: `Receita com id ${id} deletada com sucesso`,
  });
});

module.exports = {
  router,
};
