import React, { useState } from "react";
import "./MenuPage.css";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

const menuItems: MenuItem[] = [
 
  {
    id: 1,
    name: 'Butter Chicken',
    category: 'Main Dishes',
    description: 'Creamy, spiced tomato curry with tender chicken.',
    price: 250,
    image: 'butterchick.jpg',
  },
  {
    id: 2,
    name: 'Paneer Tikka',
    category: 'Appetizers',
    description: 'Grilled paneer marinated in aromatic spices.',
    price: 180,
    image: 'pantik.jpg',
  },
  {
    id: 3,
    name: 'Gulab Jamun',
    category: 'Desserts',
    description: 'Sweet, syrup-soaked milk balls.',
    price: 90,
    image: 'gulab.jpg',
  },
  {
    id: 4,
    name: 'Masala Chai',
    category: 'Beverages',
    description: 'Traditional Indian spiced tea.',
    price: 40,
    image: 'masalachai.jpg',
  },
  // New items
  {
    id: 5,
    name: 'Dal Makhani',
    category: 'Main Dishes',
    description: 'Slow-cooked lentils in a creamy tomato sauce.',
    price: 200,
    image: 'dalmakhani.jpg',
  },
  {
    id: 6,
    name: 'Samosa',
    category: 'Appetizers',
    description: 'Crispy pastry filled with spicy potatoes and peas.',
    price: 60,
    image: 'samosa.jpg',
  },
  {
    id: 7,
    name: 'Rasgulla',
    category: 'Desserts',
    description: 'Soft, spongy cheese balls soaked in sweet syrup.',
    price: 80,
    image: 'rasgulla.jpg',
  },
  {
    id: 8,
    name: 'Lassi',
    category: 'Beverages',
    description: 'Refreshing yogurt-based drink, sweet or salted.',
    price: 50,
    image: 'lassi.jpg',
  },
  {
    id: 9,
    name: 'Chicken Biryani',
    category: 'Main Dishes',
    description: 'Fragrant basmati rice cooked with chicken and spices.',
    price: 300,
    image: 'biryani.jpg',
  },
  {
    id: 10,
    name: 'Pakora',
    category: 'Appetizers',
    description: 'Fritters made from vegetables coated in chickpea flour.',
    price: 70,
    image: 'pakora.jpg',
  },
  {
    id: 11,
    name: 'Kheer',
    category: 'Desserts',
    description: 'Creamy rice pudding flavored with cardamom and nuts.',
    price: 85,
    image: 'kheer.jpg',
  },
  {
    id: 12,
    name: 'Masala Soda',
    category: 'Beverages',
    description: 'Sparkling soda with tangy Indian spices.',
    price: 45,
    image: 'masalasoda.jpg',
  },
//   {
//     id: 13,
//     name: 'Tandoori Chicken',
//     category: 'Main Dishes',
//     description: 'Juicy chicken marinated in yogurt and spices, cooked in a tandoor.',
//     price: 280,
//     image: 'tandoorichicken.jpg',
//   },
//   {
//     id: 14,
//     name: 'Aloo Tikki',
//     category: 'Appetizers',
//     description: 'Crispy fried potato patties served with chutneys.',
//     price: 70,
//     image: 'alootikki.jpg',
//   },
//   {
//     id: 15,
//     name: 'Jalebi',
//     category: 'Desserts',
//     description: 'Sweet, spiral-shaped fried batter soaked in sugar syrup.',
//     price: 75,
//     image: 'jalebi.jpg',
//   },
//   {
//     id: 16,
//     name: 'Nimbu Pani',
//     category: 'Beverages',
//     description: 'Refreshing Indian style lemonade with a hint of salt and spices.',
//     price: 35,
//     image: 'nimbupani.jpg',
//   },
//   {
//     id: 17,
//     name: 'Palak Paneer',
//     category: 'Main Dishes',
//     description: 'Cottage cheese cooked in a smooth spinach gravy.',
//     price: 230,
//     image: 'palakpaneer.jpg',
//   },
//   {
//     id: 18,
//     name: 'Chicken 65',
//     category: 'Appetizers',
//     description: 'Spicy deep-fried chicken bites with a crispy exterior.',
//     price: 200,
//     image: 'chicken65.jpg',
//   },
//   {
//     id: 19,
//     name: 'Ras Malai',
//     category: 'Desserts',
//     description: 'Soft paneer balls soaked in creamy, flavored milk.',
//     price: 95,
//     image: 'rasmalai.jpg',
//   },
//   {
//     id: 20,
//     name: 'Masala Lassi',
//     category: 'Beverages',
//     description: 'Sweet and spicy yogurt drink with Indian spices.',
//     price: 55,
//     image: 'masalalassi.jpg',
//   },
//   {
//     id: 21,
//     name: 'Fish Curry',
//     category: 'Main Dishes',
//     description: 'Tangy and spicy fish curry cooked with coconut milk.',
//     price: 270,
//     image: 'fishcurry.jpg',
//   },
//   {
//     id: 22,
//     name: 'Veg Spring Rolls',
//     category: 'Appetizers',
//     description: 'Crunchy rolls stuffed with mixed vegetables.',
//     price: 90,
//     image: 'springrolls.jpg',
//   },
//   {
//     id: 23,
//     name: 'Kaju Katli',
//     category: 'Desserts',
//     description: 'Delicious cashew nut fudge with a smooth texture.',
//     price: 120,
//     image: 'kajukatli.jpg',
//   },
//   {
//     id: 24,
//     name: 'Chai Latte',
//     category: 'Beverages',
//     description: 'Creamy and spiced Indian tea with steamed milk.',
//     price: 60,
//     image: 'chailatte.jpg',
//   },

];

const MenuPage: React.FC = () => {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addedItem, setAddedItem] = useState<MenuItem | null>(null);
  const [showCartModal, setShowCartModal] = useState(false);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => [...prevCart, item]);
    setAddedItem(item);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const openCartModal = () => {
    setShowCartModal(true);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
  };

  return (
    <div className="menu-container">
      {/* Cart Icon */}
      <div className="cart-icon" title="View Cart" onClick={openCartModal}>
        🛒
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </div>

      <h1 className="menu-heading">Explore Our Menu</h1>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-img" />
            <h3>{item.name}</h3>
            <p className="menu-desc">{item.description}</p>
            <div className="menu-footer">
              <span className="menu-price">₹{item.price}</span>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add to Cart Confirmation Modal */}
      {showAddModal && addedItem && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Added to Cart</h2>
            <p>{addedItem.name} has been added to your cart.</p>
            <button className="close-modal-btn" onClick={closeAddModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cart Items Modal */}
      {showCartModal && (
        <div className="modal-overlay" onClick={closeCartModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="cart-list">
                {cart.map((item, index) => (
                  <li key={index} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        marginBottom: "8px",
                      }}
                    />
                    <div className="cart-item-text">
                      <div>{item.name}</div>
                      <div>₹{item.price}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button className="close-modal-btn" onClick={closeCartModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
