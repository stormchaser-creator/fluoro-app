// ═══════════════════════════════════════════════════════════════
// EQUIPMENT & PHYSICS — COMPREHENSIVE STUDY GUIDE
// Fluoroscopy Exam Preparation
// Source: CA Syllabus on Fluoroscopy, Fluoroscopy Notes March 2025,
//         Radiographics Physics Tutorials (II, FPD, General Overview)
// ═══════════════════════════════════════════════════════════════

const equipmentPhysicsStudyGuide = [
  {
    title: "X-Ray Tube: Construction & Components",
    content: `The x-ray tube is an evacuated glass envelope containing two electrodes:

**Cathode (negative side):**
- Contains a tungsten filament wound in a coil, set about 1 inch from the anode
- When heated by a low-voltage current, the filament emits electrons via thermionic emission
- A focusing cup (negatively charged) directs the electron stream toward the anode target
- Most tubes have two filaments — a small one for fine focus (fluoroscopy) and a large one for high-output exposures (spot films)

**Anode (positive side):**
- Made of tungsten (W, Z=74) because of its high melting point (3,422°C) and high atomic number (efficient x-ray production)
- Modern tubes use a rotating anode — a tungsten disc that spins at 3,000–10,000 RPM to distribute heat over a larger area
- The anode angle (typically 7°–20°) determines the effective focal spot size via the line-focus principle
- Molybdenum stem supports the tungsten disc (good heat conduction, poor heat radiation)

**Tube Housing:**
- Lead-lined to limit leakage radiation to < 100 mR/hr at 1 meter from the housing
- Oil-filled for electrical insulation and cooling
- A glass or metal window allows the useful beam to exit

**Key operating differences — Fluoroscopy vs. Radiography:**
- Fluoroscopy: small focal spot, 0.5–5 mA (usually 1–3 mA), continuous operation for minutes
- Radiography/Spot films: large focal spot, 100–500+ mA, very short exposure times (< 100 ms)`
  },
  {
    title: "Focal Spot Size & the Line-Focus Principle",
    content: `**Focal Spot Definitions:**
- **Actual focal spot**: The physical area on the anode struck by electrons (always larger)
- **Effective focal spot**: The apparent size of the focal spot as projected down toward the patient (always smaller than actual)
- The effective focal spot determines spatial resolution in the image

**Line-Focus Principle:**
- The anode is angled (typically 7°–20°) so the effective focal spot is smaller than the actual area bombarded
- Effective focal spot = actual focal spot × sin(anode angle)
- Smaller anode angle = smaller effective focal spot = better resolution, BUT smaller usable field coverage
- Larger anode angle = larger effective focal spot = less resolution, but larger field coverage

**Typical focal spot sizes:**
- Fluoroscopy: 0.3–0.6 mm (small focal spot used for detail)
- General radiography: 0.6–1.2 mm
- The small focal spot is used during fluoroscopy because tube loading is not a problem at low mA values

**Heel Effect:**
- X-ray intensity is greater on the cathode side and weaker on the anode side because photons produced deeper in the anode must travel through more tungsten to escape
- More pronounced with steeper anode angles and shorter SIDs`
  },
  {
    title: "X-Ray Production: Bremsstrahlung & Characteristic Radiation",
    content: `X-rays are produced when high-speed electrons from the cathode strike the tungsten anode target. Only about 0.5–1% of kinetic energy is converted to x-rays; ~99% becomes heat.

**Bremsstrahlung (Braking) Radiation (~80–90% of useful beam):**
- Occurs when an electron passes near the nucleus of a tungsten atom and is decelerated by the nuclear positive charge
- The electron loses kinetic energy, which is emitted as an x-ray photon
- Produces a continuous spectrum of energies from zero up to the maximum (set by kVp)
- The closer the electron passes to the nucleus, the greater the deceleration and the higher the photon energy
- Maximum photon energy (keV) = kVp applied across the tube

**Characteristic Radiation (~10–20% of useful beam at diagnostic energies):**
- Occurs when an incident electron ejects an inner-shell (K, L, M) electron from a tungsten atom
- An outer-shell electron drops down to fill the vacancy, releasing the energy difference as a discrete x-ray photon
- Produces specific, fixed energies (characteristic of the target material)
- For tungsten: K-shell characteristic x-rays have energies of ~57–69 keV
- K-shell characteristic radiation only occurs when kVp exceeds the K-edge binding energy of tungsten (69.5 keV) — so below ~70 kVp, essentially no characteristic radiation from tungsten

**Factors affecting x-ray output:**
- Increasing kVp: shifts spectrum peak to higher energies, increases both quantity and quality
- Increasing mA: increases quantity (number of photons) proportionally; does NOT change quality
- Adding filtration: removes low-energy photons, hardens the beam (shifts average energy higher)
- Target material (higher Z = more efficient x-ray production)`
  },
  {
    title: "X-Ray Beam Quality, Filtration & Half-Value Layer (HVL)",
    content: `**Filtration — Purpose and Types:**
Filters (usually aluminum) are placed in the x-ray beam path to remove low-energy photons that would only increase patient skin dose without contributing to image formation.

- **Inherent filtration**: The glass envelope of the tube, tube housing, and oil (~0.5–1.0 mm Al equivalent)
- **Added filtration**: Sheets of aluminum placed in the beam path
- **Total filtration** = inherent + added filtration
- **Regulatory requirement**: Total filtration must be at least 2.5 mm aluminum equivalent for fluoroscopy operating at 80–120 kVp
- The tabletop, patient cradle, and other material between tube and patient also contribute to total filtration
- For tubes capable of operating above 125 kVp, filtration must be at least 3.0 mm Al equivalent

**Half-Value Layer (HVL):**
- The HVL is the thickness of absorbing material (usually expressed in mm of aluminum) needed to reduce x-ray beam intensity to exactly half its original value
- HVL is the standard measure of beam quality (penetrating ability)
- Higher HVL = more penetrating (harder) beam
- If the filtration requirement is met, the HVL at 80 kVp should be not less than 3.0 mm Al

**HVL calculation example:**
- To reduce 100 mR/min to 25 mR/min requires 2 HVLs (100 → 50 → 25)
- Each HVL halves the intensity: after n HVLs, intensity = original × (1/2)^n

**Exponential attenuation formula:**
- I = I₀ × e^(−μx), where μ is the linear attenuation coefficient and x is absorber thickness
- The linear attenuation coefficient depends on photon energy and absorber material (Z, density)
- HVL = 0.693 / μ`
  },
  {
    title: "X-Ray Interactions with Matter",
    content: `When x-ray photons interact with matter, three main processes occur in the diagnostic energy range:

**1. Photoelectric Effect (dominant at low energies, < ~100 kVp):**
- An x-ray photon interacts with a tightly bound inner-shell electron
- The photon is completely absorbed and the electron is ejected (photoelectron)
- The vacancy is filled by an outer-shell electron, producing characteristic radiation from the absorber
- Probability increases dramatically with higher atomic number (proportional to Z³) and decreases with higher photon energy (proportional to 1/E³)
- Produces HIGH subject contrast (why bone appears white — calcium has higher Z than soft tissue)
- No scattered radiation produced — important for image quality
- Predominant interaction in bone, barium, iodine, and lead at diagnostic energies

**2. Compton Scattering (dominant at medium energies, main source of scatter):**
- An x-ray photon interacts with a loosely bound outer-shell electron
- The photon loses some energy and changes direction (scattered photon)
- The electron is ejected as a recoil electron
- The scattered photon carries reduced energy and travels in a new direction — it degrades image quality by adding fog
- Probability depends on electron density (roughly proportional to physical density), but is relatively independent of atomic number
- Compton scattering is the PRIMARY source of scatter radiation in fluoroscopy
- Factors that increase scatter: higher kVp, larger field size, thicker body part

**3. Pair Production (only at very high energies, > 1.02 MeV):**
- A photon interacts with the nuclear field and is completely absorbed
- An electron-positron pair is created (requires minimum 1.02 MeV)
- NOT relevant at diagnostic fluoroscopy energies (which are 50–150 kVp)
- Included in exams for completeness — know the threshold energy of 1.02 MeV

**Clinical relevance:**
- The photoelectric effect is most important for producing diagnostic images at fluoroscopy energies
- Compton scatter is the chief source of occupational dose to the operator
- The patient being fluoroscoped is the main source of scattered radiation in the room`
  },
  {
    title: "Attenuation, Absorption & Remnant Radiation",
    content: `**Attenuation** is the reduction in x-ray beam intensity as it passes through matter (by absorption or scattering).

**Key factors affecting attenuation:**
- **Photon energy** (kVp): Higher energy photons are more penetrating (less attenuation)
- **Atomic number (Z)** of the absorber: Higher Z = more attenuation (especially via photoelectric effect)
- **Density** of the absorber: Higher density = more attenuation
- **Thickness** of the absorber: Thicker material = more attenuation

**Differential absorption:**
- Different tissues attenuate x-rays differently, creating image contrast
- Bone (Z=13.8, density 1.85) attenuates much more than soft tissue (Z≈7.4, density 1.0)
- Air (density 0.00129) attenuates very little — appears black
- This differential is the basis of diagnostic imaging

**Remnant radiation:**
- X-rays that exit the patient after passing through are called remnant radiation
- Only about 5% of incident photons emerge from the patient unaffected
- Remnant radiation carries the image information to the detector
- It consists of non-interacting (primary) photons plus some small-angle scattered photons

**Tissue characteristics (from syllabus chart):**
| Material | Effective Z | Density |
|----------|------------|---------|
| Air | 7.64 | 0.00129 |
| Fat | 5.92 | 0.91 |
| Water/Blood/Muscle | 7.42 | 1.00 |
| Bone | 13.80 | 1.85 |
| Lead | 82.00 | 11.00 |

**Contrast media:**
- Barium (Z=56) and iodine (Z=53) are used because their high atomic numbers dramatically increase x-ray absorption
- Optimal kVp must be selected for proper differential attenuation with contrast agents`
  },
  {
    title: "X-Ray Generators",
    content: `Generators supply high-voltage electrical power to the x-ray tube. The type of generator affects x-ray output quality.

**Single-Phase Generators:**
- AC voltage is rectified to pulsating DC
- Full-wave rectification produces pulses that drop to zero twice per cycle
- **100% voltage ripple** — output intensity varies greatly
- Least efficient; lowest average photon energy for a given kVp setting

**Three-Phase, 6-Pulse Generators:**
- Use three overlapping AC phases, rectified to produce 6 pulses per cycle
- **~13% voltage ripple** — voltage never drops to zero
- Higher average photon energy = more efficient x-ray production
- Higher effective kVp for the same peak setting

**Three-Phase, 12-Pulse Generators:**
- 12 pulses per cycle
- **~4% voltage ripple** — nearly constant potential
- Even more efficient than 6-pulse

**High-Frequency (Medium-Frequency) Generators:**
- Convert AC to high-frequency AC (500–25,000 Hz), then rectify
- **< 1% voltage ripple** — nearly constant potential
- Compact, lightweight, and very efficient
- Most common in modern fluoroscopy systems and mobile C-arms

**Advantages of 3-phase and high-frequency over single-phase:**
- Higher effective kilovoltage (more penetrating beam)
- Near constant potential available
- High mA for very short exposures (useful for spot filming and angiography)
- More efficient x-ray production per mAs

**Important**: From a patient dose standpoint, when technique is adjusted to produce the same image density and contrast, there is no appreciable dose reduction advantage of 3-phase or HF generators over single-phase for standard fluoroscopy imaging.`
  },
  {
    title: "Image Intensifier (II): Construction & Components",
    content: `The x-ray image intensifier converts a dim x-ray image into a bright, visible light image.

**Four principal components (inside a vacuum glass envelope):**

**1. Input Layer (large end, 15–40 cm diameter):**
- **Input window**: ~1 mm aluminum — allows x-rays to enter with minimal absorption
- **Input phosphor**: Cesium iodide (CsI) crystals, needle-shaped and aligned to channel light like fiber optics
  - Absorbs x-ray photons and converts them to light (fluorescence)
  - CsI is superior to older zinc-cadmium sulfide (ZnCdS) — better resolution (~4 lp/mm vs 1–2 lp/mm) and detection efficiency
  - The individual CsI crystals minimize light spread, improving resolution
- **Photocathode**: Thin layer of antimony-cesium (SbCs₃) compound directly bonded to the input phosphor
  - Absorbs light from the phosphor and emits electrons via photoemission
  - Number of electrons emitted is directly proportional to light intensity

**2. Electrostatic Focusing Lenses:**
- Series of charged electrodes that focus and accelerate the electron stream
- Maintain geometric accuracy of the image
- Electrons are accelerated through ~25,000 volts (25 kV) potential difference
- Also control magnification mode selection (changing voltage changes field of view)

**3. Accelerating Anode:**
- Maintained at ~25 kV positive potential
- Speeds up electrons, giving them additional kinetic energy

**4. Output Phosphor (small end, ~1 inch / 2.5 cm diameter):**
- Made of zinc-cadmium sulfide (P20 phosphor) — emits GREEN light
- Produces ~2,000 luminescence photons per 25-keV photoelectron
- Much smaller than input phosphor — this is the basis of minification gain
- The output image is thousands of times brighter than the input image

The entire assembly is enclosed in a vacuum glass envelope with a lead-lined housing that serves as a primary protective barrier (at least 2 mm lead equivalent for tubes operating above 125 kVp).`
  },
  {
    title: "Image Intensifier: Brightness Gain",
    content: `The II increases image brightness through two mechanisms. Total brightness gain is their product.

**1. Minification Gain:**
- Electrons from the large input phosphor are compressed onto the small output phosphor
- Formula: Minification Gain = (input diameter)² / (output diameter)²
- Example: 12-inch input, 1-inch output → (12)²/(1)² = 144
- Example: 9-inch input, 1-inch output → (9)²/(1)² = 81
- This is purely a concentration of the same information onto a smaller area — NOT an improvement in image quality or photon count

**2. Flux Gain:**
- The increase in light intensity due to the accelerating voltage giving electrons extra kinetic energy
- When accelerated electrons hit the output phosphor, each electron produces many more light photons than were originally absorbed at the input
- Typical flux gain: 50–150 (varies by manufacturer)
- Flux gain only accounts for electron-to-light conversion at the output phosphor

**Total Brightness Gain = Minification Gain × Flux Gain**
- Example: 9-inch II with flux gain of 50 → B.G. = 81 × 50 = 4,050
- Typical total brightness gain range: 5,000–20,000

**Conversion Factor (preferred modern measurement):**
- Ratio of output phosphor luminance (cd/m²) to input exposure rate (mR/s)
- Typical range: 100–300 cd·m⁻²/mR·s⁻¹
- More reproducible than brightness gain

**Degradation over time:**
- Brightness gain deteriorates approximately 10% per year due to aging of phosphors
- Must be tested at least annually
- Reduced gain forces the ABC to increase mA or kVp → increased patient dose`
  },
  {
    title: "Image Intensifier: Multi-Mode / Magnification",
    content: `Modern IIs have dual-field, triple-field, or quad-field capability for electronic magnification.

**How magnification mode works:**
- Increasing the voltage on the electrostatic focusing lenses compresses the electron beam more tightly
- Only electrons from a smaller central area of the input phosphor are focused onto the entire output phosphor
- The output phosphor size remains constant (1 inch)
- The result: a magnified image of a smaller anatomical area

**Key effects of magnification mode:**
- **Improved resolution**: Center of II has best resolution and least distortion; magnification mode uses only the central electrons → resolution increases from ~4 lp/mm to ~6 lp/mm
- **Reduced field of view (FOV)**: Smaller area of patient anatomy is imaged
- **Reduced brightness**: Fewer electrons reach the output phosphor → dimmer image
- **ABC compensates**: Automatically increases mA (and/or kVp) to restore brightness
- **Increased patient dose**: Due to ABC compensation

**Dose increase formula:**
- Dose ratio = (Normal mode diameter)² / (Magnification mode diameter)²
- Example: Switching from 9-inch to 6-inch mode → (9)²/(6)² = 81/36 = 2.25× more dose
- Example: Switching from 12-inch to 6-inch mode → (12)²/(6)² = 144/36 = 4× more dose

**Reduced pincushion distortion**: Magnification mode uses the central, more accurately focused portion of the II, so pincushion distortion is reduced.

**Clinical rule**: Use the largest field of view (non-magnification mode) with strict collimation whenever possible to minimize patient dose. Only use magnification when needed for diagnostic detail.`
  },
  {
    title: "Image Intensifier: Image Quality Issues",
    content: `**1. Quantum Mottle (Quantum Noise):**
- Grainy/blotchy appearance caused by statistical fluctuation in the number of x-ray photons reaching the input phosphor
- Most visible in high-resolution, high-contrast systems
- Fluoroscopy operates near the quantum mottle limit (low photon count)
- Adjusted by changing mA and kVp — increasing exposure increases photons and decreases mottle
- Typical manual fluoro: 2–3 mA for adult abdomen to maintain adequate statistics

**2. Contrast:**
- Subject contrast: determined by kVp (beam energy) and tissue composition
- Detector contrast: determined by II characteristics and TV camera
- Contrast ratio: brightness in open field / brightness under 10% lead disc — modern IIs exceed 15:1
- CsI tubes have better contrast than older ZnCdS tubes
- Contrast degrades as II ages
- Factors reducing contrast: transmitted x-rays through input phosphor, retrograde light from output phosphor, veiling glare

**3. Resolution:**
- Measured in line pairs per millimeter (lp/mm)
- CsI tubes: ~4 lp/mm in normal mode, ~6 lp/mm in mag mode
- ZnCdS tubes: ~1–2 lp/mm (older technology)
- Resolution is best at the center of the II
- Overall system resolution expressed as Modulation Transfer Function (MTF)

**4. Pincushion Distortion:**
- Curved input phosphor projects onto a flat output phosphor
- Causes image magnification to be greater at the edges → straight lines appear to bow inward
- Comprises 8–10% of image area, mainly at periphery
- Reduced in magnification modes

**5. Vignetting:**
- Fall-off in brightness at the periphery of the image
- Center of output screen is brightest; edges are dimmer
- Caused by pincushion distortion and scattered light in optical coupling
- Best resolution and contrast are at the center of the image

**6. Veiling Glare:**
- Light scatter within the output window of the II
- Adds background signal, reducing contrast
- Quantified by contrast ratio measurement

**7. S-Distortion:**
- Caused by external magnetic fields affecting electron paths within the II
- Produces an S-shaped warping of straight lines
- Can be caused by Earth's magnetic field or nearby equipment`
  },
  {
    title: "Flat Panel Detectors (FPD)",
    content: `FPDs are replacing image intensifiers in modern fluoroscopy systems. They use a flat matrix of detector elements (DELs).

**Basic structure of each DEL (Detector Element):**
- A thin-film transistor (TFT) array on a glass substrate
- Each DEL contains a photodiode + TFT switch
- DEL sizes range from 100–200 μm (high resolution) to 400+ μm

**Two types:**

**1. Indirect Conversion FPD (most common for fluoroscopy):**
- X-rays → Light → Electrical signal (two-step process)
- A scintillator layer (typically CsI:Tl — thallium-doped cesium iodide) converts x-rays to light
- CsI needle structure channels light to minimize spread (like fiber optics)
- Amorphous silicon (a-Si) photodiode array converts light to electrical charge
- Charge is stored in each DEL and read out row-by-row via TFT switches

**2. Direct Conversion FPD:**
- X-rays → Electrical signal directly (one-step process)
- Uses amorphous selenium (a-Se) as the photoconductor
- X-rays create electron-hole pairs directly in the selenium layer
- Better spatial resolution (no light spreading) but less common for real-time fluoroscopy
- More commonly used in mammography

**Advantages of FPD over Image Intensifier:**
- No pincushion or S-distortion (flat detector, no electron optics)
- No vignetting (uniform response across the entire detector)
- No veiling glare
- Wider dynamic range — better handling of both very bright and very dark areas
- Higher DQE (Detective Quantum Efficiency) — more efficient use of x-ray photons = potentially lower dose
- Compact form factor; lighter and more durable
- No degradation of brightness gain over time (no aging phosphors)
- Instant digital output — no analog-to-digital conversion losses

**Disadvantages of FPD vs II:**
- Higher cost
- Potential for dead pixels/DELs
- Potential for image lag in some detector types

**Pixel binning:**
- Combining adjacent DELs to act as one larger pixel
- 2×2 binning: reduces resolution to 50%, data rate drops to 25%
- Used to increase frame rate or reduce noise for real-time fluoroscopy

**Maximum spatial resolution = 1 / (2 × pixel pitch)**
- Example: 200 μm pitch → max resolution = 1 / (0.4 mm) = 2.5 lp/mm`
  },
  {
    title: "TV Camera Systems & Closed-Circuit Television",
    content: `The output image from the II (or FPD signal) is displayed on a TV monitor via a closed-circuit television (CCTV) system.

**Three components of CCTV:**
1. **TV Camera** (coupled to II output phosphor via lens or fiber optics)
2. **Camera Control Unit (CCU)** — amplifies and synchronizes the video signal
3. **TV Monitor** — displays the image via cathode ray tube (CRT) or LCD

**Vidicon Camera (most common traditional camera):**
- Contains a photoconductive target and electron gun inside a vacuum tube
- Light from output phosphor makes the target conductive proportionally
- Electron beam scans the target, reads off the charge → produces video signal
- Advantages: compact, inexpensive
- Disadvantage: image lag — "smearing" of moving objects
- Lag occurs because of slow charge buildup and decay on the target
- Some lag is beneficial — it averages out quantum mottle

**Plumbicon Camera:**
- Fixed gain, very low lag
- Preferred for cardiac catheterization (fast-moving heart)
- Better contrast, less motion blur than vidicon
- But quantum mottle is more visible (no signal averaging from lag)

**Charge-Coupled Device (CCD) Camera:**
- Solid-state semiconductor
- Stores charge when light strikes photosensitive surface
- Transfers charge by coupled readout to produce video signal
- Advantages: smaller, lower power, longer life, very fast discharge (eliminates lag)
- Has replaced vacuum tube cameras in many modern systems

**TV Monitor/Display:**
- Standard US system: 525 scan lines per frame (regardless of monitor size)
- Newer high-resolution systems: 1,000+ scan lines (doubles spatial resolution)
- Frame rate: 30 frames per second
- Interlaced scanning: odd lines first, then even lines → reduces visible flicker
- Kell factor ≈ 0.7 (actual usable vertical resolution = 70% of scan lines)
  - Example: 525 × 0.7 = ~367 effective vertical lines

**Bandwidth (Bandpass):**
- Determines horizontal resolution
- Product of scan lines × frame rate × frequency
- Higher bandwidth = more dots per line = better horizontal resolution
- Horizontal resolution is matched to vertical resolution`
  },
  {
    title: "Automatic Brightness Control (ABC) / Automatic Brightness Stabilization (ABS)",
    content: `The ABC/ABS maintains constant image brightness on the monitor despite variations in patient thickness, density, and system geometry.

**What it does:**
- Interfaces with the x-ray generator via a fast feedback loop
- Adjusts kVp and/or mA automatically to maintain constant output brightness
- Essential for consistent image quality during fluoroscopy

**Brightness sensing methods:**
1. **Photocathode current sensing**: II photocathode current is proportional to radiation input
2. **TV camera signal sensing**: Automatic gain control (AGC) of the camera tube signal
3. **Lens-coupled phototube sensing**: A photomultiplier tube samples the output phosphor light — compensates for field-size changes and mode changes

**Four types of ABC circuits:**
1. **Variable mA, preset kVp**: Operator sets kVp; ABC adjusts mA over a ~20:1 range. Good for selecting kVp optimal for contrast
2. **Variable mA with kVp following**: ABC varies mA; if mA hits upper/lower limit, kVp is adjusted by motor drive
3. **Variable kVp, selected mA**: Operator selects mA; ABC controls kVp. Remembers last operating point for rapid restabilization
4. **Variable kVp AND variable mA**: Both controlled simultaneously — less operator control over contrast

**Important operational principles:**
- Higher kVp = reduced patient dose but lower subject contrast
- Lower kVp = better contrast but higher patient dose
- For iodine contrast studies (arteriography, cholecystography): use lower kVp for best contrast
- For barium GI studies: higher kVp is acceptable → reduces patient dose
- Image brightness varies with mA (linearly) and approximately with kVp² (squaring relationship)

**ABC and magnification mode:**
- Switching to mag mode reduces brightness (fewer electrons hit output phosphor)
- ABC automatically increases mA/kVp to compensate → patient dose increases
- This is an automatic, expected response — not a malfunction`
  },
  {
    title: "Collimation & Beam Restriction",
    content: `**Why collimation is critical:**
- Required by law — the x-ray beam must be restricted to the area of clinical interest
- Reduces total patient dose (less tissue irradiated = lower integral dose)
- Reduces scatter radiation (less volume exposed = less Compton scatter)
- Improves image quality by reducing scatter fog reaching the detector
- Image will NOT be brighter with a larger field size — dose rate at the input phosphor is nearly independent of beam size

**Types of collimation:**
- **Fixed collimators** (cones, cylinders): Attach to the tube housing
- **Adjustable collimators** (shutters/diaphragms): Electronically controlled lead shutters
- Most fluoroscopic tubes have electronically controlled shutters operated from the carriage during both fluoroscopy and spot filming
- For automatic collimating devices, an unexposed border must be visible at all heights above the tabletop

**Regulatory requirements:**
- When the screen carriage is 14 inches above the tabletop with collimators fully open, an unexposed border on the input phosphor must be visible
- The fluoroscopic unit must be constructed so the II intercepts the entire useful beam
- On mobile C-arm units, it must be impossible to energize the beam unless the entire useful beam is intercepted by the image receptor
- It must be impossible to operate a mobile fluoroscope when the collimating cone or diaphragm is not in place

**Integral dose:**
- Total energy absorbed = mass of tissue × absorbed dose
- Units: gram-rads (1 gram-rad = 100 ergs)
- If the irradiated area is doubled, integral dose doubles (assuming same dose to tissue)

**Best practice:** Use the largest II field of view (non-mag mode) with the smallest manually collimated field appropriate for the exam.`
  },
  {
    title: "Filtration Requirements & Beam Hardening",
    content: `**Purpose of filtration:**
- Remove low-energy ("soft") x-ray photons that cannot penetrate to the detector
- These photons would only increase patient skin dose without contributing to the image
- Result: "harder" beam with higher average energy and better patient dose profile

**Types:**
- **Inherent filtration**: Glass tube envelope, housing, oil — typically 0.5–1.0 mm Al equivalent
- **Added filtration**: Aluminum sheets placed in the beam port
- **Total filtration**: Inherent + added; must be at least 2.5 mm Al equivalent for standard fluoroscopy
- For tubes capable of operating above 125 kVp: at least 3.0 mm Al equivalent
- Tabletop material (aluminum, Bakelite, carbon fiber) also adds to total filtration

**Filtration regulatory minimums (by kVp):**
| kVp Range | Minimum Total Filtration |
|-----------|------------------------|
| Below 50 kVp | 0.5 mm Al |
| 50–70 kVp | 1.5 mm Al |
| Above 70 kVp | 2.5 mm Al |

**Effects of filtration:**
- Reduces quantity of low-energy photons (shifts spectrum to higher average energy)
- Increases HVL (beam is more penetrating)
- Reduces patient skin dose
- Subtly improves image quality and reduces scatter

**Beam quality verification:**
- Measured via HVL
- At 80 kVp with proper filtration: HVL should be not less than 3.0 mm Al
- X-ray beam intensity at tabletop should not exceed 2.2 R/min per mA at 80 kVp`
  },
  {
    title: "Source-to-Skin Distance (SSD) & Target-to-Panel Distance (TPD)",
    content: `**Why distance matters:**
- Patient skin dose is governed by the inverse square law
- Increasing distance between x-ray source and patient skin reduces entrance dose
- At the same time, the II must be kept as close to the patient as possible

**Inverse Square Law:**
- I₁/I₂ = (D₂)²/(D₁)²
- Doubling the distance reduces intensity to 1/4
- Tripling the distance reduces intensity to 1/9
- Halving the distance quadruples the intensity

**Regulatory minimums for SSD/TPD:**
| Equipment Type | Minimum Distance |
|---------------|-----------------|
| Stationary fluoroscope (undertable tube) | Not less than 12 inches (30 cm); SHOULD be at least 18 inches (45 cm) |
| Mobile fluoroscope (C-arm) | Not less than 12 inches (30 cm) |

**Distance impact on dose:**
- Increasing TPD from 12 inches to 18 inches reduces patient skin entrance exposure by approximately 30%
- An 18-inch distance is optimal for most fluoroscopic examinations
- The spacer/cone on portable C-arms that maintains minimum SSD must never be removed

**Patient-to-image intensifier distance:**
- Should be as SHORT as possible
- With ABC systems: moving the II away from the patient → fewer x-rays intercepted → ABC increases mA → patient dose increases
- For any fluoroscopic setup: maximize source-to-skin distance AND minimize patient-to-detector distance

**Entrance skin dose location:**
- Undertable tube: entrance skin = surface closest to tabletop (inferior/posterior surface)
- Overtable tube/C-arm: entrance skin = surface toward the x-ray tube (superior/anterior surface)
- The surface closest to the x-ray source always receives the highest dose`
  },
  {
    title: "Scatter Radiation & Isoexposure Patterns",
    content: `**Scatter radiation in fluoroscopy:**
- The patient is the PRIMARY source of scatter radiation in the fluoroscopy room
- Scatter is produced mainly by Compton interactions within the patient
- Scatter radiation is what exposes the operator and other personnel

**Factors that INCREASE scatter:**
1. Higher kVp — more Compton interactions
2. Larger field size — greater tissue volume irradiated
3. Thicker body part — more tissue for x-rays to interact with

**Operator dose relationship:**
- Operator dose from scatter is DIRECTLY PROPORTIONAL to patient dose
- Reducing patient dose automatically reduces operator dose
- At 1 foot from the patient, scatter can be as high as 500 mR/hr

**Isoexposure contours (scatter radiation map):**
- Scatter intensity is highest on the x-ray tube side of the patient
- For undertable tube configurations:
  - Highest scatter is below the table and around the patient's entrance surface
  - The operator at the carriage side receives less scatter because the patient absorbs much of it
- For C-arm configurations:
  - Scatter is most intense on the side where the x-ray tube is located
  - Rule of thumb: stand on the detector/II side, not the tube side

**General scatter rule of thumb:**
- At 1 meter from the patient: scatter is approximately 0.1% (1/1000) of the entrance skin exposure
- This ratio varies with field size, kVp, and patient thickness

**Reducing operator exposure from scatter:**
- Increase distance from the patient (inverse square law applies to scatter sources too)
- Use protective barriers (curtains, Bucky slot cover, mobile shields)
- Wear lead aprons (0.25 mm Pb reduces scatter exposure ~97%; 0.5 mm Pb reduces ~99.9%)
- Minimize fluoroscopy time and field size`
  },
  {
    title: "C-Arm Configurations & Mobile Fluoroscopy",
    content: `**C-arm design:**
- The x-ray tube and image receptor are mounted on opposite ends of a C-shaped arm
- This mechanically maintains constant alignment between tube and receptor
- Can be rotated around the patient for multiple viewing angles

**C-arm orientations:**
- **Standard**: Tube below, II above
- **Inverted**: Tube above, II below (used in some surgical applications)
- **Lateral/oblique**: C-arm tilted for cross-table or angled views

**Isocentric C-arm:**
- The center of rotation is at a fixed point (isocenter)
- As the C-arm rotates, the anatomy at the isocenter stays in the field of view
- Preferred for vascular and interventional work

**Non-isocentric C-arm:**
- Center of rotation is NOT at a fixed anatomical point
- Requires repositioning after each angular change
- Less expensive; used for simpler procedures (orthopedic)

**Mobile C-arm regulatory requirements:**
- Minimum SSD: 12 inches (30 cm) — enforced by a fixed spacer/cone on the tube
- Image intensification must be provided (conventional screens are prohibited)
- Cannot operate if collimating cone/diaphragm is not in place
- Cannot energize unless entire useful beam is intercepted by the image receptor
- Maximum dose rate: 5 R/min measured at 30 cm from the input surface of the II
- Personnel monitoring required for all operators of mobile equipment
- Protective aprons of at least 0.25 mm Pb must be worn

**Operational recommendations for mobile fluoro:**
- Use longest possible cone/spacer to maximize SSD (never remove the spacer)
- Incorporate last-frame-hold for dose reduction
- Use sterile wraps when in a sterile field
- Use waterproof wraps for the portion under the patient
- Secure all functioning locks during use
- An audible indicator must sound when radiation is being produced
- Incorporate a cumulative fluoroscopic time display on the video monitor`
  },
  {
    title: "Exposure Switch, Cumulative Timer & Safety Interlocks",
    content: `**Dead-Man Switch (Exposure Switch):**
- The fluoroscopic exposure switch MUST be of the dead-man type
- This means: radiation terminates immediately when the operator releases pressure
- The conventional foot pedal is a dead-man type switch
- Prevents accidental prolonged exposures
- Care must be taken not to accidentally activate the foot switch before or after the examination
- Only activated during actual fluoroscopic observation

**Cumulative Manual-Reset Timer:**
- Required on all fluoroscopic equipment
- Activated by the exposure switch
- Records total x-ray beam "on" time
- After a predetermined time limit (NOT to exceed 5 minutes), it must either:
  1. Produce an audible signal, OR
  2. Temporarily interrupt the x-ray beam
- Must be manually reset — the operator consciously resets it to continue
- Primary purpose: assist in protecting the patient from prolonged, unnecessary radiation exposure
- A digital readout of cumulative fluoro time should be on the TV monitor
- Does NOT automatically terminate the exam — just alerts the operator

**Safety Interlocks:**
- The II must be coupled with the x-ray tube and interlocked so the tube cannot be energized when the II is in the parked position
- On mobile units: beam cannot be generated unless the entire useful beam is intercepted by the image receptor
- The collimating cone/diaphragm must be in place for the unit to operate

**High-Level Control (Boost Mode):**
- Provides tube currents of 10–20 mA (up to 40 mA in some systems)
- Entrance dose rate 2–10 times higher than standard fluoroscopy
- Requires special activation (key, interlock, additional person)
- A continuous audible signal must be heard while activated
- Dose rate limit: 20 R/min at the tabletop (unless recording devices are in use)
- Used for interventional angiography and cardiology where fine guidewires/catheters must be visualized
- Correct usage: locate area of interest in normal mode first, then activate boost only when needed

**Exposure rate limits summary:**
| Mode | Maximum Tabletop Dose Rate |
|------|---------------------------|
| Routine fluoroscopy (with ABC) | 10 R/min |
| Routine fluoroscopy (without ABC) | 5 R/min |
| High-level control (boost) | 20 R/min |
| Standard target: average patient | 1–5 R/min typical |`
  },
  {
    title: "Beam Splitter Mirror & Optical Coupling",
    content: `**Beam Splitter Mirror:**
- Positioned between the II output phosphor and the recording/viewing devices
- Partially reflective, partially transmissive
- Typical split: 10% of light to the TV camera, 90% to cine/photospot camera (or vice versa depending on system design)
- Allows simultaneous viewing and recording

**Optical Coupling Systems:**
- **Lens coupling**: A lens system conveys the image from the output phosphor to the TV camera or film camera
- **Fiber optic coupling**: Direct connection minimizes light loss (used in some systems)
- **Tandem lens system**: Two lenses face-to-face with an air gap — allows insertion of beam splitter, aperture, and other optical devices

**Aperture (Iris Diaphragm):**
- Located in the optical coupling path
- Controls the amount of light reaching the cine or photospot film
- Defined by the f-number (f-stop)
- f-number = focal length / lens diameter
- Lower f-number = larger aperture = more light = faster lens = less patient dose
- Higher f-number = smaller aperture = less light = slower lens = more patient dose

**Light distribution from II:**
- Best resolution and brightness is at the CENTER of the output phosphor
- Brightness falls off toward the periphery (vignetting)
- Optical coupling contributes to additional vignetting from scattered light effects`
  },
  {
    title: "Cinefluorography (Cine) & Dynamic Recording",
    content: `**Cinefluorography:**
- Uses a movie camera to record series of static images from the output phosphor at high speed
- Nearly all studies use 35 mm film for heart imaging
- Patient dose is significantly higher than any other recording method

**Synchronization:**
- Camera shutters operate at the same frequency as x-ray pulses
- X-rays only fire when the shutter is open (no exposure during film transport)
- All modern equipment is synchronized — eliminates wasted radiation

**Frame rates:**
- Divisions of 60: 7.5, 15, 30, 60, 90, 120 frames/second
- Higher frame rate = better motion capture but higher patient dose
- Dose is directly proportional to frame rate
- 30 fps is adequate for most fluoroscopic needs
- 60+ fps used for fast cardiac motion

**Film sizes:**
- 16 mm: lower dose, lower image quality
- 35 mm: higher dose, higher image quality; standard for cardiac studies
- Dose for cine: approximately 10× that of routine fluoroscopy per frame at the same kVp
- Patient entrance dose for cine: 50–150+ rads for a complete study

**Framing modes:**
- **Exact framing**: Intensifier image matches smallest film dimension — no image lost, 58% of film used
- **Overframing**: Image is larger than film frame — some image is lost (clipped at edges)
- **Total overframing**: Image equals film diagonal — 100% of film used but 39% of image wasted
- **Underframing**: Image is smaller than film — should be avoided

**Video Tape Recording (alternative):**
- Advantages: instant replay, no additional patient dose, no processing needed
- Disadvantages: lower resolution than cine film, fixed 30 fps rate
- VHS (1/2 inch) and U-matic (3/4 inch) formats
- S-VHS offers best standard videotape resolution`
  },
  {
    title: "Pulsed Fluoroscopy & Dose-Saving Technologies",
    content: `**Pulsed Fluoroscopy:**
- Uses short x-ray pulses (≤5 ms each) synchronized to the video camera readout
- Each pulse creates a single image that is digitized and stored in a frame buffer
- Frame is continuously displayed until the next pulse replaces it
- Available frame rates: 30, 15, 7.5, 3.75 frames/sec (and lower)
- Lower frame rates = proportionally lower dose
- At 15 fps: approximately 50% dose reduction compared to continuous 30 fps
- At 7.5 fps: approximately 75% dose reduction
- Fast-moving objects may appear jerky at very low frame rates
- Best suited for procedures with little patient motion

**Last-Image-Hold (Last-Frame-Hold / "Sticky Fluoro"):**
- After releasing the foot switch, the last fluoroscopic frame remains displayed on the monitor
- Allows the operator to study the image without continued radiation
- Significant dose reduction for procedures not requiring real-time motion observation

**Electronic Radiography / Video Disc Recording:**
- Combines advantages of fluoroscopy (real-time) with radiography (short exposure)
- Stores a single frame on video disc after brief fluoro exposure (1/3 to 1/2 second down to 5 ms)
- Exposure terminates automatically even if foot switch is held
- Manufacturers report up to 95% dose reduction compared to continuous fluoro
- Frame rates: 1–30 images/second

**Digital Photospot Imaging:**
- Uses high-resolution TV camera with digital acquisition
- Instant playback; possible subsequent image enlargement
- Resolution slightly less than conventional film but dose savings are significant

**Photospot Film Cameras:**
- Photograph output phosphor image on small format film (70, 100, or 105 mm)
- Patient dose per image: approximately 50% of conventional cassette spot films
- Larger film format = better quality but slightly more dose
- Even with 105 mm film: dose per spot is about half that of a cassette spot film

**Dose comparison (approximate ranking, highest to lowest dose per image):**
1. Conventional cassette spot film (highest)
2. Cine (35 mm)
3. Cine (16 mm)
4. Photospot film (105 mm)
5. Photospot film (70 mm)
6. Digital photospot
7. Fluoroscopy frame (lowest per frame)`
  },
  {
    title: "Visual Physiology: Rods, Cones & Room Lighting",
    content: `**The Human Eye — Two types of light receptors in the retina:**

**Cones (Photopic Vision):**
- Function in bright light (daylight conditions)
- Concentrated at the CENTER of the retina (fovea centralis)
- Perceive COLOR
- Provide HIGH visual acuity — fine detail perception
- Photopic acuity is approximately 10× greater than scotopic acuity
- Image intensifiers were specifically designed to bring the image into the photopic (cone vision) range

**Rods (Scotopic Vision):**
- Function in dim light (night/dark-adapted conditions)
- Concentrated at the PERIPHERY of the retina
- Perceive shades of GRAY only (no color)
- Provide POOR visual acuity
- Better at detecting dim objects — this is why dimly lit objects are seen better with peripheral vision (averted gaze)
- Old non-intensified fluoroscopy relied on scotopic (rod) vision after 15–20 minutes of dark adaptation

**Clinical importance for fluoroscopy:**
- With image intensifiers and TV monitors, the image is bright enough for CONE (photopic) vision
- No dark adaptation period needed (unlike old-style direct fluoroscopy screens)
- Room lighting should be DIM (not completely dark) to enhance visualization of the TV image
- Excessive room light decreases ability to resolve detail on the TV screen
- If the operator cannot see well → may increase mA/kVp → increased patient dose

**Image perception parameters:**
- Normal viewing distance for a fluoroscopy monitor: 12–15 inches
- Eye integration time (recognition time): approximately 0.2 seconds
- If an image is not bright enough, prolonged observation will NOT improve it — the brain integrates in ~0.2 sec and further staring adds nothing
- Brightness and contrast on the TV monitor must be adjusted properly — brightness can be increased indefinitely but this does NOT improve image quality
- Optimal: set contrast to near maximum, then adjust brightness for satisfactory luminance`
  },
  {
    title: "Grids, Cassettes & Accessory Equipment",
    content: `**Radiographic Grids:**
- Function: reduce scattered radiation reaching the image receptor
- Placed between the patient and the input phosphor of the II
- Composed of thin lead strips alternating with radiolucent interspace material
- Fluoroscopy typically uses low-ratio grids (e.g., 8:1)
- Grid ratio = height of lead strip / width of interspace
- Higher ratio grids remove more scatter but require more precise alignment and higher technique

**Cassettes:**
- Thin, light-tight x-ray film holders with front and back panels
- Contain intensifying screens (convert x-rays to light to expose film)
- Front must be low atomic number material (carbon fiber, cardboard, Bakelite, or aluminum)
- For spot filming: positioned between patient and II

**Intensifying Screens:**
- Convert x-ray beam energy into visible light → expose the x-ray film
- Faster screens require less dose but produce slightly lower resolution
- Rare earth screens (gadolinium, lanthanum) are more efficient than older calcium tungstate

**Tabletop requirements:**
- Made of low-absorption material: aluminum, Bakelite, or carbon fiber
- Carbon fiber significantly reduces patient dose (lowest absorption)
- Aluminum equivalence of tabletop (with cassette tray) may not exceed 1 mm Al at 100 kVp

**Protective curtains/drapes:**
- At least 0.25 mm lead equivalent
- Positioned between patient and operator
- Intercept scatter radiation from the patient
- Primary purpose: reduce operator dose from scatter
- At 1 foot from patient, scatter can reach 500 mR/hr
- NOT required on C-arm systems

**Bucky slot cover:**
- When the Bucky tray is moved to the end of the table, a ~2-inch gap is left at the operator's gonad level
- Must be automatically covered with at least 0.25 mm lead equivalent material
- Purpose: protect operator's gonads from scatter`
  },
  {
    title: "Protective Barriers & the II as Primary Barrier",
    content: `**Image Intensifier as Primary Protective Barrier:**
- The II assembly serves as the primary protective barrier for the fluoroscopic beam
- Must be at least 2 mm lead equivalent for equipment operating above 125 kVp
- Must intercept the ENTIRE useful x-ray beam
- Must be interlocked with the x-ray tube — tube cannot be energized when II is in parked position

**Three types of radiation in fluoroscopy:**
1. **Primary (useful) beam**: Directed from tube through patient to image receptor
2. **Leakage radiation**: X-rays escaping through the tube housing (must be < 100 mR/hr at 1 meter)
3. **Scatter radiation**: X-rays deflected from the patient (Compton scatter) — main source of operator exposure

**Protective apparel effectiveness:**
| Lead Equivalent | Scatter Reduction |
|----------------|-------------------|
| 0.25 mm Pb | ~97% |
| 0.50 mm Pb | ~99.9% |
| 1.00 mm Pb | Maximum (but very heavy/cumbersome) |

- A lead apron covers approximately 80% of active bone marrow
- Bone marrow NOT covered: skull, arms, clavicles (when facing the patient)
- All persons in the fluoroscopy room (except the patient) must wear aprons of at least 0.25 mm Pb (preferably 0.5 mm)
- Store on proper hangers — never fold (prevents lead cracking)

**Other protective equipment:**
- **Thyroid shields**: 0.25–0.5 mm Pb; worn during close-proximity procedures
- **Protective gloves**: 0.25–0.5 mm Pb; required if hand enters the primary beam
- **Lead glasses/goggles**: 0.25 mm Pb; reduce lens dose by 85–90%; recommended during catheterization and angiography
- **Ceiling-mounted shields**: Leaded glass, very convenient and effective
- **Mobile screen desks**: 1.0–2.0 mm Pb; provide convenient shelfspace

**Gonad shielding:**
- Not less than 0.5 mm lead equivalent
- 0.5 mm Pb reduces gonad dose by approximately 92% (97% primary attenuation minus 5% internal scatter)
- Best type for male fluoroscopy patients: shaped contact shield within an athletic supporter
- Female ovaries are internal → shielding more difficult, may interfere with diagnosis
- Average male gonad dose during barium enema (gonads outside direct beam): ~50 mR/min`
  },
  {
    title: "Exposure Rate Limits & Dose Management Summary",
    content: `**Allowable fluoroscopic exposure rates (at tabletop/panel):**

| Condition | Maximum Rate |
|-----------|-------------|
| Routine fluoro WITH ABC | 10 R/min (at patient entrance) |
| Routine fluoro WITHOUT ABC | 5 R/min (at patient entrance) |
| High-level control (boost) active | 20 R/min |
| Standard target (average patient) | 1–5 R/min typical |
| Per mA at 80 kVp | ≤ 2.2 R/min |

**Dose management techniques (all reduce patient exposure):**
1. Minimize fluoroscopy time — use short "looks" instead of continuous viewing
2. Collimate to the area of clinical interest ONLY
3. Use highest kVp and lowest mA practicable
4. Use the largest II mode (non-magnification) with strict collimation
5. Keep patient-to-II distance as short as possible
6. Maintain maximum practical source-to-skin distance
7. Use pulsed fluoroscopy with lower frame rates when possible
8. Use last-image-hold
9. Use video disc/digital recording for dose reduction (up to 95%)
10. Use photospot cameras instead of cassette spot films (50% dose savings)

**Factors that INCREASE patient dose:**
- Increased mA (direct, linear relationship)
- Increased kVp (increases beam output, but ABC may compensate)
- Increased fluoroscopy time (direct, linear relationship)
- Magnification mode (ABC compensates for brightness loss)
- Increased field size (more tissue irradiated)
- Decreased source-to-skin distance
- Increased patient-to-II distance
- Higher cine frame rates
- Inadequate filtration

**Key dose facts:**
- Doubling fluoro time = doubling dose
- Doubling field area = doubling integral dose
- Cine dose per frame ≈ 10× routine fluoroscopy dose per frame
- Upper GI fluoro (120 sec) could deliver 5–15 rads skin entrance dose
- An AP abdomen radiograph: 100–500 mR skin entrance dose`
  },
  {
    title: "mA, kVp & Technical Factor Relationships",
    content: `**Milliamperage (mA):**
- Measures x-ray tube current (quantity of electrons flowing cathode → anode)
- X-ray output (and patient dose) is DIRECTLY PROPORTIONAL to mA
- Doubling mA doubles dose; halving mA halves dose
- Fluoroscopy: typically 0.5–5 mA (usually 1–3 mA)
- Spot films with cassettes: typically > 100 mA with short exposure time
- mAs (milliampere-seconds) = mA × time = total x-ray quantity produced

**Kilovoltage peak (kVp):**
- Maximum voltage applied across the x-ray tube
- Determines the QUALITY (penetrating ability/energy) of the x-ray beam
- Higher kVp = more penetrating beam, increased x-ray output, reduced subject contrast
- Lower kVp = less penetrating beam, better subject contrast, higher patient skin dose
- X-ray output varies approximately with the SQUARE of kVp change
  - Example: kVp goes from 80 to 88 (10% increase) → ~21% increase in output
  - Going from 80 to ~113 kVp (40% increase) → approximately doubles output

**Optimal technical factor strategy:**
- Use highest kVp consistent with adequate contrast + lowest possible mA
- This maximizes beam penetration while minimizing the number of low-energy photons absorbed by the patient's skin
- For barium studies: higher kVp acceptable (barium absorbs well even at high energies)
- For iodine studies: lower kVp preferred (iodine's K-edge at 33 keV makes low kVp more effective for contrast)

**Relationship summary:**
| Factor Changed | Effect on Patient Dose | Effect on Image |
|---------------|----------------------|-----------------|
| ↑ mA | ↑ Dose (proportional) | Brighter image, less mottle |
| ↓ mA | ↓ Dose (proportional) | Dimmer image, more mottle |
| ↑ kVp | ↑ Output but may ↓ skin dose with lower mA | ↓ Contrast |
| ↓ kVp | ↓ Output, ↑ skin dose if mA must increase | ↑ Contrast |
| ↑ Time | ↑ Dose (proportional) | Longer study |
| ↑ Filtration | ↓ Skin dose | Slightly ↓ output, harder beam |`
  },
  {
    title: "Digital Fluoroscopy & Image Processing",
    content: `**Analog-to-Digital Conversion:**
- The output phosphor image (analog, continuous brightness levels) is converted by an ADC (Analog-to-Digital Converter)
- Digital data is processed and stored in image processor memory
- For viewing: DAC (Digital-to-Analog Converter) converts back to displayable image
- Pixel matrix sizes: typically 512×512 to 1024×1024

**Digital Subtraction Angiography (DSA):**
- Mask mode: A pre-contrast "mask" image is subtracted from post-contrast images
- Only structures with contrast agent remain visible
- Requires patient immobility (motion causes misregistration artifacts)
- K-edge subtraction: subtracts images at energies above and below the K-edge of the contrast agent
- Time-interval difference: continuously changing masks show contrast changes over time

**Image Processing Capabilities:**
- Gray-scale processing (window/level adjustment)
- Edge enhancement
- Frame averaging: averaging multiple frames reduces noise (5 frames → noise to ~44%)
- Digital zoom and magnification
- Last-image-hold (store and display without radiation)

**Digital photospot imaging:**
- Uses high-resolution TV camera + digital acquisition
- Advantages: instant playback, possible subsequent magnification
- Disadvantage: resolution less than film-based photospot

**Advantages of digital over analog:**
- Instant image availability (no processing time)
- Post-processing capabilities (window, level, edge enhancement)
- Easy storage and transmission (PACS integration)
- Dose reduction potential through image processing
- Subtraction imaging capability`
  },
  {
    title: "Personnel Monitoring Devices",
    content: `**Film Badge:**
- Most common personnel monitoring device
- Contains packaged film in a holder with various metal filters
- Filters allow determination of radiation type and energy
- Sensitivity: 10 mR to 700 rads
- Provides a permanent legal record of exposure
- Changed monthly (typically)
- Accuracy: ± 25%

**Thermoluminescent Dosimeter (TLD):**
- Uses lithium fluoride (LiF) crystals
- Radiation excites electrons to trapped energy states
- When heated, trapped electrons release light proportional to absorbed dose
- Accuracy: ± 9% (much better than film badges)
- Disadvantage: once read, the information is erased — NOT a truly permanent record
- Also changed monthly

**Pocket Ionization Chamber (Dosimeter):**
- Pencil-sized; provides immediate reading
- Discharges a capacitor by ionization of air
- Self-reading type or requires external reader
- Disadvantages: no permanent record, requires calibration, sensitive to shock, limited range
- Used IN ADDITION to (not instead of) film badge or TLD

**Audible Warning Device:**
- Usually a Geiger-Mueller tube with audible and visual indicators
- Warns wearer when radiation is present
- Only indicates presence and relative intensity — not accurate dose measurement
- Used as supplement to film badge or TLD during special procedures (cath lab, angiography)

**Badge placement:**
- If wearing a lead apron: badge on the COLLAR, OUTSIDE the apron
- If two badges used: one on collar outside apron, one under apron at waist
- Badge readings are considered whole-body dose unless proven otherwise
- Remove badge before personal medical x-ray exams (not occupational exposure)
- Store at the facility in a safe (low-radiation) area when not worn

**Occupational dose limits (annual):**
| Body Region | Limit |
|-------------|-------|
| Whole body (TEDE) | 5 rem (50 mSv) |
| Skin/extremities | 50 rem (500 mSv) |
| Lens of eye | 15 rem (150 mSv) |
| Minors (< 18 years) | 10% of adult limits |
| Embryo/fetus | 0.5 rem (5 mSv) over gestation |
| Public | 0.1 rem (1 mSv) per year |`
  },
  {
    title: "Time, Distance & Shielding — The Three Cardinal Rules",
    content: `These are the three fundamental principles for reducing radiation dose:

**1. TIME — Minimize exposure duration**
- Dose is directly proportional to time
- Use short "looks" rather than continuous fluoroscopy
- Eye integration time is only 0.2 seconds — prolonged viewing adds no diagnostic value
- Use last-image-hold to study static images
- The cumulative timer (5-minute alarm) reminds the operator of total beam-on time
- Estimate: 5 "looks" at ~12 seconds each ≈ 1 minute of fluoro time
- At 5 R/min: each 12-second look ≈ 400 mR to the patient

**2. DISTANCE — Maximize distance from the source**
- Follows the inverse square law: I₁/I₂ = (D₂)²/(D₁)²
- Doubling distance → dose drops to 1/4
- Tripling distance → dose drops to 1/9
- The operator should stand as far from the patient (scatter source) as practical
- Technologists required to stay in the room should stand where isoexposure curves show lowest levels
- Rule of thumb: as far from the exam table as possible

**Example calculation:**
- Fluoroscopist receives 100 mR/hr at their operating position
- If they remain for 42 minutes: dose = 100 × (42/60) ≈ 70 mR
- Moving twice as far away: dose would be ~25 mR/hr → only ~17.5 mR in 42 minutes

**3. SHIELDING — Place protective material between source and person**
- Lead is the material of choice for x-ray shielding
- Shielding works via absorption of x-ray photons (primarily photoelectric effect in lead)
- Lead aprons: 0.25 mm → 97% reduction; 0.5 mm → 99.9% reduction
- Structural shielding (walls): designed to reduce exposure to public areas below regulatory limits
- Important: persons OUTSIDE the shadow of a shield are NOT protected
- Radiation CAN scatter around corners (bounce/scatter)
- A wall is NOT necessarily safe shielding for the other side unless properly designed

**Combined approach:**
- All three principles should be used together for maximum protection
- ALARA: keep doses As Low As Reasonably Achievable`
  },
  {
    title: "Contrast Media in Fluoroscopy",
    content: `**Purpose:**
- Enhance visualization of structures that have similar x-ray absorption to surrounding tissues
- Work by dramatically increasing x-ray absorption in the filled structure

**Barium Sulfate (BaSO₄):**
- Atomic number: Z = 56
- Used for gastrointestinal tract visualization (upper GI, barium enema)
- Inert, relatively non-toxic when confined to GI tract
- K-edge at 37 keV — effective across wide range of diagnostic energies
- Higher kVp acceptable for barium studies (good absorption even at higher energies)

**Iodine-Based Contrast:**
- Atomic number: Z = 53
- Used for vascular studies, arthrography, cholecystography, urography
- K-edge at 33 keV — lower kVp (60–80 kVp) optimizes contrast for iodine studies
- Available as ionic and non-ionic formulations
- Non-ionic agents have lower osmolality and fewer adverse reactions

**Why contrast media work:**
- Both barium and iodine have MUCH higher atomic numbers than soft tissue (Z ≈ 7.4)
- At diagnostic energies, photoelectric absorption is proportional to Z³
- The difference in absorption between contrast-filled and unfilled structures creates high image contrast

**kVp selection with contrast:**
- Iodine studies: use LOWER kVp for maximum contrast (keeps most photons near the K-edge energy)
- Barium studies: can use HIGHER kVp (barium absorbs well at higher energies) — reduces patient dose
- The ABC system should be set appropriately for the contrast agent being used`
  },
  {
    title: "Quality Assurance & Equipment Testing",
    content: `**Required QA measurements and frequencies:**

**Annual (at minimum) — by qualified health/medical physicist:**
- Tabletop or patient dose rate measurement (units with ABC)
- Dose rate measurements on cineradiography equipment
- Following any major component replacement (tube, ABC, II, power source)

**Every 3 years — for units WITHOUT ABC:**
- Tabletop dose rate measurement

**Weekly — by operator:**
- Monitor x-ray tube current and potential with a designated phantom during ABC operation
- Verify they are in normal range
- Keep logs of all weekly monitoring readings (retain for at least 3 years)

**Daily:**
- Adjust TV monitor brightness and contrast controls
- Processor quality control checks (if film-based) prior to patient imaging

**Periodic checks should include:**
- Brightness gain / conversion factor (deteriorates ~10% per year)
- Resolution (line pairs per millimeter)
- Contrast ratio (10% lead disc method)
- Distortion assessment
- Collimation accuracy
- Timer accuracy
- HVL measurement
- SSD verification
- Exposure rate at tabletop
- Grid alignment
- Protective equipment integrity (lead aprons checked for cracks)

**Focal spot size testing:**
- Acceptable limits are established (see Appendix 11 of Syllabus)
- Tested using pinhole camera, slit camera, or star test pattern
- Compared against manufacturer specifications`
  },
  {
    title: "Key Numbers Quick Reference",
    content: `**Image Intensifier:**
- Input phosphor: CsI (cesium iodide) — ~4 lp/mm resolution (normal), ~6 lp/mm (mag mode)
- Output phosphor: P20 (zinc-cadmium sulfide, green emitting) — 1 inch diameter
- ~2,000 luminescence photons per 25-keV photoelectron
- Accelerating voltage: ~25 kV (25,000 volts)
- Brightness gain: 5,000–20,000
- Conversion factor: 100–300 cd·m⁻²/mR·s⁻¹
- Contrast ratio: >15:1 (modern IIs)
- Brightness gain degradation: ~10% per year
- Pincushion distortion: 8–10% of image area

**Flat Panel Detector:**
- DEL size: 100–400+ μm
- Max spatial resolution = 1/(2 × pixel pitch)
- 2×2 binning: resolution to 50%, data rate to 25%
- DQE: higher than II

**TV System:**
- Standard: 525 scan lines; High-resolution: 1,000+ lines
- Frame rate: 30 fps
- Kell factor: 0.7
- RS-170 video: 1.0 V peak-to-peak

**Dose Limits & Distances:**
- Min SSD stationary: shall not be <12 inches, should be ≥18 inches
- Min SSD mobile: 12 inches (30 cm)
- Routine fluoro max: 5 R/min (no ABC) or 10 R/min (with ABC)
- Boost max: 20 R/min
- Per mA at 80 kVp: ≤2.2 R/min
- Cumulative timer: audible signal at 5 minutes

**Filtration:**
- Total: ≥2.5 mm Al (at >70 kVp); ≥3.0 mm Al (>125 kVp)
- HVL at 80 kVp: ≥3.0 mm Al

**Protective Equipment:**
- Aprons: 0.25 mm Pb → 97% scatter reduction; 0.5 mm Pb → 99.9%
- Bucky slot cover: ≥0.25 mm Pb
- Protective curtains: ≥0.25 mm Pb
- Gonad shield: ≥0.5 mm Pb → ~92% reduction
- Lead glasses: 0.25 mm Pb → 85–90% reduction
- Lead apron covers ~80% of active bone marrow
- Tube housing leakage: <100 mR/hr at 1 meter

**Exposure/Dose:**
- Whole body annual limit: 5 rem (50 mSv)
- Lens of eye annual: 15 rem (150 mSv)
- Skin/extremities annual: 50 rem (500 mSv)
- Public annual: 0.1 rem (1 mSv)
- Eye integration time: 0.2 sec
- Optimal viewing distance: 12–15 inches
- Photopic acuity: 10× scotopic
- Scatter at 1 ft from patient: up to 500 mR/hr
- Only ~5% of incident photons exit the patient unaffected

**Generator Ripple:**
- Single-phase: 100%
- 3-phase 6-pulse: ~13%
- 3-phase 12-pulse: ~4%
- High-frequency: <1%

**Cine:**
- Cine dose ≈ 10× fluoro dose per frame
- Total cine entrance: 50–150+ rads
- Frame rates: divisions of 60 (7.5, 15, 30, 60, 90, 120)

**X-Ray Production:**
- ~99% of electron energy → heat; ~1% → x-rays
- Tungsten K-edge: 69.5 keV
- Pair production threshold: 1.02 MeV (not relevant at diagnostic energies)

**Fluoroscopy mA:**
- Routine fluoro: 0.5–5 mA (usually 1–3 mA)
- Spot films: >100 mA
- Boost: 10–20 mA (up to 40 mA)`
  }
];

export default equipmentPhysicsStudyGuide;
