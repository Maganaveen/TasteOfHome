import React, { useState, useEffect } from "react";
import "./DailyRoutinePage.css";
import { FaHistory } from "react-icons/fa";

interface Dish {
  name: string;
  price: number;
  image: string;
}

interface DayPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  totalForDay: number;
}

interface SavedPlan {
  createdAt: string;
  mealPlan: DayPlan[];
  weeklyTotal: number;
}

const dishes: { [key: string]: Dish } = {
  Idli: { name: "Idli", price: 50, image: "/TasteOfHome/idli.jpg" },
  Dosa: { name: "Dosa", price: 60, image: "/TasteOfHome/dosa.jpg" },
  Pongal: { name: "Pongal", price: 55, image: "/TasteOfHome/pongal.jpg" },
  Biryani: { name: "Biryani", price: 180, image: "/TasteOfHome/biryani.jpg" },
  Thali: { name: "Thali", price: 150, image: "/TasteOfHome/traditional.jpg" },
  "Rice and Curry": {
    name: "Rice and Curry",
    price: 120,
    image: "/TasteOfHome/vegbiryani.jpg",
  },
  Chapati: {
    name: "Chapati",
    price: 40,
    image: "/TasteOfHome/alooparatha.jpg",
  },
  Paratha: {
    name: "Paratha",
    price: 50,
    image: "/TasteOfHome/alooparatha.jpg",
  },
  Noodles: { name: "Noodles", price: 100, image: "/TasteOfHome/noodles.jpg" },
  Uttapam: { name: "Uttapam", price: 65, image: "/TasteOfHome/uttapam.jpg" },
  Vada: { name: "Vada", price: 30, image: "/TasteOfHome/vada.jpg" },
  "Sambar Rice": {
    name: "Sambar Rice",
    price: 80,
    image: "/TasteOfHome/sambarrice.jpg",
  },
  "Curd Rice": {
    name: "Curd Rice",
    price: 70,
    image: "/TasteOfHome/curdrice.jpg",
  },
  "Paneer Butter Masala": {
    name: "Paneer Butter Masala",
    price: 140,
    image: "/TasteOfHome/paneer.jpg",
  },
  "Butter Naan": {
    name: "Butter Naan",
    price: 35,
    image: "/TasteOfHome/naan.jpg",
  },
  "Chicken Curry": {
    name: "Chicken Curry",
    price: 160,
    image: "/TasteOfHome/chickencurry.jpg",
  },
  "Fish Fry": {
    name: "Fish Fry",
    price: 180,
    image: "/TasteOfHome/fishfry.jpg",
  },
  "Fried Rice": {
    name: "Fried Rice",
    price: 110,
    image: "/TasteOfHome/friedrice.jpg",
  },
  "Gobi Manchurian": {
    name: "Gobi Manchurian",
    price: 90,
    image: "/TasteOfHome/gobi.jpg",
  },
  Momos: { name: "Momos", price: 85, image: "/TasteOfHome/momos.jpg" },
  "Masala Dosa": {
    name: "Masala Dosa",
    price: 70,
    image: "/TasteOfHome/masaladosa.jpg",
  },
  "Aloo Poori": {
    name: "Aloo Poori",
    price: 60,
    image: "/TasteOfHome/aloopoori.jpg",
  },
};

