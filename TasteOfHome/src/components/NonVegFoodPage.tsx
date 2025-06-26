import React from "react";

const nonVegFoods = [
  { name: "Chicken 65", image: "/chicken65.jpg", description: "Deep-fried spicy chicken bites." },
  { name: "Fish Fry", image: "/fishfry.jpg", description: "Crispy seared fish with masala coating." },
  { name: "Mutton Curry", image: "/muttoncurry.jpg", description: "Rich and spicy mutton curry with Indian spices." },
  { name: "Lamb Kebabs", image: "/lambkebabs.jpg", description: "Marinated lamb kebabs grilled to perfection." },
  { name: "Shrimp Masala", image: "/shrimpmasala.jpg", description: "Delicious shrimp cooked in a creamy masala sauce." },
  { name: "Prawn Curry", image: "/prawncurry.jpg", description: "Tender prawns cooked in a flavorful curry." },
  { name: "Egg Curry", image: "/eggcurry.jpg", description: "Soft-boiled eggs cooked in a rich curry." },
  { name: "Goat Meat Stew", image: "/goatmeatstew.jpg", description: "Slow-cooked goat meat stew with vegetables." },
  { name: "Venison Curry", image: "/venisoncurry.jpg", description: "Wild venison cooked in a traditional curry." },
  { name: "Turkey Roast", image: "/turkeyroast.jpg", description: "Roasted turkey with herbs and gravy." },
  {name: "Duck Confit", image: "/duckconfit.jpg", description: "Slow-cooked duck confit served with roasted vegetables." },
  {name: "Quail Eggs", image: "/quaillegs.jpg", description: "Poached quail eggs served with hollandaise sauce." },
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
