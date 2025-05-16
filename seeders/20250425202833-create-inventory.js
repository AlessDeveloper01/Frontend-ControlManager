'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const ingredientNames = [
    "Tomato", "Lettuce", "Carrot", "Onion", "Cucumber", "Pepper", "Garlic",
    "Potato", "Broccoli", "Spinach", "Mushroom", "Eggplant", "Zucchini", "Corn",
    "Peas", "Celery", "Cauliflower", "Bell Pepper", "Asparagus", "Green Bean",
    "Cabbage", "Radish", "Kale", "Sweet Potato", "Pumpkin", "Avocado", "Ginger",
    "Cilantro", "Parsley", "Basil", "Thyme", "Rosemary", "Oregano", "Mint",
    "Lemon", "Lime", "Orange", "Apple", "Banana", "Strawberry", "Blueberry",
    "Raspberry", "Blackberry", "Grapes", "Watermelon", "Cantaloupe", "Pineapple",
    "Mango", "Peach", "Pear", "Plum", "Cherry", "Kiwi", "Coconut", "Olive",
    "Chickpea", "Lentil", "Black Bean", "Kidney Bean", "Rice", "Quinoa", "Pasta",
    "Flour", "Sugar", "Salt", "Pepper", "Cinnamon", "Nutmeg", "Paprika", "Cumin",
    "Coriander", "Turmeric", "Chili Powder", "Vanilla", "Honey", "Maple Syrup",
    "Vinegar", "Soy Sauce", "Olive Oil", "Butter", "Milk", "Cream", "Yogurt", 
    "Cheese", "Egg", "Chicken", "Beef", "Pork", "Fish", "Shrimp", "Tofu", "Nuts"
  ];
  
  const ingredients = [];
  
  for (let i = 0; i < ingredientNames.length; i++) {
    ingredients.push({
      name: ingredientNames[i],
      quantity: Math.floor(Math.random() * 100) + 20,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  return await queryInterface.bulkInsert('ingredients', ingredients, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ingredients', null, {});
  }
};
