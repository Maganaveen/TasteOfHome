// TraditionalFoodPage.tsx
import React from 'react';
import './TraditionalFoodPage.css';

const traditionalFoods = [
  { name: 'Idli & Sambar', image: '/idli.jpg', description: 'Soft steamed idlis with hot sambar.' },
  { name: 'Masala Dosa', image: '/dosa.jpg', description: 'Crispy dosa stuffed with spiced potatoes.' },
  { name: 'Chicken Chettinad', image: '/chettinad.jpg', description: 'Spicy South Indian chicken curry.' },
  { name: 'Pongal', image: '/pongal.jpg', description: 'Warm rice and moong dal cooked with ghee and pepper.' },
  { name: 'Vada', image: '/vada.jpg', description: 'Crispy deep-fried lentil doughnuts served with chutney.' },
  { name: 'Paruppu Rasam', image: '/rasam.jpg', description: 'Tangy tamarind soup with lentils and spices.' },
  { name: 'Fish Curry', image: '/fishcurry.jpg', description: 'Traditional tamarind-based spicy fish curry.' },
  { name: 'Appam with Stew', image: '/appam.jpg', description: 'Lacy rice pancakes served with coconut milk stew.' },
  { name: 'Kootu', image: '/kootu.jpg', description: 'Vegetable and lentil curry with mild spices.' },
  { name: 'Kuzhi Paniyaram', image: '/paniyaram.jpg', description: 'Crispy outside, soft inside – made from dosa batter.' },
  { name: 'Thalappakatti Biryani', image: '/thalappakatti.jpg', description: 'Aromatic Dindigul-style biryani with seeraga samba rice.' },
  { name: 'Murukku', image: '/murukku.jpg', description: 'Crunchy rice flour snack seasoned with sesame and cumin.' },
  { name: 'Sakkarai Pongal', image: '/sakkaraipongal.jpg', description: 'Sweet jaggery rice with ghee, cashews, and raisins.' }
];

const TraditionalFoodPage: React.FC = () => {
  return (
    <div className="food-page">
      <img src="/thoranam.jpg" alt="Thoranam" className="thoranam-banner" />
      <h2>Traditional Foods</h2>
      <div className="food-grid">
        {traditionalFoods.map((food, idx) => (
          <div key={idx} className="food-card">
            <img src={food.image} alt={food.name} />
            <h3>{food.name}</h3>
            <p>{food.description}</p>
          </div>
        ))}
      </div>
      {/* <img src="/kolam-border-top.jpg" alt="Kolam Border" className="kolam-border" /> */}
      {/* <img src="/lamp.jpg" alt="Lamp" clas  sName="corner-lamp" /> */}
      {/* Bottom Decorative Band */}
<div className="bottom-decor"></div>
<img src="/floral-border.jpg" alt="Floral Border" className="floral-border-bottom" />

{/* Optional Footer Text */}
<div className="bottom-message">
  Thank you for exploring the rich taste of our traditional cuisine!
</div>
    </div>
  );
};

export default TraditionalFoodPage;