import { useState } from "react";
import { WORKOUT_SPLIT } from "./data/workouts";
import { DIET_PLAN } from "./data/diet";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_GU = ["સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ", "રવિ"];

function getSeason(month) {
  if (month >= 2 && month <= 5) return "summer";
  if (month >= 6 && month <= 8) return "monsoon";
  if (month >= 9 && month <= 10) return "postmonsoon";
  return "winter";
}

const SEASON_DRINKS = {
  summer: {
    label: "Summer ☀️", gu: "ઉનાળો",
    base: "Sabja seeds + Lemon + Cold water",
    baseGu: "સબજા બીજ + લીંબુ + ઠંડું પાણી",
    rotate: ["Coconut water", "Cucumber + Mint water", "Aloe vera + cold water + pink salt", "Rose water + Sabja + Lemon"],
    rotateGu: ["નારિયેળ પાણી", "કાકડી + ફુદીનો પાણી", "એલોવેરા + ઠંડું પાણી", "ગુલાબ જળ + સબજા + લીંબુ"],
    tip: "Always drink cold or room temp. Avoid hot drinks at 3 PM in summer.",
    tipGu: "ઉનાળામાં ઠંડું અથવા સામાન્ય પાણી લો.",
  },
  monsoon: {
    label: "Monsoon 🌧️", gu: "ચોમાસુ",
    base: "Warm Ginger + Lemon + Honey water",
    baseGu: "ગરમ આદુ + લીંબુ + મધ પાણી",
    rotate: ["Jeera water (warm)", "Fresh Tulsi tea", "Coriander seed water", "Turmeric + black pepper water"],
    rotateGu: ["જીરા પાણી (ગરમ)", "તાજી તુલસી ચા", "ધાણા બીજ પાણી", "હળદર + મરી પાણી"],
    tip: "Avoid cold drinks in monsoon — gut is sensitive. Always go warm.",
    tipGu: "ચોમાસામાં ઠંડા પીણા ટાળો — ગરમ લો.",
  },
  postmonsoon: {
    label: "Post-Monsoon 🍂", gu: "ચોમાસા પછી",
    base: "Warm Lemon + ACV + Water",
    baseGu: "ગરમ લીંબુ + ACV + પાણી",
    rotate: ["Amla juice + water", "Triphala water (overnight soak)", "Fennel seed water", "Ashwagandha warm water"],
    rotateGu: ["આમળા જ્યુસ + પાણી", "ત્રિફળા પાણી", "વરિયાળી પાણી", "અશ્વગંધા ગરમ પાણી"],
    tip: "Liver detox focus — ACV helps reset digestion after monsoon.",
    tipGu: "ACV લીવર ડિટોક્સ માટે ઉત્તમ છે.",
  },
  winter: {
    label: "Winter ❄️", gu: "શિયાળો",
    base: "Turmeric + Ginger + Black pepper + Coconut oil",
    baseGu: "હળદર + આદુ + મરી + નારિયેળ તેલ",
    rotate: ["Ashwagandha warm milk", "Moringa + warm water + lemon", "Warm peppermint tea", "Tulsi + ginger tea"],
    rotateGu: ["અશ્વગંધા ગરમ દૂધ", "મોરિંગા + ગરમ પાણી + લીંબુ", "ફુદીના ચા", "તુલસી + આદુ ચા"],
    tip: "Winter is best for ashwagandha — great for withdrawal anxiety too.",
    tipGu: "શિયાળામાં અશ્વગંધા ખૂબ ફાયદાકારક છે.",
  },
};

const PREP_ITEMS = {
  Mon: {
    en: ["Soak moong dal for Tuesday breakfast", "Keep sabja seeds soaked in water before sleep", "Check dumbbell setup for Tue shoulders"],
    gu: ["મૂંગ દાળ મંગળ માટે પલાળો", "સૂતા પહેલા સબજા પાણીમાં પલાળો", "મંગળ ખભા માટે ડમ્બેલ તૈયાર"]
  },
  Tue: {
    en: ["Prep veggies for Wednesday meal", "Refill water bottles for shift", "Check shoulder/arm exercises for tomorrow"],
    gu: ["બુધ ભોજન માટે શાક તૈયાર", "પાળી માટે પાણીની બોટલ ભરો", "કાલ ખભા-હાથ વ્યાયામ તપાસો"]
  },
  Wed: {
    en: ["Soak rajma overnight for Thursday", "Note: back exercises — go slow, form first"],
    gu: ["ગુરુ માટે રાજમા પલાળો", "પીઠ વ્યાયામ — ધીમે, ફોર્મ પ્રથમ"]
  },
  Thu: {
    en: ["Light groceries check — restock if needed", "Core day tomorrow — no heavy dinner tonight"],
    gu: ["કરિયાણા તપાસ — જો જરૂરી હોય", "કાલ કોર — આજ ભારે ભોજન નહીં"]
  },
  Fri: {
    en: ["Weekend grocery run planning", "Plan Saturday morning walk route"],
    gu: ["વીકેન્ડ કરિયાણા આયોજન", "શનિ સવારે ચાલવાનો રૂટ"]
  },
  Sat: {
    en: ["Rest and restock — light Sunday planned", "Check weekly progress mentally"],
    gu: ["આરામ અને ભરણ — રવિ હળવો", "સાપ્તાહિક પ્રગતિ મનમાં તપાસો"]
  },
  Sun: {
    en: ["Soak overnight ingredients for Monday", "Set intentions for the week ahead"],
    gu: ["સોમ માટે રાતે સામગ્રી પલાળો", "આવતા અઠવાડિયા માટે ઇરાદો"]
  },
};

