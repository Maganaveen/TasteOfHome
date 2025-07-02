import React from "react";

const nonVegFoods = [
  { name: "Chicken 65", image: "${import.meta.env.BASE_URL}chicken65.jpg", description: "Deep-fried spicy chicken bites." },
  { name: "Fish Fry", image: "${import.meta.env.BASE_URL}fishfry.jpg", description: "Crispy seared fish with masala coating." },
  { name: "Mutton Curry", image: "${import.meta.env.BASE_URL}muttoncurry.jpg", description: "Rich and spicy mutton curry with Indian spices." },
  { name: "Lamb Kebabs", image: "${import.meta.env.BASE_URL}lambkebabs.jpg", description: "Marinated lamb kebabs grilled to perfection." },
  { name: "Shrimp Masala", image: "${import.meta.env.BASE_URL}shrimpmasala.jpg", description: "Delicious shrimp cooked in a creamy masala sauce." },
  { name: "Prawn Curry", image: "${import.meta.env.BASE_URL}prawncurry.jpg", description: "Tender prawns cooked in a flavorful curry." },
  { name: "Egg Curry", image: "${import.meta.env.BASE_URL}eggcurry.jpg", description: "Soft-boiled eggs cooked in a rich curry." },
  { name: "Goat Meat Stew", image: "${import.meta.env.BASE_URL}goatmeatstew.jpg", description: "Slow-cooked goat meat stew with vegetables." },
  { name: "Venison Curry", image: "${import.meta.env.BASE_URL}venisoncurry.jpg", description: "Wild venison cooked in a traditional curry." },
  { name: "Turkey Roast", image: "${import.meta.env.BASE_URL}turkeyroast.jpg", description: "Roasted turkey with herbs and gravy." },
  {name: "Duck Confit", image: "${import.meta.env.BASE_URL}duckconfit.jpg", description: "Slow-cooked duck confit served with roasted vegetables." },
  {name: "Quail Eggs", image: "${import.meta.env.BASE_URL}quaillegs.jpg", description: "Poached quail eggs served with hollandaise sauce." },
];

const NonVegFoodPage: React.FC = () => (
  <div className="food-page">
    <h2>Non-Vegetarian Foods</h2>
    <div className="food-grid">
      {nonVegFoods.map((food, idx) => (
        <div key={idx} className="food-card">
          <img src={food.image} alt={food.name} />
          <h3>{food.name}</h3>
          <p>{food.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default NonVegFoodPage;
