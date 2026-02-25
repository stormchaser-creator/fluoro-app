import { useState, useEffect, useCallback, useRef } from "react";
import STUDY_MATERIAL from "./studyMaterial";

// ═══════════════════════════════════════════════════════════════
// FLUOROSCOPY RAPID LEARNING PROTOCOL — INTERACTIVE DASHBOARD
// Built on: Exercise→BDNF Priming, Spaced Retrieval, Interleaving,
// Elaborative Interrogation, Dual Coding, Sleep Consolidation
// ═══════════════════════════════════════════════════════════════

// ── THEME ────────────────────────────────────────────────────
const THEMES = {
  light: {
    bg: "#FFFFFF",
    card: "#F1F5F9",
    cardActive: "#DBEAFE",
    border: "#CBD5E1",
    text: "#0F172A",
    body: "#334155",
    muted: "#64748B",
    dim: "#94A3B8",
    dimmest: "#94A3B8",
    rsvpBg: "#FFFFFF",
    answerBg: "#F0FDF4",
    answerBorder: "#10B981",
    answerText: "#065F46",
    expandedBg: "#F8FAFC",
  },
  dark: {
    bg: "#0F172A",
    card: "#1E293B",
    cardActive: "#1E3A5F",
    border: "#334155",
    text: "#F8FAFC",
    body: "#CBD5E1",
    muted: "#94A3B8",
    dim: "#64748B",
    dimmest: "#475569",
    rsvpBg: "#000000",
    answerBg: "#0F172A",
    answerBorder: "#10B981",
    answerText: "#A7F3D0",
    expandedBg: "#0F172A",
  },
};

// ── KNOWLEDGE DOMAIN MAP ──────────────────────────────────────
const DOMAINS = [
  {
    id: "equipment",
    name: "Equipment & Physics",
    color: "#3B82F6",
    icon: "⚡",
    weight: 25,
    subtopics: [
      "Image Intensifier (II) construction & operation",
      "Input/output phosphors, photocathode, electron optics",
      "Brightness gain = minification gain × flux gain",
      "Flat Panel Detectors (FPD) — DEL, scintillator, photodiode",
      "FPD vs II: distortion, dynamic range, spatial resolution",
      "TV camera systems (vidicon, plumbicon)",
      "Magnification modes & FOV",
      "Automatic Brightness Control (ABC/ABS)",
      "Collimation & filtration systems",
      "X-ray generator types (single-phase, three-phase, high-frequency)",
      "C-arm configurations (isocentric vs non-isocentric)",
      "X-ray tube components: cathode, anode, filament, focusing cup",
      "Characteristic vs bremsstrahlung radiation",
      "X-ray interactions: photoelectric, Compton, pair production",
      "Exponential attenuation (I = I₀e^−μx) & HVL",
      "Focal spot: nominal, measured, effective, actual & line focus principle",
      "Scatter radiation patterns & isoexposure curves",
      "Dead-man switch & cumulative 5-min timer",
      "Collimator/shutter protection requirements",
      "Barrier interlock (auto-terminate when receptor removed)",
      "Source-to-skin distance minimums (12″ / 15″ / 18″)",
      "Visual physiology: rods vs cones, photopic 10× scotopic acuity",
      "Image integration time (0.2 sec) & optimal viewing distance (12–15″)",
    ],
    keyNumbers: [
      "Brightness gain: 5,000–20,000",
      "Conversion factor: 100–300 cd·m⁻²/mR·s⁻¹",
      "FPD DEL size: 200 μm – 1,400 μm",
      "Max spatial resolution = 1 ÷ (2 × pitch)",
      "Binning reduces resolution to 50%, data rate to 25%",
      "Input window: ~1 mm aluminum",
      "Output phosphor: P20 (green-emitting)",
      "~2,000 luminescence photons per 25-keV photoelectron",
      "HVL minimum: 2.3 mm Al at 80 kVp (fluoro)",
      "Grid ratios for fluoro: 6:1 to 16:1",
      "Tube housing leakage: <100 mR/hr at 1 meter",
      "Cumulative timer: audible signal at 5 minutes",
      "Min SSD stationary: 12″ (should be 18″); mobile: 12″",
      "Photoelectric effect dominates at diagnostic energies (<100 kVp)",
      "Single-phase: 100% ripple; 3-phase 6-pulse: 13%; 12-pulse: 4%; HF: <1%",
      "Eye integration time: 0.2 sec; optimal viewing: 12–15 inches",
      "Photopic (cone) acuity 10× scotopic (rod) acuity",
    ],
  },
  {
    id: "digital",
    name: "Digital Fluoroscopy",
    color: "#8B5CF6",
    icon: "🖥️",
    weight: 15,
    subtopics: [
      "Binary/decimal conversion, bit depth",
      "Pixel matrix sizes (512² to 1024²)",
      "Gray levels: 8-bit = 256 shades",
      "ADC (analog-to-digital converter)",
      "Last Image Hold",
      "Gray-scale processing (window/level)",
      "Temporal frame averaging (noise ↓44% with 5 frames)",
      "Edge enhancement technique",
      "Digital Subtraction Angiography (DSA)",
      "Direct vs indirect conversion flat panel detectors",
      "Detective Quantum Efficiency (DQE)",
      "ABC vs AGC (tube output control vs video gain control)",
      "Image lag: vidicon (more) vs plumbicon (less)",
      "Flare/veiling glare measurement (10% lead disc)",
      "Conversion factor degradation over time",
      "Cine fluorography frame rates & exposure per frame",
      "RS-170 video signal standard (1.0 V peak-to-peak)",
      "II-specific distortions: pincushion, S, vignetting",
    ],
    keyNumbers: [
      "8-bit = 2⁸ = 256 gray levels",
      "4-bit = 2⁴ = 16 gray levels",
      "Frame averaging of 5 frames: noise to 44%",
      "Digital fluoro matrix: 512²–1,024² pixels",
      "Digital chest radiography: 1,500–2,000 pixels/side",
      "Cine: ~4 μR/frame (9″), ~7 μR/frame (6″), ~15 μR/frame (23 cm)",
      "Cine patient entrance: 50–150+ rads",
      "RS-170: 1.0 V peak-to-peak composite video",
      "DQE: FPD > II (better image per unit dose)",
    ],
  },
  {
    id: "radprotection",
    name: "Radiation Protection",
    color: "#EF4444",
    icon: "🛡️",
    weight: 25,
    subtopics: [
      "ALARA principle & levels (I–IV)",
      "Time, distance, shielding",
      "Inverse square law",
      "Collimation → reduces dose AND scatter",
      "Personnel monitoring (film badge, TLD, pocket ionization)",
      "Protective equipment (aprons, thyroid shields, glasses)",
      "Lead equivalence requirements",
      "Scatter radiation patterns",
      "Leakage radiation limits",
      "IRP (Interventional Reference Point)",
      "PKA (kerma air product) — Gy·cm²",
      "PKA constant along source-to-receptor axis",
      "Three radiation types operator receives: useful beam, leakage, scatter",
      "Apron attenuation varies with kVp (96% at 75 kVp vs 91% at 100 kVp)",
      "Lead apron covers ~80% of active bone marrow",
      "Protective eye lenses: 0.25 mm Pb reduces 85–90%",
      "Thyroid shield requirement during fluoroscopy",
      "Gloves required when hand in primary beam",
      "Mechanical holding devices preferred over hand-holding",
      "Proper apron storage (hangers — never fold)",
      "Fluoro rooms: secondary barriers only (unless combined unit)",
      "Scatter radiation can travel around corners",
      "Gonad shield types: flat contact, shaped contact, shadow",
      "Bone marrow dose: highest from barium enema, upper GI, abdominal angio",
      "Film badge accuracy ±25%; TLD accuracy ±9%",
      "Quality factor Q = 1 for x-rays (1 rad = 1 rem)",
    ],
    keyNumbers: [
      "Routine fluoro limit: 5 R/min (without auto), 10 R/min (with auto)",
      "Boost mode: up to 20 R/min at tabletop",
      "Exposure rate limit: 88 mGy/min",
      "Boost rate limit: 176 mGy/min",
      "Leakage limit: 100 mR at 1 meter",
      "1 foot from patient: ~500 mR/hour scatter",
      "0.25 mm Pb if ≥5 mR/hour",
      "5 Gray → Substantial Radiation Dose Level alert",
      "Dose per pulse: √(ratio of pulse rates) relationship",
      "Max mA recommendation: 2.2 R/min per mA at 80 kVp",
      "At 75 kVp: 0.25 mm Pb = 96%, 0.5 mm Pb = 99%",
      "At 100 kVp: 0.25 mm Pb = 91%, 0.5 mm Pb = 95.3%",
      "Lead apron covers ~80% active bone marrow",
      "0.25 mm Pb eye lenses: 85–90% reduction",
      "Film badge: 10 mrad – 700 rads range, ±25% accuracy",
      "TLD: ±9% accuracy, reusable, better low-dose sensitivity",
      "Q factor: 1 for x-rays/gamma/beta (1 rad = 1 rem)",
    ],
  },
  {
    id: "doselimits",
    name: "Dose Limits & Regulations",
    color: "#F59E0B",
    icon: "📋",
    weight: 15,
    subtopics: [
      "Occupational whole-body: 50 mSv/year",
      "Lifetime dose: 10 mSv × age",
      "Lens of eye: 150 mSv/year at 0.3 cm depth",
      "Skin/extremities: 500 mSv/year",
      "Public: 0.1 rem/year, 0.002 rem/hour",
      "Fetal limits: 5 mSv total, 0.5 mSv/month",
      "Radiation area vs high radiation area definitions",
      "California reporting requirements",
      "Equipment monitoring frequency (weekly/annual)",
      "ALARA investigation levels (I–IV fractions)",
      "Declared pregnant woman: voluntary written notice + est. conception date",
      "If fetal dose already 0.5 rem at declaration: 0.05 rem limit for remainder",
      "Uniform monthly exposure rate for pregnant workers",
      "Deep-dose equivalent measured at 1 cm tissue depth",
      "CA: x-ray machine registration within 30 days, renewal July even years",
      "Violation of CA radiation regs = misdemeanor",
      "Posting: CAUTION X-RAY signs, current regs, Form RH-2364",
      "No deliberate exposure for training without physician Rx",
      "Occupational dose excludes personal medical/dental exposure",
      "High-level control: continuous activation + continuous audible signal",
      "Overexposure: report to Radiologic Health Branch",
      "Supervisor responsibility: protection, equipment, authorized operators",
      "Mandatory monitoring: high radiation area entrants + mobile x-ray operators",
      "Rad protection program: develop, document, implement, review annually",
      "CA gonad shielding: 0.5 mm Pb (stricter than federal 0.25 mm)",
      "NVLAP / NSF Standard 16 for monitoring service certification",
    ],
    keyNumbers: [
      "Whole body occupational: 50 mSv/year",
      "Lifetime: 10 mSv × age in years",
      "Lens: 150 mSv/year (measured at 0.3 cm depth)",
      "Skin/extremities: 500 mSv/year",
      "Public annual: 1 mSv (0.1 rem)",
      "Public hourly: 0.02 mSv (0.002 rem)",
      "Fetal total pregnancy: 5 mSv (0.5 rem)",
      "Fetal monthly: 0.5 mSv (0.05 rem)",
      "If already at 0.5 rem when declared: 0.05 rem limit for remainder",
      "Radiation area: 0.05 mSv/hr at 30 cm",
      "High radiation area: 1 mSv/hr at 30 cm",
      "Cataract threshold: ~750 mGy (several hundred rads)",
      "Report immediately: 25 rem total effective",
      "Report 24hr: 5 rem total effective",
      "Deep-dose equivalent: measured at 1 cm (1000 mg/cm²)",
      "Eye dose: measured at 0.3 cm (300 mg/cm²)",
      "CA machine registration: within 30 days; renew July even years",
      "CA gonad shielding: 0.5 mm Pb equivalent",
      "High-level fluoro: 20 R/min max + audible signal required",
    ],
  },
  {
    id: "radbio",
    name: "Radiation Biology",
    color: "#10B981",
    icon: "🧬",
    weight: 10,
    subtopics: [
      "Direct vs indirect DNA damage",
      "Deterministic vs stochastic effects",
      "Linear non-threshold (LNT) model",
      "Somatic vs genetic effects",
      "Radiosensitivity factors (division rate, differentiation, metabolism)",
      "Carcinogenesis (initiation → promotion → progression)",
      "Complete vs incomplete carcinogen",
      "Latent period: 5 yr leukemia, 2–20 yr solid tumors",
      "Heritable effects (demonstrated in mice, not humans)",
      "Genetically Significant Dose (GSD)",
      "Cellular amplification of radiation damage",
      "Dose-rate dependence for genetic effects",
      "Gross cellular effects (chromosome breaks, giant cells, etc.)",
      "Historical evidence groups (radiologists, dial painters, miners, A-bomb)",
      "Cancer rank order: breast, thyroid, blood, lung, GI, bone",
      "Radiation-induced life-span shortening",
      "Mitotic delay (usually reversible)",
      "DNA as critical target — controls enzyme synthesis & replication",
      "Three factors: dose rate, total dose, cell type",
    ],
    keyNumbers: [
      "≤25 rads: no detectable injury",
      "Temporary sterility: 30 rads (spermatogonia depleted ~50 rads)",
      "Cataract: only disease directly linked to long-term radiation",
      "Most frequent radiation cancers: breast, thyroid, blood, lung, GI, bone",
      "DNA repair: ~24 hours after irradiation",
      "Skin repopulation: occurs over weeks",
      "Latent period: 5 yr leukemia, 2–20 yr solid tumors",
      "Early radiologists: skin cancer, leukemia (historical evidence)",
      "Radium dial painters: bone malignancies",
      "Uranium miners: lung cancer",
      "A-bomb survivors: leukemia + solid tumors",
      "Mitotic delay: usually reversible",
      "Female oocytes: cannot be replaced (permanent damage)",
    ],
  },
  {
    id: "skineffects",
    name: "Skin Effects & Fetal Dose",
    color: "#EC4899",
    icon: "⚠️",
    weight: 5,
    subtopics: [
      "Skin dose thresholds and timelines",
      "Erythema, desquamation, ulceration progression",
      "Detailed skin table: 2 Gy erythema, 6 Gy epilation, 7 Gy permanent, 10 Gy necrosis",
      "Fractionation benefit (DNA repair, stem cell repopulation)",
      "Serial radiation timing rules",
      "Pre-existing risk factors (diabetes, autoimmune, obesity)",
      "Fetal dose thresholds by gestational period",
      "Pre-implantation (0–2 wks): all-or-none",
      "Organogenesis (3–8 wks): malformations — most sensitive to teratogenesis",
      "Fetal growth (9 wks–birth): microcephaly, intellectual disability, growth retardation",
      "Fetal dose calculation (≈2% of skin dose)",
      "50 rads → possible spontaneous abortion",
      "10 rads → deleterious effects in animal embryos",
      "10-day rule / 14-day rule for scheduling exams",
      "Termination never justified from diagnostic x-ray alone",
      "Gonad irradiation: temp sterility 30 rads male; female oocytes irreplaceable",
      "Cataract threshold: several hundred rads acute (~750 mGy)",
    ],
    keyNumbers: [
      "<2 Gy: no observable skin effects",
      ">2 Gy: erythema within hours, fades 48 hrs",
      "6 Gy: temporary epilation",
      "7 Gy: permanent erythema",
      ">5 Gy: second erythema ~10 days, epilation possible",
      "10 Gy: moist desquamation, dermal necrosis possible",
      ">15 Gy: vascular damage, ulceration, necrosis",
      "Moist desquamation confirms >10 Gy",
      "Serial ≤10 Gy: wait 4–6 weeks",
      "Serial >10 Gy: wait 8–12 weeks",
      "Fetal <100 mGy: no increased malformation/death",
      "Fetal 100–200 mGy: very low malformation risk",
      "Fetal >500 mGy: significant risk CNS/growth",
      "Fetal dose ≈ 2% of skin dose",
      "Termination never justified from diagnostic x-ray",
      "50 rads to fetus: possible spontaneous abortion",
      "10 rads: deleterious effects shown in animal embryos",
      "Temp sterility: 30 rads male; 50 rads depletes spermatogonia",
      "Female oocytes: cannot be replaced (permanent)",
      "Cataract: ~750 mGy (several hundred rads) acute threshold",
    ],
  },
  {
    id: "qa",
    name: "Quality Assurance & Image Quality",
    color: "#06B6D4",
    icon: "✅",
    weight: 5,
    subtopics: [
      "Resolution testing and MTF",
      "High contrast vs low contrast resolution testing",
      "Contrast ratio measurement",
      "Vignetting, pincushion distortion, S distortion",
      "Veiling glare and lag",
      "Quantum mottle",
      "Half-value layer (HVL) determination",
      "Phantom testing requirements",
      "Relative sharpness = SOD/OID",
      "Four steps of QA: acceptance, baseline, diagnosis, verification",
      "QC test frequency: daily, weekly, semi-annual, annual",
      "Daily QC: brightness, interlocks, protective devices, collimation",
      "Semi-annual QC: shutters, ABC, resolution, HVL, dose rates, apron integrity",
      "25% output increase = action level for investigation",
      "Acceptance testing checklist (20+ items by physicist)",
      "QC required after repair/replacement before human use",
      "California: weekly kVp/mA monitoring",
      "Annual physicist review (with auto exposure)",
      "Triennial review (without auto exposure)",
      "kVp accuracy: ±5%; mAs linearity: 0.10 × sum criterion",
      "Exposure reproducibility: ±5% coefficient of variation",
      "Dose reduction factors (QA 2×, collimation 1.5–3×, gonad shield 100×)",
      "QC instrument list (penetrometer, phantom, dosimeter, etc.)",
      "QA records: 3 years; film processor records: 1 year",
    ],
    keyNumbers: [
      "Large area contrast ratio: ~120 (10% surrounding area)",
      "Lag: old II 30–40 ms, new systems ~3 ms",
      "Relative sharpness = SOD / OID",
      "Weekly: monitor kVp and mA",
      "Annually: qualified physicist review (with auto)",
      "Every 3 years: without auto exposure",
      "Annual: review rad protection program",
      "25% output increase over calibrated = action level",
      "If calibrated >4.0 R/min: test against 5 R/min ceiling",
      "kVp accuracy: ±5% (or ±2 kVp at 60–100 kVp)",
      "mAs linearity: difference ≤0.10 × sum of consecutive settings",
      "Exposure reproducibility: ±5% coefficient of variation",
      "6″ mode with grid: 2–3 R/min; 9″ no grid: 1.5–2.5 R/min",
      "Room-to-room difference >25% = investigate",
      "QA records retention: 3 years minimum",
      "Film processor records: 1 year minimum",
      "Dose reduction: QA=2×, collimation=1.5–3×, rare earth=2–4×, gonad=100×",
      "Post-repair QC required before use on humans",
    ],
  },
];

