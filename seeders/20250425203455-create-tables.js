'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tables = [];

    for (let i = 3; i <= 50; i++) {
      tables.push({
        numTable: i,
        status: false,
        capacity: Math.floor(Math.random() * 4) + 1, 
        image: "/img/tables/default.png",
        qrCode: `url/de/tu/paginaweb/${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('tables', tables, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tables', null, {});
  }
};
