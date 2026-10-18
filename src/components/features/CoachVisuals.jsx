import { useState } from 'react';

const BLUE = '#287DB0', AMBER = '#C07518', RED = '#C7473D';
function Arrow({ x1, y1, x2, y2, color = BLUE, dashed = false }) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / length, uy = (y2 - y1) / length;
  const bx = x2 - ux * 12, by = y2 - uy * 12;
  return <g><line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth="3" strokeDasharray={dashed ? '6 5' : undefined} /><polygon points={`${x2},${y2} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`} fill={color} /></g>;
}
function Diagram({ title, description, children }) {
  return <div className="coach-svg-scroll"><svg viewBox="0 0 600 245" role="img" aria-label={title}><title>{title}</title><desc>{description}</desc>{children}</svg></div>;
}
function Flow({ steps }) {
  return <ol className="coach-visual-flow">{steps.map(([label, detail]) => <li key={label}><strong>{label}</strong><span>{detail}</span></li>)}</ol>;
}

export default function LessonVisual({ lessonId }) {
  const [setting, setSetting] = useState(80);
  const [alternate, setAlternate] = useState(false);
  let title, content, caption;
  if (lessonId === 'production') {
    title = 'Follow the electron; then follow the x-ray';
    content = <><Diagram title="Electron flow from cathode to anode, with x-rays leaving the target" description="Electrons move inside the tube from a heated cathode to an anode. The emitted x-rays are a different particle stream leaving the target."><rect x="20" y="35" width="560" height="170" rx="55" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M65 110q10 -30 20 0t20 0t20 0" fill="none" stroke={RED} strokeWidth="5" /><text x="45" y="175" fill="currentColor" fontSize="18">Cathode (−)</text><text x="195" y="80" fill={BLUE} fontSize="18">electrons</text><Arrow x1="145" y1="110" x2="405" y2="110" /><path d="M420 65L450 145L480 145L450 65Z" fill={AMBER} /><text x="410" y="175" fill="currentColor" fontSize="18">Anode (+)</text><Arrow x1="437" y1="122" x2="355" y2="225" color={AMBER} /><Arrow x1="444" y1="125" x2="505" y2="225" color={AMBER} /><text x="365" y="240" fill={AMBER} fontSize="18">x-ray photons</text></Diagram><label htmlFor="tube-kvp">Tube potential: {setting} kVp</label><input id="tube-kvp" type="range" min="50" max="120" step="10" value={setting} onChange={e => setSetting(Number(e.target.value))} /><output>Maximum photon energy: {setting} keV</output></>;
    caption = 'Blue: electrons inside the tube. Amber: x-rays leaving the target. Changing kVp changes the energy ceiling; it does not make every photon equal to that ceiling.';
  } else if (lessonId === 'interactions') {
    title = 'Absorbed is different from scattered';
    content = <><div className="coach-actions"><button aria-pressed={!alternate} onClick={() => setAlternate(false)}>Photoelectric absorption</button><button aria-pressed={alternate} onClick={() => setAlternate(true)}>Compton scattering</button></div><Diagram title={alternate ? 'Compton photon changes direction and transfers energy to an electron' : 'Photoelectric absorption removes the incident photon'} description="An incoming x-ray reaches an atom. Absorption removes the photon; Compton scatter leaves a photon traveling in a new direction."><circle cx="290" cy="125" r="57" fill="none" stroke="currentColor" opacity=".5" /><circle cx="310" cy="125" r="12" fill={AMBER} /><circle cx="260" cy="125" r="7" fill={BLUE} /><Arrow x1="35" y1="125" x2="246" y2="125" color={AMBER} /><text x="40" y="95" fill="currentColor" fontSize="18">incident x-ray</text><Arrow x1="263" y1="135" x2="465" y2="208" /><text x="390" y="238" fill={BLUE} fontSize="18">ejected electron</text>{alternate ? <><Arrow x1="266" y1="113" x2="505" y2="35" color={AMBER} /><text x="360" y="22" fill={AMBER} fontSize="17">lower-energy photon</text></> : <text x="363" y="85" fill={RED} fontSize="18">incident photon removed</text>}</Diagram></>;
    caption = alternate ? 'Compton: some energy goes to an electron; the photon survives with a new direction and less energy. That scattered photon may reach staff or add background to the image.' : 'Photoelectric: the incident photon is absorbed. The ejected electron carries energy into the material. Later atomic relaxation is not drawn.';
  } else if (lessonId === 'biology') {
    title = 'Keep the quantity attached to the unit';
    content = <><Flow steps={[[ 'Gy', 'Absorbed energy per mass; local tissue dose'], ['Sv', 'Equivalent/effective protection quantities'], ['Gy·cm²', 'Air kerma multiplied by field area']]} /><div className="coach-unit-example"><strong>250 mGy</strong><span>÷ 1,000 →</span><strong>0.25 Gy</strong><span>× 100 →</span><strong>25 rad</strong></div></>;
    caption = 'The conversion keeps the same physical quantity. It does not convert a skin absorbed dose into an effective dose by changing the unit label.';
  } else if (lessonId === 'receptors') {
    title = 'The image-intensifier energy relay';
    content = <><Flow steps={[[ 'Input phosphor', 'X-rays → light'], ['Photocathode', 'Light → electrons'], ['Electron optics', 'Accelerate and focus electrons'], ['Output phosphor', 'Electrons → light']]} /><div className="coach-unit-example"><strong>9-inch field → 6-inch field</strong><span>(9/6)² →</span><strong>2.25×</strong></div></>;
    caption = 'The first, second, and last stages perform different conversions. The 2.25× figure is the simplified compensating exposure multiplier for this image-intensifier example, not a rule for every flat-panel zoom mode.';
  } else if (lessonId === 'automatic') {
    title = 'The same image brightness can hide more tube output';
    content = <><div className="coach-actions"><button aria-pressed={!alternate} onClick={() => setAlternate(false)}>Less attenuation</button><button aria-pressed={alternate} onClick={() => setAlternate(true)}>More attenuation</button></div><div className="coach-control-diagram"><div><strong>Attenuating path</strong><div className="coach-thickness" style={{ width: alternate ? '85%' : '40%' }} /><span>{alternate ? 'Thicker / steeper path' : 'Thinner / shorter path'}</span></div><div><strong>Automatic output response</strong><div className="coach-output-bar" style={{ width: alternate ? '90%' : '35%' }} /><span>{alternate ? 'May increase to compensate' : 'Lower output may suffice'}</span></div><div><strong>Displayed brightness</strong><div className="coach-monitor">Target maintained</div></div></div></>;
    caption = 'A qualitative control-system diagram, not a dose calculator. The actual response depends on the machine’s control curve and acquisition mode.';
  } else if (lessonId === 'reduction') {
    title = 'Collimation prevents exposure; cropping only hides pixels';
    content = <><div className="coach-actions"><button aria-pressed={!alternate} onClick={() => setAlternate(false)}>Collimate before exposure</button><button aria-pressed={alternate} onClick={() => setAlternate(true)}>Crop after exposure</button></div><Diagram title={alternate ? 'Cropping leaves the original broad irradiated area unchanged' : 'Collimation restricts the irradiated area before acquisition'} description="The outer patient area contains a central target. Beam restriction reduces the area receiving radiation; a later image crop does not."><rect x="80" y="25" width="440" height="185" rx="25" fill="currentColor" opacity=".08" /><rect x={alternate ? 110 : 230} y={alternate ? 40 : 65} width={alternate ? 380 : 140} height={alternate ? 150 : 100} fill={AMBER} opacity=".4" /><rect x="230" y="65" width="140" height="100" fill="none" stroke={BLUE} strokeWidth="4" strokeDasharray={alternate ? '8 5' : undefined} /><text x="248" y="125" fill="currentColor" fontSize="20">Target</text><text x="130" y="235" fill="currentColor" fontSize="18">Amber = area exposed to the beam</text></Diagram></>;
    caption = alternate ? 'The dashed blue crop changes what is displayed. Radiation was still delivered across the larger amber field.' : 'The shutters restrict the beam before it reaches the patient. Less tissue is irradiated outside the target.';
  } else if (lessonId === 'staff') {
    title = 'Place the shield in the scatter path';
    content = <><div className="coach-actions"><button aria-pressed={!alternate} onClick={() => setAlternate(false)}>Shield covers the path</button><button aria-pressed={alternate} onClick={() => setAlternate(true)}>Gap beside the shield</button></div><Diagram title={alternate ? 'Scatter can reach the operator through a gap' : 'A shield intercepts the patient-to-operator scatter path'} description="The patient is the source of scattered radiation. Shield position must intercept the path toward the operator."><ellipse cx="155" cy="175" rx="85" ry="35" fill="currentColor" opacity=".2" /><text x="90" y="235" fill="currentColor" fontSize="18">Patient / scatter source</text><circle cx="495" cy="58" r="24" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M495 85V165M495 110L465 140M495 110L525 140" fill="none" stroke="currentColor" strokeWidth="3" /><Arrow x1="170" y1="160" x2={alternate ? 467 : 325} y2={alternate ? 64 : 112} color={AMBER} /><rect x="333" y={alternate ? 135 : 50} width="13" height="90" fill={BLUE} /><text x="325" y="28" fill={BLUE} fontSize="18">Shield</text><text x="450" y="210" fill="currentColor" fontSize="18">Operator</text></Diagram></>;
    caption = 'This shows the geometric principle, not a claim of zero transmission. Real protection depends on shield material, coverage, fit, scatter direction, and the complete setup.';
  } else if (lessonId === 'controls') {
    title = 'Three numbers can answer three different questions';
    content = <Flow steps={[[ 'Equipment rate', 'mGy/min · defined measurement point and operating conditions'], ['Worker protection', 'mSv/year · specific dose quantity and tissue'], ['Patient follow-up', 'Procedure-specific trigger · assessment and local policy']]} />;
    caption = 'Before choosing a value, identify the recipient or device, dose quantity, time interval, and applicable jurisdiction. The five-minute time alert is not a patient safe-dose limit.';
  } else if (lessonId === 'skin') {
    title = 'Same total exposure, different concentration';
    const doses = alternate ? [0, 0, 8, 0, 0, 0, 0, 0] : [1, 1, 1, 1, 1, 1, 1, 1];
    content = <><div className="coach-actions"><button aria-pressed={!alternate} onClick={() => setAlternate(false)}>Spread over patches</button><button aria-pressed={alternate} onClick={() => setAlternate(true)}>Repeat the same patch</button></div><div className="coach-dose-patches" role="img" aria-label={alternate ? 'Eight illustrative exposure units concentrated in one patch' : 'Eight illustrative exposure units spread over eight patches'}>{doses.map((dose, i) => <div key={i} style={{ background: dose ? `rgba(199,71,61,${Math.min(.9, .18 + dose * .09)})` : 'transparent' }}><strong>{dose}</strong><span>patch {i + 1}</span></div>)}</div><output>Same total: 8 units · Highest patch: {alternate ? 8 : 1} units</output></>;
    caption = 'A distribution analogy using arbitrary units, not a clinical conversion between KAP and skin dose. It illustrates why a total beam-area quantity cannot specify the maximum local absorbed dose.';
  } else if (lessonId === 'artifacts') {
    title = 'A moving mask creates false edges in subtraction';
    content = <><label htmlFor="mask-shift">Mask misalignment: {setting - 80} illustrative units</label><input id="mask-shift" type="range" min="80" max="115" step="5" value={setting} onChange={e => setSetting(Number(e.target.value))} /><Diagram title="Mask and current anatomy become misregistered when one shifts" description="Two outlines coincide at zero displacement and separate when the mask is shifted. Their subtraction leaves unwanted edges."><rect x="100" y="50" width="175" height="120" rx="30" fill="none" stroke={BLUE} strokeWidth="5" /><rect x={100 + (setting - 80) * 2} y="50" width="175" height="120" rx="30" fill="none" stroke={AMBER} strokeWidth="5" strokeDasharray="8 5" /><text x="90" y="220" fill={BLUE} fontSize="18">Blue: current anatomy</text><text x="320" y="220" fill={AMBER} fontSize="18">Amber: mask</text><text x="350" y="105" fill="currentColor" fontSize="18">{setting === 80 ? 'Aligned outlines' : 'Unwanted edge mismatch'}</text></Diagram></>;
    caption = 'A schematic registration overlay, not a simulated radiograph. Increasing dose does not align a displaced subtraction mask.';
  } else if (lessonId === 'patient') {
    title = 'Verify the links before you expose';
    content = <Flow steps={[[ 'Person', 'Approved unique identifiers'], ['Order', 'Correct intended procedure and relevant history'], ['Understanding', 'Questions, consent, pregnancy / contrast screening'], ['Record', 'Correct association, documentation, authorized access']]} />;
    caption = 'A mismatch anywhere in the chain is a reason to pause and reconcile the information. A room number or a signed form alone does not complete all four steps.';
  } else if (lessonId === 'contrast') {
    title = 'Similar word, different mechanisms: “contrast risk”';
    content = <Flow steps={[[ 'Allergic-like reaction', 'Recognize symptoms; airway / circulation determine urgency'], ['Renal risk', 'AKI, renal function, clinical benefit, preventive assessment'], ['Metformin', 'Impaired clearance → accumulation / lactic acidosis concern']]} />;
    caption = 'Do not treat these as one mechanism. Use the current reaction protocol for acute symptoms and the appropriate renal/medication assessment for other risks.';
  } else if (lessonId === 'pregnancy') {
    title = 'Two exposure settings, two decision frameworks';
    content = <div className="coach-grid"><article className="coach-visual-comparison"><h3>Pregnant patient</h3><p>Clinical benefit and alternatives</p><p>Fetal absorbed dose and gestational timing</p><strong>Individual medical assessment</strong></article><article className="coach-visual-comparison"><h3>Declared pregnant worker</h3><p>Occupational monitoring and protection</p><p>5 mSv pregnancy limit in the stated NRC framework</p><strong>Occupational protection program</strong></article></div>;
    caption = 'A worker limit is not an automatic cancellation threshold for a patient’s medically indicated procedure. Fetal absorbed dose is not read directly from maternal skin dose.';
  } else return null;
  return <section className="coach-visual coach-panel"><span className="coach-eyebrow">SEE THE CONCEPT</span><h2>{title}</h2>{content}<p className="coach-visual-caption">{caption}</p></section>;
}