// ── RETRIEVAL PRACTICE QUESTIONS ─────────────────────────────
const QUESTIONS = [
  // Equipment & Physics
  { domain: "equipment", q: "What are the two components of brightness gain?", a: "Minification gain × Flux gain. Minification gain = ratio of input to output phosphor areas. Flux gain = photons at output per photon at input.", difficulty: 1 },
  { domain: "equipment", q: "What material is the image intensifier input window made of, and why?", a: "Aluminum (~1 mm thick). Minimizes x-ray absorption and scattering while providing mechanical strength with its curved convex shape.", difficulty: 1 },
  { domain: "equipment", q: "What is the output phosphor material and what color does it emit?", a: "P20 phosphor — emits green light. Produces ~2,000 luminescence photons per accelerated 25-keV photoelectron.", difficulty: 2 },
  { domain: "equipment", q: "How does a flat panel detector (FPD) convert x-rays to a digital signal?", a: "X-rays → CsI scintillator converts to light → photodiode converts light to electronic signal → readout electronics digitize the signal. Each DEL performs this independently.", difficulty: 2 },
  { domain: "equipment", q: "What is the formula for maximum spatial resolution of an FPD?", a: "Max spatial resolution = 1 ÷ (2 × pitch), where pitch = distance between DEL centers in mm.", difficulty: 2 },
  { domain: "equipment", q: "What happens to spatial resolution and data rate when you use 2×2 binning on an FPD?", a: "Spatial resolution decreases to 50% of unbinned value. Data rate drops to 25% (4 DELs binned to 1 pixel).", difficulty: 3 },
  { domain: "equipment", q: "List 3 advantages of FPD over image intensifiers.", a: "1) No spatial distortion (uniform resolution across field), 2) Extended dynamic range, 3) Greater stability, 4) Smaller physical size. Also: no pincushion/S distortion artifacts.", difficulty: 2 },
  { domain: "equipment", q: "What is the difference between isocentric and non-isocentric C-arm geometry?", a: "Isocentric: organ at isocenter, stays in FOV at any angle, patient skin closer to IRP. Used for cardiac/neuro. Non-isocentric: patient farther from source than isocenter, skin farther from IRP. Used for vascular.", difficulty: 3 },
  { domain: "equipment", q: "What is the minimum HVL for fluoroscopy at 80 kVp?", a: "2.3 mm Al (minimum). 3.0 mm Al is recommended.", difficulty: 2 },
  { domain: "equipment", q: "What grid ratios are typical for fluoroscopy?", a: "6:1 to 16:1. Removing the grid can reduce patient dose by approximately 50%.", difficulty: 2 },

  // Digital Fluoroscopy
  { domain: "digital", q: "How many gray levels does an 8-bit system encode?", a: "2⁸ = 256 different gray levels (0–255).", difficulty: 1 },
  { domain: "digital", q: "How much does temporal frame averaging of 5 frames reduce image noise?", a: "Reduces noise to 44% of original. Trade-off: increased motion blur.", difficulty: 2 },
  { domain: "digital", q: "Explain Last Image Hold.", a: "Stores the final fluoroscopy frame and displays it continuously after x-rays are turned off. Allows review without additional radiation exposure.", difficulty: 1 },
  { domain: "digital", q: "What is the edge enhancement technique in digital fluoroscopy?", a: "Subtract a blurred version of the image from the original to create an 'edge image,' then add that edge image back to the original. Enhances structural boundaries.", difficulty: 2 },
  { domain: "digital", q: "What does DSA stand for and what is the basic principle?", a: "Digital Subtraction Angiography. Subtract a pre-contrast 'mask' image from post-contrast images to isolate vascular structures by removing bone and soft tissue.", difficulty: 2 },

  // Radiation Protection
  { domain: "radprotection", q: "What is PKA and why is it useful?", a: "Kerma Air Product (Gy·cm²) = air kerma × x-ray field size. Constant along the x-ray axis. Good metric for stochastic risk because it captures both beam intensity AND volume of tissue irradiated. Also reveals poor collimation habits.", difficulty: 2 },
  { domain: "radprotection", q: "Why is PKA constant along the source-to-receptor axis?", a: "As air kerma decreases with inverse square of distance, the x-ray field area increases with inverse square of distance. These cancel out, making the product constant.", difficulty: 3 },
  { domain: "radprotection", q: "What is the leakage radiation limit?", a: "100 mR at 1 meter from the x-ray tube housing.", difficulty: 1 },
  { domain: "radprotection", q: "What is the scatter radiation exposure rate 1 foot from the patient?", a: "Approximately 500 mR per hour.", difficulty: 2 },
  { domain: "radprotection", q: "What happens to patient dose and operator exposure if you double the collimator opening?", a: "Both double. Larger field = more tissue irradiated and more scatter produced.", difficulty: 2 },
  { domain: "radprotection", q: "What is the maximum exposure rate for routine fluoroscopy?", a: "Without automatic exposure: 5 R/min. With automatic exposure: 10 R/min. Recommendation: not exceed 2.2 R/min per mA at 80 kVp.", difficulty: 2 },
  { domain: "radprotection", q: "What is the dose per pulse relationship when changing pulse rates?", a: "New dose per pulse = old dose × √(old rate / new rate). E.g., 15 pps → 7.5 pps: dose per pulse increases by factor of √2 ≈ 1.4×. Lower pulse rate = higher dose per pulse.", difficulty: 3 },
  { domain: "radprotection", q: "What triggers a Substantial Radiation Dose Level alert?", a: "5 Gray at the IRP.", difficulty: 1 },
  { domain: "radprotection", q: "What are the follow-up thresholds? (Kar, PKA, fluoro time)", a: "Reference air kerma (Kar): 5,000 mGy. Kerma area product (PKA): 500 Gy·cm². Fluoroscopy time: 60 minutes.", difficulty: 3 },

  // Dose Limits
  { domain: "doselimits", q: "What are the four ALARA investigation levels?", a: "Level I: 1/20 annual limit → interview. Level II: 1/10 → exposure investigation form. Level III: 1/4 → detailed interview with RSO. Level IV: 1/1 (full limit) → regulatory agency report, possible reassignment.", difficulty: 3 },
  { domain: "doselimits", q: "What is the occupational whole-body dose limit?", a: "50 mSv per year (5 rem/year).", difficulty: 1 },
  { domain: "doselimits", q: "What is the lifetime dose limit formula?", a: "10 mSv × age in years.", difficulty: 1 },
  { domain: "doselimits", q: "What are the lens dose limit and the depth at which it's measured?", a: "150 mSv/year, measured at tissue depth of 0.3 cm.", difficulty: 2 },
  { domain: "doselimits", q: "What defines a 'radiation area' vs a 'high radiation area'?", a: "Radiation area: 0.05 mSv in 1 hour at 30 cm. High radiation area: 1 mSv in 1 hour at 30 cm.", difficulty: 2 },
  { domain: "doselimits", q: "When must you report to the state department? (immediate vs 24-hour)", a: "Immediate: 25 rem total effective, 75 rem eye, 250 rem skin. 24-hour (1/5 of immediate): 5 rem total, 15 rem eye, 50 rem skin.", difficulty: 3 },
  { domain: "doselimits", q: "What are the fetal dose limits during pregnancy?", a: "Total pregnancy: 5 mSv (0.5 rem). Monthly: 0.5 mSv (0.05 rem).", difficulty: 2 },

  // Radiation Biology
  { domain: "radbio", q: "What is the difference between direct and indirect DNA damage from radiation?", a: "Direct: radiation directly damages DNA. Indirect: radiation creates reactive species (free radicals) which then damage DNA. Note: secondary radiation (Compton/photoelectric) is indirect ionizing radiation but causes direct DNA damage.", difficulty: 2 },
  { domain: "radbio", q: "What is a 'complete carcinogen' vs an 'incomplete carcinogen'?", a: "Complete carcinogen (like ionizing radiation): acts as both initiator (causes DNA mutation) AND promoter (stimulates cell division). Incomplete carcinogen: only acts as an initiator.", difficulty: 2 },
  { domain: "radbio", q: "What is the latent period for radiation-induced cancers?", a: "Leukemia: 5 years. Solid tumors: 2–20 years.", difficulty: 2 },
  { domain: "radbio", q: "What is the only disease directly linked to long-term radiation exposure?", a: "Cataracts. Threshold ~750 mGy (several hundred rads acute). All other long-term effects manifest as statistical increases in disease incidence.", difficulty: 2 },
  { domain: "radbio", q: "What is the Genetically Significant Dose (GSD)?", a: "The gonad dose that would produce the same total genetic effect as all individual doses actually received. Function of: number of future children, x-ray exam rate, mean gonad dose per exam. Does NOT include background radiation.", difficulty: 3 },

  // Skin Effects & Fetal
  { domain: "skineffects", q: "What are the skin dose thresholds? (<2 Gy, >2 Gy, >5 Gy, >15 Gy)", a: "<2 Gy: no observable effects. >2 Gy: erythema within hours, fades 48 hrs. >5 Gy: second erythema ~10 days, epilation possible, follow up 4–8 weeks. >15 Gy: vascular damage, ulceration, necrosis — needs grafting. Moist desquamation confirms >10 Gy.", difficulty: 3 },
  { domain: "skineffects", q: "Why does fractionation reduce skin injury?", a: "Two mechanisms: 1) Permits DNA repair (~24 hours after irradiation). 2) Allows stem cell repopulation (occurs over weeks). Therefore deterministic injuries are NOT fully additive between procedures separated by days/weeks.", difficulty: 2 },
  { domain: "skineffects", q: "What are the timing rules for serial radiation at the same site?", a: "≤10 Gy: wait 4–6 weeks. >10 Gy: wait 8–12 weeks.", difficulty: 2 },
  { domain: "skineffects", q: "What are the fetal effects by gestational period?", a: "Pre-implantation (0–2 wks): all-or-none (abortion). Organogenesis (3–8 wks): birth defects, malformations. Fetal growth (9 wks–birth): microcephaly, mental retardation, growth retardation.", difficulty: 3 },
  { domain: "skineffects", q: "How do you calculate fetal dose from a fluoroscopic exam?", a: "Fetal dose ≈ 2% of skin dose. E.g., 5 R skin exposure → 5,000 mrad × 0.02 = 100 mrad to fetus.", difficulty: 2 },

  // QA
  { domain: "qa", q: "What causes vignetting in an image intensifier?", a: "Fall-off in brightness at periphery due to unequal light collection. Center appears brighter than edges.", difficulty: 1 },
  { domain: "qa", q: "What is pincushion distortion?", a: "Geometric, nonlinear magnification across the image caused by projection of the x-ray beam onto the curved input surface of the II. Visualized with a rectangular grid.", difficulty: 2 },
  { domain: "qa", q: "What causes S distortion?", a: "Electrons deflected by external magnetic or electrical fields, causing image distortion along flux lines. Requires shielding to minimize.", difficulty: 2 },
  { domain: "qa", q: "What is the formula for relative sharpness?", a: "Relative sharpness = SOD / OID (Source-to-Object Distance / Object-to-Image Distance).", difficulty: 1 },
  { domain: "qa", q: "How often must tube potential and current be monitored in California?", a: "Weekly.", difficulty: 1 },

  // ══════════════════════════════════════════════════════════════
  // EXPANDED QUESTION BANK — Coverage gap fill
  // ══════════════════════════════════════════════════════════════

  // ── EQUIPMENT & PHYSICS (expanded) ────────────────────────────

  { domain: "equipment", q: "What are the three methods of x-ray attenuation, and which dominates at fluoroscopic energies?", a: "Photoelectric effect, Compton scattering, and pair production. Photoelectric effect dominates at diagnostic/fluoroscopic energies (up to ~100 kVp). Pair production requires >1.02 MeV, so it does not occur in diagnostic imaging.", difficulty: 2 },
  { domain: "equipment", q: "What is the exponential attenuation formula?", a: "I = I₀ × e^(−μx), where I = intensity after absorption, I₀ = incident intensity, μ = linear attenuation coefficient, x = thickness of absorber.", difficulty: 2 },
  { domain: "equipment", q: "What is the Half-Value Layer (HVL)?", a: "The thickness of material (expressed in mm of aluminum) that reduces x-ray beam intensity to one-half. Used both to characterize beam quality AND to calculate barrier thickness requirements.", difficulty: 1 },
  { domain: "equipment", q: "What is the diagnostic x-ray tube housing leakage radiation limit?", a: "Less than 100 millirads/hour (100 mR/hr) at 1 meter from the tube housing.", difficulty: 1 },
  { domain: "equipment", q: "What are the main components of the x-ray tube cathode?", a: "Filament (tungsten coil — source of electrons via thermionic emission) and focusing cup (directs the electron stream toward the anode target).", difficulty: 1 },
  { domain: "equipment", q: "What is the difference between characteristic radiation and bremsstrahlung radiation?", a: "Characteristic: produced when an incoming electron ejects an inner-shell electron and an outer-shell electron fills the vacancy, emitting a photon of specific energy. Bremsstrahlung: produced when electrons are decelerated/deflected by the nucleus, emitting a continuous spectrum of energies. Bremsstrahlung comprises the majority of the diagnostic x-ray spectrum.", difficulty: 2 },
  { domain: "equipment", q: "What factors affect the x-ray beam spectrum?", a: "kVp (shifts peak energy and maximum energy), mA (changes number of photons but not spectrum shape), filtration (removes low-energy photons, hardens beam), and target material (affects characteristic radiation energies).", difficulty: 2 },
  { domain: "equipment", q: "What is the line focus principle?", a: "By angling the anode target face, the effective focal spot (projected onto the patient) is smaller than the actual focal spot (area bombarded by electrons). Smaller anode angles produce smaller effective focal spots but limit field coverage.", difficulty: 2 },
  { domain: "equipment", q: "What are the four types of focal spot size definitions?", a: "Nominal: manufacturer's labeled size. Measured: size determined by standard test (pinhole or star pattern). Effective: geometric projection of the actual focal spot onto the image plane. Actual: true area bombarded by electrons on the anode.", difficulty: 3 },
  { domain: "equipment", q: "What are the isoexposure curve values for scatter radiation during fluoroscopy?", a: "Contour values of approximately 20, 100, and 300 mrad/hr at various distances from the patient. Maximum scatter occurs at 120–135° below the table and ~30° above. Minimum scatter at 90° — which is where the operator should stand.", difficulty: 3 },
  { domain: "equipment", q: "What is the minimum source-to-skin distance for fluoroscopy?", a: "Stationary equipment: not less than 12 inches (38 cm), should be 18 inches (45 cm). Mobile C-arm: not less than 12 inches (30 cm). Some references cite 15 inches for mobile.", difficulty: 2 },
  { domain: "equipment", q: "What must the collimator/shutter provide in terms of protection?", a: "The same degree of radiation protection as the x-ray tube housing. Collimators must attenuate the beam to at or below the tube housing leakage limit.", difficulty: 2 },
  { domain: "equipment", q: "What happens when the image receptor (barrier) is removed during fluoroscopy?", a: "X-ray exposure must automatically terminate. This is required by regulation (Section 30307(a)(4)(C)) — an interlock system must prevent exposure when the barrier is not in position.", difficulty: 2 },
  { domain: "equipment", q: "What is the cumulative timer requirement for fluoroscopy?", a: "A cumulative timer must sound an audible signal after 5 minutes of fluoroscopy time. The timer does not shut off the beam — it is a reminder to the operator. The operator must manually reset it.", difficulty: 1 },
  { domain: "equipment", q: "What is the dead-man switch requirement?", a: "Fluoroscopy must require continuous manual activation — the beam stops immediately when the operator releases the switch. Prevents unintended prolonged exposure.", difficulty: 1 },
  { domain: "equipment", q: "What are the differences between single-phase, three-phase, and high-frequency x-ray generators?", a: "Single-phase: 100% voltage ripple, lowest average photon energy. Three-phase (6-pulse): ~13% ripple; (12-pulse): ~4% ripple — higher average energy, more efficient. High-frequency: <1% ripple, nearly constant potential, most efficient output.", difficulty: 3 },

  // ── DIGITAL FLUOROSCOPY (expanded) ────────────────────────────

  { domain: "digital", q: "What is the difference between direct and indirect conversion flat panel detectors?", a: "Direct conversion: amorphous selenium converts x-rays directly to electronic signal (no light intermediary). Indirect conversion: CsI scintillator converts x-rays to light, then amorphous silicon photodiode array converts light to electronic signal. Indirect is more common in fluoroscopy.", difficulty: 2 },
  { domain: "digital", q: "What is Detective Quantum Efficiency (DQE)?", a: "A measure of how efficiently a detector converts x-ray input to a useful image signal. DQE = (SNR²_out / SNR²_in). Flat panel detectors have higher DQE than image intensifiers, meaning better image quality per unit dose.", difficulty: 2 },
  { domain: "digital", q: "What is the difference between Automatic Brightness Control (ABC) and Automatic Gain Control (AGC)?", a: "ABC adjusts x-ray tube output (kVp and/or mA) to maintain consistent exposure at the detector. AGC rapidly varies the gain of the video/electronic system to maintain a bright image on the monitor. ABC controls radiation; AGC controls the displayed image brightness.", difficulty: 2 },
  { domain: "digital", q: "What is image lag in a video camera system?", a: "The percent of video signal remaining after the light source is removed from the photocathode. Causes ghosting/smearing of moving structures. Vidicon cameras exhibit more lag than plumbicon cameras.", difficulty: 2 },
  { domain: "digital", q: "What is flare (veiling glare) in an image intensifier?", a: "Additional scattered and reflected light within the II tube that reduces image contrast. Measured by placing a lead disc equal to 10% of the II input surface diameter in the beam and comparing brightness behind the disc to surrounding brightness.", difficulty: 2 },
  { domain: "digital", q: "What is the conversion factor of an image intensifier, and what happens to it over time?", a: "Conversion factor = output luminance / input exposure rate (cd/m² per mR/s). Typical range: 100–300. It degrades over time as the phosphors and photocathode deteriorate. Declining conversion factor is an indicator the II needs replacement.", difficulty: 2 },
  { domain: "digital", q: "What is the RS-170 video signal standard?", a: "The broadcast standard for composite video signals: 1.0 volt peak-to-peak including synchronization pulses. Used in fluoroscopic TV systems to ensure compatibility between components.", difficulty: 3 },
  { domain: "digital", q: "What are typical exposure values for cine fluorography?", a: "~4 μR/frame for 9-inch mode, ~7 μR/frame for 6-inch mode, ~15 μR/frame for 23-cm mode. Patient entrance exposure for cine can range from 50–150 rads or more — significantly higher than routine fluoroscopy.", difficulty: 3 },
  { domain: "digital", q: "What types of distortion are unique to image intensifiers that FPDs do not have?", a: "Pincushion distortion (geometric magnification from curved input surface), S distortion (from external magnetic/electrical fields deflecting electrons), and vignetting (peripheral brightness fall-off from unequal light collection). FPDs have none of these.", difficulty: 2 },

  // ── RADIATION PROTECTION (expanded) ───────────────────────────

  { domain: "radprotection", q: "How does lead apron attenuation change with kVp?", a: "At 75 kVp: 0.25 mm Pb eliminates 96%, 0.5 mm Pb eliminates 99%. At 100 kVp: 0.25 mm Pb eliminates only 91%, 0.5 mm Pb eliminates 95.3%. Higher kVp = more penetrating photons = reduced apron effectiveness.", difficulty: 2 },
  { domain: "radprotection", q: "What percentage of active bone marrow does a lead apron cover?", a: "Approximately 80%. The remaining ~20% is in the skull, arms, and clavicles (not covered by the apron).", difficulty: 1 },
  { domain: "radprotection", q: "When are protective lead gloves required?", a: "When any part of the hand must be placed within the primary x-ray beam during fluoroscopy. Gloves must be 0.25 mm or 0.5 mm lead equivalent.", difficulty: 1 },
  { domain: "radprotection", q: "How much do 0.25 mm lead-equivalent eye lenses reduce exposure?", a: "85–90% reduction in eye radiation exposure. Required during catheterization, angiographic, and pacemaker insertion procedures where the operator is in close proximity.", difficulty: 2 },
  { domain: "radprotection", q: "What are the three types of radiation the fluoroscopy operator is exposed to?", a: "1) Useful beam (primary — should never strike operator directly). 2) Leakage radiation (from the tube housing). 3) Scatter radiation (from the patient — the dominant source of operator exposure).", difficulty: 1 },
  { domain: "radprotection", q: "Do fluoroscopy rooms require primary barriers?", a: "No — fluoroscopy rooms require only secondary barriers because the useful beam is intercepted by the image receptor. EXCEPTION: combined fluoro-radiographic units require primary barriers for the radiographic mode.", difficulty: 2 },
  { domain: "radprotection", q: "Can scatter radiation travel around corners?", a: "Yes. Radiation can be scattered around corners — a wall is not necessarily a safe shield if there is an open doorway or gap. Room design must account for scatter paths.", difficulty: 1 },
  { domain: "radprotection", q: "Should mechanical holding devices or human hands be used to hold patients during fluoroscopy?", a: "Mechanical holding devices, positioning aids, and similar accessories should always be used whenever possible. Human hand-holding should be a last resort, and the holder must wear protective gloves and apron.", difficulty: 1 },
  { domain: "radprotection", q: "How should protective lead aprons be stored?", a: "Always on proper hangers — never folded or draped over surfaces. Folding causes cracks in the lead material which compromise shielding effectiveness. Proper storage also makes aprons easier to put on.", difficulty: 1 },
  { domain: "radprotection", q: "What is the thyroid shield requirement during fluoroscopy?", a: "Thyroid shields (0.25 mm or 0.5 mm Pb) should be worn when the operator is in close proximity to the patient during fluoroscopy. The thyroid is one of the most radiosensitive organs.", difficulty: 1 },

  // ── DOSE LIMITS & CALIFORNIA REGULATIONS (expanded) ───────────

  { domain: "doselimits", q: "What is the occupational dose limit for the skin and extremities?", a: "500 mSv/year (50 rem/year).", difficulty: 1 },
  { domain: "doselimits", q: "What is the occupational dose limit for the lens of the eye?", a: "150 mSv/year (15 rem/year), measured at tissue depth of 0.3 cm (300 mg/cm²).", difficulty: 1 },
  { domain: "doselimits", q: "What is the public dose limit per hour?", a: "0.02 mSv (2 mrem) in any one hour. Annual public limit is 1 mSv (100 mrem).", difficulty: 2 },
  { domain: "doselimits", q: "What defines a 'declared pregnant woman' under radiation regulations?", a: "A woman who has voluntarily informed her employer IN WRITING of her pregnancy AND provided the estimated date of conception. The declaration must be voluntary — no employer can require it.", difficulty: 2 },
  { domain: "doselimits", q: "If the fetal dose is already at 0.5 rem when pregnancy is declared, what is the additional limit?", a: "0.05 rem (0.5 mSv) for the remainder of the pregnancy. This ensures the dose does not increase substantially once the pregnancy is known.", difficulty: 3 },
  { domain: "doselimits", q: "What does 'uniform monthly exposure rate' mean for pregnant workers?", a: "The regulation requires that the dose to the embryo/fetus be delivered at a roughly uniform rate — avoid substantial variations above ~0.05 rem/month. No large single exposures even if the total would be under 0.5 rem.", difficulty: 3 },
  { domain: "doselimits", q: "At what tissue depth is the deep-dose equivalent measured?", a: "1 cm (1,000 mg/cm²). This represents whole-body dose for occupational monitoring.", difficulty: 2 },
  { domain: "doselimits", q: "What are the California x-ray machine registration requirements?", a: "Must register within 30 days of acquisition. Registration renewed during July of every even-numbered year. Changes must be reported within 30 days. The vendor must inform the receiver of the registration requirement.", difficulty: 2 },
  { domain: "doselimits", q: "What is the penalty for violating California radiation regulations?", a: "A misdemeanor under Section 115215(a) of the Health and Safety Code.", difficulty: 1 },
  { domain: "doselimits", q: "What must be posted in an x-ray facility in California?", a: "'CAUTION — X-RAY' signs at each entrance. Current radiation control regulations posted conspicuously. Form RH-2364 (Notice to Employees) posted where it can be read by employees.", difficulty: 2 },
  { domain: "doselimits", q: "Is deliberate x-ray exposure of humans for training or demonstration purposes permitted?", a: "No. Section 30305(b)(4) prohibits deliberate exposure of any individual for training or demonstration purposes without a physician's prescription for a medically indicated exam.", difficulty: 1 },
  { domain: "doselimits", q: "Does occupational dose include the worker's own medical/dental x-ray exposure?", a: "No. Radiation received for the operator's own medical or dental diagnosis/therapy is NOT counted as occupational exposure. The operator must remove their monitoring badge before personal medical procedures.", difficulty: 2 },
  { domain: "doselimits", q: "What are the requirements for high-level (boost) fluoroscopy control?", a: "May produce up to 20 R/min (or 10 R/min with AEC). Requires: (1) continuous manual activation by the fluoroscopist, AND (2) a continuous audible signal during high-level operation. Must be a separate, distinct activation from routine mode.", difficulty: 2 },
  { domain: "doselimits", q: "What overexposure must be reported to California's Radiologic Health Branch (RHB)?", a: "Any dosimeter reading indicating exposure in excess of the applicable regulatory limits. Most overexposures result from poor working practices, not equipment failure.", difficulty: 2 },
  { domain: "doselimits", q: "What are the two broad responsibilities of the x-ray supervisor regarding radiation protection?", a: "(1) Take all precautions necessary for adequate protection of patients, operators, and others. (2) Responsible for maintaining properly functioning equipment, operator performance, and use of only State-authorized operators.", difficulty: 2 },
  { domain: "doselimits", q: "Which persons must be monitored regardless of expected exposure level?", a: "(1) Any person entering a high radiation area. (2) Any person operating mobile x-ray equipment (Section 30309(b)(3)). These categories require monitoring even if expected dose is low.", difficulty: 2 },
  { domain: "doselimits", q: "What must the radiation protection program include under Section 20.1101?", a: "Each supervisor shall develop, document, and implement a radiation protection program commensurate with the scope of activities. The program must be reviewed at least annually to ensure compliance and ALARA goals are met.", difficulty: 2 },
  { domain: "doselimits", q: "What is California's gonad shielding lead equivalence requirement?", a: "0.5 mm lead equivalent — stricter than the federal recommendation of 0.25 mm. Must be used when the gonads are within or near the primary beam and shielding will not interfere with the exam.", difficulty: 2 },

  // ── RADIATION BIOLOGY (expanded) ──────────────────────────────

  { domain: "radbio", q: "What is 'cellular amplification' of radiation damage?", a: "Initial radiation damage involves only a very small percentage of molecules. Normal cellular metabolic processes amplify this damage from molecular level → microscopic level → gross cellular malfunction. The cell's own machinery magnifies the initial insult.", difficulty: 2 },
  { domain: "radbio", q: "How does dose rate affect genetic damage from radiation?", a: "A given dose is LESS effective in producing genetic damage if it is protracted or fractionated over a long period. Cells have time for DNA repair between exposures. This is why chronic low-dose exposure is less harmful than the same total dose delivered acutely.", difficulty: 2 },
  { domain: "radbio", q: "What are the gross cellular effects of radiation? (list at least 5)", a: "Chromosome breaks, clumping of chromatin, formation of giant cells/abnormal mitoses, increased granularity of cytoplasm, nuclear disintegration, changes in motility/cytoplasmic activity, vacuolization, altered protoplasmic viscosity, changes in membrane permeability.", difficulty: 3 },
  { domain: "radbio", q: "What is the latent period in radiation biology, and what are the two categories?", a: "Time between radiation exposure and first detectable effects. Short-term effects: appear in minutes to weeks (erythema, nausea, hematologic changes). Long-term effects: appear in years to decades to generations (cancer, genetic effects, cataracts).", difficulty: 2 },
  { domain: "radbio", q: "Name four historical groups that provided evidence for radiation carcinogenesis.", a: "(1) Early radiologists/dentists — skin malignancies, leukemia. (2) Radium dial painters — bone malignancies. (3) Uranium miners — lung cancer. (4) Hiroshima/Nagasaki survivors — leukemia and other neoplasms.", difficulty: 2 },
  { domain: "radbio", q: "What are the most frequently occurring radiation-induced cancers, in rank order?", a: "Female breast, thyroid (especially women/children), hemopoietic tissue (leukemia), lungs, GI tract, bones.", difficulty: 2 },
  { domain: "radbio", q: "What is radiation-induced life-span shortening?", a: "Observed in animal experiments: irradiated animals die from the same diseases as non-irradiated controls but at an earlier age. The effect appears as premature aging. Demonstrated in animals; data for humans comes from A-bomb survivors.", difficulty: 2 },
  { domain: "radbio", q: "Is radiation-induced mitotic delay reversible?", a: "Usually yes. Mitotic delay (temporary halt in cell division after irradiation) is generally reversible — cells resume division after a delay proportional to dose. This is distinct from permanent mitotic inhibition at very high doses.", difficulty: 2 },
  { domain: "radbio", q: "What three factors influence biological effects from radiation following the LNT model?", a: "(1) Dose rate — lower rates allow more repair. (2) Total dose — higher total dose = greater effect. (3) Type of cell irradiated — radiosensitivity varies enormously (lymphocytes vs. neurons).", difficulty: 2 },
  { domain: "radbio", q: "Why is DNA the critical target of radiation damage in cells?", a: "DNA constitutes the cell's operational program: it controls all enzyme synthesis, is replicated during mitosis, and mutations can alter or eliminate essential protein production. Damage to other molecules is usually repairable; DNA damage can be permanent and heritable.", difficulty: 2 },

  // ── SKIN EFFECTS & FETAL DOSE (expanded) ──────────────────────

  { domain: "skineffects", q: "What are the detailed skin dose thresholds including 6 Gy, 7 Gy, and 10 Gy?", a: "2 Gy: early transient erythema. 6 Gy: temporary epilation (hair loss). 7 Gy: permanent erythema. 10 Gy: moist desquamation, dermal necrosis possible. >15 Gy: deep ulceration, vascular damage, may require surgical grafting.", difficulty: 3 },
  { domain: "skineffects", q: "What dose to the fetus could result in spontaneous abortion?", a: "Approximately 50 rads (0.5 Gy) during early pregnancy. During the pre-implantation period (0–2 weeks), this follows the 'all-or-none' rule — the embryo either survives normally or is aborted.", difficulty: 2 },
  { domain: "skineffects", q: "At what dose have deleterious effects been demonstrated in animal embryo experiments?", a: "As little as 10 rads (0.1 Gy). Effects increase significantly at 15+ rads. This is well below the human fetal dose limit of 0.5 rem (5 mSv) total pregnancy.", difficulty: 2 },
  { domain: "skineffects", q: "What are the 10-day rule and 14-day rule for scheduling x-ray exams on women of childbearing age?", a: "10-day rule (ICRP): schedule abdominal x-rays within 10 days after onset of menses (when pregnancy is unlikely). 14-day rule (NCRP): similar but allows 14 days. Current recommendation: properly indicated exams need not be postponed regardless of menstrual timing, but ask about pregnancy status.", difficulty: 2 },
  { domain: "skineffects", q: "Is interruption of pregnancy ever justified due to diagnostic x-ray exposure?", a: "No. The exposure levels from diagnostic radiology are far below the threshold for deterministic fetal effects. Termination of pregnancy is never justified on the basis of diagnostic x-ray exposure alone.", difficulty: 1 },
  { domain: "skineffects", q: "What are the specific radiation effects on the gonads?", a: "Male: spermatogonia drastically depleted by ~50 rads; temporary sterility at ~30 rads (spermatogonia can regenerate so sterility is temporary). Female: oocytes cannot be replaced — ovarian damage from radiation is permanent and irreversible.", difficulty: 2 },
  { domain: "skineffects", q: "What dose threshold causes radiation-induced cataracts?", a: "Approximately several hundred rads (750 mGy or more) of acute dose for x-rays in the diagnostic range. Cataracts are the ONLY disease directly linked to long-term low-level radiation exposure as a deterministic effect.", difficulty: 2 },
  { domain: "skineffects", q: "What are the specific fetal effects during organogenesis (weeks 3–8)?", a: "Morphological defects and congenital malformations — birth defects of organ systems forming at the time of exposure. This is the period of maximum sensitivity to teratogenic effects (structural abnormalities).", difficulty: 2 },
  { domain: "skineffects", q: "What are the specific fetal effects during the fetal growth period (9 weeks to birth)?", a: "CNS effects: microcephaly (small head), intellectual disability/mental retardation, impaired learning patterns. Also: growth retardation, reduced birth weight. The brain is the most sensitive organ during this period.", difficulty: 2 },

  // ── QA & IMAGE QUALITY (expanded) ─────────────────────────────

  { domain: "qa", q: "What are the four major steps of a QA program?", a: "(1) Acceptance testing of new/modified equipment. (2) Establishment of baseline performance levels. (3) Diagnosis of changes before they become fluoroscopically apparent. (4) Verification that deterioration has been corrected.", difficulty: 2 },
  { domain: "qa", q: "What QC tests are performed DAILY on fluoroscopy equipment?", a: "Brightness/contrast optimization, verification of protective devices (lead curtains, panel, Bucky slot cover), fluoroscopic tower locks and barrier interlocks, compression device inspection, and automatic collimation check.", difficulty: 2 },
  { domain: "qa", q: "What QC tests are performed SEMI-ANNUALLY on fluoroscopy equipment?", a: "Shutters, ABC tracking, AGC, high contrast resolution, low contrast resolution, 5-minute cumulative timer, fluoroscopic beam size, filtration/HVL, minimum source-to-tabletop distance, kVp accuracy, patient exposure rate, maximum exposure rate, lead apron/glove integrity, and distortion.", difficulty: 3 },
  { domain: "qa", q: "How often must a qualified physicist review fluoroscopy equipment in California?", a: "Annually for equipment with automatic exposure control. Every 3 years (triennially) for equipment without automatic exposure control.", difficulty: 2 },
  { domain: "qa", q: "What output rate increase triggers an investigation?", a: "A 25% increase over the calibrated output rate requires investigation and correction. If the calibrated output exceeds 4.0 R/min, testing must confirm the 5 R/min regulatory ceiling is not exceeded.", difficulty: 2 },
  { domain: "qa", q: "What is the difference between high contrast resolution and low contrast resolution testing?", a: "High contrast resolution: tests ability to reproduce thin lines/spaces using copper mesh or resolution patterns (at 50–60 kVp). Measures spatial detail. Low contrast resolution: tests ability to resolve large objects that differ slightly in radiopacity using aluminum plates with drilled holes. Measures tissue differentiation ability.", difficulty: 2 },
  { domain: "qa", q: "What factors affect spatial resolution in fluoroscopy? (list at least 4)", a: "Focal spot size, imaging geometry (magnification, source-to-image distance), optical coupling system, image intensifier characteristics, video camera properties, TV monitor resolution, and patient motion.", difficulty: 2 },
  { domain: "qa", q: "What QC tests must be performed after repair or replacement of a major component?", a: "Collimation, ABC, AGC, resolution, phototimer, timer, mAs, kVp, dose rates, focal spot, and HVL must ALL be tested before the equipment is used on human patients.", difficulty: 2 },
  { domain: "qa", q: "What is the kVp accuracy tolerance?", a: "+/- 5% of the set value (or +/- 2 kVp in the 60–100 kVp range, whichever is greater).", difficulty: 2 },
  { domain: "qa", q: "What is the acceptance criterion for mAs linearity?", a: "Ratios of exposure to mAs at any two consecutive tube current settings shall not differ by more than 0.10 times their sum. Ensures consistent output across mA stations.", difficulty: 3 },
  { domain: "qa", q: "What is the exposure reproducibility tolerance?", a: "+/- 5% coefficient of variation. The phototimer consistency must also be within +/- 5%.", difficulty: 2 },
  { domain: "qa", q: "What are typical fluoroscopic exposure rates by II mode?", a: "6-inch mode with grid: 2–3 R/min. 9-inch mode without grid: 1.5–2.5 R/min. ABC typically set at 80–90 kVp. Systems with a grid produce 1.5–2× higher rates. Room-to-room differences >25% should be investigated.", difficulty: 3 },
  { domain: "qa", q: "List the minimum QC test equipment that should be in a QA program.", a: "Penetrometer (aluminum step wedge), homogeneous phantom, stopwatch, densitometer, sensitometer, wire mesh contact test tool, thermometer (no mercury or alcohol allowed), calibrated dosimeter, and aluminum filters for HVL testing.", difficulty: 3 },
  { domain: "qa", q: "What are the dose reduction methods and their approximate reduction factors?", a: "QA program: 2.0×. Proper processing: 1.1–1.3×. Acoustic signal (5-min timer): 1.3×. Variable aperture iris/collimation: 3.0×. High/low dose switches: 1.5×. Beam collimation: 1.5–3.0×. Rare earth screens: 2.0–4.0×. Gonad shielding: up to 100×.", difficulty: 3 },
  { domain: "qa", q: "How long must QA records be retained? What about film processor records?", a: "QA records: minimum 3 years. Film processor control charts and maintenance logs: minimum 1 year.", difficulty: 1 },

  // ── CROSS-CUTTING / VISUAL PHYSIOLOGY / MONITORING ────────────

  { domain: "equipment", q: "What is the difference between rods and cones in visual physiology, and why does it matter for fluoroscopy?", a: "Rods: scotopic (dim light) vision, peripheral, detect gray tones only. Cones: photopic (bright light) vision, central/fovea, detect color and fine detail. Photopic acuity is 10× greater than scotopic. Modern image-intensified fluoroscopy uses photopic (cone) vision because the monitor is bright. Room lighting should be dim but not dark.", difficulty: 2 },
  { domain: "equipment", q: "What is the image integration time of the human eye?", a: "0.2 seconds. Prolonged observation of a dim fluoroscopic image will NOT improve perceived brightness or detail. If the image is too dim, the only solution is to increase exposure or use image intensification.", difficulty: 2 },
  { domain: "equipment", q: "What is the optimal viewing distance for a fluoroscopic monitor?", a: "12–15 inches (30–38 cm) for conventional monitors. This distance optimizes the eye's ability to resolve image detail.", difficulty: 1 },
  { domain: "radprotection", q: "What are the three types of personnel monitoring devices and how do their accuracies compare?", a: "Film badge: sensitive 10 mrad – 700 rads, accuracy +/- 25%, provides permanent record on developed film. TLD (thermoluminescent dosimeter): accuracy +/- 9%, reusable, better low-dose sensitivity. Pocket ionization chamber (dosimeter): immediate readout, limited range, no permanent record. TLD is the most accurate.", difficulty: 2 },
  { domain: "radprotection", q: "What is the quality factor (Q) for diagnostic x-rays, and what does it mean?", a: "Q = 1 for x-rays, gamma rays, and beta radiation. This means 1 rad = 1 rem for diagnostic x-rays (rem = rad × Q). Quality factor accounts for the relative biological effectiveness of different radiation types. Neutrons and alpha particles have higher Q values.", difficulty: 2 },
  { domain: "radprotection", q: "What are the three types of gonad shields?", a: "Flat contact shield: placed directly on patient, simple but may not conform well. Shaped contact shield: molded to anatomy, acceptable for some fluoroscopic procedures. Shadow shield: suspended from the tube housing, casts a 'shadow' over gonads. For fluoroscopy, only shaped contact shields are practical; flat and shadow types are generally not suitable.", difficulty: 2 },
  { domain: "radprotection", q: "Which diagnostic x-ray examinations produce the highest bone marrow doses?", a: "Barium enema, upper GI series, and abdominal angiography produce the highest bone marrow doses. Bone marrow dose is the most reasonable somatic dose indicator because marrow is widely distributed and highly radiosensitive.", difficulty: 2 },
  { domain: "radprotection", q: "Calculate: A fluoroscopist stands at 100 mrad/hr for 42 minutes. What is the total exposure?", a: "100 mrad/hr × (42/60 hr) = 100 × 0.7 = 70 mrad. Always convert minutes to hours when the rate is given in per-hour units. (Note: some references may round differently.)", difficulty: 2 },
  { domain: "doselimits", q: "What certification should a personnel monitoring service have?", a: "NVLAP (National Voluntary Laboratory Accreditation Program, run by NIST) and/or NSF Standard No. 16 certification. These ensure the monitoring service meets accuracy and quality standards.", difficulty: 2 },
];

