import { useMemo, useState } from "react";

const INJURY_CATEGORIES = [
  ["Back & Spine", ["Lower back pain", "Upper or middle back pain", "Herniated / slipped disc", "Bulging disc / disc degeneration", "Sciatica / nerve pain", "Scoliosis", "Spinal stenosis", "Spondylosis / spondylitis", "Previous spinal injury / fracture", "Chronic neck pain", "Whiplash injury", "Limited spinal mobility"]],
  ["Shoulder, Arm & Elbow", ["Shoulder pain / injury", "Rotator cuff injury", "Shoulder impingement", "Frozen shoulder", "Shoulder dislocation / instability", "Previous shoulder surgery", "Elbow pain / injury", "Tennis elbow / golfer’s elbow", "Limited shoulder or arm mobility"]],
  ["Wrist, Hand & Fingers", ["Wrist pain / injury", "Carpal tunnel syndrome", "Tendonitis / tendinopathy", "Grip weakness / limited grip", "Finger or thumb injury", "Previous wrist / hand surgery", "Limited wrist or hand mobility"]],
  ["Hip, Pelvis & Groin", ["Hip pain / injury", "Hip impingement", "Hip bursitis", "Hip labral injury", "Hip dislocation / instability", "Previous hip surgery / replacement", "Groin strain / injury", "Pelvic pain / instability", "Limited hip mobility"]],
  ["Knee", ["Knee pain / injury", "ACL / PCL ligament injury", "MCL / LCL ligament injury", "Meniscus tear", "Patellar tracking / kneecap problems", "Knee instability", "Knee arthritis", "Previous knee surgery / replacement", "Limited knee bending or straightening"]],
  ["Ankle, Foot & Leg", ["Ankle sprain / instability", "Achilles tendon injury", "Plantar fasciitis / heel pain", "Flat feet / foot pain", "Shin splints", "Calf or hamstring injury", "Muscle tear / recurring strains", "Stress fracture / previous fracture", "Limited ankle mobility", "Difficulty standing or walking"]],
  ["Muscles, Tendons & Joints", ["Chronic muscle pain", "Recurring muscle cramps", "Tendon or ligament injury", "Pain in multiple joints", "Arthritis / osteoarthritis", "Rheumatoid / inflammatory arthritis", "Hypermobility / loose joints", "Reduced flexibility / range of motion", "Muscle weakness / imbalance", "Chronic pain condition"]],
  ["Bones & Previous Injuries", ["Previous fracture / broken bone", "Osteoporosis / low bone density", "Previous stress fracture", "Previous dislocation", "Previous major accident / trauma", "Surgery affecting exercise", "Implant, plate, screw or joint prosthesis", "Unhealed / recovering injury", "Doctor-prescribed movement restriction"]],
  ["Neurological & Balance Limitations", ["Balance / coordination difficulties", "Vertigo / dizziness affecting movement", "Nerve damage / neuropathy", "Numbness / tingling in limbs", "Reduced sensation in hands or feet", "Muscle weakness due to a neurological condition", "Tremor affecting exercise", "Difficulty walking independently", "Use of a cane, walker or mobility aid"]],
  ["Cardiorespiratory & Exertion Limitations", ["Exercise-induced asthma / breathing limitation", "Shortness of breath during exertion", "Heart condition with exercise restrictions", "High blood pressure with exercise restrictions", "History of fainting during exercise", "Low exercise tolerance due to a diagnosed condition", "Doctor-prescribed heart-rate / exercise-intensity limits"]],
  ["Other Physical Considerations", ["Abdominal / inguinal hernia", "Pelvic floor dysfunction", "Urinary leakage during exercise", "Pregnancy-related movement restrictions", "Postpartum recovery restrictions", "Recent surgery / medical procedure", "Amputation / limb difference", "Prosthetic limb", "Chronic swelling / lymphedema", "Visual impairment affecting movement safety", "Hearing impairment affecting instruction safety", "Other physical limitation"]]
];

