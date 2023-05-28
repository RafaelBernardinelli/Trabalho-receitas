const prisma = require("./prisma");

const getAllRecipes = () => {
  return prisma.recipes.findMany({});
};

const getOneRecipe = (id) => {
  return prisma.recipes.findFirst({
    where: {
      id,
    },
  });
};

const createRecipes = (recipes) => {
  return prisma.recipes.create({
    data: recipes,
  });
};

const updateRecipes = (id, recipe) => {
  return prisma.recipes.update({
    where: {
      id: id,
    },
    data: recipe,
  });
};

const deleteRecipes = (id) => {
  return prisma.recipes.delete({
    where: {
      id: id,
    },
  });
};

module.exports = {
  createRecipes,
  getAllRecipes,
  updateRecipes,
  deleteRecipes,
  getOneRecipe,
};
