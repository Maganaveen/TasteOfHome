import React from 'react';
import './ModernFoodPage.css';

const modernFoods = [
  { name: 'Peri Peri Fries', image: '/fries.jpg', description: 'Crispy fries with spicy peri peri seasoning.' },
  { name: 'Paneer Wrap', image: '/wrap.jpg', description: 'Fusion of Indian paneer and tortilla wrap.' },
  { name: 'Bubble Tea', image: '/bubbletea.jpg', description: 'Refreshing milk tea with tapioca pearls.' },
  { name: 'Sushi Rolls', image: '/sushi.jpg', description: 'Japanese-style rolls with rice, veggies, and seafood.' },
  { name: 'Falafel Bowl', image: '/falafel.jpg', description: 'Middle-Eastern chickpea patties in a power bowl.' },
  { name: 'Avocado Toast', image: '/avocadotoast.jpg', description: 'Toasted bread topped with smashed avocado and toppings.' },
  { name: 'Vegan Burger', image: '/veganburger.jpg', description: 'Plant-based burger with lettuce, tomato, and vegan mayo.' },
  { name: 'Tandoori Pizza', image: '/tandooripizza.jpg', description: 'Indian-inspired pizza with tandoori veggies and paneer.' },
  { name: 'Mango Smoothie Bowl', image: '/smoothiebowl.jpg', description: 'Tropical mango smoothie topped with seeds and fruits.' },
  { name: 'Chocolate Lava Cake', image: '/lavacake.jpg', description: 'Warm chocolate cake with gooey center.' },
  { name: 'Pasta Alfredo', image: '/alfredo.jpg', description: 'Creamy white sauce pasta with herbs and cheese.' },
  { name: 'Stuffed Tacos', image: '/tacos.jpg', description: 'Crispy tacos loaded with modern Indian fillings.' },
  { name: 'Cold Brew Coffee', image: '/coldbrew.jpg', description: 'Chilled coffee steeped overnight for bold flavor.' }
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
