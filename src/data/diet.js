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
    intake1: fixedOats("1 banana"),
    intake2: {
      name: "Paneer Bhurji + 2 Phulka + Buttermilk",
      time: "6:30 PM",
      calories: 560,
      protein: 34,
      prep: "Cook paneer with onion, tomato, capsicum, turmeric, chilli, and light oil.",
      tip: "Easy protein-rich main intake with ingredients available year-round in Vadodara."
    },
    intake3: {
      name: "Cheese Sandwich + Cucumber + Guava/Papaya",
      time: "4:00 AM",
      calories: 450,
      protein: 18,
      prep: "Use whole wheat or multigrain bread. Add cucumber, tomato, light cheese, and one fruit bowl if hungry.",
      tip: "Light, quick, and practical after a long day."
    }
  },

  Tue: {
    intake1: fixedOats("1 tbsp flaxseed powder"),
    intake2: {
      name: "Mixed Dal + Brown Rice + Salad",
      time: "6:30 PM",
      calories: 540,
      protein: 25,
      prep: "Pressure cook mixed dal. Temper with jeera, garlic, turmeric, and a little ghee.",
      tip: "Comforting, affordable, and high-fibre."
    },
    intake3: {
      name: "Mixed Vegetable Soup + Roasted Chana",
      time: "4:00 AM",
      calories: 380,
      protein: 16,
      prep: "Use tomato, carrot, spinach, cabbage, and black pepper. Add roasted chana on the side.",
      tip: "Warm, hydrating, and not too heavy."
    }
  },

  Wed: {
    intake1: fixedOats("8-10 almonds"),
    intake2: {
      name: "Chole + 2 Phulka + Onion Salad",
      time: "6:30 PM",
      calories: 590,
      protein: 26,
      prep: "Soak chickpeas overnight. Pressure cook and finish with tomato-onion masala.",
      tip: "Make extra chole once and reuse for wraps or sandwiches."
    },
    intake3: {
      name: "Paneer Sandwich + Apple/Pomegranate",
      time: "4:00 AM",
      calories: 500,
      protein: 24,
      prep: "Use crumbled paneer, capsicum, onion, tomato, and green chutney. Add one fruit serving.",
      tip: "Higher protein light intake without needing a full sabzi."
    }
  },

  Thu: {
    intake1: fixedOats("apple pieces + cinnamon"),
    intake2: {
      name: "Palak Paneer + 2 Phulka",
      time: "6:30 PM",
      calories: 560,
      protein: 32,
      prep: "Use spinach, paneer, garlic, onion, tomato, and mild spices.",
      tip: "Best in winter, but spinach is usually available most of the year."
    },
    intake3: {
      name: "Vegetable Dalia + Cucumber Lemon Water",
      time: "4:00 AM",
      calories: 360,
      protein: 11,
      prep: "Cook broken wheat with carrot, peas, capsicum, and light spices. Add cucumber and lemon water if needed.",
      tip: "Soft, warm, and steady energy."
    }
  },

  Fri: {
    intake1: fixedOats("1 tbsp chia seeds"),
    intake2: {
      name: "Rajma + Brown Rice + Buttermilk",
      time: "6:30 PM",
      calories: 610,
      protein: 27,
      prep: "Soak rajma overnight. Pressure cook well and keep masala moderate.",
      tip: "Good weekly legume intake. Keep rice portion controlled."
    },
    intake3: {
      name: "Vegetable Poha + Orange/Sweet Lime",
      time: "4:00 AM",
      calories: 380,
      protein: 9,
      prep: "Add peanuts, curry leaves, peas, onion, and lemon. Add one citrus fruit when available.",
      tip: "Fast dinner when you want something warm but light."
    }
  },

  Sat: {
    intake1: fixedOats("raisins + walnuts"),
    intake2: {
      name: "Soya Chunks Curry + 2 Phulka + Salad",
      time: "6:30 PM",
      calories: 540,
      protein: 36,
      prep: "Soak soya chunks in hot water, squeeze, then cook with onion-tomato masala.",
      tip: "Excellent budget protein source."
    },
    intake3: {
      name: "Tomato Soup + Garlic Toast + Melon",
      time: "4:00 AM",
      calories: 390,
      protein: 10,
      prep: "Make tomato soup with garlic, pepper, and a little butter if needed. Add watermelon or muskmelon in summer.",
      tip: "Comforting light intake for a rest day."
    }
  },

  Sun: {
    intake1: fixedOats("mango in summer or dates in winter", "Summer/Winter"),
    intake2: {
      name: "Mixed Veg + Gujarati Dal + 2 Phulka",
      time: "6:30 PM",
      calories: 570,
      protein: 22,
      prep: "Use available seasonal vegetables. Keep dal light and not too sweet.",
      tip: "Flexible Sunday intake based on what is fresh in the market."
    },
    intake3: {
      name: "Vegetable Khichdi + Curd + Banana/Grapes",
      time: "4:00 AM",
      calories: 445,
      protein: 15,
      prep: "Cook rice and moong dal soft with vegetables. Add curd and one fruit serving on the side.",
      tip: "Light, warm, and gut-friendly."
    }
  }
};
