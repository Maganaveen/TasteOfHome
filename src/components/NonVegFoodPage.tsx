import React from "react";

const nonVegFoods = [
  { name: "Chicken 65", image: "/TasteOfHome/chicken65.jpg", description: "Deep-fried spicy chicken bites." },
  { name: "Fish Fry", image: "/TasteOfHome/fishfry.jpg", description: "Crispy seared fish with masala coating." },
  { name: "Mutton Curry", image: "/TasteOfHome/muttoncurry.jpg", description: "Rich and spicy mutton curry with Indian spices." },
  { name: "Lamb Kebabs", image: "/TasteOfHome/lambkebabs.jpg", description: "Marinated lamb kebabs grilled to perfection." },
  { name: "Shrimp Masala", image: "/TasteOfHome/shrimpmasala.jpg", description: "Delicious shrimp cooked in a creamy masala sauce." },
  { name: "Prawn Curry", image: "/TasteOfHome/prawncurry.jpg", description: "Tender prawns cooked in a flavorful curry." },
  { name: "Egg Curry", image: "/TasteOfHome/eggcurry.jpg", description: "Soft-boiled eggs cooked in a rich curry." },
  { name: "Goat Meat Stew", image: "/TasteOfHome/goatmeatstew.jpg", description: "Slow-cooked goat meat stew with vegetables." },
  { name: "Venison Curry", image: "/TasteOfHome/venisoncurry.jpg", description: "Wild venison cooked in a traditional curry." },
  { name: "Turkey Roast", image: "/TasteOfHome/turkeyroast.jpg", description: "Roasted turkey with herbs and gravy." },
  {name: "Duck Confit", image: "/TasteOfHome/duckconfit.jpg", description: "Slow-cooked duck confit served with roasted vegetables." },
  {name: "Quail Eggs", image: "/TasteOfHome/quaillegs.jpg", description: "Poached quail eggs served with hollandaise sauce." },
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
