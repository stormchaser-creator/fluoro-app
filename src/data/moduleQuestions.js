import { LESSONS } from './coachLessons.js';

// Original applications written after reviewing the user's four ASRT readings.
// These are not the readings' test questions. Public sources verify the teaching.
const WORKED_STEPS = {
  'iaea-ceiling': ['Add the five annual values: 5 + 5 + 5 + 5 + 60 = 80 mSv.', 'Divide by five: 80/5 = 16 mSv/year.', 'Compare the maximum single year separately: 60 > 50 mSv. Passing the average condition does not pass both conditions.'],
  'pulse-motion': ['Convert 8 ms to 0.008 s.', 'Multiply speed by time: 50 mm/s × 0.008 s = 0.4 mm.', 'This is motion distance during the pulse; it does not include other blur sources.'],
  'pulse-interval': ['Regular pulse starts are separated by 1/rate.', '1/(10 per second) = 0.1 second.', '0.1 second × 1,000 ms/second = 100 ms. This is not necessarily the exposure width.'],
  'dose-product': ['Write the factors with units: 0.2 mGy/pulse × 10 pulses/s.', 'Cancel pulses and multiply: 2 mGy/s.', 'If converting to a per-minute rate, multiply by 60; do not simply change the unit label.'],
  'rate-compensation': ['Old rate = 12 × 0.1 = 1.2 mGy/s.', 'New rate = 6 × 0.15 = 0.9 mGy/s.', 'Reduction = (1.2 − 0.9)/1.2 = 0.25 = 25%.'],
};
function q(id, lessonId, prompt, pairs, mechanism, source) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  return { id: `module-${id}`, lessonId, category: lesson.category, topic: lesson.title,
    q: prompt, options: pairs.map(([answer]) => answer), answer: 0,
    explanation: `${pairs[0][1]} ${mechanism}`,
    rationales: pairs.map(([, reason], i) => `${i === 0 ? 'Correct: ' : ''}${reason}`),
    steps: WORKED_STEPS[id] || [], source: source || lesson.source, section: lesson.outline };
}
export const MODULE_QUESTIONS = [
  q('lens-opacity', 'eyes', 'A radiation-associated cataract is most directly a change in which structure?', [
    ['The lens, with loss of transparency', 'A cataract is an opacity of the lens.'],
    ['The retina, defined by a malignant tumor', 'Cataract does not mean retinal cancer.'],
    ['The iris, defined by its normal adjustment to light', 'Pupil control is a different process from lens opacity.'],
    ['The cornea, defined by a temporary need for dark adaptation', 'Dark adaptation and corneal function do not define cataract.'],
  ], 'Connect the anatomical target to the effect rather than treating every eye problem as the same injury.'),
  q('torso-eye', 'eyes', 'An interventionalist’s under-apron badge is low, but no ceiling screen or protective eyewear is used. What conclusion is best supported?', [
    ['The protected torso reading does not establish the lens dose', 'The eyes may receive a different, less shielded exposure.'],
    ['The lens dose must equal the under-apron result', 'Different locations and shielding invalidate that assumption.'],
    ['The apron’s lead equivalence automatically applies to the eyes', 'Apron attenuation applies to paths through the apron, not uncovered eyes.'],
    ['The collar and eye can never require monitoring if the torso is low', 'A nonuniform field may justify monitoring near the eye.'],
  ], 'Review protection geometry and the monitoring program rather than extending a torso measurement to every organ.'),
  q('nrc-lens', 'eyes', 'A question explicitly cites 10 CFR 20.1201. Which annual adult lens-dose-equivalent limit belongs to that rule?', [
    ['150 mSv (15 rem)', 'The cited U.S. NRC provision specifies 0.15 Sv for the lens.'],
    ['20 mSv averaged over five years', 'That belongs to the IAEA framework discussed here, not the quoted NRC value.'],
    ['50 mSv total effective dose equivalent', 'This is a different adult occupational quantity in the NRC rule.'],
    ['500 mSv shallow dose equivalent to the extremities', 'This concerns skin/extremities, not the lens limit.'],
  ], 'Name the regulation, quantity, and time period before comparing numbers; do not silently substitute a different jurisdiction.', 'occupational'),
  q('iaea-average', 'eyes', 'Under the stated IAEA lens-dose framework, which summary is complete?', [
    ['20 mSv/year averaged over five years, with no single year above 50 mSv', 'Both the averaging condition and single-year ceiling matter.'],
    ['20 mSv in every five-year period combined', 'That changes an annual average into a much smaller five-year total.'],
    ['150 mSv/year with no averaging condition', 'That is the cited NRC lens value, not this IAEA framework.'],
    ['50 mSv/year is the five-year average target', 'Fifty is the single-year ceiling in this framework, not its average.'],
  ], 'Averaging does not eliminate the separate restriction on an individual year.'),
  q('iaea-ceiling', 'eyes', 'An illustrative five-year lens-dose series is 5, 5, 5, 5, and 60 mSv. How does it compare with the stated IAEA framework?', [
    ['The average is below 20 mSv/year, but the 60 mSv year exceeds the single-year ceiling', 'The total is 80 mSv, giving a 16 mSv/year average, but one year exceeds 50 mSv.'],
    ['It meets both conditions because the average is 16 mSv/year', 'This ignores the separate single-year ceiling.'],
    ['The five-year average is 80 mSv/year', 'Eighty is the sum, not the annual average.'],
    ['It should instead be compared only with a patient skin-dose trigger', 'This is an occupational lens-dose example, not patient skin follow-up.'],
  ], 'Check the average and the maximum year separately; this arithmetic example does not assign a worker’s legal status.'),
  q('hp-three', 'eyes', 'In eye-lens monitoring, what does Hp(3) refer to?', [
    ['Personal dose equivalent at a 3 mm depth', 'It is a specified monitoring quantity relevant to lens-dose assessment.'],
    ['A requirement for 3 mm-thick lead glasses', 'The depth in the quantity is not a shield specification.'],
    ['The patient’s maximum skin dose over three procedures', 'It is not a patient cumulative-dose definition.'],
    ['A three-month exposure limit', 'The numeral describes depth rather than a reporting interval.'],
  ], 'A suitable eye dosimeter and placement close to the eye can improve the estimate under the monitoring program.'),
  q('side-gap', 'eyes', 'A worker turns their head so patient scatter can enter around the side of protective glasses. What is the best interpretation?', [
    ['Protection depends on fit, side coverage, and the incoming scatter direction', 'A gap can bypass the attenuating material.'],
    ['The front-lens attenuation factor applies unchanged to every side path', 'A path around the shield is not attenuated by the front lens.'],
    ['The glasses increase all scattered photon energies', 'This is a coverage problem rather than a universal energy change.'],
    ['A collar badge fills the gap by absorbing all side scatter', 'A badge measures exposure; it is not eye shielding.'],
  ], 'Use appropriate eyewear together with correctly positioned shielding rather than relying on one nominal attenuation value.'),
  q('eye-latency', 'eyes', 'A worker has no visual symptoms immediately after a period of fluoroscopy work. What does that show about later lens effects?', [
    ['Immediate absence of symptoms does not exclude delayed lens changes', 'Radiation-associated lens effects may have a latent period.'],
    ['The lens absorbed no radiation', 'Symptoms are not a measurement of absorbed exposure.'],
    ['The occupational dose record can be discarded', 'Monitoring remains relevant even without immediate symptoms.'],
    ['All future lens opacities must be caused by that work period', 'Many factors can contribute; a later opacity does not establish a specific cause alone.'],
  ], 'Maintain protection and monitoring without treating symptoms as either a dosimeter or proof of causation.'),
  q('mobile-source', 'mobile-setup', 'Before positioning a mobile C-arm, which identification is essential for reasoning about source-to-skin distance?', [
    ['Which end contains the x-ray tube', 'The source location defines the source-to-skin distance.'],
    ['Only which side displays the larger monitor image', 'Display enlargement does not locate the tube.'],
    ['Only the image’s left-right display label', 'Display orientation can be changed and does not establish source position.'],
    ['Only the number of archived frames', 'Stored image count does not identify physical geometry.'],
  ], 'Trace the actual source–patient–receptor chain before adjusting distances.'),
  q('mobile-vertical', 'mobile-setup', 'When the procedure permits a vertical C-arm arrangement, which source/receptor setup generally helps limit upward scatter to staff?', [
    ['Tube under the table and receptor above the patient', 'This generally places more entrance-side scatter below rather than near the staff’s upper body.'],
    ['Tube above the patient because the apron then protects the head', 'An apron does not protect the head and this geometry can increase upward scatter.'],
    ['Receptor as far from the patient as possible', 'Large OID worsens geometry and can provoke higher output.'],
    ['Either setup guarantees identical scatter at every staff position', 'Scatter distribution depends on setup and position.'],
  ], 'Use the required procedural geometry and assess shielding; the principle does not guarantee a fixed reduction in every room.'),
  q('mobile-lateral-change', 'mobile-setup', 'During a change to a lateral view, a staff member ends up beside the beam-entry side. What change is generally helpful when practical?', [
    ['Move toward the receptor side with appropriate shielding and distance', 'The receptor side is generally a lower-scatter location than the entrance/tube side.'],
    ['Stay beside the tube because it emits only toward the detector', 'The patient produces scatter that can reach staff near the tube side.'],
    ['Remove shields because the view is now lateral', 'Lateral work does not remove the need for shielding.'],
    ['Treat the old AP-position badge estimate as an exact new rate', 'The radiation field changes with the projection.'],
  ], 'Recheck the setup after each important repositioning rather than assuming the AP arrangement remains optimal.'),
  q('two-distances', 'mobile-setup', 'A detector is close to the patient, but the tube has also been brought very close to the entrance skin. What is best?', [
    ['Reassess source-to-skin distance as well as detector proximity', 'Small OID and adequate source-to-skin distance solve different parts of the problem.'],
    ['Assume patient dose is optimized because OID is small', 'A small OID alone does not establish favorable entrance-skin geometry.'],
    ['Move only the detector much farther away for every case', 'That can worsen magnification and automatic-control demands.'],
    ['Use display zoom to correct the physical source distance', 'Electronic enlargement does not change the tube’s position.'],
  ], 'Balance receptor proximity, source distance, procedure access, and the system’s operating constraints.'),
  q('mobile-reposition', 'mobile-setup', 'After moving the C-arm into a new projection, what should be checked before resuming exposure?', [
    ['Geometry, staff/shield positions, field restriction, clearance, and dose mode', 'Repositioning can change both the radiation field and the physical setup.'],
    ['Only whether the last stored image is bright', 'Display brightness does not verify the new geometry or output.'],
    ['Only whether the elapsed timer was reset', 'An alert reset does not establish a safe new setup.'],
    ['Only whether the staff kept their original positions', 'The original positions may now be poorly protected.'],
  ], 'The learning goal is to reassess the changed setup rather than follow one memorized room position.'),
  q('mobile-percentage', 'mobile-setup', 'An older article gives an illustrative scatter reduction for moving to the detector side. Can that exact percentage be promised in another operating room?', [
    ['No; geometry, patient size, field, barriers, and location affect the actual reduction', 'The directional protection principle can hold without an identical numerical result.'],
    ['Yes; the percentage is a property of every C-arm shape', 'C-arm shape alone does not specify the scatter field.'],
    ['Yes; a nominal apron thickness fixes every room’s scatter ratio', 'Apron material does not determine all spatial exposure ratios.'],
    ['No; moving position can never reduce scatter exposure', 'Useful positioning can reduce exposure even without a universal exact factor.'],
  ], 'Separate qualitative protection principles from measurements made in a particular setup.'),
  q('mobile-display', 'mobile-setup', 'A display image is rotated electronically after exposure. What physical dose-related condition changes as a result of that action alone?', [
    ['None of the original source, patient, and receptor positions', 'Rotating stored pixels does not change the geometry of the completed exposure.'],
    ['The original beam entry site rotates around the patient', 'A post-exposure display transformation cannot move a past entry site.'],
    ['The accumulated skin exposure is reduced', 'Display processing does not undo absorbed radiation.'],
    ['The actual source-to-skin distance increases', 'Physical source distance requires a physical change in setup.'],
  ], 'Do not confuse the orientation of an image on screen with the position of equipment in the room.'),
  q('pulse-motion', 'pulse-timing', 'A wire moves at 50 mm/s. How far does it move during an 8 ms exposure pulse?', [
    ['0.4 mm', '8 ms = 0.008 s; 50 × 0.008 = 0.4 mm.'],
    ['400 mm', 'That treats milliseconds as seconds.'],
    ['6.25 mm', 'Dividing speed by the numeric pulse width is not distance = speed × time.'],
    ['0.04 mm', 'This is a tenfold unit-conversion error.'],
  ], 'This isolates motion during exposure; other blur sources and processing can still contribute.'),
  q('pulse-interval', 'pulse-timing', 'At 10 pulses/s, what is the time between pulse starts in a regularly spaced sequence?', [
    ['100 ms', 'The interval is 1/10 s = 0.1 s = 100 ms.'],
    ['10 ms', 'That is not the reciprocal of 10 per second.'],
    ['1 ms', 'This would correspond to 1,000 pulse starts per second.'],
    ['The pulse width must be 100 ms', 'Start-to-start interval and exposure duration are different.'],
  ], 'A 100 ms sampling interval can contain a much shorter exposure pulse.'),
  q('width-versus-rate', 'pulse-timing', 'A moving edge is blurred within each frame even though the system displays frequent new frames. Which parameter most directly addresses exposure-time motion blur?', [
    ['Shorter pulse width, with other factors evaluated', 'Less exposure time allows less movement during one pulse.'],
    ['Longer pulse width at unchanged speed', 'Longer exposure allows more movement within each frame.'],
    ['More repeated display frames without new data', 'Repeating a blurred frame does not recover its lost detail.'],
    ['A lower pulse rate alone, with unchanged pulse width', 'This changes update spacing rather than the duration of each exposure.'],
  ], 'Choose the parameter that matches the temporal problem and monitor the exposure-control response.'),
  q('dose-product', 'pulse-timing', 'In a simplified model, a mode delivers 0.2 mGy per pulse at 10 pulses/s. What is its dose rate?', [
    ['2 mGy/s', 'Multiply 0.2 mGy/pulse by 10 pulses/s.'],
    ['0.02 mGy/s', 'Dividing by the pulse count uses the wrong relationship.'],
    ['2 mGy/min', 'The calculation gives a per-second rate, not per minute.'],
    ['50 mGy/s', 'This divides rate by amount rather than multiplying the stated factors.'],
  ], 'The values are deliberately simplified teaching numbers, not a suggested clinical protocol.'),
  q('rate-compensation', 'pulse-timing', 'A mode changes from 12 pulses/s at 0.1 mGy/pulse to 6 pulses/s at 0.15 mGy/pulse. How does its simplified dose rate change?', [
    ['It falls from 1.2 to 0.9 mGy/s: a 25% reduction', 'Compute both products: 12 × 0.1 and 6 × 0.15.'],
    ['It falls by exactly 50% because pulse rate halves', 'That ignores the increased amount per pulse.'],
    ['It increases by 50% because amount per pulse increases', 'That ignores the reduced number of pulses.'],
    ['It stays 1.2 mGy/s because brightness is stable', 'Brightness alone does not specify either product.'],
  ], 'Compare total output per unit time, not one setting in isolation.'),
  q('temporal-alias', 'pulse-timing', 'A rapidly moving object appears to jump or move misleadingly after a large pulse-rate reduction. Which mechanism best fits?', [
    ['Insufficient temporal sampling of the motion', 'Longer gaps between samples can produce stroboscopic or aliased appearances.'],
    ['More acquired gray levels necessarily changed the anatomy', 'Bit depth does not physically change the object.'],
    ['Less geometric magnification always causes stroboscopic motion', 'Temporal sampling is the relevant change in this scenario.'],
    ['The lower rate proves shorter exposure within every pulse', 'Pulse rate does not determine pulse width.'],
  ], 'Select enough temporal information for the task rather than pursuing the lowest numerical rate regardless of image usefulness.'),
  q('display-refresh', 'pulse-timing', 'A monitor refreshes 60 times/s while fluoroscopy acquires 7.5 pulses/s. Must the patient receive 60 new x-ray exposures each second?', [
    ['No; the display can repeat or process existing acquired frames', 'Monitor refresh and radiation acquisition are separate rates.'],
    ['Yes; every display refresh requires a new x-ray pulse', 'This incorrectly equates presentation with acquisition.'],
    ['Yes; the 7.5 setting describes only focal-spot size', 'Pulses per second describes acquisition timing, not spot size.'],
    ['No; therefore no radiation is used during pulsed acquisition', 'Actual acquisition pulses still require radiation.'],
  ], 'Distinguish new patient exposure from displaying information that has already been acquired.'),
  q('primary-secondary', 'shielding', 'Which pairing correctly describes structural barrier roles?', [
    ['Primary: useful beam; secondary: scatter and leakage', 'The names identify the radiation pathways the barriers address.'],
    ['Primary: patient scatter only; secondary: useful beam only', 'This reverses the usual classification.'],
    ['Primary: any apron; secondary: every badge', 'Personal shielding and dosimeters are not definitions of structural barrier roles.'],
    ['Primary: dose recording; secondary: image storage', 'These are information tasks, not shielding categories.'],
  ], 'A room assessment must consider where each radiation component can travel.'),
  q('workload-change', 'shielding', 'A fluoroscopy room adds a second daily shift with similar procedures. Which shielding input most directly increases?', [
    ['Workload', 'More operating use generally increases output over the assessment period.'],
    ['Only occupancy of an unchanged adjacent office', 'The change described concerns room use, not necessarily that office’s occupied fraction.'],
    ['Only the physical wall thickness', 'Using the room more does not alter the existing wall.'],
    ['Only the unit conversion from Gy to rad', 'Unit conversions do not change with scheduling.'],
  ], 'A workload change can require reassessment even though equipment and walls have not moved.'),
  q('use-factor', 'shielding', 'A new procedure directs the useful beam toward a particular wall much more often. Which concept describes this directional change?', [
    ['Use factor for that primary barrier', 'Use factor concerns the share of radiation directed toward a barrier.'],
    ['Occupancy factor because the beam is occupied', 'Occupancy concerns people in the protected location, not beam direction.'],
    ['Half-value layer because time has changed', 'HVL describes attenuation thickness, not the direction distribution.'],
    ['Patient age alone', 'Age does not define the fraction of beam use toward a wall.'],
  ], 'Workload describes the amount; use factor helps describe its distribution toward primary barriers.'),
  q('occupancy-change', 'shielding', 'A nearby storage space becomes a continuously staffed office. Which assumption should be revisited?', [
    ['Occupancy at the protected location', 'The person can now spend much more time in that location.'],
    ['Only the number of photons already absorbed by prior patients', 'Past patient exposure does not define the new office occupancy.'],
    ['Only the C-arm display rotation', 'Display orientation does not determine time spent next door.'],
    ['None, if the fluoroscopy tube is unchanged', 'A changed surrounding occupancy can matter without a new tube.'],
  ], 'Ask the appropriate specialist to review the shielding assessment before assuming the old use classification still applies.'),
  q('barrier-continuity', 'shielding', 'Why should joints, doors, and service penetrations be included in a shielding review?', [
    ['Radiation can take paths through gaps or discontinuities', 'The complete barrier system matters, not just the material at its center.'],
    ['A thick wall guarantees equal attenuation through every opening', 'Openings can bypass the wall material.'],
    ['Only visible-light leaks determine x-ray attenuation', 'Visible-light appearance is not a complete radiation shielding survey.'],
    ['A warning sign supplies the same attenuation as the missing material', 'Signs control awareness/access rather than physically attenuating x-rays.'],
  ], 'Engineering integrity and appropriate access controls perform different protective functions.'),
  q('shielding-professional', 'shielding', 'Why does a conceptual lesson on workload and occupancy not establish a required lead thickness for a particular room?', [
    ['A design needs the actual geometry, output, uses, protected locations, and applicable criteria', 'Several quantitative and jurisdiction-specific inputs are required.'],
    ['Every fluoroscopy room uses one universally sufficient thickness', 'The same construction is not automatically adequate for every use and location.'],
    ['The image matrix alone determines barrier thickness', 'Sampling does not specify the room radiation field.'],
    ['Using an apron removes every structural shielding requirement', 'Personal shielding is not a substitute for a facility design assessment.'],
  ], 'Use a qualified shielding assessment rather than transferring a textbook example directly into construction.'),
  q('pediatric-size', 'pediatric', 'Two children are the same age but substantially different in body thickness. What should guide exposure selection?', [
    ['Size-appropriate protocol and the imaging task', 'Thickness influences attenuation; the task determines the information required.'],
    ['Age alone, using identical settings in both', 'The same age does not imply the same attenuation.'],
    ['An adult default in both to guarantee diagnostic quality', 'Adult settings can deliver unnecessary exposure to smaller patients.'],
    ['The lowest settings regardless of whether anatomy can be evaluated', 'Nondiagnostic imaging can fail the task and cause repeats.'],
  ], 'The FDA emphasizes patient size in optimization, with age also relevant to the overall clinical context.'),
  q('pediatric-repeats', 'pediatric', 'A frightened child repeatedly moves during positioning. Which action addresses avoidable repeat exposure before beam-on?', [
    ['Plan communication, positioning, and appropriate motion control', 'Preparation can reduce failed or repeated acquisitions.'],
    ['Leave continuous fluoroscopy running until cooperation improves', 'This adds exposure during an unproductive interval.'],
    ['Use recording runs for every attempted position', 'That can add unnecessary higher-dose acquisitions.'],
    ['Increase output without addressing the motion', 'More output does not itself solve a cooperation or positioning problem.'],
  ], 'Optimization includes preventing a failed examination, not only adjusting the exposure control.'),
  q('pediatric-grid', 'pediatric', 'A pediatric protocol permits grid removal for a small patient with little scatter. Why can that reduce required output?', [
    ['The system no longer needs to compensate for primary photons absorbed by the grid', 'A grid removes some useful primary radiation as well as scatter.'],
    ['The grid normally creates additional x-rays at the detector', 'The grid attenuates radiation rather than generating the useful beam.'],
    ['Removing the grid always improves all image-quality dimensions', 'The balance depends on patient size, scatter, and the task.'],
    ['The patient’s size is irrelevant once a grid exists', 'Patient size affects scatter production and the benefit of grid use.'],
  ], 'Follow the approved protocol rather than removing the grid indiscriminately.'),
  q('pediatric-task', 'pediatric', 'A lower-dose setting obscures the feature required for the clinical decision. What is the best response?', [
    ['Adjust the protocol to obtain sufficient information with optimized exposure', 'The required task must still be answered.'],
    ['Accept an uninterpretable image because its dose is lowest', 'Lowest numerical dose is not useful if the examination fails.'],
    ['Switch immediately to the highest output for all remaining cases', 'A failed low setting does not justify maximal output in every situation.'],
    ['Assume brighter windowing restores any missing signal', 'Display remapping cannot create information absent from acquisition.'],
  ], 'Optimization seeks adequate information at reasonable exposure, not a universal minimum or maximum setting.'),
  q('pediatric-field', 'pediatric', 'The target anatomy occupies only a small part of the available detector field. Which action prevents unnecessary irradiation outside it?', [
    ['Collimate the physical beam appropriately before exposure', 'Collimation restricts the region irradiated.'],
    ['Crop the image after exposure and regard the cropped dose as removed', 'Cropping changes presentation without undoing exposure.'],
    ['Use the largest field because the patient is small', 'A small patient does not justify unnecessary field extent.'],
    ['Keep exposing during discussion to preserve brightness', 'Image review can often use stored information instead of continued radiation.'],
  ], 'Field restriction can also reduce scatter; assess the system’s automatic-control response.'),
  q('pediatric-explain', 'pediatric', 'A parent asks why an indicated fluoroscopic study is still being considered despite radiation risk. Which response best reflects justification?', [
    ['Explain the expected clinical benefit, risks, suitable alternatives, and dose optimization', 'The decision weighs the individual clinical question and available options.'],
    ['Say that children cannot experience radiation effects', 'Children can be sensitive to radiation-related effects.'],
    ['Say that any radiation risk automatically rules out all imaging', 'An indicated examination can have benefits that outweigh its risks.'],
    ['Promise that a pediatric label makes the dose zero', 'An optimized x-ray examination still uses radiation.'],
  ], 'Use understandable information and involve the responsible clinical team rather than offering a categorical guarantee.'),
  q('alert-not-injury', 'dose-followup', 'A reference-air-kerma alert is reached. What does the alert alone establish?', [
    ['The specified metric reached a trigger for assessment', 'An alert identifies a condition requiring attention, not an injury diagnosis.'],
    ['A skin burn has definitely occurred', 'The display does not directly diagnose tissue injury.'],
    ['Peak skin dose exactly equals the reference reading', 'Actual geometry and field overlap affect their relationship.'],
    ['No further communication is needed if imaging is complete', 'Post-procedure assessment and communication can still be needed.'],
  ], 'Identify the quantity, notify the team, and follow the applicable dose-management process.'),
  q('repeat-region', 'dose-followup', 'A patient had a recent procedure irradiating the same skin region. Why is that relevant to a new dose assessment?', [
    ['Local prior exposure and field overlap can affect the cumulative skin-dose concern', 'The location of prior irradiation matters, not just the number of procedures.'],
    ['Only exposures on the current calendar day can matter', 'A change of date does not automatically eliminate biological relevance.'],
    ['KAP values prove the exact dose to the shared skin patch', 'KAP does not directly specify a local peak skin dose.'],
    ['The old procedure’s images can be deleted to remove the dose', 'Deleting records cannot undo absorbed exposure.'],
  ], 'Provide the relevant history to the clinical team and avoid adding incompatible quantities as though they were one measurement.'),
  q('followup-instructions', 'dose-followup', 'When follow-up after a substantial exposure is indicated, which discharge communication is most useful?', [
    ['What changes to watch for, whom to contact, and the arranged follow-up plan', 'Specific instructions support recognition and timely assessment of delayed effects.'],
    ['Only a raw dose number without its meaning or contact information', 'A number alone does not explain what the patient should do.'],
    ['A guarantee that no symptom can occur after discharge', 'Some effects may appear later.'],
    ['A statement that any later rash is definitely radiation injury', 'A symptom needs clinical assessment rather than automatic attribution.'],
  ], 'Use language the patient can understand and document that the communication occurred.'),
  q('record-specific', 'dose-followup', 'Which entry best supports assessment of a fluoroscopy exposure?', [
    ['The named dose quantity and value, procedure context, relevant geometry, assessment, and actions', 'Specific quantities and clinical context allow meaningful interpretation.'],
    ['“High radiation” with no value, quantity, or action', 'This is too vague to support a useful assessment.'],
    ['Monitor brightness alone', 'Appearance does not specify patient dose.'],
    ['The operator’s collar badge result as the patient skin dose', 'A staff badge and patient dose describe different exposure settings.'],
  ], 'Avoid a bare number without units or a metric name.'),
  q('old-trigger', 'dose-followup', 'An older module gives a specific dose trigger and follow-up interval. How should it be used in a current study app?', [
    ['Check the current source, metric, jurisdiction, and facility process before treating it as a rule', 'Thresholds and follow-up instructions require context and current verification.'],
    ['Apply it universally to every dose metric', 'Different quantities cannot be substituted without assessment.'],
    ['Treat every old numerical statement as invalid automatically', 'Some remain valid; verification, not age alone, determines how to use them.'],
    ['Treat its publication as proof it overrides current policy', 'An educational article is not automatically the controlling current requirement.'],
  ], 'Retain the mechanism while checking clinical and regulatory details that can change.'),
  q('delayed-change', 'dose-followup', 'A patient reports a new skin change after discharge following a complex fluoroscopic procedure. What is the appropriate general response?', [
    ['Arrange clinical assessment and communicate the relevant exposure history', 'Delayed effects are possible, and the cause needs evaluation.'],
    ['Dismiss it because no change was present immediately afterward', 'Absence of an immediate sign does not exclude a delayed effect.'],
    ['Diagnose a radiation burn solely from the KAP display', 'A single integrated metric does not establish the diagnosis.'],
    ['Replace the clinical evaluation with a worker badge reading', 'The worker’s exposure does not characterize the patient’s affected skin.'],
  ], 'Follow the established contact and assessment pathway rather than offering certainty from the display alone.'),
];
