'use strict';

/** @type {import('sequelize-cli').Migration} */

/**
 * Ejecutar seeder para crear un usuario demo (obligatorio despues eliminar en bd)
 * DELETE FROM users WHERE email = 'admin@example.com';
 */
module.exports = {
  async up (queryInterface, Sequelize) {
    let users = [
      {
        "name": "Demo Admin",
        "email": "admin@example.com",
        "password": "$2b$10$gNK/ALdl6h1MAgFzk0V4N.HP3AoY90KPjOvnIRMDj3pzx6XpAXLVm", // 123456789
        "permission": "Administrador",
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ];

    return queryInterface.bulkInsert('users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
