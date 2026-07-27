"use client";

/* ============================================================================
   MedVault — approved redesign, exact reference implementation.
   Drop at app/redesign-v2/page.jsx to preview, or split into components.
   PRESENTATION ONLY. Wire the marked handlers to the existing cart / search /
   WhatsApp order logic. Do not change any backend, API, Supabase or Razorpay code.
   Every pixel value here is the approved design — do not "improve" them.
   ========================================================================== */

import { useState, useEffect, useRef, useCallback } from "react";
import { BOOK_ITEMS } from "../page"; // real BPT textbook catalogue (with real cover images)

/* ---------------------------------------------------------------- tokens -- */
const T = {
  white: "#FFFFFF", surface: "#F8FBF9", media: "#F5F8F6", tint: "#F2F6F3",
  ink: "#0E1A14", ink2: "#17281F", body: "#3D4E45", muted: "#54655C",
  muted2: "#7B8B82", muted3: "#9AA8A0",
  line: "#E6EBE8", lineStrong: "#D3DED8", lineSoft: "#EEF2F0",
  green: "#16A34A", greenDark: "#15803D", greenLight: "#22B558",
  greenTint: "#EAF6EF", greenBorder: "#CFE9DA", greenSoft: "#F6FCF8", greenOnDark: "#6FBF8E",
  star: "#E0A32E", danger: "#E4574C", dangerBg: "#FEF3F2",
  darkLine: "#1E3227", darkCard: "#17281F", darkCardLn: "#24382C", darkText: "#9DB3A7",
};
const SH = {
  cardHover: "0 14px 30px rgba(11,43,29,.12)",
  panel: "0 6px 18px rgba(11,43,29,.05)",
  float: "0 16px 34px rgba(11,43,29,.12)",
  overlay: "0 24px 48px rgba(11,43,29,.10)",
  toast: "0 18px 40px rgba(11,43,29,.30)",
  primary: "0 8px 20px rgba(22,163,74,.24)",
};
const EASE = "cubic-bezier(.2,.7,.3,1)";
const UI = "'Plus Jakarta Sans', system-ui, sans-serif";
const MONO_FACE = "Inter, system-ui, sans-serif";
const container = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const fmt = (n) => "₹" + n.toLocaleString("en-IN");

/* --------------------------------------------------------------- imagery -- */
const PH = "/placeholder.svg";
const IP = (f) => "/placeholder.svg"; /* AI product photos removed — branded placeholder */

/* ------------------------------------------------------------------ data --
   Replace this array with the live product source. Field contract:
   id, cat, name, badge, price, mrp, img, reviews, stock, short, desc,
   features[], specs[{k,v}], contents[{name,retail}], gallery?[]
   ---------------------------------------------------------------------- */
const CATS = ["Assessment Kits", "Diagnostic Equipment", "Physiotherapy", "Nursing Essentials", "Medical Accessories", "BPT Textbooks"];

