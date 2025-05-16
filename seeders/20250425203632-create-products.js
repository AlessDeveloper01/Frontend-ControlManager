'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Catálogo de productos por categoría (20 por cada categoría)
    const categoryProducts = {
      // 1. Sopas
      1: [
        "Sopa de Tortilla", "Caldo de Camarón", "Sopa de Lima", "Caldo Tlalpeño", 
        "Consomé de Pollo", "Sopa de Frijol", "Sopa Azteca", "Caldo de Pescado", 
        "Sopa de Verduras", "Caldo de Res", "Sopa de Elote", "Pozole", 
        "Menudo", "Caldo de Albóndigas", "Sopa de Fideos", "Crema de Champiñones", 
        "Sopa de Lentejas", "Sopa de Hongos", "Crema de Calabaza", "Sopa Xóchitl"
      ],
      // 2. Desayunos
      2: [
        "Huevos Rancheros", "Chilaquiles Verdes", "Chilaquiles Rojos", "Huevos a la Mexicana", 
        "Enfrijoladas", "Enchiladas Suizas", "Omelette de Chorizo", "Pan Francés", 
        "Hot Cakes", "Waffles con Frutas", "Molletes", "Enchiladas de Mole", 
        "Huevos Divorciados", "Huevos Motuleños", "Huevos con Machaca", "Omelette Vegetariano", 
        "Quesadillas de Desayuno", "Tacos de Huevo con Chorizo", "Torta de Huevo", "Breakfast Burrito"
      ],
      // 3. Bebidas
      3: [
        "Agua de Jamaica", "Agua de Horchata", "Limonada", "Agua de Tamarindo", 
        "Naranjada", "Agua de Piña", "Refresco de Cola", "Café Americano", 
        "Café de Olla", "Chocolate Caliente", "Michelada", "Cerveza Nacional", 
        "Margarita", "Piña Colada", "Tequila Sunrise", "Mezcalita", 
        "Sangría", "Mojito", "Jugo de Naranja Natural", "Smoothie de Frutas"
      ],
      // 4. Entradas
      4: [
        "Guacamole", "Queso Fundido", "Totopos con Salsa", "Nachos Supremos", 
        "Calamares Fritos", "Ceviche de Camarón", "Aguachile", "Cóctel de Camarón", 
        "Ostiones en su Concha", "Ensalada César", "Ensalada de Nopales", "Carpaccio de Res", 
        "Tostadas de Atún", "Chicharrón de Pescado", "Chalupas", "Botana Mixta", 
        "Empanadas de Queso", "Champiñones al Ajillo", "Flautas de Pollo", "Chiles Rellenos"
      ],
      // 5. Antojitos
      5: [
        "Tacos al Pastor", "Tacos de Carnitas", "Tacos de Bistec", "Tacos de Chorizo", 
        "Tacos de Barbacoa", "Quesadillas de Queso", "Quesadillas de Hongos", "Quesadillas de Flor de Calabaza", 
        "Gorditas de Chicharrón", "Gorditas de Frijol", "Sopes", "Huaraches", 
        "Tlacoyos", "Pambazos", "Garnachas", "Tostadas de Tinga", 
        "Sincronizadas", "Gringas", "Volcanes", "Tortas Ahogadas"
      ],
      // 6. Extras
      6: [
        "Guacamole Extra", "Orden de Tortillas", "Arroz", "Frijoles Charros", 
        "Frijoles Refritos", "Chiles Toreados", "Cebollitas Asadas", "Nopales Asados", 
        "Salsa Habanero", "Salsa Verde", "Pico de Gallo", "Queso Rallado", 
        "Crema Extra", "Aguacate Extra", "Papas a la Francesa", "Ensalada Pequeña", 
        "Limones", "Orden de Pan", "Chorizo Extra", "Chicharrón"
      ],
      // 7. Memelas
      7: [
        "Memela de Chorizo", "Memela de Tasajo", "Memela de Cecina", "Memela de Pollo", 
        "Memela de Res", "Memela de Frijol", "Memela de Queso", "Memela Vegetariana", 
        "Memela con Chicharrón", "Memela con Huevo", "Memela Mixta", "Memela con Championes", 
        "Memela con Flor de Calabaza", "Memela con Huitlacoche", "Memela con Mole", "Memela con Chapulines", 
        "Memela con Quesillo", "Memela con Chile Poblano", "Memela con Nopal", "Memela con Epazote"
      ],
      // 8. Camarones
      8: [
        "Camarones al Ajillo", "Camarones a la Diabla", "Camarones al Coco", "Camarones al Mojo de Ajo", 
        "Camarones Empanizados", "Camarones a la Plancha", "Camarones Rancheros", "Camarones en Chipotle", 
        "Camarones a la Mantequilla", "Camarones en Salsa Verde", "Camarones Zarandeados", "Torre de Camarones", 
        "Camarones a la Parrilla", "Brochetas de Camarón", "Camarones con Tocino", "Tacos de Camarón", 
        "Camarones en Aguachile", "Camarones en Salsa de Mango", "Arroz con Camarones", "Pasta con Camarones"
      ],
      // 9. Mojarras
      9: [
        "Mojarra Frita", "Mojarra al Mojo de Ajo", "Mojarra a la Diabla", "Mojarra en Salsa Verde", 
        "Mojarra Zarandeada", "Mojarra a la Talla", "Mojarra en Hoja de Plátano", "Mojarra al Limón", 
        "Mojarra al Cilantro", "Mojarra Empapelada", "Mojarra en Adobo", "Mojarra a la Veracruzana", 
        "Mojarra con Camarones", "Mojarra Rellena", "Mojarra en Escabeche", "Mojarra al Ajo Negro", 
        "Mojarra con Nopales", "Mojarra con Hongos", "Mojarra con Guacamole", "Mojarra con Costra de Chile"
      ],
      // 10. Pulpo
      10: [
        "Pulpo al Ajillo", "Pulpo a la Gallega", "Pulpo Zarandeado", "Pulpo a las Brasas", 
        "Pulpo en su Tinta", "Pulpo a la Diabla", "Pulpo Encacahuatado", "Pulpo al Grill", 
        "Pulpo al Pastor", "Tacos de Pulpo", "Pulpo en Escabeche", "Pulpo en Salsa Verde", 
        "Pulpo en Ceviche", "Pulpo a la Mantequilla", "Pulpo en Salsa de Cilantro", "Pulpo con Camarones", 
        "Pulpo en Salsa de Mango", "Pulpo en Tostadas", "Pulpo con Papas", "Pulpo con Chorizo"
      ],
      // 11. Filetes
      11: [
        "Filete de Pescado al Ajillo", "Filete de Pescado Empanizado", "Filete de Pescado a la Plancha", "Filete de Pescado en Salsa Verde", 
        "Filete de Pescado a la Diabla", "Filete de Pescado al Mojo de Ajo", "Filete de Pescado a la Veracruzana", "Filete de Pescado en Salsa de Mango", 
        "Filete de Pescado en Hoja de Plátano", "Filete de Pescado al Cilantro", "Filete de Pescado con Camarones", "Filete de Pescado Relleno", 
        "Filete de Pescado con Champiñones", "Filete de Pescado con Costra de Chile", "Filete de Pescado con Salsa de Coco", "Filete de Pescado Zarandeado", 
        "Filete de Pescado al Limón", "Filete de Pescado con Verduras", "Filete de Pescado al Chipotle", "Filete de Pescado al Guajillo"
      ],
      // 12. Postres
      12: [
        "Flan Napolitano", "Arroz con Leche", "Pastel de Tres Leches", "Churros con Chocolate", 
        "Pay de Limón", "Pay de Queso", "Buñuelos", "Plátanos Fritos", 
        "Helado de Vainilla", "Helado de Chocolate", "Nieve de Frutas", "Carlota de Limón", 
        "Fresas con Crema", "Crepas de Cajeta", "Pastel de Chocolate", "Jericalla", 
        "Capirotada", "Chongos Zamoranos", "Dulce de Calabaza", "Cocadas"
      ]
    };

    const basePrices = {
      1: 60, // Sopas
      2: 85, // Desayunos
      3: 35, // Bebidas
      4: 90, // Entradas
      5: 70, // Antojitos
      6: 25, // Extras
      7: 45, // Memelas
      8: 160, // Camarones
      9: 150, // Mojarras
      10: 180, // Pulpo
      11: 140, // Filetes
      12: 50  // Postres
    };

    const totalIngredients = 93;

    const products = [];
    const productIngredients = [];

    let productId = 2;

    for (let categoryId = 1; categoryId <= 12; categoryId++) {
      const categoryProductNames = categoryProducts[categoryId];
      const basePrice = basePrices[categoryId];

      for (let i = 0; i < 20; i++) {
        const priceVariation = Math.floor(basePrice * (0.8 + Math.random() * 0.4));
        
        products.push({
          name: categoryProductNames[i],
          price: priceVariation,
          status: true,
          categoryId: categoryId,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const numIngredients = Math.floor(Math.random() * 6) + 3;
        
        const usedIngredients = new Set();
        
        for (let j = 0; j < numIngredients; j++) {
          let ingredientId;
          do {
            ingredientId = Math.floor(Math.random() * totalIngredients) + 1;
          } while (usedIngredients.has(ingredientId));
          
          usedIngredients.add(ingredientId);
          
          const quantity = Math.floor(Math.random() * 5) + 1;
          
          productIngredients.push({
            productId: productId,
            ingredientId: ingredientId,
            quantity: quantity,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        productId++;
      }
    }

    await queryInterface.bulkInsert('products', products, {});
    
    await queryInterface.bulkInsert('product_ingredients', productIngredients, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_ingredients', null, {});
    await queryInterface.bulkDelete('products', null, {});
  }
};