const MOVEMENT_LIMITATIONS = ["Squatting", "Lunging", "Bending forward", "Twisting the torso", "Raising arms overhead", "Pushing movements (push-ups / bench press)", "Pulling movements (rows / pull-ups)", "Lifting weights from the floor", "Running / sprinting", "Jumping / high-impact exercise", "Kneeling / getting down to the floor", "Balancing on one leg", "Walking / climbing stairs", "Holding weights / gripping equipment", "Sitting on the floor / getting up from it", "Standing for long periods"];

const NONE = "None of these";
const STATUS = ["Recovered", "Ongoing", "Recovering / under rehabilitation", "Unsure"];
const SYMPTOMS = ["No current symptoms", "Mild", "Moderate", "Severe", "Varies by activity"];
const RESTRICTIONS = ["Yes, a doctor or physiotherapist has restricted certain activities", "No known professional restrictions", "Unsure"];
const SAFETY_TRIGGERS = ["Recent surgery / medical procedure", "Unhealed / recovering injury", "Previous stress fracture", "Heart condition with exercise restrictions", "Doctor-prescribed heart-rate / exercise-intensity limits", "History of fainting during exercise", "Muscle weakness due to a neurological condition", "Difficulty walking independently"];

const inputStyle = { width: "100%", padding: "12px", border: "1px solid var(--app-border)", borderRadius: "8px", background: "var(--app-surface)", color: "var(--app-text)", fontSize: "16px", boxSizing: "border-box" };

function toggle(values, item, noneLabel = NONE) {
  if (item === noneLabel) return values.includes(noneLabel) ? [] : [noneLabel];
  const withoutNone = values.filter(value => value !== noneLabel);
  return withoutNone.includes(item) ? withoutNone.filter(value => value !== item) : [...withoutNone, item];
}

function Chips({ items, onRemove, disabled, primaryColor }) {
  return items.length ? <div aria-live="polite" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
    {items.map(item => <button key={item} type="button" disabled={disabled} onClick={() => onRemove(item)} style={{ border: 0, borderRadius: "999px", padding: "6px 10px", background: primaryColor, color: "white", cursor: disabled ? "default" : "pointer" }}>{item} ×</button>)}
  </div> : null;
}

