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

const createRecipes = (recipes, userId) => {
  return prisma.recipes.create({
    data: {
      id: recipes.id,
      name: recipes.name,
      description: recipes.description,
      preparationTime: recipes.preparationTime,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

const updateRecipes = (id, recipes, userId) => {
  return prisma.recipes.update({
    where: {
      id: id,
    },
    data: {
      id: recipes.id,
      name: recipes.name,
      description: recipes.description,
      preparationTime: recipes.preparationTime,
      user: {
        connect: {
          id: userId,
        },
      },
    },
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
