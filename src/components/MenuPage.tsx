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
    name: "Butter Chicken",
    category: "Tamil Nadu",
    description: "Creamy, spiced tomato curry with tender chicken.",
    price: 250,
    image: "/TasteOfHome/butterchick.jpg",
  },
  {
    id: 2,
    name: "Paneer Tikka",
    category: "Karnataka",
    description: "Grilled paneer marinated in aromatic spices.",
    price: 180,
    image: "/TasteOfHome/pantik.jpg",
  },
  {
    id: 3,
    name: "Gulab Jamun",
    category: "Sweets",
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
    name: "Dal Makhani",
    category: "Tamil Nadu",
    description: "Slow-cooked lentils in a creamy tomato sauce.",
    price: 200,
    image: "/TasteOfHome/dalmakhani.jpg",
  },
  {
    id: 6,
    name: "Samosa",
    category: "Kerala",
    description: "Crispy pastry filled with spicy potatoes and peas.",
    price: 60,
    image: "/TasteOfHome/samosa.jpg",
  },
  {
    id: 7,
    name: "Rasgulla",
    category: "Sweets",
    description: "Soft, spongy cheese balls soaked in sweet syrup.",
    price: 80,
    image: "/TasteOfHome/rasgulla.jpg",
  },
  {
    id: 8,
    name: "Lassi",
    category: "Beverages",
    description: "Refreshing yogurt-based drink, sweet or salted.",
    price: 50,
    image: "/TasteOfHome/lassi.jpg",
  },
  {
    id: 9,
    name: "Chicken Biryani",
    category: "Tamil Nadu",
    description: "Fragrant basmati rice cooked with chicken and spices.",
    price: 300,
    image: "/TasteOfHome/biryani.jpg",
  },
  {
    id: 10,
    name: "Pakora",
    category: "Karnataka",
    description: "Fritters made from vegetables coated in chickpea flour.",
    price: 70,
    image: "/TasteOfHome/pakora.jpg",
  },
  {
    id: 11,
    name: "Kheer",
    category: "Sweets",
    description: "Creamy rice pudding flavored with cardamom and nuts.",
    price: 85,
    image: "/TasteOfHome/kheer.jpg",
  },
  {
    id: 12,
    name: "Masala Soda",
    category: "Beverages",
    description: "Sparkling soda with tangy Indian spices.",
    price: 45,
    image: "/TasteOfHome/masalasoda.jpg",
  },
  {
    id: 13,
    name: "Veg Noodles",
    category: "Chinese",
    description: "Stir-fried noodles with fresh vegetables.",
    price: 120,
    image: "/TasteOfHome/noodles.jpg",
  },
  {
    id: 14,
    name: "Vanilla Ice Cream",
    category: "Ice Cream",
    description: "Classic vanilla flavored creamy ice cream.",
    price: 60,
    image: "/TasteOfHome/vanilla.jpg",
  },
  {
    id: 15,
    name: "Idli Sambar",
    category: "Tamil Nadu",
    description: "Soft steamed rice cakes served with flavorful sambar.",
    price: 60,
    image: "/TasteOfHome/idli.jpg",
  },
  {
    id: 16,
    name: "Neer Dosa",
    category: "Karnataka",
    description: "Thin, soft dosas made with rice batter, served with chutney.",
    price: 90,
    image: "/TasteOfHome/neerdosa.jpg",
  },
  {
    id: 17,
    name: "Puttu Kadala",
    category: "Kerala",
    description: "Steamed rice flour with black chickpea curry.",
    price: 100,
    image: "/TasteOfHome/puttukadala.jpg",
  },
  {
    id: 18,
    name: "Hot and Sour Soup",
    category: "Chinese",
    description: "Spicy and tangy soup with vegetables and soy sauce.",
    price: 110,
    image: "/TasteOfHome/hotsoursoup.jpg",
  },
  {
    id: 19,
    name: "Filter Coffee",
    category: "Beverages",
    description: "Traditional South Indian coffee brewed with a filter.",
    price: 30,
    image: "/TasteOfHome/filtercoffee.jpg",
  },
  {
    id: 20,
    name: "Jalebi",
    category: "Sweets",
    description: "Crispy, deep-fried spirals soaked in sugar syrup.",
    price: 70,
    image: "/TasteOfHome/jalebi.jpg",
  },
  {
    id: 21,
    name: "Chocolate Ice Cream",
    category: "Ice Cream",
    description: "Rich and creamy chocolate flavored ice cream.",
    price: 65,
    image: "/TasteOfHome/chocolateice.jpg",
  },
  {
    id: 22,
    name: "Spring Rolls",
    category: "Chinese",
    description: "Crispy rolls filled with spiced vegetables.",
    price: 100,
    image: "/TasteOfHome/springrolls.jpg",
  },
  {
    id: 23,
    name: "Medu Vada",
    category: "Tamil Nadu",
    description: "Crispy fried lentil donuts served with chutney and sambar.",
    price: 55,
    image: "/TasteOfHome/meduvada.jpg",
  },
  {
    id: 24,
    name: "Ragi Mudde",
    category: "Karnataka",
    description: "Traditional finger millet balls served with spicy curry.",
    price: 85,
    image: "/TasteOfHome/ragimudde.jpg",
  },
  {
    id: 25,
    name: "Appam with Stew",
    category: "Kerala",
    description:
      "Fermented rice pancake served with coconut-based vegetable stew.",
    price: 120,
    image: "/TasteOfHome/appam.jpg",
  },
  {
    id: 26,
    name: "Veg Manchurian",
    category: "Chinese",
    description: "Crispy vegetable balls tossed in Indo-Chinese sauce.",
    price: 130,
    image: "/TasteOfHome/vegmanchurian.jpg",
  },
  {
    id: 27,
    name: "Tender Coconut Water",
    category: "Beverages",
    description: "Refreshing drink directly from young coconuts.",
    price: 40,
    image: "/TasteOfHome/coconutwater.jpg",
  },
  {
    id: 28,
    name: "Rasmalai",
    category: "Sweets",
    description: "Soft paneer discs soaked in flavored milk and saffron.",
    price: 100,
    image: "/TasteOfHome/rasmalai.jpg",
  },
  {
    id: 29,
    name: "Strawberry Ice Cream",
    category: "Ice Cream",
    description: "Creamy pink ice cream with a fruity strawberry flavor.",
    price: 65,
    image: "/TasteOfHome/strawberryice.jpg",
  },
  {
    id: 30,
    name: "Hakka Noodles",
    category: "Chinese",
    description: "Wok-tossed noodles with soy, vegetables, and chili sauce.",
    price: 125,
    image: "/TasteOfHome/hakkanoodles.jpg",
  },
  {
    id: 31,
    name: "Pineapple Juice",
    category: "Beverages",
    description: "Chilled juice made from fresh pineapples.",
    price: 45,
    image: "/TasteOfHome/pineapplejuice.jpg",
  },
  {
    id: 32,
    name: "Boondi Ladoo",
    category: "Sweets",
    description: "Golden gram flour pearls bound with cardamom and ghee.",
    price: 90,
    image: "/TasteOfHome/boondi.jpg",
  },
  {
    id: 33,
    name: "Kozhukattai",
    category: "Tamil Nadu",
    description:
      "Steamed rice flour dumplings filled with coconut and jaggery.",
    price: 50,
    image: "/TasteOfHome/kozhukattai.jpg",
  },
  {
    id: 34,
    name: "Bisi Bele Bath",
    category: "Karnataka",
    description: "Spiced rice-lentil dish loaded with vegetables and ghee.",
    price: 95,
    image: "/TasteOfHome/bisibelebath.jpg",
  },
  {
    id: 35,
    name: "Kerala Fish Curry",
    category: "Kerala",
    description: "Spicy fish curry cooked with tamarind and coconut milk.",
    price: 160,
    image: "/TasteOfHome/fishcurry.jpg",
  },
  {
    id: 36,
    name: "Gobi 65",
    category: "Chinese",
    description:
      "Fried cauliflower florets tossed in spicy Indo-Chinese sauce.",
    price: 110,
    image: "/TasteOfHome/gobi65.jpg",
  },
  {
    id: 37,
    name: "Masala Soda",
    category: "Beverages",
    description: "Tangy soda with lemon, spices, and mint – street style!",
    price: 35,
    image: "/TasteOfHome/masalasoda.jpg",
  },
  {
    id: 38,
    name: "Gulab Jamun",
    category: "Sweets",
    description:
      "Soft milk-solid balls soaked in cardamom-infused sugar syrup.",
    price: 80,
    image: "/TasteOfHome/gulab.jpg",
  },
  {
    id: 39,
    name: "Chocolate Ice Cream",
    category: "Ice Cream",
    description: "Rich, creamy chocolate ice cream topped with choco chips.",
    price: 70,
    image: "/TasteOfHome/chocolateice.jpg",
  },
  {
    id: 40,
    name: "Veg Fried Rice",
    category: "Chinese",
    description: "Fragrant rice stir-fried with mixed vegetables and sauces.",
    price: 115,
    image: "/TasteOfHome/friedrice.jpg",
  },
  {
    id: 41,
    name: "Nannari Sarbath",
    category: "Beverages",
    description: "Sweet herbal drink made with sarsaparilla syrup and lemon.",
    price: 30,
    image: "/TasteOfHome/nannari.jpg",
  },
  {
    id: 42,
    name: "Mysore Pak",
    category: "Sweets",
    description: "Traditional sweet made from ghee, sugar, and gram flour.",
    price: 90,
    image: "/TasteOfHome/mysorepak.jpg",
  },
  {
    id: 43,
    name: "Mini Tiffin",
    category: "Tamil Nadu",
    description:
      "A combo of idli, dosa, pongal, vada, chutney, and sambar – all in one plate.",
    price: 120,
    image: "/TasteOfHome/minitiffin.jpg",
  },
  {
    id: 44,
    name: "Rava Kichadi",
    category: "Breakfast",
    description: "Creamy semolina dish tempered with spices and vegetables.",
    price: 70,
    image: "/TasteOfHome/ravakichadi.jpg",
  },
  {
    id: 45,
    name: "Pani Puri",
    category: "Chaat",
    description:
      "Crispy puris filled with tangy water, mashed potato, and chutneys.",
    price: 50,
    image: "/TasteOfHome/panipuri.jpg",
  },
  {
    id: 46,
    name: "Chilli Parotta",
    category: "Street Food",
    description:
      "Shredded parotta tossed with onion, capsicum, and spicy sauce.",
    price: 90,
    image: "/TasteOfHome/chilliparotta.jpg",
  },
  {
    id: 47,
    name: "Thayir Vadai",
    category: "Tamil Nadu",
    description: "Medu vada soaked in spiced curd and topped with coriander.",
    price: 60,
    image: "/TasteOfHome/thayirvadai.jpg",
  },
  {
    id: 48,
    name: "Carrot Halwa",
    category: "Sweets",
    description: "Slow-cooked grated carrots in milk, sugar, ghee, and nuts.",
    price: 85,
    image: "/TasteOfHome/carrothalwa.jpg",
  },
  {
    id: 49,
    name: "Mango Lassi",
    category: "Beverages",
    description: "A rich blend of mango pulp and creamy yogurt with cardamom.",
    price: 50,
    image: "/TasteOfHome/mangolassi.jpg",
  },
  {
    id: 50,
    name: "Chicken Kothu Parotta",
    category: "Non-Veg",
    description: "Spicy shredded parotta mixed with egg, chicken, and masala.",
    price: 140,
    image: "/TasteOfHome/kothuparotta.jpg",
  },
  {
    id: 51,
    name: "Masala Dosa",
    category: "Breakfast",
    description:
      "Crispy dosa with a flavorful potato filling, served with chutneys.",
    price: 80,
    image: "/TasteOfHome/masaladosa.jpg",
  },
  {
    id: 52,
    name: "Butter Naan with Paneer Butter Masala",
    category: "North Indian",
    description: "Soft buttery naan paired with rich paneer butter gravy.",
    price: 150,
    image: "/TasteOfHome/butternaanpaneer.jpg",
  },
];

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Tamil Nadu",
    "Karnataka",
    "Kerala",
    "Chinese",
    "Beverages",
    "Sweets",
    "Ice Cream",
  ];

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="menu-page">
      <h1 className="menu-heading">Menu You Can Taste Here!</h1>
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            {/* Removed price and Add to Cart */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
