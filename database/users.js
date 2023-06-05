const prisma = require("./prisma");

const registerUser = (data) => {
  return prisma.users.create({
    data,
  });
};

const findUserByEmail = (email) => {
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
};

const findUserById = (id) => {
  return prisma.users.findUnique({
    where: {
      id,
    },
  });
};

module.exports = {
  registerUser,
  findUserByEmail,
  findUserById,
};