const TYPE_COLORS = {
  drink:   { bg: "#fff8e7", border: "#e8a427" },
  workout: { bg: "#f0f7ee", border: "#5a8f4e" },
  meal:    { bg: "#fff2ee", border: "#c0522a" },
  shift:   { bg: "#eef4ff", border: "#3d6b8f" },
  snack:   { bg: "#f5f0ff", border: "#7a5c9e" },
  sleep:   { bg: "#f0f4ff", border: "#4a5f8f" },
};

const UI = {
  en: {
    title: "My Wellness Plan",
    subtitle: "Night Shift · Recomp · Vadodara",
    calories: "Calories",
    protein: "Protein",
    goal: "Goal",
    workoutFocus: "TODAY'S WORKOUT FOCUS",
    detoxDrink: "TODAY'S DETOX DRINK",
    rotate: "ROTATE THROUGH THE WEEK",
    timeline: "DAILY TIMELINE",
    prepTomorrow: "PREP FOR TOMORROW",
    tomorrow: "Tomorrow",
    expandHint: "Tap to expand",
    pending: "Coming soon — building this section",
    sets: "sets",
    reps: "reps",
  },
  gu: {
    title: "મારી સ્વાસ્થ્ય યોજના",
    subtitle: "નાઇટ શિફ્ટ · રિકૉમ્પ · વડોદરા",
    calories: "કૅલરી",
    protein: "પ્રોટીન",
    goal: "લક્ષ્ય",
    workoutFocus: "આજનો વ્યાયામ",
    detoxDrink: "આજનું ડિટૉક્સ પીણું",
    rotate: "સાપ્તાહિક ફેરફાર",
    timeline: "દૈનિક સમયપત્રક",
    prepTomorrow: "કાલ માટે તૈયારી",
    tomorrow: "કાલ",
    expandHint: "વિગત માટે ટૅપ કરો",
    pending: "ટૂંક સમયમાં — આ વિભાગ બની રહ્યો છે",
    sets: "સેટ",
    reps: "રેપ",
  }
};

