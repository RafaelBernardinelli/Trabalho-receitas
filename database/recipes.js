const prisma = require("./prisma");

const getAllRecipes = (userId) => {
  return prisma.recipes.findMany({
    select: {
      name: true,
      description: true,
      preparationTime: true,
      user: true,
      userId: true,
    },
    where: {
      userId,
    },
  });
};

const getOneRecipe = (id, recipeId) => {
  return prisma.recipes.findFirst({
    select: {
      name: true,
      description: true,
      preparationTime: true,
      user: true,
      userId: true,
    },
    where: {
      userId: id,
      id: recipeId,
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

const updateRecipes = (id, recipes) => {
  return prisma.recipes.update({
    where: {
      id: id,
    },
    data: {
      id: recipes.id,
      name: recipes.name,
      description: recipes.description,
      preparationTime: recipes.preparationTime,
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
