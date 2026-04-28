import { useState } from "react";

export default function Home() {

  const [selectedDay, setSelectedDay] = useState("Wed");

  return (
    <div className="page">

      {/* Header */}
      <h1 style={{color:"#0F172A"}}>My Wellness Plan</h1>

      <p style={{color:"#64748B", marginBottom:"12px"}}>
        Wednesday • Summer
      </p>


      {/* Day Selector */}
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        marginBottom:"26px"
      }}>
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
          <div
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              flex:1,
              textAlign:"center",
              padding:"8px 0",
              borderRadius:"10px",
              margin:"0 3px",
              background: selectedDay === day ? "#2563EB" : "#E2E8F0",
              color: selectedDay === day ? "white" : "#0F172A",
              fontWeight:"500",
              fontSize:"14px",
              cursor:"pointer",
              transition:"0.2s"
            }}
          >
            {day}
          </div>
        ))}
      </div>


      {/* Stats */}
      <div style={{
        display:"flex",
        gap:"16px",
        marginBottom:"24px"
      }}>

        <div style={{
          flex:1,
          background:"#3B82F6",
          color:"white",
          padding:"20px",
          borderRadius:"12px",
          textAlign:"center"
        }}>
          <h2 style={{margin:0}}>1140</h2>
          <p style={{margin:0}}>Calories</p>
        </div>

        <div style={{
          flex:1,
          background:"#10B981",
          color:"white",
          padding:"20px",
          borderRadius:"12px",
          textAlign:"center"
        }}>
          <h2 style={{margin:0}}>63g</h2>
          <p style={{margin:0}}>Protein</p>
        </div>

      </div>


      {/* Workout */}
      <div style={{
        background:"#F1F5F9",
        padding:"20px",
        borderRadius:"12px",
        marginBottom:"20px"
      }}>
        <h3 style={{color:"#2563EB"}}>Workout Focus</h3>

        <p style={{color:"#64748B"}}>Back + Posture</p>

        <ul>
          <li>Dumbbell rows — 3 × 12</li>
          <li>Rear delt fly — 3 × 12</li>
          <li>Superman hold — 3 × 20 sec</li>
          <li>Wall angels — 2 × 10</li>
        </ul>
      </div>


      {/* Detox */}
      <div style={{
        background:"#F1F5F9",
        padding:"20px",
        borderRadius:"12px"
      }}>
        <h3 style={{color:"#10B981"}}>Detox Drink</h3>

        <p>Sabja seeds + Lemon + Cold water</p>

        <p style={{color:"#64748B"}}>
          Drink cold or room temperature.
        </p>
      </div>

    </div>
  );
}