export default function Dashboard() {
  const today = new Date();
  const dayMap = [6, 0, 1, 2, 3, 4, 5];
  const [selectedDay, setSelectedDay] = useState(dayMap[today.getDay()]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [lang, setLang] = useState("en");

  const L = UI[lang];
  const currentMonth = today.getMonth();
  const season = getSeason(currentMonth);
  const seasonData = SEASON_DRINKS[season];
  const workout = WORKOUT_SPLIT[DAYS[selectedDay]];
  const diet = DIET_PLAN[DAYS[selectedDay]];

  const t = (en, gu) => lang === "gu" ? gu : en;

  const timeline = [
    {
      time: "3:00 PM", timeGu: "બપોરે ૩:૦૦", icon: "🌅", type: "drink",
      label: "Wake-up Detox Drink", labelGu: "જાગ્યા પછીનું ડિટૉક્સ પીણું",
      detail: seasonData.base, detailGu: seasonData.baseGu,
      tip: seasonData.tip, tipGu: seasonData.tipGu, status: "active",
    },
    {
      time: "3:30 PM", timeGu: "બપોરે ૩:૩૦", icon: "💪", type: "workout",
      label: `Workout #1 — ${workout.focus}`, labelGu: `વ્યાયામ #1 — ${workout.gu}`,
      detail: workout.exercises.slice(0, 2).map(e => `${e.name} · ${e.sets} sets × ${e.reps}`).join("\n"),
      detailGu: workout.exercises.slice(0, 2).map(e => `${e.nameGu} · ${e.sets} ${UI.gu.sets} × ${e.reps}`).join("\n"),
      tip: "10–15 mins only. Focus on form, not speed.",
      tipGu: "ફક્ત ૧૦-૧૫ મિનિટ. ઝડપ નહીં, ફૉર્મ ધ્યાનમાં.",
      status: "active",
    },
    {
      time: "4:30 PM", timeGu: "બપોરે ૪:૩૦", icon: "🍽️", type: "meal",
      label: `Meal 1 — ${diet.meal1.name}`, labelGu: `ભોજન ૧ — ${diet.meal1.nameGu}`,
      detail: `${diet.meal1.calories} kcal · ${diet.meal1.protein}g protein\nPrep: ${diet.meal1.prep}`,
      detailGu: `${diet.meal1.calories} kcal · ${diet.meal1.protein}g પ્રોટીન\nતૈયારી: ${diet.meal1.prepGu}`,
      tip: diet.meal1.tip, tipGu: diet.meal1.tipGu, status: "active",
    },
    {
      time: "5:30 PM", timeGu: "સાંજે ૫:૩૦", icon: "💪", type: "workout",
      label: `Workout #2 — ${workout.focus}`, labelGu: `વ્યાયામ #2 — ${workout.gu}`,
      detail: workout.exercises.slice(2).map(e => `${e.name} · ${e.sets} sets × ${e.reps}`).join("\n"),
      detailGu: workout.exercises.slice(2).map(e => `${e.nameGu} · ${e.sets} ${UI.gu.sets} × ${e.reps}`).join("\n"),
      tip: "Second session — lighter. Finish before 6 PM.",
      tipGu: "બીજો સત્ર — હળવો. ૬ PM પહેલાં.",
      status: "active",
    },
    {
      time: "6:30 PM", timeGu: "સાંજે ૬:૩૦", icon: "🍱", type: "meal",
      label: `Meal 2 — ${diet.meal2.name}`, labelGu: `ભોજન ૨ — ${diet.meal2.nameGu}`,
      detail: `${diet.meal2.calories} kcal · ${diet.meal2.protein}g protein\nPrep: ${diet.meal2.prep}`,
      detailGu: `${diet.meal2.calories} kcal · ${diet.meal2.protein}g પ્રોટીન\nતૈયારી: ${diet.meal2.prepGu}`,
      tip: diet.meal2.tip, tipGu: diet.meal2.tipGu, status: "active",
    },
    {
      time: "7:00 PM", timeGu: "સાંજે ૭:૦૦", icon: "🖥️", type: "shift",
      label: "Shift Starts", labelGu: "પાળી શરૂ",
      detail: "EST Night shift begins", detailGu: "EST નાઇટ પાળી શરૂ",
      tip: "Keep water bottle and snack ready at desk.",
      tipGu: "ડેસ્ક પર પાણી અને નાસ્તો તૈયાર.", status: "active",
    },
    {
      time: "11:00 PM", timeGu: "રાત્રે ૧૧:૦૦", icon: "🥜", type: "snack",
      label: `Break Snack — ${diet.snack.name}`, labelGu: `નાસ્તો — ${diet.snack.nameGu}`,
      detail: `${diet.snack.calories} kcal · ${diet.snack.protein}g protein\nPrep: ${diet.snack.prep}`,
      detailGu: `${diet.snack.calories} kcal · ${diet.snack.protein}g પ્રોટીન\nતૈયારી: ${diet.snack.prepGu}`,
      tip: diet.snack.tip, tipGu: diet.snack.tipGu, status: "active",
    },
    {
      time: "4:00 AM", timeGu: "સવારે ૪:૦૦", icon: "🌙", type: "meal",
      label: `Meal 3 — ${diet.meal3.name}`, labelGu: `ભોજન ૩ — ${diet.meal3.nameGu}`,
      detail: `${diet.meal3.calories} kcal · ${diet.meal3.protein}g protein\nPrep: ${diet.meal3.prep}`,
      detailGu: `${diet.meal3.calories} kcal · ${diet.meal3.protein}g પ્રોટીન\nતૈયારી: ${diet.meal3.prepGu}`,
      tip: diet.meal3.tip, tipGu: diet.meal3.tipGu, status: "active",
    },
    {
      time: "5:00 AM", timeGu: "સવારે ૫:૦૦", icon: "🌿", type: "drink",
      label: "Protein Shake", labelGu: "પ્રોટીન શૅક",
      detail: "Brand TBD — coming soon",
      detailGu: "બ્રૅન્ડ નક્કી થશે — ટૂંક સમયમાં",
      tip: "No screens 20 mins after this drink.",
      tipGu: "આ પછી ૨૦ મિનિટ ફોન ટાળો.", status: "active",
    },
    {
      time: "5:30 AM", timeGu: "સવારે ૫:૩૦", icon: "😴", type: "sleep",
      label: "Sleep — Target 7–8 hours", labelGu: "ઊંઘ — લક્ષ્ય ૭-૮ કલાક",
      detail: "Dark room. Fan or white noise if needed.",
      detailGu: "અંધારો ઓરડો. ફૅન ચલાવો.",
      tip: "Withdrawal may affect sleep — that's okay. Just lie down.",
      tipGu: "ઊંઘ ન આવે તો ઠીક — ફક્ત સૂઈ રહો.", status: "active",
    },
  ];

  const totalCals = diet.meal1.calories + diet.meal2.calories + diet.snack.calories + diet.meal3.calories;
  const totalProtein = diet.meal1.protein + diet.meal2.protein + diet.snack.protein + diet.meal3.protein;

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "linear-gradient(160deg, #fdf6e3 0%, #f5ede0 100%)", minHeight: "100vh", paddingBottom: 40 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .day-btn {
          border: 2px solid #e8d5c0; background: white; cursor: pointer;
          padding: 8px 12px; border-radius: 14px; font-family: 'DM Sans', sans-serif;
          font-size: 12px; transition: all 0.2s; min-width: 52px; text-align: center; color: #8a6a40;
        }
        .day-btn.active {
          background: linear-gradient(135deg, #b5541e, #e8a427); color: white;
          border-color: transparent; box-shadow: 0 4px 12px rgba(181,84,30,0.3);
        }
        .day-btn:hover:not(.active) { border-color: #b5541e; color: #b5541e; }
        .timeline-card {
          background: white; border-radius: 16px; padding: 14px 16px; margin-bottom: 10px;
          border-left: 4px solid; box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          cursor: pointer; transition: all 0.2s;
        }
        .timeline-card:hover { transform: translateX(4px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .rotate-chip {
          display: inline-block; background: #fff8e7; border-radius: 20px;
          padding: 5px 12px; margin: 3px; font-size: 11.5px;
          font-family: 'DM Sans', sans-serif; color: #7a4a1e; border: 1px solid #f0d8a0;
        }
        .prep-card {
          background: white; border-radius: 12px; padding: 11px 14px; margin-bottom: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          border-left: 3px solid #e8a427; color: #5a3e1e; box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .section-label {
          font-family: 'DM Sans', sans-serif; font-size: 10.5px; letter-spacing: 2.5px;
          color: #b5541e; text-transform: uppercase; margin-bottom: 12px; margin-top: 4px;
        }
        .lang-toggle {
          display: flex; align-items: center; background: rgba(255,255,255,0.2);
          border-radius: 20px; padding: 4px; gap: 2px; border: none; cursor: pointer;
        }
        .lang-btn {
          padding: 4px 12px; border-radius: 16px; font-size: 12px;
          font-family: 'DM Sans', sans-serif; border: none; cursor: pointer;
          transition: all 0.2s; font-weight: 500;
        }
        .lang-btn.active { background: white; color: #b5541e; }
        .lang-btn.inactive { background: transparent; color: rgba(255,255,255,0.8); }
        .detail-text { white-space: pre-line; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #b5541e 0%, #d4821e 60%, #e8a427 100%)", padding: "28px 20px 22px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, fontFamily: "'DM Sans', sans-serif", opacity: 0.75, marginBottom: 6 }}>
              {L.subtitle.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700 }}>
              🥗 {L.title}
            </div>
          </div>

          {/* Language Toggle */}
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === "en" ? "active" : "inactive"}`} onClick={() => setLang("en")}>EN</button>
            <button className={`lang-btn ${lang === "gu" ? "active" : "inactive"}`} onClick={() => setLang("gu")}>ગુ</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            📅 {today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </span>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            {t(seasonData.label, `${seasonData.label} · ${seasonData.gu}`)}
          </span>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* Day Selector */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "16px 0 10px", scrollbarWidth: "none" }}>
          {DAYS.map((day, i) => (
            <button key={day} className={`day-btn ${selectedDay === i ? "active" : ""}`} onClick={() => { setSelectedDay(i); setExpandedItem(null); }}>
              <div style={{ fontWeight: 600 }}>{lang === "gu" ? DAYS_GU[i] : day}</div>
            </button>
          ))}
        </div>

        {/* Stats Bar — dynamic from diet data */}
        <div style={{ background: "#1c1c1e", borderRadius: 18, padding: "16px 10px", display: "flex", justifyContent: "space-around", marginBottom: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#e8a427", fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>{totalCals}</div>
            <div style={{ color: "#888", fontSize: 10, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{L.calories}</div>
          </div>
          <div style={{ width: 1, background: "#333" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#5a8f4e", fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>{totalProtein}g</div>
            <div style={{ color: "#888", fontSize: 10, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{L.protein}</div>
          </div>
          <div style={{ width: 1, background: "#333" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#e07060", fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Recomp</div>
            <div style={{ color: "#888", fontSize: 10, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{L.goal}</div>
          </div>
        </div>

        {/* Today's Workout Focus */}
        <div style={{ background: "linear-gradient(135deg, #f0f7ee, #e4f0e0)", border: "1px solid #c0dab0", borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
          <div className="section-label">{L.workoutFocus}</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#2d5a20", marginBottom: 8 }}>
            💪 {t(workout.focus, workout.gu)}
          </div>
          {workout.exercises.map((ex, i) => (
            <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#4a7a40", marginBottom: 4 }}>
              · {t(ex.name, ex.nameGu)} — {ex.sets} {L.sets} × {ex.reps}
            </div>
          ))}
        </div>

        {/* Detox Drink Highlight */}
        <div style={{ background: "linear-gradient(135deg, #fff8e7, #fdf0d5)", border: "1px solid #e8c878", borderRadius: 16, padding: "14px 16px", marginBottom: 20 }}>
          <div className="section-label">{L.detoxDrink}</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, marginBottom: 10, color: "#7a4a1e" }}>
            🌅 {t(seasonData.base, seasonData.baseGu)}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 2, color: "#b5541e", marginBottom: 8 }}>{L.rotate}</div>
          <div>
            {seasonData.rotate.map((r, i) => (
              <span key={i} className="rotate-chip">🔄 {t(r, seasonData.rotateGu[i])}</span>
            ))}
          </div>
          <div style={{ marginTop: 12, background: "#fff3cd", borderRadius: 10, padding: "8px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8a6020" }}>
            💡 {t(seasonData.tip, seasonData.tipGu)}
          </div>
        </div>

        {/* Timeline */}
        <div className="section-label">{L.timeline}</div>
        {timeline.map((item, i) => {
          const colors = TYPE_COLORS[item.type];
          const isExpanded = expandedItem === i;
          return (
            <div
              key={i}
              className="timeline-card"
              style={{ borderLeftColor: colors.border, background: colors.bg }}
              onClick={() => setExpandedItem(isExpanded ? null : i)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: "#aaa", marginBottom: 4 }}>
                    <span style={{ background: colors.border, borderRadius: 4, padding: "1px 6px", color: "white", marginRight: 6, fontSize: 10 }}>
                      {t(item.time, item.timeGu)}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: "#2a1a0a", marginBottom: 2 }}>
                    {item.icon} {t(item.label, item.labelGu)}
                  </div>
                  {isExpanded && (
                    <div style={{ marginTop: 12, borderTop: "1px solid #f0e0d0", paddingTop: 10 }}>
                      <div className="detail-text" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#5a3a1a", marginBottom: 10 }}>
                        📌 {t(item.detail, item.detailGu)}
                      </div>
                      <div style={{ background: "#fffbf0", borderRadius: 8, padding: "8px 10px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8a6020" }}>
                        💡 {t(item.tip, item.tipGu)}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ marginLeft: 10, color: "#ccc", fontSize: 16 }}>{isExpanded ? "▲" : "▼"}</div>
              </div>
            </div>
          );
        })}

        {/* Prep for Tomorrow */}
        <div style={{ marginTop: 20, background: "linear-gradient(135deg, #fff2ee, #ffe8e0)", border: "1px solid #f0c0a8", borderRadius: 16, padding: "16px" }}>
          <div className="section-label">
            🔔 {L.prepTomorrow} — {lang === "gu" ? DAYS_GU[(selectedDay + 1) % 7] : DAYS[(selectedDay + 1) % 7]}
          </div>
          {PREP_ITEMS[DAYS[(selectedDay + 1) % 7]][lang === "gu" ? "gu" : "en"].map((item, i) => (
            <div key={i} className="prep-card">✅ {item}</div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#c0a880" }}>
          {t("Built for Sujay · Vadodara, Gujarat 🌿", "સુજય માટે · વડોદરા, ગુજરાત 🌿")}<br />
          {t("Night Shift Recomp — Version 1.1", "નાઇટ શિફ્ટ રિકૉમ્પ — વર્ઝન ૧.૧")}
        </div>
      </div>
    </div>
  );
}