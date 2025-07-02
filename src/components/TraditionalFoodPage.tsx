// TraditionalFoodPage.tsx
import React from 'react';
import './TraditionalFoodPage.css';

const traditionalFoods = [
  { name: 'Idli & Sambar', image: '${import.meta.env.BASE_URL}idli.jpg', description: 'Soft steamed idlis with hot sambar.' },
  { name: 'Masala Dosa', image: '${import.meta.env.BASE_URL}dosa.jpg', description: 'Crispy dosa stuffed with spiced potatoes.' },
  { name: 'Chicken Chettinad', image: '${import.meta.env.BASE_URL}chettinad.jpg', description: 'Spicy South Indian chicken curry.' },
  { name: 'Pongal', image: '${import.meta.env.BASE_URL}pongal.jpg', description: 'Warm rice and moong dal cooked with ghee and pepper.' },
  { name: 'Vada', image: '${import.meta.env.BASE_URL}vada.jpg', description: 'Crispy deep-fried lentil doughnuts served with chutney.' },
  { name: 'Paruppu Rasam', image: '${import.meta.env.BASE_URL}rasam.jpg', description: 'Tangy tamarind soup with lentils and spices.' },
  { name: 'Fish Curry', image: '${import.meta.env.BASE_URL}fishcurry.jpg', description: 'Traditional tamarind-based spicy fish curry.' },
  { name: 'Appam with Stew', image: '${import.meta.env.BASE_URL}appam.jpg', description: 'Lacy rice pancakes served with coconut milk stew.' },
  { name: 'Kootu', image: '${import.meta.env.BASE_URL}kootu.jpg', description: 'Vegetable and lentil curry with mild spices.' },
  { name: 'Kuzhi Paniyaram', image: '${import.meta.env.BASE_URL}paniyaram.jpg', description: 'Crispy outside, soft inside – made from dosa batter.' },
  { name: 'Thalappakatti Biryani', image: '${import.meta.env.BASE_URL}thalappakatti.jpg', description: 'Aromatic Dindigul-style biryani with seeraga samba rice.' },
  { name: 'Murukku', image: '${import.meta.env.BASE_URL}murukku.jpg', description: 'Crunchy rice flour snack seasoned with sesame and cumin.' },
  { name: 'Sakkarai Pongal', image: '${import.meta.env.BASE_URL}sakkaraipongal.jpg', description: 'Sweet jaggery rice with ghee, cashews, and raisins.' }
];

const TraditionalFoodPage: React.FC = () => {
  return (
    <div className="food-page">
      <img src="${import.meta.env.BASE_URL}thoranam.jpg" alt="Thoranam" className="thoranam-banner" />
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
<img src="${import.meta.env.BASE_URL}floral-border.jpg" alt="Floral Border" className="floral-border-bottom" />

{/* Optional Footer Text */}
<div className="bottom-message">
  Thank you for exploring the rich taste of our traditional cuisine!
</div>
    </div>
  );
};

export default TraditionalFoodPage;