import React, { useState, useEffect } from "react";
import "./OrderPage.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../components/CartContext";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

interface MenuItemType {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  isBOGOF?: boolean;
}

interface OrderStatus {
  status: "Confirmed" | "Preparing" | "Out for delivery" | "Delivered";
  timestamp: Date;
}

interface OrderType {
  item: MenuItemType;
  quantity: number;
  total: number;
  paymentMethod: string;
  orderTime: Date;
  statusHistory: OrderStatus[];
}

const initialMenuItems: MenuItemType[] = [
  {
    id: 1,
    name: "Butter Chicken",
    category: "Main Dishes",
    description: "Creamy, spiced tomato curry with tender chicken.",
    price: 250,
    image: "/TasteOfHome/butterchick.jpg",
  },
  {
    id: 2,
    name: "Paneer Tikka",
    category: "Appetizers",
    description: "Grilled paneer marinated in aromatic spices.",
    price: 180,
    image: "/TasteOfHome/pantik.jpg",
  },
  {
    id: 3,
    name: "Gulab Jamun",
    category: "Desserts",
    description: "Sweet, syrup-soaked milk balls.",
    price: 90,
    image: "/TasteOfHome/gulab.jpg",
  },
  {
    id: 4,
    name: "Masala Chai",
    category: "Beverages",
    description: "Traditional Indian spiced tea.",
    price: 40,
    image: "/TasteOfHome/masalachai.jpg",
  },
  {
    id: 5,
    name: "Chicken Biryani",
    category: "Main Dishes",
    description: "Fragrant basmati rice cooked with spicy marinated chicken.",
    price: 220,
    image: "/TasteOfHome/biryani.jpg",
  },
  {
    id: 6,
    name: "Samosa",
    category: "Appetizers",
    description: "Deep-fried pastry filled with spicy potatoes and peas.",
    price: 50,
    image: "/TasteOfHome/samosa.jpg",
  },
  {
    id: 7,
    name: "Rasmalai",
    category: "Desserts",
    description: "Soft paneer balls soaked in flavored milk.",
    price: 100,
    image: "/TasteOfHome/rasmalai.jpg",
  },
  {
    id: 8,
    name: "Lassi",
    category: "Beverages",
    description: "Cool yogurt-based drink, sweet or salted.",
    price: 60,
    image: "/TasteOfHome/lassi.jpg",
  },
  {
    id: 9,
    name: "Palak Paneer",
    category: "Main Dishes",
    description: "Cottage cheese cubes in a creamy spinach gravy.",
    price: 200,
    image: "/TasteOfHome/palakpaneer.jpg",
  },
  {
    id: 10,
    name: "Onion Pakoda",
    category: "Appetizers",
    description: "Crispy onion fritters made with gram flour.",
    price: 70,
    image: "/TasteOfHome/pakoda.jpg",
  },
  {
    id: 11,
    name: "Kheer",
    category: "Desserts",
    description: "Rice pudding flavored with cardamom and saffron.",
    price: 80,
    image: "/TasteOfHome/kheer.jpg",
  },
  {
    id: 12,
    name: "Filter Coffee",
    category: "Beverages",
    description: "Strong South Indian brewed coffee with frothy milk.",
    price: 45,
    image: "/TasteOfHome/filtercoffee.jpg",
  },
  {
    id: 13,
    name: "Chole Bhature",
    category: "Main Dishes",
    description: "Spicy chickpeas served with deep-fried fluffy bread.",
    price: 160,
    image: "/TasteOfHome/cholebhature.jpg",
  },
  {
    id: 14,
    name: "Tandoori Chicken",
    category: "Main Dishes",
    description: "Chicken marinated in yogurt and spices, cooked in tandoor.",
    price: 240,
    image: "/TasteOfHome/tandoorichicken.jpg",
  },
  {
    id: 15,
    name: "Dhokla",
    category: "Appetizers",
    description: "Steamed savory cake made from fermented rice and chickpeas.",
    price: 70,
    image: "/TasteOfHome/dhokla.jpg",
  },
  {
    id: 16,
    name: "Aloo Tikki",
    category: "Appetizers",
    description: "Crispy potato patties with spices and herbs.",
    price: 60,
    image: "/TasteOfHome/alootikki.jpg",
  },
  {
    id: 17,
    name: "Jalebi",
    category: "Desserts",
    description: "Deep-fried coils soaked in saffron sugar syrup.",
    price: 50,
    image: "/TasteOfHome/jalebi.jpg",
  },
  {
    id: 18,
    name: "Kulfi",
    category: "Desserts",
    description: "Traditional Indian frozen dairy dessert with cardamom.",
    price: 70,
    image: "/TasteOfHome/kulfi.jpg",
  },
  {
    id: 19,
    name: "Thandai",
    category: "Beverages",
    description: "Chilled milk drink with spices, nuts, and rose essence.",
    price: 65,
    image: "/TasteOfHome/thandai.jpg",
  },
  {
    id: 20,
    name: "Badam Milk",
    category: "Beverages",
    description: "Hot milk flavored with almonds and saffron.",
    price: 55,
    image: "/TasteOfHome/badammilk.jpg",
  },
  {
    id: 21,
    name: "Rajma Chawal",
    category: "Main Dishes",
    description: "Red kidney bean curry served with steamed rice.",
    price: 140,
    image: "/TasteOfHome/rajmachawal.jpg",
  },
  {
    id: 22,
    name: "Fish Curry",
    category: "Main Dishes",
    description: "Spicy and tangy fish curry with coconut or tamarind base.",
    price: 260,
    image: "/TasteOfHome/fishcurry.jpg",
  },
  {
    id: 23,
    name: "Vada Pav",
    category: "Appetizers",
    description: "Spicy potato fritter in a bun with chutney.",
    price: 40,
    image: "/TasteOfHome/vadapav.jpg",
  },
  {
    id: 24,
    name: "Bhel Puri",
    category: "Appetizers",
    description: "Puffed rice tossed with vegetables and tangy tamarind sauce.",
    price: 50,
    image: "/TasteOfHome/bhelpuri.jpg",
  },
  {
    id: 25,
    name: "Besan Ladoo",
    category: "Desserts",
    description: "Sweet gram flour balls with ghee and cardamom.",
    price: 60,
    image: "/TasteOfHome/besanladoo.jpg",
  },
  {
    id: 26,
    name: "Rava Kesari",
    category: "Desserts",
    description: "Semolina pudding flavored with ghee and saffron.",
    price: 55,
    image: "/TasteOfHome/ravakesari.jpg",
  },
  {
    id: 27,
    name: "Nimbu Pani",
    category: "Beverages",
    description: "Refreshing Indian-style lemonade with salt and spices.",
    price: 30,
    image: "/TasteOfHome/nimbupani.jpg",
  },
  {
    id: 28,
    name: "Tender Coconut Water",
    category: "Beverages",
    description: "Naturally sweet and hydrating drink from green coconuts.",
    price: 50,
    image: "/TasteOfHome/coconutwater.jpg",
  },
  {
    id: 29,
    name: "Aloo Paratha",
    category: "Main Dishes",
    description: "Wheat flatbread stuffed with spiced mashed potatoes.",
    price: 100,
    image: "/TasteOfHome/alooparatha.jpg",
  },
  {
    id: 30,
    name: "Kadhi Pakora",
    category: "Main Dishes",
    description: "Yogurt-based curry with gram flour fritters.",
    price: 130,
    image: "/TasteOfHome/kadhi.jpg",
  },
  {
    id: 31,
    name: "Bhindi Masala",
    category: "Main Dishes",
    description: "Stir-fried okra with onions and spices.",
    price: 150,
    image: "/TasteOfHome/bhindi.jpg",
  },
  {
    id: 32,
    name: "Moong Dal Halwa",
    category: "Desserts",
    description: "Rich, slow-cooked lentil dessert with ghee and dry fruits.",
    price: 85,
    image: "/TasteOfHome/moongdalhalwa.jpg",
  },

  // Your 32 items here (same as previous)
];

