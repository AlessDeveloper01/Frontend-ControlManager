'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categoriesName = [
      'Desayunos',
      "Bebidas",
      "Entradas",
      "Antojitos",
      "Extras",
      "Memelas",
      "Camarones",
      "Mojarras",
      "Pulpo",
      "Filetes",
      "Postres"
    ];

    const categories = categoriesName.map((name) => ({
      name,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('categories', categories, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});

  }
};