// ── 30-DAY PROTOCOL PHASES ──────────────────────────────────
const PHASES = [
  {
    name: "Foundation",
    days: "1–7",
    dayRange: [1, 7],
    color: "#3B82F6",
    goal: "Build mental scaffolding for all 7 domains",
    protocol: [
      "20 min moderate exercise → start studying within 30 min (primes BDNF for memory)",
      "Tap 📖 Read above to go through today's domain material section by section",
      "After each section: lock your phone, write down everything you remember on paper (brain dump)",
      "Pick 2–3 'anchor concepts' from today's reading — the key ideas everything else connects to",
      "Tap ⚡ Quiz above to test yourself on today's domain (142 questions across all domains) — just get familiar, don't stress",
      "Before bed: open 📖 Read, skim just the section titles for today's domain — mentally recall what each one covered without expanding them",
    ],
    dailySchedule: [
      { day: 1, focus: "Equipment & Physics — Image Intensifiers", domains: ["equipment"] },
      { day: 2, focus: "Equipment & Physics — Flat Panel Detectors", domains: ["equipment"] },
      { day: 3, focus: "Digital Fluoroscopy — All topics", domains: ["digital"] },
      { day: 4, focus: "Radiation Protection — ALARA, shielding, PKA", domains: ["radprotection"] },
      { day: 5, focus: "Dose Limits & Regulations", domains: ["doselimits"] },
      { day: 6, focus: "Radiation Biology — All topics", domains: ["radbio", "skineffects"] },
      { day: 7, focus: "QA + Image Quality + FULL domain review", domains: ["qa"] },
    ],
  },
  {
    name: "Interleave & Retrieve",
    days: "8–16",
    dayRange: [8, 16],
    color: "#8B5CF6",
    goal: "Force discrimination between related concepts via interleaved retrieval",
    protocol: [
      "20 min moderate exercise → start studying within 30 min (primes BDNF for memory)",
      "Tap 📖 Read for each of today's domains — cycle through 3 domains in 25-min blocks",
      "After reading each domain: lock your phone, brain dump what you remember on paper, then tap ⚡ Quiz to test yourself",
      "Tap 🔀 Confusable Pairs — this phase is where discrimination between similar concepts matters most",
      "For every quiz answer, ask yourself 'WHY does this make sense?' before moving on",
      "End each session with 🔢 Number Drill — rapid-fire recall of dose limits and thresholds",
      "Sleep TMR (optional): play the same background sound each time you study a domain, then replay it while you sleep — try mynoise.net/NoiseMachines/whiteNoiseGenerator.php for free ambient sounds",
    ],
    dailySchedule: [
      { day: 8, focus: "Equipment + Dose Limits + Skin Effects", domains: ["equipment", "doselimits", "skineffects"] },
      { day: 9, focus: "Digital + Rad Protection + QA", domains: ["digital", "radprotection", "qa"] },
      { day: 10, focus: "Rad Biology + Equipment + Dose Limits", domains: ["radbio", "equipment", "doselimits"] },
      { day: 11, focus: "Rad Protection + Skin Effects + Digital", domains: ["radprotection", "skineffects", "digital"] },
      { day: 12, focus: "QA + Rad Biology + Equipment", domains: ["qa", "radbio", "equipment"] },
      { day: 13, focus: "Dose Limits + Digital + Rad Protection", domains: ["doselimits", "digital", "radprotection"] },
      { day: 14, focus: "TEST REVIEW #1A — First 500 questions (timed)", domains: ["equipment", "radprotection", "doselimits"] },
      { day: 15, focus: "Skin Effects + Equipment + QA", domains: ["skineffects", "equipment", "qa"] },
      { day: 16, focus: "TEST REVIEW #1A — Questions 500–1000 (timed)", domains: ["radbio", "digital", "skineffects"] },
    ],
  },
  {
    name: "Deep Encode",
    days: "17–24",
    dayRange: [17, 24],
    color: "#EF4444",
    goal: "Attack weak spots, encode critical numbers, practice under test conditions",
    protocol: [
      "20 min moderate exercise → start studying within 30 min",
      "Start each session with 🔢 Number Drill — run through all critical values before anything else",
      "Tap ⚡ Quiz for today's domains — answer in random order, focus on weak spots",
      "For every wrong answer: ask 'WHY?' + sketch a quick visual mnemonic on paper",
      "Teach-back: pick 3 concepts and explain them aloud as if teaching a colleague",
      "Dual coding: on paper, draw diagrams from memory (II cross-section, FPD schematic, dose thresholds) then check against 📖 Read",
      "Sleep TMR continues (optional): replay the same ambient sound from your study sessions while sleeping",
    ],
    dailySchedule: [
      { day: 17, focus: "TEST REVIEW — Questions 1000–1500 + weak domain drill", domains: ["equipment", "radprotection"] },
      { day: 18, focus: "Critical numbers deep drill + teach-back", domains: ["doselimits", "skineffects", "radprotection"] },
      { day: 19, focus: "TEST REVIEW — Questions 1500–2000 + diagram practice", domains: ["digital", "equipment", "qa"] },
      { day: 20, focus: "Full interleaved retrieval — all 7 domains", domains: ["equipment", "digital", "radprotection", "doselimits", "radbio", "skineffects", "qa"] },
      { day: 21, focus: "Mock exam simulation (timed, full-length)", domains: ["equipment", "digital", "radprotection", "doselimits", "radbio", "skineffects", "qa"] },
      { day: 22, focus: "Post-mock analysis: weak spots identified → targeted drill", domains: ["radprotection", "doselimits"] },
      { day: 23, focus: "Calculation practice: PKA, dose per pulse, fetal dose, brightness gain", domains: ["radprotection", "equipment", "skineffects"] },
      { day: 24, focus: "Mock exam #2 + error analysis", domains: ["equipment", "digital", "radprotection", "doselimits", "radbio", "skineffects", "qa"] },
    ],
  },
  {
    name: "Consolidate & Peak",
    days: "25–30",
    dayRange: [25, 30],
    color: "#10B981",
    goal: "Consolidate, reduce anxiety, peak on exam day",
    protocol: [
      "Exercise continues but REDUCE study volume — you're tapering now",
      "Day 25–28: 2 focused sessions per day, tap ⚡ Quiz on weak domains only",
      "Quick 🔢 Number Drill each day — keep the critical values sharp",
      "Day 29: Light review only — skim 📖 Read for anchor concepts, quick Number Drill, then STOP",
      "Day 30: Exam day — morning exercise, 30-min anchor concept review, then go crush it",
      "NO new material after Day 27",
      "Sleep 8+ hours — confidence comes from what you KNOW, not last-minute cramming",
    ],
    dailySchedule: [
      { day: 25, focus: "Weak spots only — targeted retrieval practice", domains: ["radprotection", "doselimits"] },
      { day: 26, focus: "Critical numbers final drill + teach-back", domains: ["doselimits", "skineffects", "radprotection"] },
      { day: 27, focus: "Final mock exam (short) + last new-info cutoff", domains: ["equipment", "digital", "radprotection", "doselimits", "radbio", "skineffects", "qa"] },
      { day: 28, focus: "Light review — anchor concepts + diagrams only", domains: ["equipment", "radprotection"] },
      { day: 29, focus: "REST DAY — Light anchor review only, then stop studying", domains: [] },
      { day: 30, focus: "EXAM DAY — Morning exercise, 30-min anchor review, go crush it", domains: [] },
    ],
  },
];

