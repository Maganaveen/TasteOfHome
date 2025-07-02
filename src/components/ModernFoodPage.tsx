import React from 'react';
import './ModernFoodPage.css';

const modernFoods = [
  { name: 'Peri Peri Fries', image: '/TasteOfHome/fries.jpg', description: 'Crispy fries with spicy peri peri seasoning.' },
  { name: 'Paneer Wrap', image: '/TasteOfHome/wrap.jpg', description: 'Fusion of Indian paneer and tortilla wrap.' },
  { name: 'Bubble Tea', image: '/TasteOfHome/bubbletea.jpg', description: 'Refreshing milk tea with tapioca pearls.' },
  { name: 'Sushi Rolls', image: '/TasteOfHome/sushi.jpg', description: 'Japanese-style rolls with rice, veggies, and seafood.' },
  { name: 'Falafel Bowl', image: '/TasteOfHome/falafel.jpg', description: 'Middle-Eastern chickpea patties in a power bowl.' },
  { name: 'Avocado Toast', image: '/TasteOfHome/avocadotoast.jpg', description: 'Toasted bread topped with smashed avocado and toppings.' },
  { name: 'Vegan Burger', image: '/TasteOfHome/veganburger.jpg', description: 'Plant-based burger with lettuce, tomato, and vegan mayo.' },
  { name: 'Tandoori Pizza', image: '/TasteOfHome/tandooripizza.jpg', description: 'Indian-inspired pizza with tandoori veggies and paneer.' },
  { name: 'Mango Smoothie Bowl', image: '/TasteOfHome/smoothiebowl.jpg', description: 'Tropical mango smoothie topped with seeds and fruits.' },
  { name: 'Chocolate Lava Cake', image: '/TasteOfHome/lavacake.jpg', description: 'Warm chocolate cake with gooey center.' },
  { name: 'Pasta Alfredo', image: '/TasteOfHome/alfredo.jpg', description: 'Creamy white sauce pasta with herbs and cheese.' },
  { name: 'Stuffed Tacos', image: '/TasteOfHome/tacos.jpg', description: 'Crispy tacos loaded with modern Indian fillings.' },
  { name: 'Cold Brew Coffee', image: '/TasteOfHome/coldbrew.jpg', description: 'Chilled coffee steeped overnight for bold flavor.' }
];

const ModernFoodPage: React.FC = () => {
  return (
    <div className="modern-page">
      <h2 className="modern-title">Discover Modern Flavors</h2>
      <p className="modern-subtitle">Trendy tastes that blend tradition with innovation</p>

      <div className="modern-grid">
        {modernFoods.map((food, idx) => (
          <div key={idx} className="modern-card">
            <img src={food.image} alt={food.name} className="modern-img" />
            <div className="modern-info">
              <h3>{food.name}</h3>
              <p>{food.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernFoodPage;
