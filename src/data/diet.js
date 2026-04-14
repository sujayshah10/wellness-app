// Meal structure matches actual daily schedule:
// meal1 → 4:30 PM (biggest meal)
// meal2 → 6:30 PM (light pre-shift)
// snack  → 11:00 PM (break snack during shift)
// meal3  → 4:00 AM (light wind-down after shift)
// NOTE: Protein shake brand/type — TBD with Sujay

export const DIET_PLAN = {
  Mon: {
    meal1: {
      name: "Moong Dal Chilla + Mint Chutney",
      nameGu: "મૂંગ દાળ ચીલ્લા + ફુદીના ચટણી",
      calories: 420,
      protein: 34,
      prep: "Soak moong dal overnight",
      prepGu: "મૂંગ દાળ રાતે પલાળો",
      tip: "Biggest protein meal of the day. Eat slowly.",
      tipGu: "દિવસનું સૌથી વધુ પ્રોટીન. ધીરે ખાઓ."
    },
    meal2: {
      name: "Soya Chunks Curry + 1 Roti",
      nameGu: "સોયા ચંક્સ શાક + 1 રોટી",
      calories: 380,
      protein: 32,
      prep: "Soak soya in hot water 15 mins before cooking",
      prepGu: "સોયા 15 મિનિટ ગરમ પાણીમાં પલાળો",
      tip: "Light portion. Shift starts in 30 mins after this.",
      tipGu: "હળવો ભાગ. 30 મિનિટ પછી પાળી."
    },
    snack: {
      name: "Roasted Peanuts + Green Tea",
      nameGu: "શેકેલી મગફળી + ગ્રીન ટી",
      calories: 200,
      protein: 9,
      prep: "Dry roast — no oil",
      prepGu: "સૂકા શેકો — તેલ નહીં",
      tip: "Take a 5 min walk after this snack.",
      tipGu: "નાસ્તા પછી 5 મિનિટ ચાલો."
    },
    meal3: {
      name: "Vegetable Khichdi + Curd",
      nameGu: "શાકભાજી ખીચડી + દહીં",
      calories: 320,
      protein: 14,
      prep: "Use less salt. Add ghee — 1 tsp only.",
      prepGu: "ઓછું મીઠું. ઘી 1 ચમચી.",
      tip: "Light and warm. Best wind-down meal.",
      tipGu: "હળવું અને ગરમ. ઊંઘ માટે ઉત્તમ."
    }
  },

  Tue: {
    meal1: {
      name: "Besan Chilla + Tomato Chutney",
      nameGu: "બેસન ચીલ્લા + ટામેટા ચટણી",
      calories: 400,
      protein: 22,
      prep: "Add ajwain to batter for digestion",
      prepGu: "બૅટરમાં અજવાઈન નાખો",
      tip: "Add chopped onion and green chilli for taste.",
      tipGu: "સ્વાદ માટે ડુંગળી અને લીલી મરચી."
    },
    meal2: {
      name: "Paneer Bhurji + 1 Roti",
      nameGu: "પનીર ભુર્જી + 1 રોટી",
      calories: 390,
      protein: 28,
      prep: "Use minimal oil — 1 tsp. Add capsicum.",
      prepGu: "ઓછું તેલ. કેપ્સિકમ ઉમેરો.",
      tip: "Don't overeat before shift. Half roti if full.",
      tipGu: "પાળી પહેલાં વધુ ન ખાઓ."
    },
    snack: {
      name: "Boiled Egg (2) + Black Coffee",
      nameGu: "બાફેલા ઈંડા (2) + બ્લૅક કૉફી",
      calories: 180,
      protein: 14,
      prep: "Boil eggs in the evening before shift",
      prepGu: "સાંજે ઇંડા બાફી રાખો",
      tip: "If avoiding eggs, replace with 30g peanuts.",
      tipGu: "ઇંડા ન હોય તો 30g મગફળી."
    },
    meal3: {
      name: "Curd Rice + Pickle",
      nameGu: "દહીં ભાત + અથાણું",
      calories: 300,
      protein: 10,
      prep: "Use room temperature curd. Not cold at 4 AM.",
      prepGu: "4 AM પર ઠંડું દહીં ન વાપરો.",
      tip: "Probiotic gut reset after night shift.",
      tipGu: "રાત્રી પાળી પછી આંત રીસેટ."
    }
  },

  Wed: {
    meal1: {
      name: "Rajma (Kidney Bean) Curry + 2 Rotis",
      nameGu: "રાજમા + 2 રોટી",
      calories: 480,
      protein: 28,
      prep: "Soak rajma overnight. Pressure cook 4–5 whistles.",
      prepGu: "રાજમા રાતે પલાળો. 4-5 સીટી.",
      tip: "High fibre and protein. Eat slowly.",
      tipGu: "ઉચ્ચ ફાઇબર. ધીરે ખાઓ."
    },
    meal2: {
      name: "Sprouts Salad + Lemon + Chaat Masala",
      nameGu: "સ્પ્રાઉટ્સ સૅલડ + લીંબુ",
      calories: 220,
      protein: 14,
      prep: "Soak moong overnight, sprout for 1 day",
      prepGu: "મૂંગ 1 દિવસ અંકુરિત કરો",
      tip: "Light pre-shift. Easily digestible.",
      tipGu: "હળવું. સહેલાઈથી પચે."
    },
    snack: {
      name: "Makhana (Fox nuts) + Herbal Tea",
      nameGu: "મખાના + હર્બલ ચા",
      calories: 160,
      protein: 5,
      prep: "Dry roast makhana with pinch of rock salt",
      prepGu: "સૈંધવ મીઠા સાથે શેકો",
      tip: "Great late night snack — light on stomach.",
      tipGu: "રાત્રે હળવો નાસ્તો."
    },
    meal3: {
      name: "Moong Dal Soup + 1 Roti",
      nameGu: "મૂંગ દાળ સૂપ + 1 રોટી",
      calories: 280,
      protein: 16,
      prep: "Thin consistency. Add turmeric and cumin.",
      prepGu: "પાતળું. હળદર અને જીરું ઉમેરો.",
      tip: "Warm soup helps sleep. Don't skip this.",
      tipGu: "ગરમ સૂપ ઊંઘ સુધારે."
    }
  },

  Thu: {
    meal1: {
      name: "Egg Omelette (3 eggs) + Brown Bread (2 slices)",
      nameGu: "ઇંડા ઑમ્લેટ (3) + બ્રાઉન બ્રેડ (2)",
      calories: 460,
      protein: 36,
      prep: "Add vegetables — onion, tomato, capsicum",
      prepGu: "ડુંગળી, ટામેટું, કૅપ્સિકમ ઉમેરો",
      tip: "Vegetarian option: Tofu scramble instead of eggs.",
      tipGu: "શાકાહારી: ઇંડાને બદલે ટોફૂ."
    },
    meal2: {
      name: "Chana Dal + 1 Roti + Salad",
      nameGu: "ચણા દાળ + 1 રોટી + સૅલડ",
      calories: 360,
      protein: 20,
      prep: "Pressure cook 3 whistles. Season with jeera.",
      prepGu: "3 સીટી. જીરૂ વઘાર.",
      tip: "Have salad first, then dal-roti.",
      tipGu: "પહેલા સૅલડ, પછી દાળ-રોટી."
    },
    snack: {
      name: "Roasted Chana + Lemon Water",
      nameGu: "શેકેલો ચણો + લીંબુ પાણી",
      calories: 170,
      protein: 10,
      prep: "Buy pre-roasted or dry roast at home",
      prepGu: "ઘરે સૂકા શેકો",
      tip: "Lemon water reduces cravings during shift.",
      tipGu: "લીંબુ પાણી ક્રેવિંગ ઘટાડે."
    },
    meal3: {
      name: "Banana + Peanut Butter + Warm Milk",
      nameGu: "કેળું + પીનટ બટર + ગરમ દૂધ",
      calories: 310,
      protein: 12,
      prep: "1 banana + 1 tbsp peanut butter + 1 glass warm milk",
      prepGu: "1 કેળું + 1 ચમચી પીનટ બટર + 1 ગ્લાસ દૂધ",
      tip: "Natural tryptophan in banana + milk helps sleep.",
      tipGu: "કેળા-દૂધ ઊંઘ માટે ઉત્તમ."
    }
  },

  Fri: {
    meal1: {
      name: "Soya Chunks Pulao + Raita",
      nameGu: "સોયા ચંક્સ પુલાવ + રાઇતા",
      calories: 500,
      protein: 38,
      prep: "Soak soya 15 mins. Use basmati rice — 1 cup.",
      prepGu: "સોયા 15 મિનિટ. બાસમતી ચોખા 1 કપ.",
      tip: "Friday big meal — you've earned it.",
      tipGu: "શુક્રવારનું મોટું ભોજન — તમે કમાયું છે."
    },
    meal2: {
      name: "Mixed Vegetable Soup + 1 Roti",
      nameGu: "મિક્સ શાક સૂપ + 1 રોટી",
      calories: 240,
      protein: 9,
      prep: "Blend or chunky. Add black pepper and ginger.",
      prepGu: "આદુ અને મરી ઉમેરો.",
      tip: "Weekend starts tomorrow — keep dinner light.",
      tipGu: "કાલ વીકેન્ડ — ભોજન હળવું રાખો."
    },
    snack: {
      name: "Walnuts (5–6) + Green Tea",
      nameGu: "અખરોટ (5-6) + ગ્રીન ટી",
      calories: 190,
      protein: 4,
      prep: "No prep needed",
      prepGu: "કોઈ તૈયારી નથી",
      tip: "Walnuts are great for mood and brain — helpful during withdrawal.",
      tipGu: "અખરોટ મૂડ અને મગજ માટે ઉત્તમ."
    },
    meal3: {
      name: "Vegetable Daliya (Broken wheat) + Curd",
      nameGu: "શાક દળિયા + દહીં",
      calories: 290,
      protein: 11,
      prep: "Add mixed vegetables. Cook soft consistency.",
      prepGu: "મિક્સ શાક ઉમેરો. નરમ રાંધો.",
      tip: "Easy to digest at 4 AM. Good sleep food.",
      tipGu: "4 AM પર સહેલો. ઊંઘ સારી."
    }
  },

  Sat: {
    meal1: {
      name: "Poha + Peanuts + Lemon",
      nameGu: "પૌવા + મગફળી + લીંબુ",
      calories: 380,
      protein: 14,
      prep: "Rinse poha well. Add curry leaves and mustard seeds.",
      prepGu: "પૌવા ધોઈ લો. કઢીપત્તા ઉમેરો.",
      tip: "Weekend treat meal — enjoy it mindfully.",
      tipGu: "વીકેન્ડ ભોજન — ધ્યાનથી ખાઓ."
    },
    meal2: {
      name: "Paneer Tikka (home style) + Green Chutney",
      nameGu: "પનીર ટિક્કા + લીલી ચટણી",
      calories: 420,
      protein: 30,
      prep: "Marinate paneer in curd + spices for 30 mins. Tawa cook.",
      prepGu: "30 મિનિટ દહીં-મસાલામાં. તવા પર.",
      tip: "No shift today — enjoy a slightly bigger meal.",
      tipGu: "આજ પાળી નહીં — ભોજન થોડું વધારે."
    },
    snack: {
      name: "Fruit Bowl — Banana + Apple + Pomegranate",
      nameGu: "ફળ — કેળું + સફરજન + દાડમ",
      calories: 200,
      protein: 3,
      prep: "Fresh cut. No sugar. Add chaat masala if needed.",
      prepGu: "તાજું કાપો. ખાંડ નહીં.",
      tip: "Antioxidants for skin balance on your rest day.",
      tipGu: "ત્વચા માટે ઍન્ટિઑક્સિડન્ટ."
    },
    meal3: {
      name: "Khichdi + Ghee + Pickle",
      nameGu: "ખીચડી + ઘી + અથાણું",
      calories: 330,
      protein: 13,
      prep: "1 tsp ghee on top after cooking. Comfort meal.",
      prepGu: "રાંધ્યા પછી 1 ચમચી ઘી.",
      tip: "Saturday night comfort. Sleep well tonight.",
      tipGu: "શનિ રાત્રી. ઘી + ખીચડી = ઊંઘ."
    }
  },

  Sun: {
    meal1: {
      name: "Upma + Coconut Chutney",
      nameGu: "ઉપમા + નારિયેળ ચટણી",
      calories: 360,
      protein: 12,
      prep: "Dry roast sooji first. Add mixed veggies.",
      prepGu: "સૂજી પહેલા સૂકી શેકો. મિક્સ શાક.",
      tip: "Light Sunday start. Sets up a good week.",
      tipGu: "હળવો રવિવાર. સારા અઠવાડિયા માટે."
    },
    meal2: {
      name: "Dal Tadka + 2 Rotis + Salad",
      nameGu: "દાળ તડકા + 2 રોટી + સૅલડ",
      calories: 450,
      protein: 24,
      prep: "Toor dal. Tadka with ghee, jeera, garlic.",
      prepGu: "તૂવેર દાળ. ઘી-જીરા-લસણ વઘાર.",
      tip: "Classic Sunday meal. Protein and comfort together.",
      tipGu: "ક્લૅસિક રવિ ભોજન."
    },
    snack: {
      name: "Peanut Butter + Apple slices",
      nameGu: "પીનટ બટર + સફરજન",
      calories: 210,
      protein: 7,
      prep: "1 tbsp peanut butter. Slice apple thin.",
      prepGu: "1 ચમચી. સફરજન પાતળું.",
      tip: "Good fat and fibre combo for energy.",
      tipGu: "ઊર્જા માટે ચરબી + ફાઇબર."
    },
    meal3: {
      name: "Warm Turmeric Milk + 2 Whole Wheat Biscuits",
      nameGu: "ગરમ હળદર દૂધ + 2 બિસ્કિટ",
      calories: 220,
      protein: 8,
      prep: "1 glass milk + pinch turmeric + pinch black pepper",
      prepGu: "1 ગ્લાસ દૂધ + ચપટી હળદર + ચpટી મરી",
      tip: "Sunday wind-down. Prepares body for Mon–Fri routine.",
      tipGu: "રવિ ઊંઘ. સોમ-શુક્ર માટે તૈયાર."
    }
  }
};