// ── CONFUSABLE PAIRS (high-value interleaving targets) ──────
const CONFUSABLE_PAIRS = [
  { pair: ["Minification gain", "Flux gain"], why: "Both are components of brightness gain but measure different things. Minification = area ratio. Flux = photon ratio." },
  { pair: ["PKA (Gy·cm²)", "Air Kerma (Gy)"], why: "PKA includes field size (stochastic risk). Air kerma alone tells you intensity but not volume irradiated. PKA is constant along beam axis; kerma is not." },
  { pair: ["Deterministic effects", "Stochastic effects"], why: "Deterministic: threshold dose, severity increases with dose (skin burns, cataracts). Stochastic: no threshold, probability increases with dose (cancer, genetic)." },
  { pair: ["Direct ionizing radiation", "Indirect ionizing radiation"], why: "Direct: primary beam. Indirect: secondary radiation (Compton/photoelectric). But indirect ionizing radiation causes direct DNA damage." },
  { pair: ["5 R/min", "10 R/min", "20 R/min"], why: "5 R/min: routine without auto. 10 R/min: routine with auto. 20 R/min: high-level/boost mode maximum." },
  { pair: ["Radiation area", "High radiation area"], why: "Radiation: 0.05 mSv/hr at 30 cm. High: 1 mSv/hr at 30 cm. Factor of 20× difference." },
  { pair: ["Image intensifier distortions", "FPD advantages"], why: "II has pincushion, S distortion, vignetting. FPD has NO spatial distortion but has ghosting, same resolution all FOVs." },
  { pair: ["Fetal monthly limit", "Fetal total limit"], why: "Monthly: 0.5 mSv. Total pregnancy: 5 mSv. Factor of 10×." },
  { pair: ["Somatic effects", "Genetic effects"], why: "Somatic: damage to the individual (skin, cancer, cataracts). Genetic: damage to germ cells passed to offspring." },
  { pair: ["Temporary sterility dose", "Fetal damage threshold"], why: "Temp sterility: 30 rads to spermatogonia. Fetal damage threshold: ≥10 rads (with particular increase ≥15 rads)." },
  { pair: ["ABC (Automatic Brightness Control)", "AGC (Automatic Gain Control)"], why: "ABC adjusts x-ray output (kVp/mA) — controls radiation dose. AGC adjusts video system electronic gain — controls displayed image brightness. Both maintain a 'bright' image but through completely different mechanisms." },
  { pair: ["Direct conversion FPD", "Indirect conversion FPD"], why: "Direct: amorphous selenium converts x-rays directly to charge (no light step). Indirect: CsI scintillator → light → amorphous silicon photodiode → charge. Indirect is more common in fluoroscopy." },
  { pair: ["Photoelectric effect", "Compton scattering"], why: "Photoelectric: complete absorption of photon, dominates at low energies/high Z. Compton: partial absorption + scattered photon, dominates at diagnostic energies in soft tissue. Photoelectric produces NO scatter; Compton is the main source of scatter." },
  { pair: ["Film badge accuracy (±25%)", "TLD accuracy (±9%)"], why: "TLD is 3× more accurate. Film badge provides a permanent physical record. TLD is reusable. Both measure accumulated dose over time; pocket dosimeter gives immediate readout." },
  { pair: ["Characteristic radiation", "Bremsstrahlung radiation"], why: "Characteristic: discrete energies from electron shell transitions. Bremsstrahlung: continuous spectrum from electron deceleration near nuclei. Bremsstrahlung makes up the majority of the diagnostic x-ray beam." },
  { pair: ["High contrast resolution", "Low contrast resolution"], why: "High contrast: thin lines/spaces, copper mesh test, measures spatial detail. Low contrast: large objects with slight density differences, aluminum plate test, measures tissue differentiation. Different tests, different clinical meaning." },
  { pair: ["Deep-dose equivalent (1 cm)", "Eye dose equivalent (0.3 cm)"], why: "Deep dose measured at 1 cm tissue depth for whole-body. Eye dose at 0.3 cm for lens of eye. Different depths because the lens is more superficial. Limits are different: 50 mSv/yr whole body vs 150 mSv/yr eye." },
  { pair: ["CA gonad shielding (0.5 mm Pb)", "Federal gonad shielding (0.25 mm Pb)"], why: "California requires 0.5 mm lead equivalent — double the federal minimum of 0.25 mm. A California-specific regulation that is a common exam question." },
  { pair: ["10-day rule", "14-day rule"], why: "Both relate to scheduling x-rays for women of childbearing age. 10-day (ICRP): exam within 10 days of menses onset. 14-day (NCRP): within 14 days. Current practice: properly indicated exams need not be postponed, but always ask about pregnancy." },
  { pair: ["QA records (3 years)", "Film processor records (1 year)"], why: "QA equipment records must be kept 3 years minimum. Film processor control charts/logs only 1 year. Different retention periods for different types of quality records." },
];

