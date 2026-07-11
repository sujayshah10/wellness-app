const fixedOats = (addon, seasonalNote = "All seasons") => ({
  name: `Pintola High Protein Oats + Milk + ${addon}`,
  time: "4:30 PM",
  calories: 430,
  protein: 24,
  prep: "Cook 50 g Pintola High Protein Oats with 220 ml milk. Add the day's topping after cooking.",
  tip: `Fixed base for consistency. Add-on: ${addon}. Season: ${seasonalNote}.`
});

export const DIET_PLAN = {
  Mon: {
    meal1: fixedOats("1 banana"),
    meal2: {
      name: "Paneer Bhurji + 2 Phulka + Buttermilk",
      time: "6:30 PM",
      calories: 560,
      protein: 34,
      prep: "Cook paneer with onion, tomato, capsicum, turmeric, chilli, and light oil.",
      tip: "Easy protein-rich main meal with ingredients available year-round in Vadodara."
    },
    snack: {
      name: "Guava or Papaya",
      time: "11:00 PM",
      calories: 90,
      protein: 2,
      prep: "One bowl fruit. Add chaat masala if needed.",
      tip: "One fruit per day is enough."
    },
    meal3: {
      name: "Cheese Sandwich + Cucumber",
      time: "4:00 AM",
      calories: 360,
      protein: 16,
      prep: "Use whole wheat or multigrain bread. Add cucumber, tomato, and light cheese.",
      tip: "Light, quick, and practical after a long day."
    }
  },

  Tue: {
    meal1: fixedOats("1 tbsp flaxseed powder"),
    meal2: {
      name: "Mixed Dal + Brown Rice + Salad",
      time: "6:30 PM",
      calories: 540,
      protein: 25,
      prep: "Pressure cook mixed dal. Temper with jeera, garlic, turmeric, and a little ghee.",
      tip: "Comforting, affordable, and high-fibre."
    },
    snack: {
      name: "Buttermilk + Roasted Chana",
      time: "11:00 PM",
      calories: 160,
      protein: 9,
      prep: "Keep buttermilk chilled. Add roasted chana for crunch.",
      tip: "Good for Gujarat heat and easy digestion."
    },
    meal3: {
      name: "Mixed Vegetable Soup",
      time: "4:00 AM",
      calories: 220,
      protein: 7,
      prep: "Use tomato, carrot, spinach, cabbage, and black pepper. Keep it light.",
      tip: "Warm, hydrating, and not too heavy."
    }
  },

  Wed: {
    meal1: fixedOats("8-10 almonds"),
    meal2: {
      name: "Chole + 2 Phulka + Onion Salad",
      time: "6:30 PM",
      calories: 590,
      protein: 26,
      prep: "Soak chickpeas overnight. Pressure cook and finish with tomato-onion masala.",
      tip: "Make extra chole once and reuse for wraps or sandwiches."
    },
    snack: {
      name: "Apple or Pomegranate",
      time: "11:00 PM",
      calories: 110,
      protein: 1,
      prep: "Wash and cut fresh.",
      tip: "Simple fruit rotation keeps the plan easy."
    },
    meal3: {
      name: "Paneer Sandwich",
      time: "4:00 AM",
      calories: 390,
      protein: 23,
      prep: "Use crumbled paneer, capsicum, onion, tomato, and green chutney.",
      tip: "Higher protein light dinner without needing a full sabzi."
    }
  },

  Thu: {
    meal1: fixedOats("apple pieces + cinnamon"),
    meal2: {
      name: "Palak Paneer + 2 Phulka",
      time: "6:30 PM",
      calories: 560,
      protein: 32,
      prep: "Use spinach, paneer, garlic, onion, tomato, and mild spices.",
      tip: "Best in winter, but spinach is usually available most of the year."
    },
    snack: {
      name: "Cucumber + Lemon Water",
      time: "11:00 PM",
      calories: 50,
      protein: 1,
      prep: "Slice cucumber. Add lemon and salt to water if needed.",
      tip: "Useful in summer and after salty meals."
    },
    meal3: {
      name: "Vegetable Dalia",
      time: "4:00 AM",
      calories: 310,
      protein: 10,
      prep: "Cook broken wheat with carrot, peas, capsicum, and light spices.",
      tip: "Soft, warm, and steady energy."
    }
  },

  Fri: {
    meal1: fixedOats("1 tbsp chia seeds"),
    meal2: {
      name: "Rajma + Brown Rice + Buttermilk",
      time: "6:30 PM",
      calories: 610,
      protein: 27,
      prep: "Soak rajma overnight. Pressure cook well and keep masala moderate.",
      tip: "Good weekly legume meal. Keep rice portion controlled."
    },
    snack: {
      name: "Orange or Sweet Lime",
      time: "11:00 PM",
      calories: 80,
      protein: 1,
      prep: "One fruit serving.",
      tip: "Fresh and easy when available."
    },
    meal3: {
      name: "Vegetable Poha",
      time: "4:00 AM",
      calories: 300,
      protein: 8,
      prep: "Add peanuts, curry leaves, peas, onion, and lemon.",
      tip: "Fast dinner when you want something warm but light."
    }
  },

  Sat: {
    meal1: fixedOats("raisins + walnuts"),
    meal2: {
      name: "Soya Chunks Curry + 2 Phulka + Salad",
      time: "6:30 PM",
      calories: 540,
      protein: 36,
      prep: "Soak soya chunks in hot water, squeeze, then cook with onion-tomato masala.",
      tip: "Excellent budget protein source."
    },
    snack: {
      name: "Watermelon or Muskmelon",
      time: "11:00 PM",
      calories: 90,
      protein: 2,
      prep: "One bowl. Use mainly in summer.",
      tip: "Hydrating seasonal fruit for Vadodara heat."
    },
    meal3: {
      name: "Tomato Soup + Garlic Toast",
      time: "4:00 AM",
      calories: 300,
      protein: 8,
      prep: "Make tomato soup with garlic, pepper, and a little butter if needed.",
      tip: "Comforting light dinner."
    }
  },

  Sun: {
    meal1: fixedOats("mango in summer or dates in winter", "Summer/Winter"),
    meal2: {
      name: "Mixed Veg + Gujarati Dal + 2 Phulka",
      time: "6:30 PM",
      calories: 570,
      protein: 22,
      prep: "Use available seasonal vegetables. Keep dal light and not too sweet.",
      tip: "Flexible Sunday meal based on what is fresh in the market."
    },
    snack: {
      name: "Banana or Grapes",
      time: "11:00 PM",
      calories: 105,
      protein: 1,
      prep: "One fruit serving.",
      tip: "Keep snacks simple instead of adding another full meal."
    },
    meal3: {
      name: "Vegetable Khichdi + Curd",
      time: "4:00 AM",
      calories: 340,
      protein: 14,
      prep: "Cook rice and moong dal soft with vegetables. Add curd on the side.",
      tip: "Light, warm, and gut-friendly."
    }
  }
};
