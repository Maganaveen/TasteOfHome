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
  Button,
  // Stepper,
  // Step,
  // StepLabel,
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
  {
    id: 33,
    name: "Chettinad Chicken",
    category: "Main Dishes",
    description: "Fiery Tamil Nadu chicken curry with black pepper and spices.",
    price: 270,
    image: "/TasteOfHome/chettinadchicken.jpg",
  },
  {
    id: 34,
    name: "Idli Sambar",
    category: "Main Dishes",
    description: "Steamed rice cakes served with lentil vegetable stew.",
    price: 60,
    image: "/TasteOfHome/idlisambar.jpg",
  },
  {
    id: 35,
    name: "Medu Vada",
    category: "Appetizers",
    description: "Crispy lentil doughnuts served with chutney.",
    price: 50,
    image: "/TasteOfHome/meduvada.jpg",
  },
  {
    id: 36,
    name: "Chicken 65",
    category: "Appetizers",
    description: "Spicy, deep-fried chicken snack from Tamil Nadu.",
    price: 160,
    image: "/TasteOfHome/chicken65.jpg",
  },
  {
    id: 37,
    name: "Mutton Kurma",
    category: "Main Dishes",
    description: "Rich and creamy mutton curry with coconut and spices.",
    price: 300,
    image: "/TasteOfHome/muttonkurma.jpg",
  },
  {
    id: 38,
    name: "Pongal",
    category: "Main Dishes",
    description:
      "Savory rice-lentil porridge tempered with black pepper and ghee.",
    price: 80,
    image: "/TasteOfHome/pongal.jpg",
  },
  {
    id: 39,
    name: "Kothu Parotta",
    category: "Main Dishes",
    description: "Chopped parotta stir-fried with eggs, meat, and spices.",
    price: 180,
    image: "/TasteOfHome/kothuparotta.jpg",
  },
  {
    id: 40,
    name: "Rava Dosa",
    category: "Main Dishes",
    description: "Crispy dosa made with semolina and rice flour.",
    price: 70,
    image: "/TasteOfHome/ravadosa.jpg",
  },
  {
    id: 41,
    name: "Fish Fry",
    category: "Appetizers",
    description: "Shallow-fried fish coated with Tamil-style masala.",
    price: 200,
    image: "/TasteOfHome/fishfry.jpg",
  },
  {
    id: 42,
    name: "Paruppu Payasam",
    category: "Desserts",
    description: "Lentil jaggery pudding made with coconut milk.",
    price: 90,
    image: "/TasteOfHome/paruppupayasam.jpg",
  },
  {
    id: 43,
    name: "Madras Filter Coffee",
    category: "Beverages",
    description: "South Indian-style strong coffee with milk and froth.",
    price: 40,
    image: "/TasteOfHome/madrascoffee.jpg",
  },
  {
    id: 44,
    name: "Karupatti Coffee",
    category: "Beverages",
    description: "Palm jaggery-sweetened coffee from Tamil Nadu.",
    price: 50,
    image: "/TasteOfHome/karupatticoffee.jpg",
  },
  {
    id: 45,
    name: "Paneer Butter Masala",
    category: "Main Dishes",
    description: "Creamy tomato curry with soft paneer cubes.",
    price: 220,
    image: "/TasteOfHome/paneerbutter.jpg",
  },
  {
    id: 46,
    name: "Tamarind Rice",
    category: "Main Dishes",
    description: "Tangy rice tempered with mustard, curry leaves and peanuts.",
    price: 70,
    image: "/TasteOfHome/tamarindrice.jpg",
  },
  {
    id: 47,
    name: "Vegetable Kurma",
    category: "Main Dishes",
    description: "Mixed vegetables in coconut-based gravy.",
    price: 120,
    image: "/TasteOfHome/vegkurma.jpg",
  },
  {
    id: 48,
    name: "Keerai Vadai",
    category: "Appetizers",
    description: "Lentil fritters with spinach and spices.",
    price: 55,
    image: "/TasteOfHome/keeraivadai.jpg",
  },
  {
    id: 49,
    name: "Ragi Malt",
    category: "Beverages",
    description: "Healthy finger millet drink with jaggery.",
    price: 35,
    image: "/TasteOfHome/ragimalt.jpg",
  },
  {
    id: 50,
    name: "Appam with Stew",
    category: "Main Dishes",
    description:
      "Fermented rice pancakes served with vegetable or chicken stew.",
    price: 140,
    image: "/TasteOfHome/appamstew.jpg",
  },
  {
    id: 51,
    name: "Thayir Sadam",
    category: "Main Dishes",
    description: "Curd rice tempered with mustard, ginger and curry leaves.",
    price: 60,
    image: "/TasteOfHome/curdrice.jpg",
  },
  {
    id: 52,
    name: "Mysore Pak",
    category: "Desserts",
    description: "Rich gram flour sweet with ghee from Mysore.",
    price: 80,
    image: "/TasteOfHome/mysorepak.jpg",
  },
  {
    id: 53,
    name: "Rose Milk",
    category: "Beverages",
    description: "Chilled sweet milk flavored with rose essence.",
    price: 50,
    image: "/TasteOfHome/rosemilk.jpg",
  },
  {
    id: 54,
    name: "Kambu Koozh",
    category: "Beverages",
    description: "Pearl millet porridge served cold with onion and chili.",
    price: 30,
    image: "/TasteOfHome/kambukoozh.jpg",
  },
  {
    id: 55,
    name: "Mutton Chukka",
    category: "Main Dishes",
    description: "Dry mutton fry with Chettinad spices.",
    price: 280,
    image: "/TasteOfHome/muttonchukka.jpg",
  },
  {
    id: 56,
    name: "Uttapam",
    category: "Main Dishes",
    description: "Thick dosa topped with onions, tomatoes, and chilies.",
    price: 70,
    image: "/TasteOfHome/uttapam.jpg",
  },
  {
    id: 57,
    name: "Vegetable Biryani",
    category: "Main Dishes",
    description: "Aromatic rice cooked with mixed vegetables and spices.",
    price: 160,
    image: "/TasteOfHome/vegbiryani.jpg",
  },
  {
    id: 58,
    name: "Egg Curry",
    category: "Main Dishes",
    description: "Boiled eggs in a spicy onion-tomato gravy.",
    price: 130,
    image: "/TasteOfHome/eggcurry.jpg",
  },
  {
    id: 59,
    name: "Kari Dosa",
    category: "Main Dishes",
    description: "Dosa topped with spicy minced meat.",
    price: 150,
    image: "/TasteOfHome/karidosa.jpg",
  },
  {
    id: 60,
    name: "Sundal",
    category: "Appetizers",
    description: "Boiled legumes tempered with coconut and mustard seeds.",
    price: 45,
    image: "/TasteOfHome/sundal.jpg",
  },
  {
    id: 61,
    name: "Adai with Aviyal",
    category: "Main Dishes",
    description: "Lentil crepe served with mixed vegetable coconut curry.",
    price: 130,
    image: "/TasteOfHome/adaiaviyal.jpg",
  },
  {
    id: 62,
    name: "Kalkandu Pongal",
    category: "Desserts",
    description: "Sweet pongal made with rock sugar and ghee.",
    price: 70,
    image: "/TasteOfHome/kalkandu.jpg",
  },
  {
    id: 63,
    name: "Chicken Chettinad Biryani",
    category: "Main Dishes",
    description: "Spicy chicken biryani with bold Chettinad flavors.",
    price: 240,
    image: "/TasteOfHome/chettinadbiriyani.jpg",
  },
  {
    id: 64,
    name: "Sambar Vada",
    category: "Appetizers",
    description: "Crispy vada soaked in hot sambar.",
    price: 60,
    image: "/TasteOfHome/sambarvada.jpg",
  },
  {
    id: 65,
    name: "Badusha",
    category: "Desserts",
    description: "Flaky, syrup-soaked deep-fried sweet.",
    price: 50,
    image: "/TasteOfHome/badusha.jpg",
  },
  {
    id: 66,
    name: "Butter Naan",
    category: "Main Dishes",
    description: "Soft leavened flatbread topped with butter.",
    price: 50,
    image: "/TasteOfHome/butternaan.jpg",
  },
  {
    id: 67,
    name: "Nethili Fry",
    category: "Appetizers",
    description: "Crispy fried anchovy fish with coastal spices.",
    price: 180,
    image: "/TasteOfHome/nethilifry.jpg",
  },
  {
    id: 68,
    name: "Fruit Salad with Ice Cream",
    category: "Desserts",
    description: "Chilled mixed fruit bowl with vanilla ice cream.",
    price: 90,
    image: "/TasteOfHome/fruitsalad.jpg",
  },
  {
    id: 69,
    name: "Masala Buttermilk",
    category: "Beverages",
    description: "Spiced and salted yogurt drink with curry leaves.",
    price: 35,
    image: "/TasteOfHome/masalabuttermilk.jpg",
  },
  {
    id: 70,
    name: "Egg Dosa",
    category: "Main Dishes",
    description: "Thin dosa with egg spread and black pepper.",
    price: 90,
    image: "/TasteOfHome/eggdosa.jpg",
  },
  {
    id: 71,
    name: "Avial",
    category: "Main Dishes",
    description: "Mixed vegetables in coconut and yogurt gravy.",
    price: 100,
    image: "/TasteOfHome/avial.jpg",
  },
  {
    id: 72,
    name: "Lemon Rasam",
    category: "Main Dishes",
    description: "Tangy South Indian soup made with lemon and lentils.",
    price: 60,
    image: "/TasteOfHome/lemonrasam.jpg",
  },
  {
    id: 73,
    name: "Masala Pori",
    category: "Appetizers",
    description: "Spicy puffed rice snack with roasted peanuts.",
    price: 30,
    image: "/TasteOfHome/masalapori.jpg",
  },
  {
    id: 74,
    name: "Sweet Poli",
    category: "Desserts",
    description: "Flatbread filled with jaggery and chana dal paste.",
    price: 65,
    image: "/TasteOfHome/sweetpoli.jpg",
  },
  {
    id: 75,
    name: "Paniyaram",
    category: "Appetizers",
    description: "Ball-shaped snacks made from fermented dosa batter.",
    price: 50,
    image: "/TasteOfHome/paniyaram.jpg",
  },
  {
    id: 76,
    name: "Kuzhi Paniyaram",
    category: "Appetizers",
    description: "Savory version of paniyaram with onions and mustard.",
    price: 55,
    image: "/TasteOfHome/kuzhipaniyaram.jpg",
  },
  {
    id: 77,
    name: "Ragi Dosa",
    category: "Main Dishes",
    description: "Healthy finger millet crepe served with chutney.",
    price: 70,
    image: "/TasteOfHome/ragidosa.jpg",
  },
  {
    id: 78,
    name: "Jackfruit Payasam",
    category: "Desserts",
    description: "Sweet pudding made with ripe jackfruit and coconut milk.",
    price: 85,
    image: "/TasteOfHome/jackfruitpayasam.jpg",
  },
  {
    id: 79,
    name: "Vazhaipoo Vadai",
    category: "Appetizers",
    description: "Banana flower fritters blended with lentils.",
    price: 60,
    image: "/TasteOfHome/vazhaipoovadai.jpg",
  },
  {
    id: 80,
    name: "Kara Kuzhambu",
    category: "Main Dishes",
    description: "Spicy tamarind-based South Indian gravy.",
    price: 110,
    image: "/TasteOfHome/karakuzhambu.jpg",
  },
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
  const [tab, setTab] = useState<"menu" | "orders" | "status" | "track">(
    "menu"
  );
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [trackingOrderId, setTrackingOrderId] = useState<string>("");
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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
    setLikedItems((prev) => {
      if (prev.includes(itemId)) {
        // Unlike: remove from liked items
        return prev.filter((id) => id !== itemId);
      } else {
        // Like: add to liked items
        return [...prev, itemId];
      }
    });

    // Show toast notification
    const item = menuWithBOGO.find((item) => item.id === itemId);
    if (item) {
      const isLiked = !likedItems.includes(itemId);
      if (isLiked) {
        toast.success(`You liked ${item.name}!`);
      } else {
        toast.info(`You unliked ${item.name}`);
      }
    }

    // Save liked items to localStorage for persistence
    localStorage.setItem(
      "likedItems",
      JSON.stringify(
        likedItems.includes(itemId)
          ? likedItems.filter((id) => id !== itemId)
          : [...likedItems, itemId]
      )
    );
  };

  const getDiscount = (qty: number, price: number) => {
    return qty >= 3 ? 0.1 * qty * price : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "#2196f3";
      case "Preparing": return "#ff9800";
      case "Out for delivery": return "#9c27b0";
      case "Delivered": return "#4caf50";
      default: return "#666";
    }
  };

  const getEstimatedDeliveryTime = (statusHistory: any[]) => {
    const currentStatus = statusHistory[statusHistory.length - 1];
    
    switch (currentStatus.status) {
      case "Confirmed":
        return "Your order will be ready in 30-45 minutes";
      case "Preparing":
        return "Your order is being prepared. Expected delivery in 20-30 minutes";
      case "Out for delivery":
        return "Your order is on the way! Expected delivery in 10-15 minutes";
      case "Delivered":
        return "Order delivered successfully!";
      default:
        return "Estimated delivery time will be updated soon";
    }
  };

  const discount = selectedItem ? getDiscount(quantity, selectedItem.price) : 0;
  const itemTotal = selectedItem ? selectedItem.price * quantity : 0;
  const finalTotal = itemTotal - discount;

  // Load liked items from localStorage
  useEffect(() => {
    const savedLikedItems = localStorage.getItem("likedItems");
    if (savedLikedItems) {
      try {
        setLikedItems(JSON.parse(savedLikedItems));
      } catch (error) {
        console.error("Error parsing liked items from localStorage:", error);
      }
    }
  }, []);

  // Fetch orders from database
  const fetchOrdersFromDB = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDbOrders(data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Track specific order by ID
  const trackOrderById = async (orderId: string, showLoading: boolean = true) => {
    const token = localStorage.getItem("token");
    if (!token || !orderId) return;

    if (showLoading) setIsRefreshing(true);

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrackedOrder(data);
      } else {
        toast.error("Order not found or access denied");
        setTrackedOrder(null);
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      toast.error("Error tracking order");
    } finally {
      if (showLoading) setIsRefreshing(false);
    }
  };

  // Auto-refresh tracked order every 30 seconds when tracking
  useEffect(() => {
    if (!trackedOrder) return;

    const interval = setInterval(() => {
      trackOrderById(trackedOrder._id, false); // Don't show loading for auto-refresh
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [trackedOrder?._id]);

  // Load orders when tab changes to status or track
  useEffect(() => {
    if (tab === "status" || tab === "track") {
      fetchOrdersFromDB();
    }
  }, [tab]);

  // Update order statuses for database orders
  const updateOrderStatusInDB = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        console.log(`Order ${orderId} status updated to ${newStatus}`);
        return true;
      } else {
        console.error(`Failed to update order ${orderId} status`);
        return false;
      }
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      return false;
    }
  };

  // Update order statuses (both local and database)
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const statusOrder: OrderStatus["status"][] = [
        "Confirmed",
        "Preparing",
        "Out for delivery",
        "Delivered",
      ];

      // Update local orders (for backward compatibility)
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const lastStatus =
            order.statusHistory[order.statusHistory.length - 1];
          const timeDiff =
            now.getTime() - new Date(lastStatus.timestamp).getTime();

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

      // Update database orders
      for (const order of dbOrders) {
        const lastStatus = order.statusHistory[order.statusHistory.length - 1];
        const timeDiff = now.getTime() - new Date(lastStatus.timestamp).getTime();
        const currentIndex = statusOrder.indexOf(lastStatus.status);
        
        if (
          currentIndex < statusOrder.length - 1 &&
          timeDiff > 15 * 60 * 1000 // 15 minutes
        ) {
          const newStatus = statusOrder[currentIndex + 1];
          const updated = await updateOrderStatusInDB(order._id, newStatus);
          
          if (updated) {
            // Refresh the orders from database to get updated status
            await fetchOrdersFromDB();
            
            // If this is the currently tracked order, refresh it too
            if (trackedOrder && trackedOrder._id === order._id) {
              await trackOrderById(order._id, false);
            }
          }
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [dbOrders, trackedOrder]);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!selectedItem || !name.trim() || !address.trim() || !phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
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
          customerName: name,
          phone,
          address,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Order placed successfully! Order ID: ${data.orderId}`);
        setOrderPlaced(true);

        // Refresh orders from database
        fetchOrdersFromDB();

        // Keep the local orders for backward compatibility
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
        
        // Auto-close modal after 2 seconds
        setTimeout(() => {
          closeOrderModal();
        }, 2000);
      } else {
        toast.error(`${data.message || "Order failed"}`);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Something went wrong while placing the order.");
    }
  };

  return (
    <div className="order-page">
      {/* <h2>Order Page</h2> */}
      {/* ✅ Hero Banner */}
      <div className="hero-banner">
        <img
          src="/TasteOfHome/burger.jpg"
          alt="Order Food"
          className="hero-img"
        />
        <div className="hero-text">
          <h1>Delicious Meals Await!</h1>
          <p>Choose your favorites and enjoy</p>
        </div>
      </div>
      {/* ✅ Search and Filter */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        mt={3}
        mb={3}
        className="search-filter-section"
        style={{ display: "none ", flexDirection: "column" }}
      >
        <TextField
          size="small"
          label="Search Food"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 240, background: "#fff", borderRadius: 1 }}
        />
        <FormControl
          size="small"
          sx={{ minWidth: 200, background: "#fff", borderRadius: 1 }}
        >
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
      {/* ✅ Navigation Tabs */}
      <Box display="flex" justifyContent="center" mb={3} gap={2} flexWrap="wrap" marginTop="20px">
  <Button
    variant={tab === "menu" ? "contained" : "outlined"}
    onClick={() => setTab("menu")}
    sx={{ 
      borderRadius: 5, 
      paddingX: 3,
      backgroundColor: tab === "menu" ? "#ff5722" : "transparent",
      '&:hover': {
        backgroundColor: tab === "menu" ? "#e64a19" : "rgba(255, 87, 34, 0.04)"
      }
    }}
  >
    Menu
  </Button>
  <Button
    variant={tab === "track" ? "contained" : "outlined"}
    onClick={() => setTab("track")}
    sx={{ 
      borderRadius: 5, 
      paddingX: 3, 
      backgroundColor: tab === "track" ? "#ff5722" : "transparent",
      '&:hover': {
        backgroundColor: tab === "track" ? "#e64a19" : "rgba(255, 87, 34, 0.04)"
      }
    }}
  >
    Track Order
  </Button>
  <Button
    variant={tab === "status" ? "contained" : "outlined"}
    onClick={() => setTab("status")}
    sx={{ 
      borderRadius: 5, 
      paddingX: 3,
      backgroundColor: tab === "status" ? "#ff5722" : "transparent",
      '&:hover': {
        backgroundColor: tab === "status" ? "#e64a19" : "rgba(255, 87, 34, 0.04)"
      }
    }}
  >
    All Orders
  </Button>
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
                    className={`like-button ${
                      likedItems.includes(item.id) ? "liked" : ""
                    }`}
                    aria-label={
                      likedItems.includes(item.id) ? "Unlike" : "Like"
                    }
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0 }}>All Your Orders</h3>
            <div style={{ fontSize: "0.8rem", color: "#666" }}>
              🔄 Orders update automatically every 15 minutes
            </div>
          </div>
          {dbOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {dbOrders.map((order) => {
                const currentStatus = order.statusHistory[order.statusHistory.length - 1];
                const menuItem = menuWithBOGO.find(item => item.id === order.itemId);
                
                return (
                  <div
                    key={order._id}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      backgroundColor: "#f9f9f9"
                    }}
                  >
                    {menuItem && (
                      <img
                        src={menuItem.image}
                        alt={order.itemName}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div><strong>{order.itemName}</strong></div>
                      <div>Order ID: {order._id}</div>
                      <div>Quantity: {order.quantity}</div>
                      <div>Total: ₹{order.total.toFixed(2)}</div>
                      <div>Payment: {order.paymentMethod}</div>
                      <div>Status: <strong style={{ color: getStatusColor(currentStatus.status) }}>
                        {currentStatus.status}
                      </strong></div>
                      <div>Ordered: {new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {tab === "track" && (
        <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
          <h3>Track Your Order</h3>
          
          <Box display="flex" gap={2} mb={3} alignItems="center">
            <TextField
              label="Enter Order ID"
              variant="outlined"
              value={trackingOrderId}
              onChange={(e) => setTrackingOrderId(e.target.value)}
              placeholder="Enter your order ID"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => trackOrderById(trackingOrderId)}
              disabled={!trackingOrderId.trim()}
              sx={{ minWidth: "100px" }}
            >
              Track
            </Button>
          </Box>

          {/* Quick access to recent orders */}
          {dbOrders.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h4>Your Recent Orders:</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {dbOrders.slice(0, 5).map((order) => (
                  <Button
                    key={order._id}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setTrackingOrderId(order._id);
                      trackOrderById(order._id);
                    }}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {order.itemName} - {order._id.slice(-6)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {trackedOrder && (
            <div style={{ 
              border: "2px solid #ff5722", 
              borderRadius: 12, 
              padding: "1.5rem",
              backgroundColor: "#fff"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ margin: 0 }}>Order Details</h4>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => trackOrderById(trackedOrder._id)}
                  disabled={isRefreshing}
                  sx={{ minWidth: "80px" }}
                >
                  {isRefreshing ? "..." : "Refresh"}
                </Button>
              </div>
              
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {(() => {
                  const menuItem = menuWithBOGO.find(item => item.id === trackedOrder.itemId);
                  return menuItem ? (
                    <img
                      src={menuItem.image}
                      alt={trackedOrder.itemName}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : null;
                })()}
                
                <div>
                  <div><strong>{trackedOrder.itemName}</strong></div>
                  <div>Order ID: {trackedOrder._id}</div>
                  <div>Quantity: {trackedOrder.quantity}</div>
                  <div>Total Amount: ₹{trackedOrder.total.toFixed(2)}</div>
                  <div>Payment Method: {trackedOrder.paymentMethod}</div>
                  <div>Phone: {trackedOrder.phone}</div>
                  <div>Address: {trackedOrder.address}</div>
                </div>
              </div>

              <h5>Order Status Timeline:</h5>
              <div style={{ position: "relative", paddingLeft: "2rem" }}>
                {trackedOrder.statusHistory.map((status: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      paddingBottom: "1rem",
                      borderLeft: index < trackedOrder.statusHistory.length - 1 ? "2px solid #ddd" : "none"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "-8px",
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(status.status),
                        border: "2px solid #fff",
                        boxShadow: "0 0 0 2px #ddd"
                      }}
                    />
                    <div style={{ marginLeft: "1rem" }}>
                      <div style={{ 
                        fontWeight: "bold", 
                        color: getStatusColor(status.status) 
                      }}>
                        {status.status}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {new Date(status.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: "1rem", 
                padding: "1rem", 
                backgroundColor: "#f0f8ff", 
                borderRadius: "8px" 
              }}>
                <strong>Estimated Delivery Time:</strong>
                <div>{getEstimatedDeliveryTime(trackedOrder.statusHistory)}</div>
                <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.5rem" }}>
                  🔄 Status updates automatically every 15 minutes • Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
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
              {/* Conditionally show card details or QR scanner */}
              {paymentMethod === "Card Payment" && (
                <div className="card-details">
                  <input
                    type="text"
                    placeholder="Card Number"
                    maxLength={16}
                    pattern="\d*"
                    required
                  />
                  <input type="text" placeholder="Name on Card" required />
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                      type="text"
                      placeholder="Expiry (MM/YY)"
                      maxLength={5}
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      maxLength={3}
                      pattern="\d*"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "Online Wallet" && (
                <div className="wallet-qr-section">
                  <p>Scan this QR code to complete your payment:</p>
                  <img
                    src="/TasteOfHome/upi_qr.jpg"
                    alt="Wallet QR"
                    style={{ width: "150px", height: "150px" }}
                  />
                  <p>
                    <strong>Note:</strong> After payment, click 'Place Order'
                  </p>
                </div>
              )}

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