// ── MAIN APP COMPONENT ──────────────────────────────────────
export default function FluoroStudyDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("fluoro_darkMode") === "true"; } catch { return false; }
  });
  const t = darkMode ? THEMES.dark : THEMES.light;

  const [view, setView] = useState("protocol");
  const [currentDay, setCurrentDay] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem("fluoro_currentDay"));
      return typeof v === "number" && v >= 1 && v <= 30 ? v : 1;
    } catch { return 1; }
  });
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem("fluoro_completedDays"));
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch { return {}; }
  });
  const [quizMode, setQuizMode] = useState(false);
  const [quizDomain, setQuizDomain] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizResults, setQuizResults] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem("fluoro_quizResults"));
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch { return {}; }
  });
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [readDomain, setReadDomain] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [numberDrillMode, setNumberDrillMode] = useState(false);
  const [numberDrillIndex, setNumberDrillIndex] = useState(0);
  const [showNumberAnswer, setShowNumberAnswer] = useState(false);

  // RSVP speed reader state
  const [rsvpActive, setRsvpActive] = useState(false);
  const [rsvpWords, setRsvpWords] = useState([]);
  const [rsvpIndex, setRsvpIndex] = useState(0);
  const [rsvpPlaying, setRsvpPlaying] = useState(false);
  const [rsvpWpm, setRsvpWpm] = useState(() => {
    try {
      const v = parseInt(localStorage.getItem("fluoro_rsvpWpm"));
      return !isNaN(v) && v >= 100 && v <= 800 ? v : 300;
    } catch { return 300; }
  });
  const [rsvpChunk, setRsvpChunk] = useState(() => {
    try {
      const v = parseInt(localStorage.getItem("fluoro_rsvpChunk"));
      return v === 1 || v === 2 || v === 3 ? v : 1;
    } catch { return 1; }
  });
  const [rsvpTitle, setRsvpTitle] = useState("");
  const rsvpTimer = useRef(null);

  // Persist state to localStorage
  useEffect(() => { localStorage.setItem("fluoro_completedDays", JSON.stringify(completedDays)); }, [completedDays]);
  useEffect(() => { localStorage.setItem("fluoro_quizResults", JSON.stringify(quizResults)); }, [quizResults]);
  useEffect(() => { localStorage.setItem("fluoro_currentDay", JSON.stringify(currentDay)); }, [currentDay]);
  useEffect(() => {
    localStorage.setItem("fluoro_darkMode", String(darkMode));
    document.body.style.background = darkMode ? "#0F172A" : "#FFFFFF";
  }, [darkMode]);
  useEffect(() => { localStorage.setItem("fluoro_rsvpWpm", String(rsvpWpm)); }, [rsvpWpm]);
  useEffect(() => { localStorage.setItem("fluoro_rsvpChunk", String(rsvpChunk)); }, [rsvpChunk]);

  // RSVP timer logic
  useEffect(() => {
    if (rsvpPlaying && rsvpActive && rsvpIndex < rsvpWords.length) {
      const msPerWord = 60000 / rsvpWpm;
      rsvpTimer.current = setTimeout(() => {
        setRsvpIndex(prev => {
          const next = prev + rsvpChunk;
          if (next >= rsvpWords.length) {
            setRsvpPlaying(false);
            return rsvpWords.length - 1;
          }
          return next;
        });
      }, msPerWord * rsvpChunk);
    }
    return () => { if (rsvpTimer.current) clearTimeout(rsvpTimer.current); };
  }, [rsvpPlaying, rsvpActive, rsvpIndex, rsvpWpm, rsvpChunk, rsvpWords.length]);

  const launchRsvp = (text, title) => {
    // Strip markdown bold markers and split into words
    const clean = text.replace(/\*\*/g, "").replace(/\n+/g, " ").trim();
    const words = clean.split(/\s+/).filter(w => w.length > 0);
    setRsvpWords(words);
    setRsvpIndex(0);
    setRsvpPlaying(false);
    setRsvpTitle(title);
    setRsvpActive(true);
  };

  const closeRsvp = () => {
    setRsvpActive(false);
    setRsvpPlaying(false);
    setRsvpIndex(0);
    setRsvpWords([]);
    if (rsvpTimer.current) clearTimeout(rsvpTimer.current);
  };

  // Get all critical numbers for drill mode (memoized to avoid re-shuffle on every render)
  const allNumbers = DOMAINS.flatMap(d => d.keyNumbers.map(n => ({ domain: d.name, color: d.color, number: n })));
  const [shuffledNumbers] = useState(() => [...allNumbers].sort(() => 0.5 - Math.random()));

  const getPhaseForDay = (day) => PHASES.find(p => day >= p.dayRange[0] && day <= p.dayRange[1]);
  const getDaySchedule = (day) => {
    for (const phase of PHASES) {
      const found = phase.dailySchedule.find(d => d.day === day);
      if (found) return { ...found, phase: phase.name };
    }
    return null;
  };

  const toggleDay = (day) => {
    setCompletedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const filteredQuestions = quizDomain
    ? QUESTIONS.filter(q => q.domain === quizDomain)
    : [...QUESTIONS].sort(() => 0.5 - Math.random());

  const markQuiz = (correct) => {
    const q = filteredQuestions[quizIndex];
    setQuizResults(prev => ({
      ...prev,
      [q.domain]: {
        ...(prev[q.domain] || { correct: 0, wrong: 0 }),
        correct: (prev[q.domain]?.correct || 0) + (correct ? 1 : 0),
        wrong: (prev[q.domain]?.wrong || 0) + (correct ? 0 : 1),
      }
    }));
    setShowAnswer(false);
    setQuizIndex(prev => Math.min(prev + 1, filteredQuestions.length - 1));
  };

  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const totalDays = 30;
  const progressPct = Math.round((completedCount / totalDays) * 100);

  // ── VIEWS ──────────────────────────────────────────────────

  const renderNav = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
      {[
        { id: "protocol", label: "📅 Protocol" },
        { id: "read", label: "📖 Read" },
        { id: "domains", label: "🧠 Topics" },
        { id: "quiz", label: "⚡ Quiz" },
        { id: "numbers", label: "🔢 Numbers" },
        { id: "confusables", label: "🔀 Pairs" },
        { id: "calendar", label: "📊 Progress" },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => { setView(tab.id); setQuizMode(false); setNumberDrillMode(false); }}
          style={{
            padding: "12px 8px",
            borderRadius: 10,
            border: view === tab.id ? "2px solid #3B82F6" : `1px solid ${t.border}`,
            background: view === tab.id ? t.cardActive : t.card,
            color: view === tab.id ? "#3B82F6" : t.muted,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: view === tab.id ? 600 : 400,
            textAlign: "center",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const goToRead = (domainId) => {
    setView("read");
    setReadDomain(domainId);
    setExpandedSection(null);
  };
  const goToQuiz = (domainId) => {
    setView("quiz");
    setQuizDomain(domainId);
    setQuizIndex(0);
    setShowAnswer(false);
  };
  const goToNumbers = () => {
    setView("numbers");
    setNumberDrillMode(false);
    setNumberDrillIndex(0);
    setShowNumberAnswer(false);
  };
  const goToConfusables = () => {
    setView("confusables");
  };

  const renderProtocol = () => {
    const schedule = getDaySchedule(currentDay);
    const phase = getPhaseForDay(currentDay);
    const scheduleDomains = (schedule?.domains || []).map(d => DOMAINS.find(dom => dom.id === d)).filter(Boolean);

    const actionBtnStyle = (bg) => ({
      padding: "10px 16px",
      borderRadius: 10,
      border: "none",
      background: bg,
      color: "#FFF",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 15,
      flex: 1,
      textAlign: "center",
      minWidth: 0,
    });

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))} style={{ ...btnStyle, fontSize: 18, padding: "10px 18px" }}>◀</button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 16, color: phase?.color, fontWeight: 600 }}>{phase?.name} Phase</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: t.text }}>Day {currentDay}</div>
          </div>
          <button onClick={() => setCurrentDay(Math.min(30, currentDay + 1))} style={{ ...btnStyle, fontSize: 18, padding: "10px 18px" }}>▶</button>
        </div>

        {schedule && (
          <div style={{ background: t.card, borderRadius: 12, padding: 20, marginBottom: 16, borderLeft: `4px solid ${phase?.color}` }}>
            <div style={{ fontSize: 19, fontWeight: 600, color: t.text, marginBottom: 6 }}>{schedule.focus}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {scheduleDomains.map(d => (
                <span key={d.id} style={{ background: d.color + "22", color: d.color, padding: "4px 12px", borderRadius: 12, fontSize: 14, fontWeight: 500 }}>
                  {d.icon} {d.name}
                </span>
              ))}
            </div>
            <button
              onClick={() => toggleDay(currentDay)}
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                border: "none",
                background: completedDays[currentDay] ? "#10B981" : t.border,
                color: "#FFF",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {completedDays[currentDay] ? "✅ Completed" : "Mark Complete"}
            </button>
          </div>
        )}

        {/* ACTION CARDS — directly linked to app sections */}
        {scheduleDomains.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.muted, marginBottom: 12 }}>TODAY'S ACTIONS</div>

            {/* Read sections for each domain */}
            {scheduleDomains.map(d => (
              <div
                key={"read-" + d.id}
                onClick={() => goToRead(d.id)}
                style={{
                  background: t.card,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 8,
                  cursor: "pointer",
                  borderLeft: `4px solid ${d.color}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>📖 Read: {d.name}</div>
                  <div style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>{(STUDY_MATERIAL[d.id] || []).length} study sections</div>
                </div>
                <span style={{ color: d.color, fontSize: 20 }}>→</span>
              </div>
            ))}

            {/* Quiz for each domain */}
            {scheduleDomains.map(d => (
              <div
                key={"quiz-" + d.id}
                onClick={() => goToQuiz(d.id)}
                style={{
                  background: t.card,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 8,
                  cursor: "pointer",
                  borderLeft: `4px solid ${d.color}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>⚡ Quiz: {d.name}</div>
                  <div style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>{QUESTIONS.filter(q => q.domain === d.id).length} questions</div>
                </div>
                <span style={{ color: d.color, fontSize: 20 }}>→</span>
              </div>
            ))}

            {/* Numbers drill */}
            <div
              onClick={goToNumbers}
              style={{
                background: t.card,
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
                cursor: "pointer",
                borderLeft: "4px solid #F59E0B",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>🔢 Number Drill</div>
                <div style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>Critical values flashcards</div>
              </div>
              <span style={{ color: "#F59E0B", fontSize: 20 }}>→</span>
            </div>

            {/* Confusable pairs */}
            <div
              onClick={goToConfusables}
              style={{
                background: t.card,
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
                cursor: "pointer",
                borderLeft: "4px solid #8B5CF6",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>🔀 Confusable Pairs</div>
                <div style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>Commonly mixed-up concepts</div>
              </div>
              <span style={{ color: "#8B5CF6", fontSize: 20 }}>→</span>
            </div>
          </div>
        )}

        {/* Protocol tips */}
        <div style={{ background: t.card, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.muted, marginBottom: 12 }}>STUDY TIPS — {phase?.name} Phase</div>
          {phase?.protocol.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
              <span style={{ color: phase.color, fontWeight: 700, fontSize: 16, minWidth: 24 }}>{i + 1}.</span>
              <span style={{ color: t.body, fontSize: 16, lineHeight: 1.6 }}>{step}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.muted, marginBottom: 12 }}>PHASE OVERVIEW — {phase?.name}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
            {phase?.dailySchedule.map(d => (
              <div
                key={d.day}
                onClick={() => setCurrentDay(d.day)}
                style={{
                  background: d.day === currentDay ? phase.color + "33" : t.card,
                  border: d.day === currentDay ? `2px solid ${phase.color}` : `1px solid ${t.border}`,
                  borderRadius: 8,
                  padding: 12,
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: phase.color }}>Day {d.day}</div>
                <div style={{ fontSize: 13, color: t.muted, marginTop: 4, lineHeight: 1.4 }}>{d.focus.slice(0, 50)}{d.focus.length > 50 ? "..." : ""}</div>
                {completedDays[d.day] && <span style={{ position: "absolute", top: 6, right: 8, fontSize: 14 }}>✅</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStudyMaterial = () => {
    const sections = readDomain ? STUDY_MATERIAL[readDomain] : null;
    const domain = readDomain ? DOMAINS.find(d => d.id === readDomain) : null;

    if (!readDomain) {
      return (
        <div>
          <div style={{ fontSize: 16, color: t.muted, marginBottom: 16 }}>Select a domain to read its study material.</div>
          {DOMAINS.map(d => (
            <div
              key={d.id}
              onClick={() => { setReadDomain(d.id); setExpandedSection(null); }}
              style={{
                background: t.card,
                borderRadius: 12,
                padding: 16,
                marginBottom: 10,
                cursor: "pointer",
                borderLeft: `4px solid ${d.color}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: 22, marginRight: 8 }}>{d.icon}</span>
                <span style={{ fontSize: 17, fontWeight: 600, color: t.text }}>{d.name}</span>
                <span style={{ marginLeft: 10, fontSize: 14, color: t.muted }}>
                  {(STUDY_MATERIAL[d.id] || []).length} sections
                </span>
              </div>
              <span style={{ color: t.muted, fontSize: 20 }}>▶</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div>
        <button
          onClick={() => { setReadDomain(null); setExpandedSection(null); }}
          style={{ ...btnStyle, marginBottom: 16, fontSize: 15 }}
        >
          ← Back to Domains
        </button>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12, gap: 10 }}>
          <span style={{ fontSize: 28 }}>{domain?.icon}</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{domain?.name}</div>
            <div style={{ fontSize: 14, color: t.muted }}>{sections?.length || 0} study sections</div>
          </div>
        </div>
        {/* Speed Read entire domain / from section */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => {
              const allText = (sections || []).map(s => s.title + ".\n" + s.content).join("\n\n");
              launchRsvp(allText, domain?.name + " — All Sections");
            }}
            style={{
              display: "flex", alignItems: "center", gap: 6, flex: 1,
              padding: "12px 12px", borderRadius: 10, border: "none",
              background: `linear-gradient(135deg, ${domain?.color || "#3B82F6"}, ${domain?.color || "#3B82F6"}88)`,
              color: "#FFF", cursor: "pointer", fontWeight: 700, fontSize: 14,
              justifyContent: "center",
            }}
          >
            ⚡ Speed Read All ({Math.ceil((sections || []).reduce((sum, s) => sum + s.content.split(/\s+/).length, 0) / (rsvpWpm || 300) * 60)}s)
          </button>
          {expandedSection !== null && expandedSection < (sections || []).length && (
            <button
              onClick={() => {
                const fromHere = (sections || []).slice(expandedSection);
                const text = fromHere.map(s => s.title + ".\n" + s.content).join("\n\n");
                launchRsvp(text, domain?.name + " — From §" + (expandedSection + 1));
              }}
              style={{
                display: "flex", alignItems: "center", gap: 6, flex: 1,
                padding: "12px 12px", borderRadius: 10, border: "none",
                background: domain?.color || "#3B82F6",
                color: "#FFF", cursor: "pointer", fontWeight: 700, fontSize: 14,
                justifyContent: "center",
              }}
            >
              ⚡ From §{expandedSection + 1} onward ({Math.ceil((sections || []).slice(expandedSection).reduce((sum, s) => sum + s.content.split(/\s+/).length, 0) / (rsvpWpm || 300) * 60)}s)
            </button>
          )}
        </div>
        {(sections || []).map((section, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <div
              onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
              style={{
                background: expandedSection === idx ? t.cardActive : t.card,
                borderRadius: expandedSection === idx ? "12px 12px 0 0" : 12,
                padding: "14px 16px",
                cursor: "pointer",
                borderLeft: `3px solid ${domain?.color}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, color: t.text, lineHeight: 1.4 }}>
                {idx + 1}. {section.title}
              </span>
              <span style={{ color: t.muted, fontSize: 18, flexShrink: 0, marginLeft: 8 }}>
                {expandedSection === idx ? "▼" : "▶"}
              </span>
            </div>
            {expandedSection === idx && (
              <div style={{
                background: t.bg,
                borderRadius: "0 0 12px 12px",
                padding: "16px 16px 20px",
                borderLeft: `3px solid ${domain?.color}`,
                borderBottom: `1px solid ${domain?.color}22`,
              }}>
                {/* Speed Read button */}
                <button
                  onClick={() => launchRsvp(section.content, section.title)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", borderRadius: 8, border: "none",
                    background: domain?.color || "#3B82F6", color: "#FFF",
                    cursor: "pointer", fontWeight: 600, fontSize: 14,
                    marginBottom: 14, width: "100%", justifyContent: "center",
                  }}
                >
                  ⚡ Speed Read ({Math.ceil(section.content.split(/\s+/).length / (rsvpWpm || 300) * 60)}s at {rsvpWpm} WPM)
                </button>
                <div style={{
                  fontSize: 15,
                  color: t.body,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}>
                  {section.content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={i} style={{ color: t.text, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderDomains = () => (
    <div>
      <div style={{ fontSize: 16, color: t.muted, marginBottom: 16 }}>Tap any domain to see subtopics, key numbers, and start retrieval practice.</div>
      {DOMAINS.map(domain => (
        <div key={domain.id} style={{ marginBottom: 12 }}>
          <div
            onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
            style={{
              background: t.card,
              borderRadius: 12,
              padding: 16,
              cursor: "pointer",
              borderLeft: `4px solid ${domain.color}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: 22, marginRight: 8 }}>{domain.icon}</span>
              <span style={{ fontSize: 17, fontWeight: 600, color: t.text }}>{domain.name}</span>
              <span style={{ marginLeft: 10, fontSize: 14, color: t.muted }}>({domain.weight}%)</span>
            </div>
            <span style={{ color: t.muted, fontSize: 20 }}>{expandedDomain === domain.id ? "▼" : "▶"}</span>
          </div>

          {expandedDomain === domain.id && (() => {
            const sections = STUDY_MATERIAL[domain.id] || [];
            // Match subtopic to best study section by keyword overlap
            const findSection = (subtopic) => {
              const words = subtopic.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 2);
              let bestIdx = -1, bestScore = 0;
              sections.forEach((sec, idx) => {
                const titleLower = sec.title.toLowerCase();
                const contentLower = sec.content.toLowerCase().slice(0, 300);
                const score = words.reduce((sum, w) => sum + (titleLower.includes(w) ? 3 : 0) + (contentLower.includes(w) ? 1 : 0), 0);
                if (score > bestScore) { bestScore = score; bestIdx = idx; }
              });
              return bestScore >= 2 ? bestIdx : -1;
            };

            return (
              <div style={{ background: t.bg, borderRadius: "0 0 12px 12px", padding: 20, borderLeft: `4px solid ${domain.color}` }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: domain.color, marginBottom: 10 }}>SUBTOPICS</div>
                  {domain.subtopics.map((s, i) => {
                    const matchIdx = findSection(s);
                    const hasMatch = matchIdx >= 0;
                    return (
                      <div
                        key={i}
                        onClick={hasMatch ? () => { setView("read"); setReadDomain(domain.id); setExpandedSection(matchIdx); } : undefined}
                        style={{
                          color: hasMatch ? domain.color : t.body,
                          fontSize: 15,
                          marginBottom: 8,
                          paddingLeft: 12,
                          lineHeight: 1.5,
                          cursor: hasMatch ? "pointer" : "default",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>{hasMatch ? "📖" : "•"}</span>
                        <span style={{ textDecoration: hasMatch ? "underline" : "none", textDecorationColor: domain.color + "66" }}>
                          {s}
                          {hasMatch && <span style={{ color: t.muted, fontSize: 12, marginLeft: 6 }}>→ §{matchIdx + 1}</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#F59E0B", marginBottom: 10 }}>🔢 CRITICAL NUMBERS</div>
                  {domain.keyNumbers.map((n, i) => (
                    <div key={i} style={{ color: darkMode ? "#FCD34D" : "#B45309", fontSize: 15, marginBottom: 6, paddingLeft: 12, lineHeight: 1.5 }}>▸ {n}</div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => goToRead(domain.id)}
                    style={{ padding: "12px 20px", borderRadius: 8, border: "none", background: domain.color, color: "#FFF", cursor: "pointer", fontWeight: 600, fontSize: 15, flex: 1 }}
                  >
                    📖 Read Material
                  </button>
                  <button
                    onClick={() => goToQuiz(domain.id)}
                    style={{ padding: "12px 20px", borderRadius: 8, border: "none", background: domain.color, color: "#FFF", cursor: "pointer", fontWeight: 600, fontSize: 15, flex: 1 }}
                  >
                    ⚡ Quiz
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      ))}
    </div>
  );

  const renderQuiz = () => {
    if (!filteredQuestions.length) return <div style={{ color: t.muted }}>No questions available.</div>;
    const q = filteredQuestions[quizIndex];
    const domain = DOMAINS.find(d => d.id === q.domain);
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ background: domain?.color + "22", color: domain?.color, padding: "4px 12px", borderRadius: 12, fontSize: 14, fontWeight: 500 }}>
              {domain?.icon} {domain?.name}
            </span>
            <span style={{ color: t.dim, fontSize: 15 }}>
              {quizIndex + 1} / {filteredQuestions.length} {"⭐".repeat(q.difficulty)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => { setQuizDomain(null); setQuizIndex(0); setShowAnswer(false); }}
              style={{ ...btnStyle, fontSize: 14, padding: "8px 14px" }}
            >
              All
            </button>
            {DOMAINS.map(d => (
              <button
                key={d.id}
                onClick={() => { setQuizDomain(d.id); setQuizIndex(0); setShowAnswer(false); }}
                style={{
                  ...btnStyle,
                  fontSize: 16,
                  padding: "8px 12px",
                  background: quizDomain === d.id ? d.color + "33" : t.card,
                  borderColor: quizDomain === d.id ? d.color : t.border,
                }}
              >
                {d.icon}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: t.card, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 19, fontWeight: 600, color: t.text, lineHeight: 1.5, marginBottom: 20 }}>
            {q.q}
          </div>

          {!showAnswer ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ color: t.dim, fontSize: 15, marginBottom: 14, fontStyle: "italic" }}>
                Try to answer from memory before revealing...
              </div>
              <button
                onClick={() => setShowAnswer(true)}
                style={{ padding: "14px 36px", borderRadius: 10, border: "none", background: "#3B82F6", color: "#FFF", cursor: "pointer", fontWeight: 600, fontSize: 17 }}
              >
                Reveal Answer
              </button>
            </div>
          ) : (
            <div>
              <div style={{ background: t.answerBg, borderRadius: 8, padding: 16, marginBottom: 16, borderLeft: `3px solid ${t.answerBorder}` }}>
                <div style={{ color: t.answerText, fontSize: 16, lineHeight: 1.7 }}>{q.a}</div>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={() => markQuiz(false)} style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "#DC2626", color: "#FFF", cursor: "pointer", fontWeight: 600, fontSize: 16 }}>
                  ❌ Wrong
                </button>
                <button onClick={() => markQuiz(true)} style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "#10B981", color: "#FFF", cursor: "pointer", fontWeight: 600, fontSize: 16 }}>
                  ✅ Right
                </button>
              </div>
            </div>
          )}
        </div>

        {Object.keys(quizResults).length > 0 && (
          <div style={{ background: t.card, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.muted, marginBottom: 10 }}>SESSION RESULTS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
              {Object.entries(quizResults).map(([domId, res]) => {
                const dom = DOMAINS.find(d => d.id === domId);
                const total = res.correct + res.wrong;
                const pct = total > 0 ? Math.round((res.correct / total) * 100) : 0;
                return (
                  <div key={domId} style={{ background: t.bg, borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 14, color: dom?.color, fontWeight: 600 }}>{dom?.icon} {dom?.name}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: pct >= 80 ? "#10B981" : pct >= 60 ? "#F59E0B" : "#EF4444" }}>{pct}%</div>
                    <div style={{ fontSize: 14, color: t.dim }}>{res.correct}/{total} correct</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNumberDrill = () => {
    const item = shuffledNumbers[numberDrillIndex % shuffledNumbers.length];
    return (
      <div>
        <div style={{ color: t.muted, fontSize: 16, marginBottom: 16 }}>
          Rapid-fire recall of every critical number. Say the value out loud before revealing.
        </div>
        <div style={{ textAlign: "center", marginBottom: 16, color: t.dim, fontSize: 15 }}>
          {numberDrillIndex + 1} / {shuffledNumbers.length}
        </div>
        <div style={{ background: t.card, borderRadius: 12, padding: 28, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, color: item.color, fontWeight: 600, marginBottom: 10 }}>{item.domain}</div>
          {showNumberAnswer ? (
            <div style={{ fontSize: 20, fontWeight: 700, color: darkMode ? "#FCD34D" : "#B45309", lineHeight: 1.6 }}>
              {item.number}
            </div>
          ) : (
            <div style={{ fontSize: 18, color: t.dimmest, fontStyle: "italic" }}>What is the value for...</div>
          )}
          {!showNumberAnswer && (
            <div style={{ fontSize: 18, color: t.muted, marginTop: 14 }}>
              {item.number.split(":")[0]}:
              <span style={{ color: t.border }}> ???</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {!showNumberAnswer ? (
            <button onClick={() => setShowNumberAnswer(true)} style={{ padding: "14px 36px", borderRadius: 10, border: "none", background: "#F59E0B", color: "#000", cursor: "pointer", fontWeight: 700, fontSize: 17 }}>
              Reveal
            </button>
          ) : (
            <button onClick={() => { setShowNumberAnswer(false); setNumberDrillIndex(prev => prev + 1); }} style={{ padding: "14px 36px", borderRadius: 10, border: "none", background: "#3B82F6", color: "#FFF", cursor: "pointer", fontWeight: 600, fontSize: 17 }}>
              Next →
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderConfusables = () => (
    <div>
      <div style={{ color: t.muted, fontSize: 16, marginBottom: 16 }}>
        Concept pairs students commonly confuse. Study these during interleaving blocks.
      </div>
      {CONFUSABLE_PAIRS.map((pair, i) => (
        <div key={i} style={{ background: t.card, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {pair.pair.map((p, j) => (
              <span key={j} style={{ background: "#3B82F622", color: darkMode ? "#93C5FD" : "#1D4ED8", padding: "6px 14px", borderRadius: 8, fontSize: 15, fontWeight: 600 }}>
                {p}
              </span>
            ))}
          </div>
          <div style={{ color: t.body, fontSize: 15, lineHeight: 1.6 }}>{pair.why}</div>
        </div>
      ))}
    </div>
  );

  const renderCalendar = () => (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: t.text }}>{progressPct}%</div>
          <div style={{ fontSize: 15, color: t.muted }}>{completedCount} of {totalDays} days</div>
        </div>
        <div style={{ width: "100%", height: 12, background: t.border, borderRadius: 6 }}>
          <div style={{ width: `${progressPct}%`, height: "100%", background: progressPct >= 80 ? "#10B981" : progressPct >= 50 ? "#F59E0B" : "#3B82F6", borderRadius: 6, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
          const phase = getPhaseForDay(day);
          return (
            <div
              key={day}
              onClick={() => { toggleDay(day); }}
              style={{
                background: completedDays[day] ? phase?.color + "33" : t.card,
                border: completedDays[day] ? `2px solid ${phase?.color}` : `1px solid ${t.border}`,
                borderRadius: 8,
                padding: 8,
                cursor: "pointer",
                textAlign: "center",
                minHeight: 60,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: completedDays[day] ? phase?.color : t.dim }}>{day}</div>
              <div style={{ fontSize: 10, color: t.dim, marginTop: 2 }}>{phase?.name}</div>
              {completedDays[day] && <div style={{ fontSize: 12, marginTop: 2 }}>✅</div>}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 16 }}>
        {PHASES.map(p => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: t.muted }}>{p.name} ({p.days})</span>
          </div>
        ))}
      </div>
    </div>
  );

  const btnStyle = {
    padding: "10px 18px",
    borderRadius: 8,
    border: `1px solid ${t.border}`,
    background: t.card,
    color: t.muted,
    cursor: "pointer",
    fontSize: 16,
  };

  return (
    <div style={{ background: t.bg, minHeight: "100vh", padding: "16px 12px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: t.text }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: t.text }}>
              ⚡ Fluoro Study
            </h1>
            <p style={{ color: t.dim, fontSize: 14, margin: "4px 0 0" }}>
              Exercise→BDNF · Spaced Retrieval · Interleaving · Dual Coding
            </p>
          </div>
          <button
            onClick={() => setDarkMode(prev => !prev)}
            style={{
              background: t.card, border: `1px solid ${t.border}`, borderRadius: 8,
              padding: "8px 12px", cursor: "pointer", fontSize: 18, flexShrink: 0,
              color: t.text,
            }}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {renderNav()}

        {view === "protocol" && renderProtocol()}
        {view === "read" && renderStudyMaterial()}
        {view === "domains" && renderDomains()}
        {view === "quiz" && renderQuiz()}
        {view === "numbers" && renderNumberDrill()}
        {view === "confusables" && renderConfusables()}
        {view === "calendar" && renderCalendar()}
      </div>

      {/* RSVP Speed Reader Overlay */}
      {rsvpActive && (() => {
        const currentChunk = rsvpWords.slice(rsvpIndex, rsvpIndex + rsvpChunk).join(" ");
        const progress = rsvpWords.length > 0 ? ((rsvpIndex + rsvpChunk) / rsvpWords.length) * 100 : 0;
        const timeLeft = rsvpWords.length > 0
          ? Math.ceil(((rsvpWords.length - rsvpIndex) / rsvpWpm) * 60)
          : 0;
        const timeMin = Math.floor(timeLeft / 60);
        const timeSec = timeLeft % 60;

        return (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: t.rsvpBg, zIndex: 9999,
            display: "flex", flexDirection: "column",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}>
            {/* Top bar */}
            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${t.card}` }}>
              <button onClick={closeRsvp} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 16, fontWeight: 600, cursor: "pointer", padding: "8px 12px" }}>
                ✕ Close
              </button>
              <div style={{ color: t.muted, fontSize: 13, textAlign: "center", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {rsvpTitle}
              </div>
              <div style={{ color: t.dim, fontSize: 13, minWidth: 60, textAlign: "right" }}>
                {timeMin}:{String(timeSec).padStart(2, "0")} left
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: t.card }}>
              <div style={{ height: "100%", background: "#3B82F6", width: `${Math.min(progress, 100)}%`, transition: "width 0.1s" }} />
            </div>

            {/* Main word display — tap to play/pause */}
            <div
              onClick={() => {
                if (rsvpIndex >= rsvpWords.length - 1) {
                  setRsvpIndex(0);
                  setRsvpPlaying(true);
                } else {
                  setRsvpPlaying(p => !p);
                }
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                padding: "0 20px",
              }}
            >
              {/* Focus guide lines */}
              <div style={{ width: "80%", maxWidth: 500, position: "relative" }}>
                <div style={{ borderBottom: `2px solid ${t.card}`, marginBottom: 16 }} />
                <div style={{
                  fontSize: rsvpChunk === 1 ? 44 : rsvpChunk === 2 ? 36 : 30,
                  fontWeight: 700,
                  color: t.text,
                  textAlign: "center",
                  minHeight: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  letterSpacing: rsvpChunk === 1 ? 2 : 1,
                  lineHeight: 1.2,
                }}>
                  {rsvpIndex >= rsvpWords.length ? "Done" : currentChunk}
                </div>
                <div style={{ borderTop: `2px solid ${t.card}`, marginTop: 16 }} />
              </div>

              {/* Play state hint */}
              <div style={{ marginTop: 24, color: t.dimmest, fontSize: 14 }}>
                {rsvpIndex >= rsvpWords.length - 1 && !rsvpPlaying
                  ? "Tap to restart"
                  : rsvpPlaying ? "Tap to pause" : "Tap to play"}
              </div>
            </div>

            {/* Controls */}
            <div style={{ padding: "16px", borderTop: `1px solid ${t.card}` }}>
              {/* WPM control */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: t.muted, fontSize: 13 }}>Speed</span>
                  <span style={{ color: "#3B82F6", fontSize: 15, fontWeight: 700 }}>{rsvpWpm} WPM</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={800}
                  step={25}
                  value={rsvpWpm}
                  onChange={(e) => setRsvpWpm(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "#3B82F6" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t.dimmest }}>
                  <span>100</span><span>300</span><span>500</span><span>800</span>
                </div>
              </div>

              {/* Chunk size + navigation */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {/* Chunk selector */}
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3].map(n => (
                    <button
                      key={n}
                      onClick={() => setRsvpChunk(n)}
                      style={{
                        padding: "8px 12px", borderRadius: 6, border: "none",
                        background: rsvpChunk === n ? "#3B82F6" : t.card,
                        color: rsvpChunk === n ? "#FFF" : t.muted,
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {n}w
                    </button>
                  ))}
                </div>

                <div style={{ flex: 1 }} />

                {/* Skip back / forward */}
                <button
                  onClick={() => setRsvpIndex(prev => Math.max(0, prev - 20))}
                  style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: t.card, color: t.muted, fontSize: 14, cursor: "pointer" }}
                >
                  ⏪
                </button>
                <button
                  onClick={() => {
                    if (rsvpIndex >= rsvpWords.length - 1) {
                      setRsvpIndex(0);
                      setRsvpPlaying(true);
                    } else {
                      setRsvpPlaying(p => !p);
                    }
                  }}
                  style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: "#3B82F6", color: "#FFF", fontSize: 18, cursor: "pointer", fontWeight: 700 }}
                >
                  {rsvpPlaying ? "⏸" : "▶"}
                </button>
                <button
                  onClick={() => setRsvpIndex(prev => Math.min(rsvpWords.length - 1, prev + 20))}
                  style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: t.card, color: t.muted, fontSize: 14, cursor: "pointer" }}
                >
                  ⏩
                </button>
              </div>

              {/* Word counter */}
              <div style={{ textAlign: "center", marginTop: 10, color: t.dimmest, fontSize: 12 }}>
                {Math.min(rsvpIndex + rsvpChunk, rsvpWords.length)} / {rsvpWords.length} words
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}