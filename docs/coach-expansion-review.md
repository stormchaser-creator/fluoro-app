# FluoroPath course expansion — October 18, 2026

The course contains 27 lessons, 27 schematic visual guides, and 200 original multiple-choice items. The added 80 items broaden topics rather than creating a second copy of numerical variants. The previous 12 numerical variants remain included in the displayed total. This is formative educational content, not a clinically or psychometrically validated examination.

## Distribution and pacing

| Category | Official scored items | Course items | 110-item practice quota |
| --- | ---: | ---: | ---: |
| Patient Care | 9 | 24 | 11 |
| Radiation Physics and Biology | 22 | 42 | 27 |
| Radiation Protection | 24 | 61 | 29 |
| Equipment Operation | 22 | 49 | 27 |
| Image Evaluation and QC | 13 | 24 | 16 |

Practice quotas use largest-remainder proportional allocation. These are course allocations across 110 graded practice items, not a claim about the actual exam's pilot-item distribution. The 2026 state candidate handbook, page 47, lists 90 scored plus 20 pilot items, 120 minutes testing, and a 140-minute appointment.

## Sources checked and teaching scope

- [ARRT fluoroscopy outline, effective January 2023](https://assets-us-01.kc-usercontent.com/406ac8c6-58e8-00b3-e3c1-0c312965deb2/fa4e374a-dfe8-4e45-a28a-cc512ee1b224/FO_CSTI_2023.pdf): category weights and topic placement. Course topic labels summarize groups; the copyrighted outline is linked rather than reproduced.
- [2026 Handbook for State Candidates](https://www.arrt.org/pdfs/disciplines/handbooks/state-handbook.pdf): exam length and pacing. All practice items receive feedback; practice percentages are not scaled scores.
- [21 CFR 1020.32](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-J/part-1020/section-1020.32): barrier, continuous-pressure activation, high-level control, rate measurement context, and time alerts.
- [10 CFR 20.1208](https://www.ecfr.gov/current/title-10/chapter-I/part-20/subpart-C/section-20.1208): explicitly labeled declared-worker pregnancy rules. Not presented as a patient dose limit or as a complete statement of California law.
- [ACR Manual on Contrast Media, 2026](https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Contrast-Manual): contrast reaction history, physiologic versus allergic-like symptoms, and response escalation. No standalone treatment dosing added.
- [DICOM official current edition](https://dicom.nema.org/medical/DICOM/current/): imaging data/communication standard, distinct from an archive system.
- [IAEA Radiation Biology handbook](https://www-pub.iaea.org/MTCD/Publications/PDF/TCS-42_web.pdf): cellular mechanisms, repair, radiosensitivity, and oxygen effect.
- IAEA Diagnostic Radiology Physics and the recovered user-provided physics teaching material support the beam/detector/QC explanations. The IAEA diagnostic book was too large for the web reader and its direct download was blocked in this session; do not claim a new full-book online audit. Mathematical relationships and original worked examples were checked separately.

## Assessment integrity and persistence

Seen status records question display, not merely answering. Known attempts/cards exclude items from unseen-only selection even in older backups. Old unrecorded displays cannot be reconstructed. Newness only describes this device and imported progress; it cannot know what was studied elsewhere. Learning a related concept does not count as displaying every associated question.

A new timed session stores its initial freshness classification. Navigation records displays, preserves responses, and persists the original deadline locally. Reload recovery validates IDs, count, mode, response ranges, and index; expired sessions submit rather than restarting. Submission grades unanswered items as incorrect and exposes the entire set in review, so all submitted items become seen. Insufficient category pools fail explicitly without quietly shortening or repeating the set.

The bank supports one initially unseen 110-item set, not multiple independent full-length sets. Exposure within the course can make unseen-only full-length selection unavailable earlier. Coverage gaps remain in detailed California regulation, compliance tolerances and shielding calculations, full privacy/information-system workflows, and device-specific QC and clinical protocols. These are visible in the Coverage tab.

## Verification

`npm test`: 25 passing tests, including full-length category allocation, insufficient pools, legacy backup migration, display tracking, reload recovery, expired-session submission, feedback timing, answer navigation, coverage UI, and visual toggles. `npm run build` and `npm run build:coach` pass. The full PWA has an existing large-chunk warning. Browser/device layout QA was unavailable in this environment; React interactions were exercised in jsdom.


## Recovered ASRT reading paths

The four user-provided 2017 modules inform topic selection and original teaching: Radiation Protection and Safety; Operation and Safety of Fixed Fluoroscopy Units; Mobile Unit Operation and Safety; and Radiation Protection of the Eye. Local extracted text was reviewed for relevant learning goals, geometry, timing, shielding, pediatric protection, monitoring, lens anatomy, and follow-up discussions. No publisher figures, PDFs, quiz stems, answer keys, personal email content, or private Dropbox invitation are included in the course or repository.

Six additional lessons and 40 original items expand these topics. Four reading paths link both existing and new lessons; overlapping lessons mean module question totals must not be added as a count of independent items. Twelve-item module checks favor unattempted questions; these are formative checks, not unseen exam forms or CE-credit quizzes.

Current public checks include [IAEA eye-lens guidance](https://www.iaea.org/sites/default/files/22/06/lensoftheeyeorp.pdf), [10 CFR 20.1201](https://www.ecfr.gov/current/title-10/chapter-I/part-20/subpart-C/section-20.1201), [FDA pediatric imaging](https://www.fda.gov/radiation-emitting-products/medical-imaging/pediatric-x-ray-imaging), and IAEA SSG-46 facility-design and staff-protection guidance linked in the course. Distinctions retained: the NRC lens rule and IAEA framework are different; pulse width, pulse rate, and display refresh are different; a directional scatter principle is not a guaranteed reduction percentage; workload/use factor/occupancy have separate meanings; and older follow-up triggers are not universal current policy. The course does not claim that all four 2017 modules have been audited line by line or that the current commercial ASRT series is identical.

New interaction checks cover module-to-lesson navigation, module quiz selection and feedback, preference for unattempted items, eye-protection and C-arm toggles, occupancy changes, and independently changing pulse width/rate in the visual. All 25 tests and both builds pass; real mobile-browser layout QA remains unavailable.