const BASE = [
  { id: "k1", cat: "Assessment Kits", name: "MedVault MVP Physiotherapy Assessment Kit", badge: "Bestseller", price: 1799, mrp: 2358, img: "/kit.jpg", reviews: 184, stock: 48,
    short: "Nine instruments covering the entire first-year assessment syllabus, in one waterproof case. Bought separately it comes to ₹2,358.",
    desc: "The MVP Kit is the kit we built after watching first-years turn up to practicals with half their instruments borrowed. It carries a genuine BPL dual-head stethoscope, all three goniometers, a 128 Hz tuning fork, knee hammer, measuring tape, assessment notepad and skin marker — everything the BPT curriculum asks you to demonstrate. Packed in a waterproof MedVault pouch with your name and RA number printed free on the first 50 orders.",
    features: ["Genuine BPL stethoscope", "All three goniometers", "Curriculum-mapped", "Waterproof carry pouch"],
    specs: [{ k: "Instruments", v: "9 pieces" }, { k: "Case", v: "Waterproof zip pouch" }, { k: "Stethoscope", v: "BPL dual-head" }, { k: "Warranty", v: "1 year (stethoscope)" }, { k: "Personalisation", v: "Name + RA number" }, { k: "Best for", v: "1st & 2nd year BPT" }],
    contents: [{ name: "BPL Dual-Sided Chestpiece Stethoscope", retail: "₹950" }, { name: "Universal Goniometer", retail: "₹293" }, { name: "Half-Range Goniometer", retail: "₹267" }, { name: "Finger Goniometer", retail: "₹267" }, { name: "128 Hz Tuning Fork", retail: "₹102" }, { name: "Knee Hammer", retail: "₹78" }, { name: "Measuring Tape", retail: "₹100" }, { name: "Assessment Notepad", retail: "₹150" }, { name: "Skin Marker", retail: "₹151" }] },
  { id: "k2", cat: "Assessment Kits", name: "MedVault Clinical Goniometer Set", badge: "Essential", price: 849, mrp: 1358, img: IP("goniometer.jpg"), reviews: 96, stock: 72,
    short: "Everything for musculoskeletal and neurological range-of-motion work, with the assessment sheet and skin marker thrown in.",
    desc: "Three goniometers sized for large, medium and small joints, plus the reflex hammer, tuning fork and measuring tape you'll be marked on. A clinical assessment sheet and skin marker are included free. Sized to fit a coat pocket.",
    features: ["Three goniometer sizes", "Neuro tools included", "Free assessment sheet", "Fits a coat pocket"],
    specs: [{ k: "Instruments", v: "8 pieces" }, { k: "Goniometers", v: "Universal, half-range, finger" }, { k: "Material", v: "Transparent ABS" }, { k: "Scale", v: "0–360° / 0–180° / 0–90°" }, { k: "Free additions", v: "Sheet + marker" }, { k: "Best for", v: "MSK & neuro postings" }],
    contents: [{ name: "Universal Goniometer", retail: "₹293" }, { name: "Half-Range Goniometer", retail: "₹267" }, { name: "Finger Goniometer", retail: "₹267" }, { name: "Reflex (Knee) Hammer", retail: "₹78" }, { name: "128 Hz Tuning Fork", retail: "₹102" }, { name: "Measuring Tape", retail: "₹100" }, { name: "Clinical Assessment Sheet (free)", retail: "₹100" }, { name: "Skin Marker (free)", retail: "₹151" }] },
  { id: "k3", cat: "Assessment Kits", name: "CNS Assessment Kit", badge: "Neuro", price: 748, mrp: 904, img: "/pouch.jpg", reviews: 61, stock: 100,
    short: "A complete neurological examination set — reflex, vibration, sensory and pupillary testing — in a premium carry pouch.",
    desc: "Built for the neurology posting: reflex hammer, 128 Hz tuning fork, Wartenberg pinwheel, cotton swab and safety pin for sharp-dull discrimination, pen torch for pupillary reflexes, measuring tape and a clinical assessment sheet. All of it in a premium zip pouch.",
    features: ["Full neuro examination set", "Wartenberg pinwheel", "Pen torch included", "Premium carry pouch"],
    specs: [{ k: "Instruments", v: "9 pieces" }, { k: "Reflex hammer", v: "Taylor pattern" }, { k: "Tuning fork", v: "128 Hz aluminium" }, { k: "Torch", v: "LED with pupil gauge" }, { k: "Case", v: "Premium zip pouch" }, { k: "Best for", v: "Neurology postings" }],
    contents: [{ name: "Reflex Hammer", retail: "₹78" }, { name: "128 Hz Tuning Fork", retail: "₹102" }, { name: "Neurological Pin Wheel", retail: "₹200" }, { name: "Cotton Swab", retail: "₹50" }, { name: "Safety Pin", retail: "₹50" }, { name: "Measuring Tape", retail: "₹100" }, { name: "Pen Torch", retail: "₹124" }, { name: "Clinical Assessment Sheet", retail: "₹100" }, { name: "Premium Carry Pouch", retail: "₹100" }] },

  { id: "d1", cat: "Diagnostic Equipment", name: "BPL Dual-Sided Chestpiece Stethoscope", badge: "Monitoring", price: 950, mrp: 1299, img: IP("stethoscope.jpg"), reviews: 212, stock: 55,
    short: "Diaphragm for high-frequency sounds, bell for low. The genuine BPL, not a lookalike — with a one-year warranty.",
    desc: "A dual-head acoustic stethoscope with a diaphragm for high-frequency sounds and a bell for low-frequency sounds, suitable for cardiac, pulmonary and abdominal auscultation. Soft ear tips for long postings, clear-transmission tubing, and a one-year BPL manufacturer warranty.",
    features: ["Dual-head chestpiece", "Soft ear tips", "Clear-transmission tubing", "1-year warranty"],
    specs: [{ k: "Type", v: "Dual head, acoustic" }, { k: "Tubing", v: "PVC, 22 in" }, { k: "Ear tips", v: "Soft silicone" }, { k: "Brand", v: "BPL" }, { k: "Warranty", v: "1 year" }, { k: "Use", v: "Cardiac, pulmonary, abdominal" }], contents: [] },
  { id: "d2", cat: "Diagnostic Equipment", name: "Aneroid Sphygmomanometer", badge: "Monitoring", price: 1250, mrp: 1699, img: IP("sphygmomanometer.jpg"), reviews: 78, stock: 34,
    short: "Manual BP cuff with a shock-resistant gauge — the one your examiner expects you to know how to use.",
    desc: "A manual aneroid sphygmomanometer with a shock-resistant 300 mmHg gauge, latex inflation bulb with air-release valve, and a nylon cuff with a metal D-ring. Calibrated and ready for clinical use.",
    features: ["300 mmHg gauge", "Shock resistant", "Nylon adult cuff", "Carry case included"],
    specs: [{ k: "Range", v: "0–300 mmHg" }, { k: "Accuracy", v: "± 3 mmHg" }, { k: "Cuff", v: "Adult, nylon" }, { k: "Bulb", v: "Latex with valve" }, { k: "Case", v: "Zip pouch" }, { k: "Warranty", v: "1 year" }], contents: [] },
  { id: "d3", cat: "Diagnostic Equipment", name: "Digital BP Monitor", badge: "Monitoring", price: 1450, mrp: 1999, img: IP("bp-apparatus.jpg"), reviews: 44, stock: 22,
    short: "Automatic upper-arm monitor with memory — useful for home-visit postings and community placements.",
    desc: "An automatic upper-arm blood pressure monitor with a large display, irregular-heartbeat indicator and two-user memory. Handy for community postings and home visits where a manual reading is impractical.",
    features: ["Automatic inflation", "Large display", "2-user memory", "Irregular heartbeat alert"],
    specs: [{ k: "Method", v: "Oscillometric" }, { k: "Range", v: "0–299 mmHg" }, { k: "Memory", v: "2 × 60 readings" }, { k: "Power", v: "4 × AA" }, { k: "Cuff", v: "22–36 cm" }, { k: "Warranty", v: "1 year" }], contents: [] },
  { id: "d4", cat: "Diagnostic Equipment", name: "Digital Thermometer", badge: "Monitoring", price: 199, mrp: 299, img: IP("thermometer.jpg"), reviews: 130, stock: 180,
    short: "Ten-second read, waterproof tip, fever alarm. Basic, and you will use it every posting.",
    desc: "A digital clinical thermometer with a flexible waterproof tip, ten-second reading time, memory recall and a fever alarm. Oral, axillary or rectal use.",
    features: ["10-second reading", "Waterproof tip", "Fever alarm", "Memory recall"],
    specs: [{ k: "Range", v: "32–42 °C" }, { k: "Accuracy", v: "± 0.1 °C" }, { k: "Reading", v: "~10 seconds" }, { k: "Tip", v: "Flexible, waterproof" }, { k: "Battery", v: "LR41" }, { k: "Auto-off", v: "After 8 min" }], contents: [] },
  { id: "d5", cat: "Diagnostic Equipment", name: "LED Pen Torch", badge: "Neuro tool", price: 124, mrp: 250, img: IP("pen-torch.jpg"), reviews: 88, stock: 100,
    short: "Chrome pen torch with a pupil gauge printed on the barrel — for pupillary reflex testing.",
    desc: "A chrome medical pen torch with a bright LED tip and a pupil gauge millimetre scale printed on the barrel. Pocket clip, push-button operation, replaceable cells.",
    features: ["Bright LED tip", "Pupil gauge on barrel", "Pocket clip", "Replaceable cells"],
    specs: [{ k: "Body", v: "Chrome-plated brass" }, { k: "Light", v: "White LED" }, { k: "Gauge", v: "2–8 mm scale" }, { k: "Power", v: "2 × AAA" }, { k: "Length", v: "140 mm" }, { k: "Use", v: "Pupillary reflex" }], contents: [] },

  { id: "p1", cat: "Physiotherapy", name: "Universal Goniometer", badge: "Physio tool", price: 293, mrp: 450, img: IP("goniometer.jpg"), reviews: 156, stock: 80,
    short: "Full-circle 360° goniometer for hip, knee and shoulder range of motion.",
    desc: "A large transparent goniometer for measuring joint range of motion in major joints — hip, knee and shoulder. Clear ABS body with a 360° scale in 1° increments and a riveted, friction-held arm.",
    features: ["360° full circle", "1° increments", "Transparent ABS", "Riveted arm"],
    specs: [{ k: "Scale", v: "0–360°" }, { k: "Increment", v: "1°" }, { k: "Arm length", v: "200 mm" }, { k: "Material", v: "Transparent ABS" }, { k: "Use", v: "Hip, knee, shoulder" }, { k: "Autoclavable", v: "No" }], contents: [] },
  { id: "p2", cat: "Physiotherapy", name: "Half-Range Goniometer", badge: "Physio tool", price: 267, mrp: 300, img: IP("goniometer.jpg"), reviews: 74, stock: 80,
    short: "180° half-circle goniometer with two adjustable arms — elbow and ankle work.",
    desc: "A standard 180-degree half-circle goniometer with two adjustable arms, sized for elbow and ankle measurements. Clear body, easy to read against skin.",
    features: ["180° half circle", "Two adjustable arms", "Pocket sized", "Clear scale"],
    specs: [{ k: "Scale", v: "0–180°" }, { k: "Increment", v: "1°" }, { k: "Arm length", v: "150 mm" }, { k: "Material", v: "Transparent ABS" }, { k: "Use", v: "Elbow, ankle, wrist" }, { k: "Autoclavable", v: "No" }], contents: [] },
  { id: "p3", cat: "Physiotherapy", name: "Finger Goniometer", badge: "Physio tool", price: 267, mrp: 350, img: IP("goniometer.jpg"), reviews: 52, stock: 80,
    short: "90° finger goniometer for precise small-joint measurement.",
    desc: "A small 90-degree finger goniometer for precision measurement of small joint ranges of motion — MCP, PIP and DIP joints. Sits flat over the digit.",
    features: ["90° range", "Small-joint precision", "Flat profile", "Stainless option"],
    specs: [{ k: "Scale", v: "0–90°" }, { k: "Increment", v: "5°" }, { k: "Length", v: "85 mm" }, { k: "Material", v: "Transparent ABS" }, { k: "Use", v: "MCP, PIP, DIP" }, { k: "Autoclavable", v: "No" }], contents: [] },
  { id: "p4", cat: "Physiotherapy", name: "Reflex (Knee) Hammer", badge: "Neuro tool", price: 78, mrp: 220, img: IP("knee-hammer.jpg"), reviews: 198, stock: 95,
    short: "Taylor percussion hammer — the standard for deep tendon reflex testing.",
    desc: "The Taylor percussion hammer is the standard tool for testing deep tendon reflexes in neurological and physiotherapy assessments. Triangular rubber head on a chrome-plated handle.",
    features: ["Taylor pattern", "Rubber head", "Chrome handle", "Balanced weight"],
    specs: [{ k: "Pattern", v: "Taylor" }, { k: "Head", v: "Triangular rubber" }, { k: "Handle", v: "Chrome-plated" }, { k: "Length", v: "190 mm" }, { k: "Weight", v: "85 g" }, { k: "Use", v: "Deep tendon reflexes" }], contents: [] },
  { id: "p5", cat: "Physiotherapy", name: "Taylor Reflex Hammer — Deluxe", badge: "Neuro tool", price: 95, mrp: 240, img: IP("reflex-hammer.jpg"), reviews: 63, stock: 70,
    short: "Heavier deluxe hammer with a knurled grip, for a cleaner reflex response.",
    desc: "A heavier deluxe Taylor hammer with a knurled non-slip grip and a denser rubber head, giving a cleaner, more repeatable reflex response during examinations.",
    features: ["Knurled grip", "Denser head", "Heavier swing", "Non-slip"],
    specs: [{ k: "Pattern", v: "Taylor deluxe" }, { k: "Head", v: "High-density rubber" }, { k: "Grip", v: "Knurled" }, { k: "Length", v: "205 mm" }, { k: "Weight", v: "120 g" }, { k: "Use", v: "Deep tendon reflexes" }], contents: [] },
  { id: "p6", cat: "Physiotherapy", name: "128 Hz Tuning Fork", badge: "Neuro tool", price: 102, mrp: 320, img: IP("tuning-fork.jpg"), reviews: 112, stock: 60,
    short: "Aluminium alloy fork for vibration sense, plus Rinne and Weber tests.",
    desc: "A 128 Hz aluminium alloy tuning fork used for assessing vibration sense and conducting Rinne and Weber tests. Accurately tuned, with a rounded base for bone conduction.",
    features: ["128 Hz tuned", "Aluminium alloy", "Rounded base", "Rinne & Weber"],
    specs: [{ k: "Frequency", v: "128 Hz" }, { k: "Material", v: "Aluminium alloy" }, { k: "Length", v: "200 mm" }, { k: "Base", v: "Rounded foot" }, { k: "Use", v: "Vibration sense, hearing" }, { k: "Weighted", v: "No" }], contents: [] },
  { id: "p7", cat: "Physiotherapy", name: "Hand Dynamometer", badge: "Physio tool", price: 1899, mrp: 2499, img: IP("dynamometer.jpg"), reviews: 29, stock: 18,
    short: "Grip-strength meter with an adjustable handle — for objective strength documentation.",
    desc: "A hydraulic hand dynamometer with five adjustable handle positions and a peak-hold dial, for objective grip strength documentation in assessment and progress notes.",
    features: ["5 handle positions", "Peak-hold dial", "0–90 kg range", "Objective readings"],
    specs: [{ k: "Range", v: "0–90 kg / 0–200 lb" }, { k: "Type", v: "Hydraulic" }, { k: "Handle", v: "5 positions" }, { k: "Dial", v: "Peak hold" }, { k: "Accuracy", v: "± 3 %" }, { k: "Warranty", v: "1 year" }], contents: [] },
  { id: "p8", cat: "Physiotherapy", name: "Premium Yoga Mat", badge: "Rehab", price: 699, mrp: 999, img: IP("yoga-mat.jpg"), reviews: 57, stock: 40,
    short: "6 mm anti-slip mat for exercise therapy sessions and home practice.",
    desc: "A 6 mm anti-slip TPE mat for exercise therapy demonstrations, mat-based rehab and home practice. Closed-cell surface wipes clean, and it rolls into the supplied strap.",
    features: ["6 mm cushioning", "Anti-slip surface", "Wipe clean", "Carry strap"],
    specs: [{ k: "Thickness", v: "6 mm" }, { k: "Size", v: "183 × 61 cm" }, { k: "Material", v: "TPE" }, { k: "Weight", v: "1.1 kg" }, { k: "Surface", v: "Closed cell" }, { k: "Strap", v: "Included" }], contents: [] },
  { id: "p9", cat: "Physiotherapy", name: "Measuring Tape — 150 cm", badge: "Measurement", price: 100, mrp: 150, img: IP("inch-tape.jpg"), reviews: 141, stock: 150,
    short: "Flexible 150 cm tape for limb girth and postural measurement.",
    desc: "A flexible 150 cm measuring tape used for limb girth measurements, leg length discrepancy and postural assessment. Metric and imperial on opposite faces, retractable case.",
    features: ["150 cm length", "Metric + imperial", "Retractable", "Non-stretch"],
    specs: [{ k: "Length", v: "150 cm / 60 in" }, { k: "Width", v: "12 mm" }, { k: "Material", v: "Fibreglass" }, { k: "Case", v: "Retractable ABS" }, { k: "Use", v: "Girth, leg length" }, { k: "Stretch", v: "Non-stretch" }], contents: [] },

  { id: "n1", cat: "Nursing Essentials", name: "Dressing Scissors", badge: "Clinical", price: 189, mrp: 280, img: IP("scissors.jpg"), reviews: 66, stock: 90,
    short: "Stainless steel blunt-tip dressing scissors — safe against skin.",
    desc: "Stainless steel dressing scissors with a blunt lower tip so they can be worked under a dressing without catching skin. Autoclavable, corrosion resistant.",
    features: ["Stainless steel", "Blunt safety tip", "Autoclavable", "Corrosion resistant"],
    specs: [{ k: "Length", v: "145 mm" }, { k: "Material", v: "Stainless steel" }, { k: "Tip", v: "Blunt / sharp" }, { k: "Autoclavable", v: "Yes" }, { k: "Finish", v: "Satin" }, { k: "Use", v: "Dressings, bandages" }], contents: [] },
  { id: "n2", cat: "Nursing Essentials", name: "Tongue Depressors — pack of 100", badge: "Consumable", price: 149, mrp: 220, img: IP("tongue-depressor.jpg"), reviews: 38, stock: 200,
    short: "Sterile birchwood depressors, smooth-sanded edges, 100 to a pack.",
    desc: "Sterile single-use birchwood tongue depressors with smooth-sanded edges. Standard adult size, individually usable from a sealed pack of 100.",
    features: ["Sterile", "Birchwood", "Smooth edges", "Pack of 100"],
    specs: [{ k: "Quantity", v: "100 per pack" }, { k: "Material", v: "Birchwood" }, { k: "Size", v: "150 × 18 mm" }, { k: "Sterile", v: "Yes" }, { k: "Single use", v: "Yes" }, { k: "Edges", v: "Sanded" }], contents: [] },
  { id: "n3", cat: "Nursing Essentials", name: "Cotton Swabs — clinical grade", badge: "Consumable", price: 50, mrp: 80, img: PH, reviews: 24, stock: 200,
    short: "Medical-grade swabs for light-touch sensory testing.",
    desc: "Medical-grade cotton swabs used for light touch sensory testing in neurological assessments, and for general cleaning and application.",
    features: ["Medical grade", "Light-touch testing", "Sealed pack", "Single use"],
    specs: [{ k: "Quantity", v: "100 per pack" }, { k: "Tip", v: "Absorbent cotton" }, { k: "Stick", v: "Wooden" }, { k: "Length", v: "150 mm" }, { k: "Sterile", v: "Yes" }, { k: "Use", v: "Sensory testing" }], contents: [] },
  { id: "n4", cat: "Nursing Essentials", name: "Clinical Safety Pins", badge: "Consumable", price: 50, mrp: 80, img: PH, reviews: 19, stock: 200,
    short: "For sharp–dull discrimination testing during neurological examination.",
    desc: "Clinical safety pins used for sharp/dull discrimination testing during neurological examinations. Single-patient use, supplied in a sealed sachet.",
    features: ["Sharp–dull testing", "Single use", "Sealed sachet", "Rust resistant"],
    specs: [{ k: "Quantity", v: "25 per pack" }, { k: "Material", v: "Nickel-plated steel" }, { k: "Length", v: "38 mm" }, { k: "Single use", v: "Yes" }, { k: "Use", v: "Sensory testing" }, { k: "Sterile", v: "No" }], contents: [] },

  { id: "a1", cat: "Medical Accessories", name: "Personalised MedVault Clinical Pouch", badge: "Accessory", price: 399, mrp: 599, img: "/pouch.jpg", reviews: 103, stock: 50,
    short: "Waterproof zip pouch with free name and RA number printing on the first 50 orders.",
    desc: "Protect and organise your instruments in a waterproof MedVault pouch built to hold a full assessment kit — goniometers, reflex hammer, tuning fork and the rest. Soft inner lining, double zip, multiple inner pockets. Free name and RA number printing while the launch offer lasts.",
    features: ["Waterproof outer", "Soft inner lining", "Double zip", "Free personalisation"],
    specs: [{ k: "Size", v: "240 × 150 × 70 mm" }, { k: "Outer", v: "Waterproof polyester" }, { k: "Lining", v: "Soft brushed" }, { k: "Closure", v: "Double zip" }, { k: "Pockets", v: "4 inner" }, { k: "Printing", v: "Name + RA number" }], contents: [] },
  { id: "a2", cat: "Medical Accessories", name: "Physiotherapy Assessment Sheets", badge: "Study tool", price: 149, mrp: 249, img: PH, reviews: 71, stock: 200,
    short: "Perforated evaluation templates — history, ROM, MMT, posture, treatment plan.",
    desc: "Professionally laid-out physiotherapy assessment templates covering patient history, pain assessment on NRS and VAS scales, range of motion, muscle strength grading, postural analysis, functional assessment, treatment plan and progress notes. Perforated for easy submission during practicals.",
    features: ["Curriculum-mapped sections", "Perforated sheets", "NRS & VAS scales", "50 sheets"],
    specs: [{ k: "Sheets", v: "50 per pad" }, { k: "Size", v: "A4" }, { k: "Paper", v: "80 gsm" }, { k: "Binding", v: "Perforated pad" }, { k: "Sections", v: "8" }, { k: "Print", v: "Single sided" }], contents: [] },
  { id: "a3", cat: "Medical Accessories", name: "Surgical Skin Marker", badge: "Clinical", price: 120, mrp: 199, img: PH, reviews: 47, stock: 150,
    short: "Fine-tip skin-safe marker for landmarks and electrode placement.",
    desc: "A medical skin marker for clinical assessment, anatomical landmark identification and treatment planning. The fine precision tip suits electrode placement in electrotherapy, joint line identification and postural assessment. Skin-friendly ink that removes easily.",
    features: ["Fine precision tip", "Skin-friendly ink", "Easy to remove", "Long lasting"],
    specs: [{ k: "Tip", v: "Fine, 0.5 mm" }, { k: "Ink", v: "Gentian violet" }, { k: "Sterile", v: "Yes" }, { k: "Ruler", v: "Included on barrel" }, { k: "Length", v: "145 mm" }, { k: "Single use", v: "Yes" }], contents: [] },
  { id: "a4", cat: "Medical Accessories", name: "Assessment Notepad", badge: "Study tool", price: 150, mrp: 200, img: PH, reviews: 35, stock: 120,
    short: "Pre-printed pad for history, ROM measurements and muscle testing grades.",
    desc: "A clinical assessment sheet pad with pre-printed forms for recording patient history, ROM measurements and muscle testing grades. Sized to sit inside the MedVault pouch.",
    features: ["Pre-printed forms", "Pouch-sized", "60 sheets", "Glued spine"],
    specs: [{ k: "Sheets", v: "60 per pad" }, { k: "Size", v: "A5" }, { k: "Paper", v: "70 gsm" }, { k: "Binding", v: "Glued" }, { k: "Sections", v: "5" }, { k: "Print", v: "Single sided" }], contents: [] },
];

