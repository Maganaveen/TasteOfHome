import React from "react";

const vegFoods = [
  { name: "Vegetable Biryani", image: "/vegbiryani.jpg", description: "Aromatic basmati rice with spiced vegetables." },
  { name: "Palak Paneer", image: "/palakpaneer.jpg", description: "Spinach curry with soft paneer cubes." },
  { name: "Veg Kofta", image: "/vegkofta.jpg", description: "Fried vegetable balls in creamy tomato curry." },
  { name: "Dal Makhani", image: "/dalmakhani.jpg", description: "Rich lentil stew with butter and cream." },
  { name: "Paneer Tikka Masala", image: "/panneritikamasaal.jpg", description: "Marinated paneer chunks cooked in a rich tomato sauce." },
  { name: "Chana Masala", image: "/chamanasal.jpg", description: "Spicy chickpea curry with tomatoes and onions." },
  { name: "Saag Aloo", image: "/saagaalo.jpg", description: "Spinach and potato curry with ginger and garlic." },
  { name: "Gobi Manchurian", image: "/gobimanjuarion.jpg", description: "Stir-fried cauliflower florets with soy sauce and spices." },
  { name: "Kadai Paneer", image: "/kadairpaneer.jpg", description: "Soft paneer cubes cooked in a spicy tomato-based gravy." },
  { name: "Matar Paneer", image: "/matarpaneer.jpg", description: "Green peas and paneer cooked together." },
  { name: "Paneer Butter Masala", image: "/pannerbuttermasala.jpg", description: "Creamy paneer dish with butter and spices."},
  {name: "Malai Kofta", image: "/malai_kofta.jpg", description: "Deep-fried vegetable balls served with a creamy tomato-based gravy."},
  
];

const VegFoodPage: React.FC = () => (
  <div className="food-page">
    <h2>Vegetarian Foods</h2>
    <div className="food-grid">
      {vegFoods.map((food, idx) => (
        <div key={idx} className="food-card">
          <img src={food.image} alt={food.name} />
          <h3>{food.name}</h3>
          <p>{food.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default VegFoodPage;