export default function InjuryLimitationsForm({ value = {}, onChange, disabled = false, primaryColor = "var(--app-primary)" }) {
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState(() => new Set());
  const injuries = Array.isArray(value.injuries) ? value.injuries : [];
  const movements = Array.isArray(value.movementLimitations) ? value.movementLimitations : [];
  const details = value.details || {};
  const normalizedQuery = query.trim().toLowerCase();
  const visibleCategories = useMemo(() => INJURY_CATEGORIES.map(([title, options]) => [title, options.filter(option => !normalizedQuery || option.toLowerCase().includes(normalizedQuery) || title.toLowerCase().includes(normalizedQuery))]).filter(([, options]) => options.length), [normalizedQuery]);
  const update = (patch) => {
    try {
      onChange({ injuries, movementLimitations: movements, details, notes: "", ...value, ...patch });
    } catch (error) {
      console.error("Error updating injury limitations:", error);
    }
  };
  const changeInjury = (item) => update({ injuries: toggle(injuries, item) });
  const changeMovement = (item) => update({ movementLimitations: toggle(movements, item) });
  const updateDetail = (item, field, fieldValue) => update({ details: { ...details, [item]: { ...(details[item] || {}), [field]: fieldValue } } });
  const needsSafetyPrompt = injuries.some(item => SAFETY_TRIGGERS.includes(item)) || Object.values(details).some(detail => detail?.professionalRestrictions?.startsWith("Yes"));

  return <div style={{ display: "grid", gap: "20px" }}>
    <section>
      <label htmlFor="injury-search" style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Do you have any existing injuries, physical limitations, or movement restrictions?</label>
      <p style={{ margin: "0 0 10px", color: "var(--app-muted)", fontSize: "14px" }}>Optional. You can choose symptoms or functional limits even without a diagnosis.</p>
      <input id="injury-search" disabled={disabled} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search injuries or limitations" style={inputStyle} />
      <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
        <button type="button" disabled={disabled} onClick={() => changeInjury(NONE)} aria-pressed={injuries.includes(NONE)} style={{ ...inputStyle, textAlign: "left", cursor: "pointer", background: injuries.includes(NONE) ? "color-mix(in srgb, var(--app-primary) 18%, var(--app-surface))" : "var(--app-surface)" }}>{injuries.includes(NONE) ? "✓ " : ""}{NONE}</button>
        {visibleCategories.map(([title, options]) => <details key={title} open={normalizedQuery || openCategories.has(title)} onToggle={event => {
          if (event.currentTarget) {
            setOpenCategories(previous => {
              const next = new Set(previous);
              event.currentTarget.open ? next.add(title) : next.delete(title);
              return next;
            });
          }
        }} style={{ border: "1px solid var(--app-border)", borderRadius: "8px", padding: "10px" }}>
          <summary style={{ cursor: "pointer", fontWeight: 650 }}>{title} <span style={{ color: "var(--app-muted)", fontWeight: 400 }}>({options.length})</span></summary>
          <div style={{ display: "grid", gap: "6px", marginTop: "10px" }}>
            {options.map(option => <label key={option} style={{ display: "flex", gap: "9px", alignItems: "flex-start", cursor: disabled ? "default" : "pointer" }}><input type="checkbox" disabled={disabled || injuries.includes(NONE)} checked={injuries.includes(option)} onChange={() => changeInjury(option)} /> <span>{option}</span></label>)}
          </div>
        </details>)}
      </div>
      <Chips items={injuries} onRemove={changeInjury} disabled={disabled} primaryColor={primaryColor} />
    </section>

    {injuries.filter(item => item !== NONE).length > 0 && <section aria-label="Injury follow-up details" style={{ display: "grid", gap: "12px" }}>
      <h3 style={{ margin: 0, fontSize: "16px" }}>Optional follow-up details</h3>
      {injuries.filter(item => item !== NONE).map(item => <div key={item} style={{ border: "1px solid var(--app-border)", borderRadius: "8px", padding: "12px" }}>
        <strong>{item}</strong>
        <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
          <SelectField label="Current status" options={STATUS} value={details[item]?.status || ""} disabled={disabled} onChange={fieldValue => updateDetail(item, "status", fieldValue)} />
          <SelectField label="Current symptoms" options={SYMPTOMS} value={details[item]?.symptoms || ""} disabled={disabled} onChange={fieldValue => updateDetail(item, "symptoms", fieldValue)} />
          <SelectField label="Professional restrictions" options={RESTRICTIONS} value={details[item]?.professionalRestrictions || ""} disabled={disabled} onChange={fieldValue => updateDetail(item, "professionalRestrictions", fieldValue)} />
        </div>
      </div>)}
    </section>}

    <section>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Which movements are difficult, painful, or restricted for you?</label>
      <div style={{ display: "grid", gap: "7px" }}>
        {[...MOVEMENT_LIMITATIONS, NONE, "Other movement limitation"].map(item => <label key={item} style={{ display: "flex", gap: "9px", alignItems: "flex-start" }}><input type="checkbox" disabled={disabled || (movements.includes(NONE) && item !== NONE)} checked={movements.includes(item)} onChange={() => changeMovement(item)} /> <span>{item}</span></label>)}
      </div>
      <Chips items={movements} onRemove={changeMovement} disabled={disabled} primaryColor={primaryColor} />
    </section>

    <label style={{ display: "grid", gap: "7px", fontWeight: 700 }}>Anything else we should know about this injury or limitation?<textarea disabled={disabled} rows={3} value={value.notes || ""} onChange={event => update({ notes: event.target.value })} placeholder="Optional details, triggers, or clinician guidance" style={{ ...inputStyle, resize: "vertical" }} /></label>
    {needsSafetyPrompt && <div role="status" style={{ border: "1px solid #d97706", borderRadius: "8px", padding: "12px", background: "rgba(217,119,6,.12)", color: "var(--app-text)" }}><strong>Safety note:</strong> Please seek appropriate medical or physiotherapy clearance before changing your exercise routine. The app cannot replace a clinician’s restrictions.</div>}
  </div>;
}

function SelectField({ label, options, value, onChange, disabled }) {
  return <label style={{ display: "grid", gap: "5px", fontSize: "14px" }}>{label}<select disabled={disabled} value={value} onChange={event => onChange(event.target.value)} style={inputStyle}><option value="">Not specified</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>;
}