/* BPT textbooks — mapped from the existing BOOK_ITEMS catalogue (real cover images) */
const BOOKS = BOOK_ITEMS.map((b, i) => ({
  id: b.id,
  cat: "BPT Textbooks",
  name: b.name,
  badge: b.year || "Textbook",
  price: b.price,
  mrp: b.originalPrice,
  img: (b.images && b.images[0]) || PH,
  reviews: 14 + (i % 8) * 4,
  stock: b.stock,
  short: b.tagline || (b.desc ? b.desc.slice(0, 120) + "…" : ""),
  desc: b.desc || "",
  features: [b.subject, (b.year || "") + " BPT", "Prescribed text"].filter(Boolean),
  specs: [{ k: "Subject", v: b.subject || "—" }, { k: "Year", v: b.year || "—" }, { k: "Format", v: "Paperback" }],
  contents: [],
}));

const DATA = [...BASE, ...BOOKS];

const REVIEWS = [
  { q: "Ordered the MVP kit the night before my first assessment posting. It was at Paari gate in twelve minutes and everything I needed was in one case.", n: "Aparna R.", y: "1st Year BPT · SRM" },
  { q: "The BPL stethoscope is the real thing, not a cheap copy. I'd been about to buy a knock-off online for nearly the same price.", n: "Karthik V.", y: "2nd Year BPT · SRM" },
  { q: "Free name and register-number printing meant my kit never got swapped in the lab. Small thing, saved me a lot of arguing.", n: "Meghna S.", y: "1st Year BPT · SRM" },
];

/* -------------------------------------------------------------- global css */
const GLOBAL = `
  @keyframes mvIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes mvPulse{0%,100%{opacity:1}50%{opacity:.45}}
  @keyframes mvPop{0%{transform:scale(1)}45%{transform:scale(1.35)}100%{transform:scale(1)}}
  @keyframes mvFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  .mv-lift{transition:transform .22s ${EASE},box-shadow .22s,border-color .22s}
  .mv-lift:hover{transform:translateY(-4px);box-shadow:${SH.cardHover};border-color:${T.lineStrong}}
  .mv-zoom img{transition:transform .5s ${EASE}}
  .mv-zoom:hover img{transform:scale(1.05)}
  .mv-navlink{transition:color .18s;cursor:pointer}
  .mv-navlink:hover{color:${T.green}}
  .mv-listlink{transition:color .16s,transform .16s;display:inline-block;cursor:pointer}
  .mv-listlink:hover{color:${T.green};transform:translateX(3px)}
  .mv-footlink{transition:color .16s,transform .16s;display:inline-block;width:fit-content;cursor:pointer}
  .mv-footlink:hover{color:#fff;transform:translateX(3px)}
  .mv-btn{transition:background .18s,transform .14s,box-shadow .18s,border-color .18s,color .18s;cursor:pointer}
  .mv-btn:hover{transform:translateY(-2px)}
  .mv-btn:active{transform:translateY(0) scale(.98)}
  .mv-btn:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(22,163,74,.35)}
  .mv-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .mv-flat{transition:background .16s,border-color .16s,color .16s;cursor:pointer}
  .mv-flat:hover{background:${T.tint}}
  .mv-input{transition:border-color .18s,box-shadow .18s;outline:none}
  .mv-input:focus{border-color:${T.green};box-shadow:0 0 0 3px rgba(22,163,74,.14)}
  .mv-remove{transition:all .16s}
  .mv-remove:hover{border-color:${T.danger};color:${T.danger};background:${T.dangerBg}}
  .mv-cardname{transition:color .18s;cursor:pointer}
  .mv-cardname:hover{color:${T.greenDark}}
  .mv-underline{transition:color .18s,border-color .18s;cursor:pointer}
  .mv-underline:hover{color:${T.green};border-color:${T.green}}
  .mv-zoomxl img{transition:transform .6s ${EASE}}
  .mv-zoomxl:hover img{transform:scale(1.35)}
  .mv-reveal{opacity:0;transform:translateY(18px);transition:opacity .55s ${EASE},transform .55s ${EASE}}
  .mv-reveal.is-in{opacity:1;transform:none}
  @media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}
    .mv-reveal{opacity:1;transform:none}}
`;

