'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener todos los productos para poder acceder a sus precios
    const products = await queryInterface.sequelize.query(
      'SELECT id, name, price FROM products',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const meseros = [
      'Demo Mesero1', 'Demo Mesero2', 'Demo Mesero3', 'Demo Mesero4', 
      'Demo Mesero5', 'Demo Mesero6', 'Demo Mesero7', 'Demo Mesero8',
      'AdminRoot'
    ];

    const paymentMethods = ['Efectivo', 'Tarjeta', null];

    // Crear 50 órdenes
    const orders = [];
    const orderDates = []; // Guardamos las fechas en un array separado
    
    for (let i = 0; i < 50; i++) {
      // Generar fecha (últimos 30 días)
      const fechaActual = new Date();
      const date = new Date();
      date.setDate(fechaActual.getDate() - Math.floor(Math.random() * 30));
      orderDates.push(date); // Guardar la fecha para usarla después
      
      // Datos aleatorios para la orden
      const mesero = meseros[Math.floor(Math.random() * meseros.length)];
      const numTable = Math.floor(Math.random() * 50) + 1;
      
      // 70% de probabilidad de que la orden esté completada
      const isCompleted = Math.random() < 0.7;
      const status = isCompleted;
      
      // Si la orden está completa, asignar un método de pago y fecha de finalización
      const methodPayment = isCompleted ? 
                            paymentMethods[Math.floor(Math.random() * 2)] : 
                            null;
      
      // Fecha de finalización
      let finishDate = null;
      if (isCompleted) {
        finishDate = new Date(date);
        finishDate.setMinutes(date.getMinutes() + Math.floor(Math.random() * 90) + 30);
      }
      
      // Crear la orden con un total inicial de 0
      orders.push({
        mesero: mesero,
        total: 0, // Lo actualizaremos después
        status: status,
        date: date,
        finishDate: finishDate,
        methodPayment: methodPayment,
        numTable: numTable,
        createdAt: date,
        updatedAt: date
      });
    }

    // Insertar órdenes
    await queryInterface.bulkInsert('orders', orders, {});
    
    // Obtener los IDs generados
    const insertedOrders = await queryInterface.sequelize.query(
      'SELECT id FROM orders ORDER BY id ASC',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Array para almacenar los productos en órdenes
    const orderProducts = [];

    // Asociamos productos a cada orden
    for (let i = 0; i < insertedOrders.length; i++) {
      const orderId = insertedOrders[i].id;
      const orderDate = orderDates[i]; // Usar la fecha guardada anteriormente
      
      // Número aleatorio de productos (entre 2 y 8)
      const numProductsInOrder = Math.floor(Math.random() * 7) + 2;
      
      // Conjunto para evitar productos duplicados
      const selectedProducts = new Set();
      let orderTotal = 0;
      
      // Seleccionamos productos aleatorios para esta orden
      for (let j = 0; j < numProductsInOrder; j++) {
        // Elegir un producto al azar
        let selectedProduct;
        do {
          selectedProduct = products[Math.floor(Math.random() * products.length)];
        } while (selectedProducts.has(selectedProduct.id));
        
        selectedProducts.add(selectedProduct.id);
        
        // Cantidad aleatoria (entre 1 y 3)
        const quantity = Math.floor(Math.random() * 3) + 1;
        const productPrice = selectedProduct.price;
        const productTotal = productPrice * quantity;
        
        // Acumular al total
        orderTotal += productTotal;
        
        // Agregar a lista de productos en la orden
        orderProducts.push({
          orderId: orderId,
          productId: selectedProduct.id,
          quantity: quantity,
          price: productPrice,
          total: productTotal,
          createdAt: orderDate,
          updatedAt: orderDate
        });
      }
      
      // Actualizar el total de la orden
      await queryInterface.sequelize.query(
        `UPDATE orders SET total = ${orderTotal} WHERE id = ${orderId}`,
        { type: queryInterface.sequelize.QueryTypes.UPDATE }
      );
    }
    
    // Insertar productos en órdenes
    await queryInterface.bulkInsert('order_products', orderProducts, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_products', null, {});
    await queryInterface.bulkDelete('orders', null, {});
  }
};