const DailyRoutinePage: React.FC = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [mealPlan, setMealPlan] = useState<DayPlan[]>(
    days.map((day) => ({
      day,
      breakfast: "",
      lunch: "",
      dinner: "",
      totalForDay: 0,
    }))
  );
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [history, setHistory] = useState<SavedPlan[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const total = mealPlan.reduce((acc, day) => acc + day.totalForDay, 0);
    setWeeklyTotal(total);
  }, [mealPlan]);

  const calculateDayTotal = (
    breakfast: string,
    lunch: string,
    dinner: string
  ): number => {
    return (
      (dishes[breakfast]?.price || 0) +
      (dishes[lunch]?.price || 0) +
      (dishes[dinner]?.price || 0)
    );
  };

  const handleMealChange = (
    day: string,
    meal: "breakfast" | "lunch" | "dinner",
    value: string
  ) => {
    setMealPlan((prev) =>
      prev.map((p) => {
        if (p.day === day) {
          const updated = { ...p, [meal]: value };
          return {
            ...updated,
            totalForDay: calculateDayTotal(
              updated.breakfast,
              updated.lunch,
              updated.dinner
            ),
          };
        }
        return p;
      })
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/mealplan/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mealPlan, weeklyTotal }),
      });
      const result = await response.json();
      alert(
        result.message === "Meal plan saved successfully"
          ? "Meal plan saved!"
          : "Failed to save."
      );
    } catch {
      alert("Error saving meal plan");
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/mealplan/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setHistory(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <div
      className="daily-routine-1"
      style={{
        backgroundImage: "url(/TasteOfHome/kitchen-bg.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="header-with-icon">
        <div className="logo-brand">
          <img
            src="/TasteOfHome/logo.jpg"
            alt="Taste of Home Logo"
            className="brand-logo"
          />
          <h1>Taste of Home – Weekly Meal Planner</h1>
        </div>
        <button
          className="icon-button"
          onClick={fetchHistory}
          title="View History"
        >
          <FaHistory size={24} />
        </button>
      </div>

      <div className="meal-plan-grid">
        <div className="header-row">
          <div className="day-header">Day</div>
          <div className="meal-header">🍳 Breakfast</div>
          <div className="meal-header">🍛 Lunch</div>
          <div className="meal-header">🍲Dinner</div>
          <div className="total-header">Day Total</div>
        </div>
        {mealPlan.map((day) => (
          <div key={day.day} className="day-row">
            <div className="day-order-pill">
              <span>{day.day}</span>
            </div>
            {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
              <div className="meal-cell" key={meal}>
                <div className="meal-selection-wrapper">
                  <label className="meal-label">{meal.toUpperCase()}</label>
                  <div className="custom-dropdown">
                    <select
                      value={day[meal]}
                      onChange={(e) =>
                        handleMealChange(day.day, meal, e.target.value)
                      }
                    >
                      <option value="">{`Menu ${
                        meal === "breakfast"
                          ? "I"
                          : meal === "lunch"
                          ? "II"
                          : "III"
                      }`}</option>
                      {Object.entries(dishes).map(([key, dish]) => (
                        <option key={key} value={key}>
                          {`${dish.name} (₹${dish.price})`}
                        </option>
                      ))}
                    </select>
                    <span className="dropdown-icon">▼</span>
                  </div>

                  {day[meal] && (
                    <div className="meal-preview">
                      <img src={dishes[day[meal]].image} alt={meal} />
                      <span className="price">₹{dishes[day[meal]].price}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="total-cell">
              <span>₹{day.totalForDay}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="history-modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <div className="history-header-visuals">
              <img
                src="/TasteOfHome/chef.jpg"
                alt="Chef"
                className="chef-image"
                style={{ width: "86px", height: "72px" }}
              />
              {/* <img
                src="/TasteOfHome/kitchen-visual.png"
                alt="Kitchen Scene"
                className="history-kitchen"
              /> */}
            </div>
            <h2>Saved Meal Plan History</h2>
            {history.map((plan, i) => (
              <div key={i} className="history-card-new">
                <p className="history-date">
                  <strong>Date:</strong>{" "}
                  {new Date(plan.createdAt).toLocaleString()}
                </p>
                <div className="history-plan-blocks">
                  {plan.mealPlan.map((entry, j) => (
                    <div key={j} className="history-day-block">
                      <h3>{entry.day.toUpperCase()}</h3>
                      <p>
                        <strong>Menu I:</strong> {entry.breakfast}
                      </p>
                      <p>
                        <strong>Menu II:</strong> {entry.lunch}
                      </p>
                      <p>
                        <strong>Menu III:</strong> {entry.dinner}
                      </p>
                      <hr />
                    </div>
                  ))}
                </div>
                <p className="weekly-total-line">
                  <strong>Weekly Total:</strong> ₹{plan.weeklyTotal}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="weekly-summary">
        <div className="weekly-total">
          <span>Weekly Total:</span>
          <span className="amount">₹{weeklyTotal}</span>
        </div>
        <button className="submit-button" onClick={handleSubmit}>
          Save Meal Plan
        </button>
      </div>
    </div>
  );
};

export default DailyRoutinePage;