/* ------------------------------------------------------------- primitives -- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const nodes = ref.current ? ref.current.querySelectorAll(".mv-reveal") : [];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    nodes.forEach((n) => io.observe(n));
    const t = setTimeout(() => nodes.forEach((n) => n.classList.add("is-in")), 1600);
    return () => { io.disconnect(); clearTimeout(t); };
  });
  return ref;
}

const btn = {
  primary: { height: 52, padding: "0 26px", border: "none", borderRadius: 12, background: T.green, color: "#fff", fontSize: 15, fontWeight: 700, boxShadow: SH.primary },
  dark:    { height: 52, padding: "0 26px", border: "none", borderRadius: 12, background: T.ink, color: "#fff", fontSize: 15, fontWeight: 700 },
  ghost:   { height: 52, padding: "0 26px", border: `1px solid ${T.lineStrong}`, borderRadius: 12, background: "#fff", color: T.ink, fontSize: 15, fontWeight: 700 },
};
const eyebrow = { fontFamily: MONO_FACE, fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: T.greenDark, margin: "0 0 10px" };
const h2 = { fontSize: 32, fontWeight: 800, letterSpacing: "-.025em", margin: 0 };
const meta = { fontFamily: MONO_FACE, fontSize: 12.5, color: T.muted2, margin: 0 };

function Stars({ size = 13 }) {
  return <span style={{ color: T.star, fontSize: size, letterSpacing: 1 }}>★★★★★</span>;
}

/* ------------------------------------------------------------ ProductCard -- */
function ProductCard({ p, wished, onOpen, onAdd, onWish }) {
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  return (
    <div className="mv-lift" style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div className="mv-zoom" onClick={onOpen} style={{ position: "relative", aspectRatio: "1/1", background: T.media, overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
        <img src={p.img} alt={p.name} loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block" }} />
        <span style={{ position: "absolute", top: 10, left: 10, background: "#fff", border: `1px solid ${T.line}`, color: T.greenDark, fontSize: 9.5, fontWeight: 800, letterSpacing: ".09em", textTransform: "uppercase", padding: "5px 9px", borderRadius: 999 }}>{p.badge}</span>
        <button type="button" aria-label="Save to wishlist" onClick={(e) => { e.stopPropagation(); onWish(); }}
          style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", border: `1px solid ${wished ? T.green : T.line}`, background: wished ? T.green : "rgba(255,255,255,.94)", color: wished ? "#fff" : "#8C9C93", fontSize: 14, lineHeight: 1, cursor: "pointer", display: "grid", placeItems: "center", transition: "all .18s", padding: 0 }}>♥</button>
        <span style={{ position: "absolute", bottom: 10, left: 10, background: T.ink, color: "#fff", fontSize: 10.5, fontWeight: 700, letterSpacing: ".04em", padding: "5px 9px", borderRadius: 6 }}>−{off}%</span>
      </div>
      <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
        <p style={{ fontFamily: MONO_FACE, fontSize: 10.5, color: T.muted2, letterSpacing: ".1em", textTransform: "uppercase", margin: 0 }}>{p.cat}</p>
        <h3 className="mv-cardname" onClick={onOpen} style={{ fontSize: 14.5, fontWeight: 700, color: T.ink, lineHeight: 1.35, margin: 0, minHeight: 39, textWrap: "pretty" }}>{p.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: MONO_FACE, fontSize: 11, color: T.muted2 }}>
          <Stars size={11} /><span>{p.reviews}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: "auto", paddingTop: 4 }}>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-.01em", fontVariantNumeric: "tabular-nums" }}>{fmt(p.price)}</span>
          <span style={{ fontFamily: MONO_FACE, fontSize: 12.5, color: T.muted3, textDecoration: "line-through" }}>{fmt(p.mrp)}</span>
        </div>
        <button type="button" className="mv-btn" onClick={onAdd}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.green)} onMouseLeave={(e) => (e.currentTarget.style.background = T.ink)}
          style={{ marginTop: 8, width: "100%", height: 40, border: "none", borderRadius: 10, background: T.ink, color: "#fff", fontSize: 13, fontWeight: 700 }}>Add to cart</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page -- */