const menuWithBOGO = [...initialMenuItems];
const randomIndex = Math.floor(Math.random() * menuWithBOGO.length);
menuWithBOGO[randomIndex].isBOGOF = true;

const OrderPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tab, setTab] = useState<"menu" | "orders" | "status">("menu");
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const { addToCart } = useCart();
  const categories = [
    "All",
    ...Array.from(new Set(menuWithBOGO.map((item) => item.category))),
  ];

  const filteredItems = menuWithBOGO.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openOrderModal = (item: MenuItemType) => {
    setSelectedItem(item);
    setQuantity(1);
    setOrderPlaced(false);
    setName("");
    setAddress("");
    setPhone("");
    setPaymentMethod("Cash on Delivery");
  };

  const closeOrderModal = () => {
    setSelectedItem(null);
  };
  
  const handleLikeToggle = (itemId: number) => {
    setLikedItems(prev => {
      if (prev.includes(itemId)) {
        // Unlike: remove from liked items
        return prev.filter(id => id !== itemId);
      } else {
        // Like: add to liked items
        return [...prev, itemId];
      }
    });
    
    // Show toast notification
    const item = menuWithBOGO.find(item => item.id === itemId);
    if (item) {
      const isLiked = !likedItems.includes(itemId);
      if (isLiked) {
        toast.success(`You liked ${item.name}!`);
      } else {
        toast.info(`You unliked ${item.name}`);
      }
    }
    
    // Save liked items to localStorage for persistence
    localStorage.setItem('likedItems', JSON.stringify(
      likedItems.includes(itemId) 
        ? likedItems.filter(id => id !== itemId) 
        : [...likedItems, itemId]
    ));
  };

  const getDiscount = (qty: number, price: number) => {
    return qty >= 3 ? 0.1 * qty * price : 0;
  };

  const discount = selectedItem ? getDiscount(quantity, selectedItem.price) : 0;
  const itemTotal = selectedItem ? selectedItem.price * quantity : 0;
  const finalTotal = itemTotal - discount;

  // Load liked items from localStorage
  useEffect(() => {
    const savedLikedItems = localStorage.getItem('likedItems');
    if (savedLikedItems) {
      try {
        setLikedItems(JSON.parse(savedLikedItems));
      } catch (error) {
        console.error('Error parsing liked items from localStorage:', error);
      }
    }
  }, []);

  // Update order statuses
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const now = new Date();
          const lastStatus =
            order.statusHistory[order.statusHistory.length - 1];
          const timeDiff =
            now.getTime() - new Date(lastStatus.timestamp).getTime();

          const statusOrder: OrderStatus["status"][] = [
            "Confirmed",
            "Preparing",
            "Out for delivery",
            "Delivered",
          ];

          const currentIndex = statusOrder.indexOf(lastStatus.status);
          if (
            currentIndex < statusOrder.length - 1 &&
            timeDiff > 15 * 60 * 1000
          ) {
            return {
              ...order,
              statusHistory: [
                ...order.statusHistory,
                {
                  status: statusOrder[currentIndex + 1],
                  timestamp: now,
                },
              ],
            };
          }
          return order;
        })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!selectedItem) return;
    const totalAmount = finalTotal;

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          quantity,
          price: selectedItem.price,
          total: totalAmount,
          discount,
          paymentMethod,
          phone,
          address,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!");
        setOrderPlaced(true);

        const newOrder: OrderType = {
          item: selectedItem,
          quantity,
          total: totalAmount,
          paymentMethod,
          orderTime: new Date(),
          statusHistory: [
            {
              status: "Confirmed",
              timestamp: new Date(),
            },
          ],
        };

        setOrders((prev) => [...prev, newOrder]);
      } else {
        toast.error(`${data.message || "Order failed"}`);
      }
    } catch {
      toast.error("Something went wrong while placing the order.");
    }
  };

  return (
    <div className="order-page">
      <h2>Order Page</h2>
      <Box sx={{ width: "100%", mb: 3 }}>
       <Box
  sx={{
    backgroundColor: "#FF5200", // Red background
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    mb: 3,
    maxWidth: "1000px",               // Set max width
    margin: "0 auto",
  }}
>
  <Stepper
    activeStep={tab === "menu" ? 0 : tab === "orders" ? 1 : 2}
    alternativeLabel
    sx={{
      color: "#fff", // White text for the entire Stepper
      ".MuiStepLabel-label": {
        color: "#fff !important", // Force white label color
        fontWeight: 600,
      },
      ".Mui-active .MuiStepLabel-label": {
        fontWeight: 700,
        textDecoration: "underline", // Optional: highlight active step
      },
      ".Mui-completed .MuiStepLabel-label": {
        color: "#fff",
        opacity: 0.8,
      },
    }}
  >
    <Step onClick={() => setTab("menu")}>
      <StepLabel sx={{ cursor: "pointer" }}>Menu</StepLabel>
    </Step>
    <Step onClick={() => setTab("orders")}>
      <StepLabel sx={{ cursor: "pointer" }}>Orders</StepLabel>
    </Step>
    <Step onClick={() => setTab("status")}>
      <StepLabel sx={{ cursor: "pointer" }}>Order Status</StepLabel>
    </Step>
  </Stepper>
</Box>

      </Box>
      {tab === "menu" && (
        <div>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
            mb={3}
          >
            <TextField
              size="small"
              label="Search Food"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 240 }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Filter by Category"
              >
                {categories.map((cat, index) => (
                  <MenuItem key={index} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-card">
                <div style={{ position: "relative" }}>
                  <img src={item.image} alt={item.name} className="menu-img" />
                  {item.isBOGOF && <div className="bogo-tag"></div>}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle(item.id);
                    }}
                    className={`like-button ${likedItems.includes(item.id) ? 'liked' : ''}`}
                    aria-label={likedItems.includes(item.id) ? "Unlike" : "Like"}
                  >
                    ♥
                  </button>
                </div>
                <h3>{item.name}</h3>
                <p className="menu-desc">{item.description}</p>
                <div className="menu-footer">
                  <span className="menu-price">₹{item.price}</span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        addToCart({ ...item, quantity: 1 });
                        toast.success(`${item.name} added to cart!`);
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="order-btn"
                      onClick={() => openOrderModal(item)}
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>

            ))}
          </div>
        </div>
      )}
      {tab === "orders" && (
        <div className="orders-list" style={{ padding: "1rem" }}>
          <h3>Your Orders</h3>
          {orders.length === 0 ? (
            <p>No orders placed yet.</p>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {orders.map((order, idx) => (
                <li
                  key={idx}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: "1rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <img
                    src={order.item.image}
                    alt={order.item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <div>
                    <strong>{order.item.name}</strong> x {order.quantity} <br />
                    Quantity: {order.quantity}
                    <br />
                    Total Paid: ₹{order.total.toFixed(2)} <br />
                    Payment Method: {order.paymentMethod}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {tab === "status" && (
        <div style={{ padding: "1rem" }}>
          <h3>Order Status</h3>
          {orders.length === 0 ? (
            <p>No orders to track.</p>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {orders.map((order, idx) => {
                const currentStatus =
                  order.statusHistory[order.statusHistory.length - 1];
                return (
                  <li
                    key={idx}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: "1rem",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src={order.item.image}
                      alt={order.item.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <strong>{order.item.name}</strong>
                    <br />
                    Quantity: {order.quantity} <br />
                    Total: ₹{order.total.toFixed(2)} <br />
                    Current Status: <strong>{currentStatus.status}</strong>{" "}
                    <br />
                    Updated At: {currentStatus.timestamp.toLocaleTimeString()}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="modal-img"
            />
            <p>
              <strong>{selectedItem.name}</strong> - {selectedItem.category}
            </p>
            <p>{selectedItem.description}</p>

            {selectedItem.isBOGOF && (
              <p className="bogo-modal-msg">
                🎁 This item qualifies for Buy 1 Get 1 Free!
              </p>
            )}

            <div className="quantity-section">
              <label>Quantity:</label>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="pricing-section">
              <p>Item Price: ₹{selectedItem.price}</p>
              {discount > 0 && (
                <p>Discount: ₹{discount.toFixed(2)} (10% per item)</p>
              )}
              <p>
                <strong>Total: ₹{finalTotal.toFixed(2)}</strong>
              </p>
            </div>

            <form className="order-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="payment-method">
                <label>
                  <strong>Payment Method:</strong>
                </label>
                <div className="payment-options">
                  <label>
                    <input
                      type="radio"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cash on Delivery
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Card Payment"
                      checked={paymentMethod === "Card Payment"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Card Payment
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Online Wallet"
                      checked={paymentMethod === "Online Wallet"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Online Wallet
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={orderPlaced}
              >
                {orderPlaced ? "Order Placed" : "Place Order"}
              </button>
              <button
                type="button"
                onClick={closeOrderModal}
                className="close-btn"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default OrderPage;