export default function MedVaultRedesign() {
  const [page, setPage] = useState("home");
  const [cat, setCat] = useState("All");
  const [price, setPrice] = useState("any");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");
  const [pageNum, setPageNum] = useState(1);
  const [productId, setProductId] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [cart, setCart] = useState([]);           // ← replace with existing cart store
  const [wish, setWish] = useState([]);
  const [mega, setMega] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [slot, setSlot] = useState("now");
  const [pay, setPay] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const root = useReveal();

  const go = useCallback((p) => { setPage(p); setMega(false); setSearch(false); window.scrollTo({ top: 0 }); }, []);
  const goCat = (c) => { setCat(c); setPageNum(1); go("listing"); };
  const open = (p) => { setProductId(p.id); setImgIndex(0); setQty(1); setTab("desc"); go("detail"); };
  const flash = (t) => { setToast(t); clearTimeout(window.__mvT); window.__mvT = setTimeout(() => setToast(""), 2600); };

  /* ↓↓↓ swap these two for the existing cart / wishlist actions ↓↓↓ */
  const add = (p, n = 1) => {
    setCart((c) => { const i = c.findIndex((x) => x.id === p.id); if (i > -1) { const n2 = c.slice(); n2[i] = { ...n2[i], qty: n2[i].qty + n }; return n2; } return [...c, { id: p.id, qty: n }]; });
    flash(p.name.length > 34 ? p.name.slice(0, 32) + "… added" : p.name + " added");
  };
  const toggleWish = (p) => setWish((w) => (w.includes(p.id) ? w.filter((x) => x !== p.id) : [...w, p.id]));
  /* ↑↑↑ -------------------------------------------------------- ↑↑↑ */

  const cartItems = cart.map((c) => { const p = DATA.find((d) => d.id === c.id); return { ...p, qty: c.qty }; });
  const subtotal = cartItems.reduce((n, i) => n + i.price * i.qty, 0);
  const mrpTotal = cartItems.reduce((n, i) => n + i.mrp * i.qty, 0);
  const count = cartItems.reduce((n, i) => n + i.qty, 0);
  const savings = Math.max(0, mrpTotal - subtotal);

  let list = DATA.filter((p) => cat === "All" || p.cat === cat);
  if (price === "u300") list = list.filter((p) => p.price < 300);
  if (price === "300-800") list = list.filter((p) => p.price >= 300 && p.price <= 800);
  if (price === "800-1500") list = list.filter((p) => p.price > 800 && p.price <= 1500);
  if (price === "o1500") list = list.filter((p) => p.price > 1500);
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "disc") list = [...list].sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
  const perPage = 12;
  const pageCount = Math.max(1, Math.ceil(list.length / perPage));
  const pn = Math.min(pageNum, pageCount);
  const pageProducts = list.slice((pn - 1) * perPage, pn * perPage);

  const product = DATA.find((d) => d.id === productId) || DATA[0];
  const gallery = product.gallery || [product.img];
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const q = query.trim().toLowerCase();
  /* ↓ replace with the existing search implementation ↓ */
  const results = q ? DATA.filter((p) => (p.name + " " + p.cat + " " + p.short).toLowerCase().includes(q)).slice(0, 6) : [];

  const cardProps = (p) => ({ p, wished: wish.includes(p.id), onOpen: () => open(p), onAdd: () => add(p), onWish: () => toggleWish(p) });
  const pill = (active) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, width: "100%", height: 36, padding: "0 12px", border: `1px solid ${active ? T.greenBorder : "transparent"}`, borderRadius: 9, background: active ? T.greenTint : "transparent", color: active ? T.greenDark : T.body, fontSize: 13.5, fontWeight: active ? 700 : 500, cursor: "pointer", textAlign: "left", transition: "background .16s,color .16s" });

  const tabDefs = [
    { key: "desc", label: "Description" }, { key: "specs", label: "Specifications" },
    ...(product.contents.length ? [{ key: "inside", label: "What's inside" }] : []),
    { key: "reviews", label: "Reviews" }, { key: "shipping", label: "Shipping & returns" },
  ];

  const summaryRows = [
    { k: "Subtotal", v: fmt(subtotal) },
    { k: "Savings", v: "− " + fmt(savings) },
    { k: "Delivery (SRM)", v: "Free" },
  ];

  const Summary = ({ withItems }) => (
    <aside style={{ flex: "1 1 320px", minWidth: 280, position: "sticky", top: 96, border: `1px solid ${T.line}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 14, background: T.surface }}>
      <p style={{ fontSize: 17, fontWeight: 800, margin: "0 0 4px" }}>Order summary</p>
      {withItems && cartItems.map((it) => (
        <div key={it.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <img src={it.img} alt="" style={{ width: 48, height: 48, borderRadius: 9, objectFit: "contain", background: T.tint, padding: 4 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.35 }}>{it.name}</p>
            <p style={{ fontFamily: MONO_FACE, fontSize: 12, color: T.muted2, margin: "3px 0 0" }}>Qty {it.qty}</p>
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmt(it.price * it.qty)}</span>
        </div>
      ))}
      {withItems && <div style={{ height: 1, background: T.line, margin: "4px 0" }} />}
      {summaryRows.map((r) => (
        <div key={r.k} style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO_FACE, fontSize: 14, color: T.muted }}>
          <span>{r.k}</span><span style={{ fontWeight: 600, color: T.ink }}>{r.v}</span>
        </div>
      ))}
      <div style={{ height: 1, background: T.line, margin: "4px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
        <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums" }}>{fmt(subtotal)}</span>
      </div>
      {!withItems && (
        <>
          <button type="button" className="mv-btn" onClick={() => go("checkout")} style={{ ...btn.primary, height: 50, marginTop: 6 }}>Checkout</button>
          <p style={{ ...meta, textAlign: "center" }}>Pay on delivery · cash or UPI</p>
        </>
      )}
    </aside>
  );

  const megaCols = [
    { title: "Assessment kits", links: [["MVP Physiotherapy Kit", () => open(DATA[0])], ["Clinical Goniometer Set", () => open(DATA[1])], ["CNS Assessment Kit", () => open(DATA[2])], ["All kits", () => goCat("Assessment Kits")]] },
    { title: "Diagnostics", links: [["Stethoscopes", () => goCat("Diagnostic Equipment")], ["BP monitors", () => goCat("Diagnostic Equipment")], ["Thermometers", () => goCat("Diagnostic Equipment")], ["Pen torches", () => goCat("Diagnostic Equipment")]] },
    { title: "Physiotherapy", links: [["Goniometers", () => goCat("Physiotherapy")], ["Reflex hammers", () => goCat("Physiotherapy")], ["Tuning forks", () => goCat("Physiotherapy")], ["Dynamometers", () => goCat("Physiotherapy")]] },
    { title: "Essentials", links: [["Nursing consumables", () => goCat("Nursing Essentials")], ["Carry pouches", () => goCat("Medical Accessories")], ["Assessment sheets", () => goCat("Medical Accessories")], ["Skin markers", () => goCat("Medical Accessories")]] },
  ];

  return (
    <div ref={root} style={{ minHeight: "100vh", background: "#fff", color: T.ink, fontFamily: UI, WebkitFontSmoothing: "antialiased" }}>
      <style>{GLOBAL}</style>

      <div style={{ background: T.green, color: "#fff", fontFamily: MONO_FACE, fontSize: 12.5, fontWeight: 600, textAlign: "center", padding: "9px 16px" }}>
        10-minute delivery inside SRM · Free name + RA number printing on the first 50 orders
      </div>

      {/* ---------------------------------------------------------- header -- */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(255,255,255,.86)", backdropFilter: "saturate(180%) blur(14px)", WebkitBackdropFilter: "saturate(180%) blur(14px)", borderBottom: `1px solid ${T.line}` }}>
        <div style={{ ...container, height: 70, display: "flex", alignItems: "center", gap: 28 }}>
          <div onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", flexShrink: 0 }}>
            <img src="/logo.png" alt="MedVault" style={{ height: 30, width: "auto", display: "block" }} />
            <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-.02em" }}>MedVault</span>
          </div>
          <nav onMouseLeave={() => setMega(false)} style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 14, fontWeight: 600, flex: 1 }}>
            <span className="mv-navlink" onMouseEnter={() => setMega(false)} onClick={() => goCat("Assessment Kits")} style={{ padding: "24px 0" }}>Assessment Kits</span>
            <span className="mv-navlink" onMouseEnter={() => { setMega(true); setSearch(false); }} onClick={() => goCat("All")} style={{ padding: "24px 0", display: "flex", alignItems: "center", gap: 5 }}>Instruments <span style={{ fontSize: 9, opacity: .55 }}>▼</span></span>
            <span className="mv-navlink" onMouseEnter={() => setMega(false)} onClick={() => goCat("Medical Accessories")} style={{ padding: "24px 0" }}>Accessories</span>
            <span className="mv-navlink" onMouseEnter={() => setMega(false)} onClick={() => go("track")} style={{ padding: "24px 0" }}>Track order</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button type="button" aria-label="Search" className="mv-flat" onClick={() => { setSearch((s) => !s); setMega(false); }} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid transparent", background: "transparent", fontSize: 15, display: "grid", placeItems: "center" }}>⌕</button>
            <button type="button" aria-label="Wishlist" className="mv-flat" onClick={() => go("wishlist")} style={{ position: "relative", width: 38, height: 38, borderRadius: 10, border: "1px solid transparent", background: "transparent", fontSize: 14, display: "grid", placeItems: "center" }}>
              ♥{wish.length > 0 && <span style={{ position: "absolute", top: 4, right: 3, minWidth: 15, height: 15, padding: "0 4px", borderRadius: 999, background: T.green, color: "#fff", fontSize: 9.5, fontWeight: 800, display: "grid", placeItems: "center" }}>{wish.length}</span>}
            </button>
            <button type="button" aria-label="Cart" className="mv-flat" onClick={() => go("cart")} style={{ display: "flex", alignItems: "center", gap: 8, height: 38, padding: "0 14px", borderRadius: 10, border: `1px solid ${T.line}`, background: "#fff", fontSize: 13, fontWeight: 700 }}>
              Cart<span key={count} style={{ minWidth: 20, height: 20, padding: "0 6px", borderRadius: 999, background: count ? T.green : T.line, color: count ? "#fff" : T.muted2, fontSize: 11, fontWeight: 800, display: "grid", placeItems: "center", fontVariantNumeric: "tabular-nums", animation: count ? "mvPop .3s ease" : "none" }}>{count}</span>
            </button>
          </div>
        </div>

        {mega && (
          <div onMouseLeave={() => setMega(false)} style={{ position: "absolute", left: 0, right: 0, top: "100%", background: "#fff", borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}`, boxShadow: SH.overlay, animation: "mvIn .18s ease both" }}>
            <div style={{ ...container, padding: "32px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 32 }}>
              {megaCols.map((col) => (
                <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontFamily: MONO_FACE, fontSize: 10.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: T.muted2, margin: 0 }}>{col.title}</p>
                  {col.links.map(([label, fn]) => (
                    <span key={label} className="mv-listlink" onClick={fn} style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{label}</span>
                  ))}
                </div>
              ))}
              <div style={{ background: T.ink, borderRadius: 14, padding: 22, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16, minHeight: 190 }}>
                <div>
                  <p style={{ fontFamily: MONO_FACE, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: T.greenOnDark, margin: "0 0 8px" }}>Best value</p>
                  <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.35, margin: 0 }}>The MVP Kit — 9 instruments, one case</p>
                  <p style={{ fontFamily: MONO_FACE, fontSize: 13, color: T.darkText, margin: "8px 0 0" }}>Save ₹559 against buying separately.</p>
                </div>
                <button type="button" className="mv-btn" onClick={() => open(DATA[0])} style={{ alignSelf: "flex-start", height: 38, padding: "0 18px", border: "none", borderRadius: 9, background: T.green, color: "#fff", fontSize: 13, fontWeight: 700 }}>View the kit</button>
              </div>
            </div>
          </div>
        )}

        {search && (
          <div style={{ position: "absolute", left: 0, right: 0, top: "100%", background: "#fff", borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}`, boxShadow: SH.overlay, animation: "mvIn .18s ease both" }}>
            <div style={{ ...container, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${T.lineStrong}`, borderRadius: 12, padding: "0 16px", height: 52, background: T.surface }}>
                <span style={{ fontSize: 17, color: T.muted2 }}>⌕</span>
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search goniometer, stethoscope, CNS kit…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: T.ink }} />
                <button type="button" onClick={() => setSearch(false)} style={{ border: "none", background: "transparent", color: T.muted2, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Esc</button>
              </div>
              {results.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 8, marginTop: 16 }}>
                  {results.map((r) => (
                    <div key={r.id} className="mv-flat" onClick={() => open(r)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 10 }}>
                      <img src={r.img} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "contain", background: T.tint, padding: 3 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</p>
                        <p style={{ ...meta, marginTop: 2 }}>{fmt(r.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {q.length > 1 && !results.length && (
                <p style={{ fontFamily: MONO_FACE, fontSize: 14, color: T.muted2, margin: "20px 0 6px" }}>No instruments match that. Try “goniometer”, “hammer” or “kit”.</p>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------ home -- */}
      {page === "home" && (
        <main>
          <section style={{ borderBottom: `1px solid ${T.line}` }}>
            <div style={container}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 48, padding: "72px 0 76px" }}>
                <div style={{ flex: "1 1 380px", minWidth: 300, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO_FACE, fontSize: 11.5, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: T.greenDark, background: T.greenTint, border: `1px solid ${T.greenBorder}`, padding: "7px 13px", borderRadius: 999 }}>For BPT students at SRM</span>
                  <h1 style={{ fontSize: "clamp(38px,4.6vw,58px)", lineHeight: 1.04, fontWeight: 800, letterSpacing: "-.035em", margin: 0, textWrap: "balance" }}>Assessment kits for healthcare students.</h1>
                  <p style={{ fontFamily: MONO_FACE, fontSize: 17, lineHeight: 1.6, color: T.muted, margin: 0, maxWidth: 460, textWrap: "pretty" }}>Everything you need for practical exams — goniometers, reflex hammer, tuning fork, BPL stethoscope — in one case. At your hostel gate in 10 minutes.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
                    <button type="button" className="mv-btn" onClick={() => goCat("Assessment Kits")} style={btn.primary}>Shop assessment kits</button>
                    <button type="button" className="mv-btn" onClick={() => goCat("All")} style={btn.ghost}>Browse all products</button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 18, fontFamily: MONO_FACE, fontSize: 13, color: T.muted }}>
                    <span><strong style={{ color: T.ink }}>2,400+</strong> students served</span>
                    <span><strong style={{ color: T.ink }}>₹559</strong> saved per kit</span>
                    <span><strong style={{ color: T.ink }}>4.9</strong> average rating</span>
                  </div>
                </div>
                <div style={{ flex: "1 1 420px", minWidth: 300, position: "relative" }}>
                  <div style={{ borderRadius: 20, overflow: "hidden", background: T.tint, border: `1px solid ${T.line}`, padding: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src="/kit.jpg" alt="MedVault MVP assessment kit" style={{ width: "100%", height: "auto", maxHeight: 520, objectFit: "contain", display: "block", borderRadius: 10 }} />
                  </div>
                  <div style={{ position: "absolute", left: -16, top: 34, background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14, padding: "12px 16px", boxShadow: SH.float, animation: "mvFloat 7s ease-in-out infinite" }}>
                    <p style={{ fontFamily: MONO_FACE, fontSize: 11.5, fontWeight: 700, color: T.greenDark, margin: 0 }}>✓ Genuine product</p>
                    <p style={{ fontSize: 13.5, fontWeight: 700, margin: "4px 0 0" }}>BPL Dual Head Stethoscope</p>
                  </div>
                  <div style={{ position: "absolute", right: -16, top: 96, background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14, padding: "12px 16px", boxShadow: SH.float, animation: "mvFloat 8s ease-in-out .6s infinite" }}>
                    <p style={{ fontFamily: MONO_FACE, fontSize: 11.5, fontWeight: 700, color: "#2563EB", margin: 0 }}>Free launch offer</p>
                    <p style={{ fontSize: 13.5, fontWeight: 700, margin: "4px 0 0" }}>Name + RA number printing</p>
                  </div>
                  <div style={{ position: "absolute", left: -16, bottom: 96, background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14, padding: "12px 18px", boxShadow: SH.float, display: "flex", alignItems: "center", gap: 12, animation: "mvFloat 7.5s ease-in-out .3s infinite" }}>
                    <span style={{ fontSize: 20, lineHeight: 1 }}>★</span>
                    <div>
                      <p style={{ fontSize: 19, fontWeight: 800, margin: 0, letterSpacing: "-.02em" }}>4.9</p>
                      <p style={{ fontFamily: MONO_FACE, fontSize: 11.5, color: T.muted2, margin: "1px 0 0" }}>Student rating</p>
                    </div>
                  </div>
                  <div style={{ position: "absolute", right: -16, bottom: 22, background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14, padding: "14px 18px", boxShadow: SH.float, display: "flex", alignItems: "center", gap: 12, animation: "mvFloat 8.5s ease-in-out .9s infinite" }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: T.green, animation: "mvPulse 2s infinite", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Delivering now around SRM</p>
                      <p style={{ ...meta, marginTop: 2, fontSize: 12 }}>Avg. 10 min to hostel gate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ borderBottom: `1px solid ${T.line}`, background: T.surface }}>
            <div style={container}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 1, background: T.line }}>
                {[
                  ["10 minutes to your gate", "Inside SRM campus and hostels, any day before 9 PM."],
                  ["Cheaper than buying separately", "The MVP kit saves ₹559 against the same items bought one by one."],
                  ["Genuine, warrantied brands", "BPL stethoscope with a one-year manufacturer warranty."],
                  ["2,400+ students served", "Rated 4.9 across the BPT batches at SRM."],
                ].map(([title, body]) => (
                  <div key={title} style={{ background: T.surface, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 6 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{title}</p>
                    <p style={{ fontFamily: MONO_FACE, fontSize: 13, lineHeight: 1.55, color: T.muted2, margin: 0 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mv-reveal">
            <div style={{ ...container, padding: "76px 24px 0" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
                <div><p style={eyebrow}>Shop by category</p><h2 style={h2}>Find what your posting needs</h2></div>
                <span className="mv-underline" onClick={() => goCat("All")} style={{ fontSize: 14, fontWeight: 700, borderBottom: `1px solid ${"#C9D5CE"}`, paddingBottom: 3 }}>View all products →</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
                {CATS.map((c) => {
                  const first = DATA.find((d) => d.cat === c);
                  return (
                    <div key={c} className="mv-lift mv-zoom" onClick={() => goCat(c)} style={{ border: `1px solid ${T.line}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", background: "#fff" }}>
                      <div style={{ aspectRatio: "1/1", background: T.tint, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 14 }}>
                        <img src={first.img} alt={c} loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                      </div>
                      <div style={{ padding: "14px 16px 16px" }}>
                        <p style={{ fontSize: 14.5, fontWeight: 700, margin: 0 }}>{c}</p>
                        <p style={{ ...meta, marginTop: 4 }}>{DATA.filter((d) => d.cat === c).length} products</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mv-reveal">
            <div style={{ ...container, padding: "76px 24px 0" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
                <div><p style={eyebrow}>Bestsellers</p><h2 style={h2}>What first-years order most</h2></div>
                <span className="mv-underline" onClick={() => goCat("All")} style={{ fontSize: 14, fontWeight: 700, borderBottom: "1px solid #C9D5CE", paddingBottom: 3 }}>See all {DATA.length} →</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 20 }}>
                {[DATA[0], DATA[3], DATA[1], DATA[9], DATA[2], DATA[12], DATA[20], DATA[4]].map((p) => <ProductCard key={p.id} {...cardProps(p)} />)}
              </div>
            </div>
          </section>

          <section className="mv-reveal">
            <div style={{ ...container, padding: "76px 24px 0" }}>
              <div style={{ background: T.ink, borderRadius: 20, overflow: "hidden", display: "flex", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 400px", minWidth: 300, padding: "54px 48px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
                  <span style={{ fontFamily: MONO_FACE, fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: T.greenOnDark }}>Launching offer</span>
                  <h2 style={{ fontSize: "clamp(28px,3vw,40px)", lineHeight: 1.1, fontWeight: 800, letterSpacing: "-.03em", color: "#fff", margin: 0 }}>Launching Offer — The MVP Assessment Kit</h2>
                  <p style={{ fontFamily: MONO_FACE, fontSize: 15.5, lineHeight: 1.6, color: T.darkText, margin: 0, maxWidth: 420 }}>Everything you need for your practical exams in one premium kit. Includes a genuine BPL stethoscope with free name and RA number personalization.</p>
                  <div style={{ display: "flex", gap: 10, margin: "6px 0 4px" }}>
                    {[["02", "days"], ["14", "hrs"], ["38", "min"], ["05", "sec"]].map(([v, l]) => (
                      <div key={l} style={{ background: T.darkCard, border: `1px solid ${T.darkCardLn}`, borderRadius: 10, width: 62, padding: "10px 0", textAlign: "center" }}>
                        <p style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0, fontVariantNumeric: "tabular-nums" }}>{v}</p>
                        <p style={{ fontFamily: MONO_FACE, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#7B9C8A", margin: "3px 0 0" }}>{l}</p>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="mv-btn" onClick={() => open(DATA[0])} style={{ ...btn.primary, height: 50, boxShadow: "none" }}>Claim Launch Offer — ₹1,799</button>
                </div>
                <div style={{ flex: "1 1 380px", minWidth: 280, background: T.darkCard, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                  <img src="/kit.jpg" alt="MVP kit" loading="lazy" style={{ maxWidth: "100%", maxHeight: 380, objectFit: "contain", display: "block", borderRadius: 12 }} />
                </div>
              </div>
            </div>
          </section>

          <section className="mv-reveal">
            <div style={{ ...container, padding: "76px 24px 0" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <p style={eyebrow}>Student reviews</p><h2 style={h2}>Trusted across the BPT batches</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
                {REVIEWS.map((r) => (
                  <figure key={r.n} style={{ margin: 0, border: `1px solid ${T.line}`, borderRadius: 16, padding: 28, background: "#fff", display: "flex", flexDirection: "column", gap: 16 }}>
                    <Stars size={14} />
                    <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.6, fontWeight: 500, textWrap: "pretty" }}>{r.q}</blockquote>
                    <figcaption style={{ fontFamily: MONO_FACE, fontSize: 13, color: T.muted2, marginTop: "auto" }}>{r.n} · {r.y}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section className="mv-reveal">
            <div style={{ ...container, padding: "76px 24px 0" }}>
              <div style={{ border: `1px solid ${T.line}`, borderRadius: 20, background: T.surface, padding: 48, display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center" }}>
                <div style={{ flex: "1 1 380px", minWidth: 280 }}>
                  <p style={eyebrow}>Endorsed on campus</p>
                  <p style={{ fontSize: 21, lineHeight: 1.5, fontWeight: 600, margin: 0, textWrap: "pretty" }}>“The kit covers every instrument our first-years are assessed on. Students turning up prepared makes the practical sessions run properly.”</p>
                  <p style={{ fontFamily: MONO_FACE, fontSize: 13.5, color: T.muted2, margin: "16px 0 0" }}>Faculty, Department of Physiotherapy · SRM</p>
                </div>
                <div style={{ flex: "1 1 260px", minWidth: 240, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.line, border: `1px solid ${T.line}`, borderRadius: 14, overflow: "hidden" }}>
                  {[["2,400+", "students served"], ["4.9", "average rating"], ["10 min", "median delivery"], ["₹559", "saved per kit"]].map(([v, l]) => (
                    <div key={l} style={{ background: "#fff", padding: "22px 18px" }}>
                      <p style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", margin: 0 }}>{v}</p>
                      <p style={{ ...meta, marginTop: 4 }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mv-reveal">
            <div style={{ ...container, padding: "76px 24px 90px" }}>
              <div style={{ background: T.green, borderRadius: 20, padding: 48, display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ flex: "1 1 340px", minWidth: 280 }}>
                  <h2 style={{ ...h2, fontSize: 30, color: "#fff" }}>Get ₹100 off your first order</h2>
                  <p style={{ fontFamily: MONO_FACE, fontSize: 15, color: "#DBF3E4", margin: "10px 0 0" }}>Drop your number — we'll send the code on WhatsApp with the delivery slots for your block.</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); flash("We'll WhatsApp your code shortly"); }} style={{ flex: "1 1 320px", minWidth: 280, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input placeholder="WhatsApp number" style={{ flex: "1 1 180px", height: 52, border: "none", borderRadius: 12, padding: "0 18px", fontSize: 15, outline: "none", color: T.ink }} />
                  <button type="submit" className="mv-btn" style={btn.dark}>{subscribed ? "Sent ✓" : "Get the code"}</button>
                </form>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* --------------------------------------------------------- listing -- */}
      {page === "listing" && (
        <main style={{ ...container, padding: "0 24px 90px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: MONO_FACE, fontSize: 12.5, color: T.muted2, padding: "22px 0" }}>
            <span onClick={() => go("home")} style={{ cursor: "pointer" }}>Home</span><span>/</span>
            <span style={{ color: T.ink, fontWeight: 600 }}>{cat === "All" ? "All products" : cat}</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", paddingBottom: 22, borderBottom: `1px solid ${T.line}` }}>
            <div>
              <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-.03em", margin: 0 }}>{cat === "All" ? "All products" : cat}</h1>
              <p style={{ fontFamily: MONO_FACE, fontSize: 14, color: T.muted2, margin: "8px 0 0" }}>{list.length} products · delivered around SRM in about 10 minutes</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPageNum(1); }} style={{ height: 40, border: `1px solid ${T.lineStrong}`, borderRadius: 10, padding: "0 12px", fontSize: 13, fontWeight: 600, background: "#fff", color: T.ink, cursor: "pointer", outline: "none" }}>
                <option value="featured">Sort: Featured</option><option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option><option value="disc">Biggest saving</option>
              </select>
              <div style={{ display: "flex", border: `1px solid ${T.lineStrong}`, borderRadius: 10, overflow: "hidden", height: 40 }}>
                {["grid", "list"].map((v, i) => (
                  <button key={v} type="button" onClick={() => setView(v)} style={{ width: 54, border: "none", borderLeft: i ? `1px solid ${T.lineStrong}` : "none", background: view === v ? T.ink : "#fff", color: view === v ? "#fff" : T.muted, fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all .16s", textTransform: "capitalize" }}>{v}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 36, alignItems: "flex-start", paddingTop: 28, flexWrap: "wrap" }}>
            {/* sidebar: flex 1 1 210px, NO max-width — see handoff note */}
            <aside style={{ flex: "1 1 210px", minWidth: 200, position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <p style={{ fontFamily: MONO_FACE, fontSize: 10.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: T.muted2, margin: "0 0 12px" }}>Category</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {["All", ...CATS].map((c) => (
                    <button key={c} type="button" onClick={() => { setCat(c); setPageNum(1); }} style={pill(cat === c)}>
                      <span>{c === "All" ? "All products" : c}</span>
                      <span style={{ fontFamily: MONO_FACE, fontSize: 11.5, opacity: .6 }}>{c === "All" ? DATA.length : DATA.filter((d) => d.cat === c).length}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: MONO_FACE, fontSize: 10.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: T.muted2, margin: "0 0 12px" }}>Price</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[["any", "Any price"], ["u300", "Under ₹300"], ["300-800", "₹300 – ₹800"], ["800-1500", "₹800 – ₹1,500"], ["o1500", "Above ₹1,500"]].map(([k, l]) => (
                    <button key={k} type="button" onClick={() => { setPrice(k); setPageNum(1); }} style={pill(price === k)}><span>{l}</span></button>
                  ))}
                </div>
              </div>
              <div style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: 16, background: T.surface }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, margin: 0 }}>Delivery inside SRM</p>
                <p style={{ fontFamily: MONO_FACE, fontSize: 12.5, lineHeight: 1.55, color: T.muted2, margin: "6px 0 0" }}>Order before 9 PM and it reaches your hostel gate in about 10 minutes.</p>
              </div>
            </aside>

            <div style={{ flex: "999 1 380px", minWidth: 280 }}>
              <div style={{ display: "grid", gridTemplateColumns: view === "grid" ? "repeat(auto-fill,minmax(230px,1fr))" : "1fr", gap: 20 }}>
                {pageProducts.map((p) => <ProductCard key={p.id} {...cardProps(p)} />)}
              </div>
              {!pageProducts.length && (
                <div style={{ border: `1px dashed ${T.lineStrong}`, borderRadius: 16, padding: "60px 24px", textAlign: "center" }}>
                  <p style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Nothing in this range yet</p>
                  <p style={{ fontFamily: MONO_FACE, fontSize: 14, color: T.muted2, margin: "8px 0 18px" }}>Try a wider price filter or browse everything.</p>
                  <button type="button" className="mv-btn" onClick={() => { setCat("All"); setPrice("any"); }} style={{ ...btn.ghost, height: 44, borderColor: T.ink }}>Browse all products</button>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 36, paddingTop: 24, borderTop: `1px solid ${T.line}`, flexWrap: "wrap" }}>
                <p style={{ fontFamily: MONO_FACE, fontSize: 13, color: T.muted2, margin: 0 }}>Showing {pageProducts.length} of {list.length} products</p>
                <div style={{ display: "flex", gap: 6 }}>
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button key={i} type="button" onClick={() => setPageNum(i + 1)} style={{ minWidth: 38, height: 38, borderRadius: 10, border: `1px solid ${pn === i + 1 ? T.ink : T.lineStrong}`, background: pn === i + 1 ? T.ink : "#fff", color: pn === i + 1 ? "#fff" : T.ink, fontSize: 13.5, fontWeight: 700, cursor: "pointer", transition: "all .16s" }}>{i + 1}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ---------------------------------------------------------- detail -- */}
      {page === "detail" && (
        <main style={{ ...container, padding: "0 24px 90px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: MONO_FACE, fontSize: 12.5, color: T.muted2, padding: "22px 0", flexWrap: "wrap" }}>
            <span onClick={() => go("home")} style={{ cursor: "pointer" }}>Home</span><span>/</span>
            <span onClick={() => goCat(product.cat)} style={{ cursor: "pointer" }}>{product.cat}</span><span>/</span>
            <span style={{ color: T.ink, fontWeight: 600 }}>{product.name}</span>
          </div>

          <div style={{ display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 460px", minWidth: 300, display: "flex", gap: 14, flexWrap: "wrap-reverse" }}>
              {gallery.length > 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "0 0 72px" }}>
                  {gallery.map((g, i) => (
                    <div key={i} onClick={() => setImgIndex(i)} style={{ width: 72, height: 72, borderRadius: 11, overflow: "hidden", cursor: "pointer", background: T.tint, border: `2px solid ${imgIndex === i ? T.green : T.line}`, transition: "border-color .16s" }}>
                      <img src={g} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </div>
                  ))}
                </div>
              )}
              <div className="mv-zoomxl" style={{ flex: "1 1 340px", minWidth: 280, border: `1px solid ${T.line}`, borderRadius: 18, overflow: "hidden", background: T.media, aspectRatio: "1/1", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                <img src={gallery[imgIndex] || product.img} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                <span style={{ position: "absolute", left: 14, bottom: 14, background: "rgba(255,255,255,.92)", border: `1px solid ${T.line}`, fontFamily: MONO_FACE, fontSize: 11, color: T.muted, padding: "5px 10px", borderRadius: 999 }}>Hover to zoom</span>
              </div>
            </div>

            <div style={{ flex: "1 1 380px", minWidth: 300, position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <p style={{ ...eyebrow, fontSize: 11, letterSpacing: ".13em" }}>{product.badge}</p>
                <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.18, margin: 0, textWrap: "balance" }}>{product.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontFamily: MONO_FACE, fontSize: 13, color: T.muted2, flexWrap: "wrap" }}>
                  <Stars /><span>{product.reviews} reviews</span><span>·</span>
                  <span style={{ color: T.greenDark, fontWeight: 600 }}>{product.stock > 20 ? "In stock" : `Only ${product.stock} left`}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>{fmt(product.price)}</span>
                <span style={{ fontFamily: MONO_FACE, fontSize: 16, color: T.muted3, textDecoration: "line-through" }}>{fmt(product.mrp)}</span>
                <span style={{ background: T.greenTint, border: `1px solid ${T.greenBorder}`, color: T.greenDark, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>−{off}%</span>
              </div>
              <p style={{ fontFamily: MONO_FACE, fontSize: 15, lineHeight: 1.65, color: T.muted, margin: 0, textWrap: "pretty" }}>{product.short}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.features.map((f) => (
                  <span key={f} style={{ fontFamily: MONO_FACE, fontSize: 12.5, color: T.ink, background: T.tint, border: `1px solid ${T.line}`, padding: "6px 12px", borderRadius: 8 }}>{f}</span>
                ))}
              </div>

              <div style={{ border: `1px solid ${T.line}`, borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 14, background: "#fff", boxShadow: SH.panel }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", border: `1px solid ${T.lineStrong}`, borderRadius: 10, height: 48, overflow: "hidden" }}>
                    <button type="button" className="mv-flat" onClick={() => setQty((n) => Math.max(1, n - 1))} style={{ width: 42, height: "100%", border: "none", background: "#fff", fontSize: 17 }}>−</button>
                    <span style={{ minWidth: 38, textAlign: "center", fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{qty}</span>
                    <button type="button" className="mv-flat" onClick={() => setQty((n) => n + 1)} style={{ width: 42, height: "100%", border: "none", background: "#fff", fontSize: 17 }}>+</button>
                  </div>
                  <button type="button" className="mv-btn" onClick={() => add(product, qty)} style={{ ...btn.primary, flex: "1 1 180px", height: 48, borderRadius: 11, boxShadow: "0 8px 18px rgba(22,163,74,.22)" }}>Add {qty} to cart · {fmt(product.price * qty)}</button>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {/* ← wire to the existing WhatsApp order composer */}
                  <button type="button" className="mv-btn" onClick={() => { add(product, qty); go("checkout"); }} style={{ ...btn.dark, flex: "1 1 160px", height: 48, borderRadius: 11, fontSize: 14.5 }}>Order on WhatsApp</button>
                  <button type="button" className="mv-btn" onClick={() => toggleWish(product)} style={{ flex: "0 0 120px", height: 48, border: `1px solid ${wish.includes(product.id) ? T.green : T.lineStrong}`, borderRadius: 11, background: wish.includes(product.id) ? T.greenTint : "#fff", color: wish.includes(product.id) ? T.greenDark : T.ink, fontSize: 14.5, fontWeight: 700 }}>{wish.includes(product.id) ? "♥ Saved" : "♡ Save"}</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4, fontFamily: MONO_FACE, fontSize: 13, color: T.muted }}>
                  <span>10-minute delivery inside SRM · ₹0 delivery fee</span>
                  <span>Pay on delivery — cash or UPI</span>
                  <span>Free name + RA number printing on the pouch</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 72, borderTop: `1px solid ${T.line}` }}>
            <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
              {tabDefs.map((t) => (
                <button key={t.key} type="button" onClick={() => setTab(t.key)} style={{ border: "none", background: "transparent", padding: "16px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", color: tab === t.key ? T.ink : T.muted2, boxShadow: tab === t.key ? `inset 0 -2px 0 ${T.green}` : "none", transition: "color .16s" }}>{t.label}</button>
              ))}
            </div>
            <div style={{ padding: "32px 0 0", maxWidth: 820 }}>
              {tab === "desc" && <p style={{ fontFamily: MONO_FACE, fontSize: 15.5, lineHeight: 1.75, color: T.body, margin: 0, textWrap: "pretty" }}>{product.desc}</p>}
              {tab === "specs" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "0 40px" }}>
                  {product.specs.map((s) => (
                    <div key={s.k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "13px 0", borderBottom: `1px solid ${T.lineSoft}`, fontFamily: MONO_FACE, fontSize: 14 }}>
                      <span style={{ color: T.muted2 }}>{s.k}</span><span style={{ fontWeight: 600, textAlign: "right" }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              )}
              {tab === "inside" && (
                <div style={{ border: `1px solid ${T.line}`, borderRadius: 14, overflow: "hidden" }}>
                  {product.contents.map((c) => (
                    <div key={c.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "14px 18px", borderBottom: `1px solid ${T.lineSoft}`, fontFamily: MONO_FACE, fontSize: 14 }}>
                      <span>{c.name}</span><span style={{ color: T.muted2 }}>{c.retail}</span>
                    </div>
                  ))}
                </div>
              )}
              {tab === "reviews" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {REVIEWS.map((r) => (
                    <div key={r.n} style={{ border: `1px solid ${T.line}`, borderRadius: 14, padding: 22 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{r.n}</span><Stars size={12} />
                      </div>
                      <p style={{ fontFamily: MONO_FACE, fontSize: 14.5, lineHeight: 1.65, color: T.body, margin: 0 }}>{r.q}</p>
                      <p style={{ fontFamily: MONO_FACE, fontSize: 12.5, color: T.muted3, margin: "10px 0 0" }}>{r.y}</p>
                    </div>
                  ))}
                </div>
              )}
              {tab === "shipping" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: MONO_FACE, fontSize: 15, lineHeight: 1.7, color: T.body }}>
                  <p style={{ margin: 0 }}><strong style={{ color: T.ink }}>Inside SRM campus and hostels —</strong> about 10 minutes, any day before 9 PM. No delivery fee.</p>
                  <p style={{ margin: 0 }}><strong style={{ color: T.ink }}>Potheri, Guduvanchery, Maraimalai Nagar —</strong> same day, ₹0 above ₹499.</p>
                  <p style={{ margin: 0 }}><strong style={{ color: T.ink }}>Rest of India —</strong> 3–5 working days by courier, tracked.</p>
                  <p style={{ margin: 0 }}><strong style={{ color: T.ink }}>Returns —</strong> 7 days on unused instruments in original packaging. BPL stethoscope carries a 1-year manufacturer warranty.</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 72 }}>
            <h2 style={{ ...h2, fontSize: 24, marginBottom: 22 }}>You may also need</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 20 }}>
              {DATA.filter((d) => d.cat === product.cat && d.id !== product.id).concat(DATA.filter((d) => d.cat !== product.cat)).slice(0, 4).map((p) => <ProductCard key={p.id} {...cardProps(p)} />)}
            </div>
          </div>
        </main>
      )}

      {/* ------------------------------------------------------------ cart -- */}
      {page === "cart" && (
        <main style={{ ...container, padding: "44px 24px 90px" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-.03em", margin: "0 0 6px" }}>Your cart</h1>
          <p style={{ fontFamily: MONO_FACE, fontSize: 14, color: T.muted2, margin: "0 0 32px" }}>{count ? `${count} item${count === 1 ? "" : "s"} · free delivery inside SRM` : "Nothing here yet"}</p>
          {cartItems.length ? (
            <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 560px", minWidth: 300, border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden" }}>
                {cartItems.map((it) => (
                  <div key={it.id} style={{ display: "flex", gap: 16, padding: 18, borderBottom: `1px solid ${T.lineSoft}`, alignItems: "center", flexWrap: "wrap" }}>
                    <img src={it.img} alt="" style={{ width: 82, height: 82, borderRadius: 11, objectFit: "contain", background: T.tint, padding: 6, flexShrink: 0 }} />
                    <div style={{ flex: "1 1 200px", minWidth: 160 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>{it.name}</p>
                      <p style={{ ...meta, marginTop: 5 }}>{it.cat} · {fmt(it.price)} each</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${T.lineStrong}`, borderRadius: 9, height: 38, overflow: "hidden" }}>
                      <button type="button" className="mv-flat" onClick={() => setCart((c) => c.map((x) => x.id === it.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))} style={{ width: 34, height: "100%", border: "none", background: "#fff", fontSize: 15 }}>−</button>
                      <span style={{ minWidth: 30, textAlign: "center", fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{it.qty}</span>
                      <button type="button" className="mv-flat" onClick={() => setCart((c) => c.map((x) => x.id === it.id ? { ...x, qty: x.qty + 1 } : x))} style={{ width: 34, height: "100%", border: "none", background: "#fff", fontSize: 15 }}>+</button>
                    </div>
                    <span style={{ minWidth: 88, textAlign: "right", fontSize: 15.5, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{fmt(it.price * it.qty)}</span>
                    <button type="button" aria-label="Remove" className="mv-remove" onClick={() => setCart((c) => c.filter((x) => x.id !== it.id))} style={{ width: 34, height: 34, border: `1px solid ${T.line}`, borderRadius: 9, background: "#fff", color: T.muted3, cursor: "pointer" }}>✕</button>
                  </div>
                ))}
                <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span className="mv-navlink" onClick={() => goCat("All")} style={{ fontSize: 14, fontWeight: 700 }}>← Continue shopping</span>
                  <span style={{ fontFamily: MONO_FACE, fontSize: 13, color: T.greenDark, fontWeight: 600 }}>You're saving {fmt(savings)}</span>
                </div>
              </div>
              <Summary />
            </div>
          ) : (
            <div style={{ border: `1px dashed ${T.lineStrong}`, borderRadius: 18, padding: "80px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Your cart is empty</p>
              <p style={{ fontFamily: MONO_FACE, fontSize: 14.5, color: T.muted2, margin: "10px 0 22px" }}>Start with the MVP kit — it covers the whole first-year assessment syllabus.</p>
              <button type="button" className="mv-btn" onClick={() => goCat("Assessment Kits")} style={{ ...btn.primary, height: 48, boxShadow: "none" }}>Shop assessment kits</button>
            </div>
          )}
        </main>
      )}

      {/* -------------------------------------------------------- checkout -- */}
      {page === "checkout" && (
        <main style={{ ...container, padding: "44px 24px 90px" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-.03em", margin: "0 0 6px" }}>Checkout</h1>
          <p style={{ fontFamily: MONO_FACE, fontSize: 14, color: T.muted2, margin: "0 0 32px" }}>Confirm your details — we'll send the order to WhatsApp and deliver to your block.</p>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* ← replace onSubmit with the existing order handler */}
            <form onSubmit={(e) => { e.preventDefault(); if (placing) return; setPlacing(true); setTimeout(() => { setPlacing(false); setCart([]); go("success"); }, 1100); }} style={{ flex: "1 1 560px", minWidth: 300, display: "flex", flexDirection: "column", gap: 28 }}>
              <div style={{ border: `1px solid ${T.line}`, borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 18px" }}>1 · Your details</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                  {[["Full name", "Aparna R."], ["RA number", "RA24110xxxxxxx"], ["WhatsApp number", "+91 "], ["Year & course", "1st year BPT"]].map(([l, ph]) => (
                    <label key={l} style={{ display: "flex", flexDirection: "column", gap: 7, fontFamily: MONO_FACE, fontSize: 12.5, fontWeight: 600, color: T.muted }}>{l}
                      <input className="mv-input" placeholder={ph} style={{ height: 46, border: `1px solid ${T.lineStrong}`, borderRadius: 10, padding: "0 14px", fontSize: 14.5, color: T.ink }} />
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ border: `1px solid ${T.line}`, borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 18px" }}>2 · Where should we drop it?</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                  {[["Hostel / block", "Paari Block A"], ["Room number", "412"]].map(([l, ph]) => (
                    <label key={l} style={{ display: "flex", flexDirection: "column", gap: 7, fontFamily: MONO_FACE, fontSize: 12.5, fontWeight: 600, color: T.muted }}>{l}
                      <input className="mv-input" placeholder={ph} style={{ height: 46, border: `1px solid ${T.lineStrong}`, borderRadius: 10, padding: "0 14px", fontSize: 14.5, color: T.ink }} />
                    </label>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                  {[["now", "Deliver now (~10 min)"], ["eve", "This evening, 6–9 PM"], ["tom", "Tomorrow morning"]].map(([k, l]) => (
                    <button key={k} type="button" onClick={() => setSlot(k)} style={{ height: 40, padding: "0 16px", borderRadius: 10, border: `1px solid ${slot === k ? T.green : T.lineStrong}`, background: slot === k ? T.greenTint : "#fff", color: slot === k ? T.greenDark : T.body, fontSize: 13.5, fontWeight: 600, cursor: "pointer", transition: "all .16s" }}>{l}</button>
                  ))}
                </div>
              </div>

              <div style={{ border: `1px solid ${T.line}`, borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 18px" }}>3 · Payment</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[["cod", "Cash on delivery", "Pay the delivery partner at your gate"], ["upi", "UPI on delivery", "Scan and pay when it arrives"], ["rzp", "Pay now via Razorpay", "Card, UPI, netbanking — secured"]].map(([k, l, note]) => (
                    <button key={k} type="button" onClick={() => setPay(k)} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px 18px", borderRadius: 12, border: `1px solid ${pay === k ? T.green : T.line}`, background: pay === k ? T.greenSoft : "#fff", cursor: "pointer", transition: "all .18s" }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, border: `2px solid ${pay === k ? T.green : "#C9D5CE"}`, boxShadow: pay === k ? `inset 0 0 0 3.5px #fff, inset 0 0 0 9px ${T.green}` : "none", transition: "all .18s" }} />
                      <span style={{ display: "flex", flexDirection: "column", gap: 3, textAlign: "left" }}>
                        <span style={{ fontSize: 14.5, fontWeight: 700 }}>{l}</span>
                        <span style={{ ...meta, fontWeight: 500 }}>{note}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="mv-btn" disabled={placing} style={{ ...btn.primary, height: 54, borderRadius: 13, fontSize: 15.5, boxShadow: "0 10px 22px rgba(22,163,74,.22)", background: placing ? T.greenDark : T.green, cursor: placing ? "wait" : "pointer", opacity: placing ? .85 : 1 }}>
                {placing ? "Sending to WhatsApp…" : `Place order · ${fmt(subtotal)}`}
              </button>
            </form>
            <Summary withItems />
          </div>
        </main>
      )}

      {/* --------------------------------------------------------- success -- */}
      {page === "success" && (
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "100px 24px 120px", textAlign: "center", animation: "mvIn .4s ease both" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.greenTint, border: `1px solid ${T.greenBorder}`, color: T.green, fontSize: 30, display: "grid", placeItems: "center", margin: "0 auto 26px" }}>✓</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.03em", margin: 0 }}>Order sent to WhatsApp</h1>
          <p style={{ fontFamily: MONO_FACE, fontSize: 16, lineHeight: 1.65, color: T.muted, margin: "14px 0 30px" }}>We've got it. You'll get a confirmation on WhatsApp in a minute, and the delivery in about 10 after that.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" className="mv-btn" onClick={() => go("track")} style={{ ...btn.primary, height: 48, boxShadow: "none" }}>Track this order</button>
            <button type="button" className="mv-btn" onClick={() => go("home")} style={{ ...btn.ghost, height: 48 }}>Back to home</button>
          </div>
        </main>
      )}

      {/* -------------------------------------------------------- wishlist -- */}
      {page === "wishlist" && (
        <main style={{ ...container, padding: "44px 24px 90px" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-.03em", margin: "0 0 6px" }}>Saved for later</h1>
          <p style={{ fontFamily: MONO_FACE, fontSize: 14, color: T.muted2, margin: "0 0 32px" }}>{wish.length ? `${wish.length} item${wish.length === 1 ? "" : "s"} saved` : "Nothing saved yet"}</p>
          {wish.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 20 }}>
              {DATA.filter((d) => wish.includes(d.id)).map((p) => <ProductCard key={p.id} {...cardProps(p)} />)}
            </div>
          ) : (
            <div style={{ border: `1px dashed ${T.lineStrong}`, borderRadius: 18, padding: "80px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Nothing saved yet</p>
              <p style={{ fontFamily: MONO_FACE, fontSize: 14.5, color: T.muted2, margin: "10px 0 22px" }}>Tap the heart on any product to keep it here until your stipend lands.</p>
              <button type="button" className="mv-btn" onClick={() => goCat("All")} style={{ ...btn.primary, height: 48, boxShadow: "none" }}>Browse products</button>
            </div>
          )}
        </main>
      )}

      {/* ----------------------------------------------------------- track -- */}
      {page === "track" && (
        <main style={{ maxWidth: 760, margin: "0 auto", padding: "44px 24px 90px" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-.03em", margin: "0 0 6px" }}>Track your order</h1>
          <p style={{ fontFamily: MONO_FACE, fontSize: 14, color: T.muted2, margin: "0 0 28px" }}>Enter the order ID from your WhatsApp confirmation.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
            <input className="mv-input" placeholder="MV-2481" style={{ flex: "1 1 240px", height: 50, border: `1px solid ${T.lineStrong}`, borderRadius: 12, padding: "0 16px", fontSize: 15 }} />
            <button type="button" className="mv-btn" onClick={() => flash("Order MV-2481 · out for delivery")} style={{ ...btn.dark, height: 50 }}>Track</button>
          </div>
          <div style={{ border: `1px solid ${T.line}`, borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingBottom: 20, borderBottom: `1px solid ${T.lineSoft}`, marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Order MV-2481</p>
                <p style={{ fontFamily: MONO_FACE, fontSize: 13, color: T.muted2, margin: "5px 0 0" }}>MVP Assessment Kit · Paari Block A, Room 412</p>
              </div>
              <span style={{ alignSelf: "flex-start", background: T.greenTint, border: `1px solid ${T.greenBorder}`, color: T.greenDark, fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 999 }}>Out for delivery</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[["Order confirmed", "Today, 4:12 PM", true], ["Packed at MedVault", "Today, 4:18 PM", true], ["Out for delivery", "Today, 4:21 PM", true], ["Delivered", "Expected 4:31 PM", false]].map(([title, time, done], i, arr) => (
                <div key={title} style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: 13, height: 13, borderRadius: "50%", background: done ? T.green : "#fff", border: `2px solid ${done ? T.green : T.lineStrong}`, flexShrink: 0, animation: i === 2 ? "mvPulse 2s infinite" : "none" }} />
                    <span style={{ width: 2, flex: 1, background: i === arr.length - 1 ? "transparent" : (done ? T.green : T.line), minHeight: 34 }} />
                  </div>
                  <div style={{ paddingBottom: 26 }}>
                    <p style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: done ? T.ink : T.muted3 }}>{title}</p>
                    <p style={{ fontFamily: MONO_FACE, fontSize: 13, color: T.muted2, margin: "4px 0 0" }}>{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ---------------------------------------------------------- footer -- */}
      <footer style={{ background: T.ink, color: T.darkText }}>
        <div style={{ ...container, padding: "64px 24px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <img src="/logo.png" alt="" style={{ height: 28, width: "auto", filter: "brightness(0) invert(1)" }} />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-.02em" }}>MedVault</span>
            </div>
            <p style={{ fontFamily: MONO_FACE, fontSize: 13.5, lineHeight: 1.65, margin: 0, maxWidth: 250 }}>Clinical assessment instruments for healthcare students. Built around the BPT syllabus, delivered around SRM.</p>
            <p style={{ fontFamily: MONO_FACE, fontSize: 13, margin: "6px 0 0" }}><a href="https://wa.me/918248613274" style={{ color: T.greenOnDark, textDecoration: "none" }}>+91 82486 13274</a></p>
          </div>
          {[
            { title: "Shop", links: [["Assessment kits", () => goCat("Assessment Kits")], ["Diagnostic equipment", () => goCat("Diagnostic Equipment")], ["Physiotherapy", () => goCat("Physiotherapy")], ["Accessories", () => goCat("Medical Accessories")]] },
            { title: "Support", links: [["Track your order", () => go("track")], ["Delivery around SRM", () => go("track")], ["Returns & warranty", () => go("track")], ["Talk to us on WhatsApp", () => window.open("https://wa.me/918248613274", "_blank")]] },
            { title: "MedVault", links: [["Our story", () => go("home")], ["Campus partnerships", () => go("home")], ["Bulk orders for colleges", () => go("home")], ["Careers", () => go("home")]] },
          ].map((col) => (
            <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <p style={{ fontFamily: MONO_FACE, fontSize: 10.5, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "#fff", margin: "0 0 3px" }}>{col.title}</p>
              {col.links.map(([l, fn]) => <span key={l} className="mv-footlink" onClick={fn} style={{ fontFamily: MONO_FACE, fontSize: 13.5 }}>{l}</span>)}
            </div>
          ))}
        </div>
        <div style={{ ...container, padding: "20px 24px 40px", borderTop: `1px solid ${T.darkLine}`, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", fontFamily: MONO_FACE, fontSize: 12.5 }}>
          <span>© 2026 MedVault. All rights reserved.</span>
          <span>Cash &amp; UPI on delivery · Razorpay · 7-day returns</span>
        </div>
      </footer>

      {toast && (
        <div style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 90, background: T.ink, color: "#fff", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: SH.toast, animation: "mvIn .22s ease both" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{toast}</span>
          <span onClick={() => go("cart")} style={{ fontSize: 13.5, fontWeight: 700, color: T.greenOnDark, cursor: "pointer" }}>View cart</span>
        </div>
      )}
    </div>
  );
}
