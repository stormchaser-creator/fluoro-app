# FluoroPath course expansion — October 18, 2026

The course contains 21 lessons, 21 schematic visual guides, and 160 original multiple-choice items. The added 80 items broaden topics rather than creating a second copy of numerical variants. The previous 12 numerical variants remain included in the displayed total. This is formative educational content, not a clinically or psychometrically validated examination.

## Distribution and pacing

| Category | Official scored items | Course items | 110-item practice quota |
| --- | ---: | ---: | ---: |
| Patient Care | 9 | 18 | 11 |
| Radiation Physics and Biology | 22 | 42 | 27 |
| Radiation Protection | 24 | 41 | 29 |
| Equipment Operation | 22 | 35 | 27 |
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

`npm test`: 22 passing tests, including full-length category allocation, insufficient pools, legacy backup migration, display tracking, reload recovery, expired-session submission, feedback timing, answer navigation, coverage UI, and visual toggles. `npm run build` and `npm run build:coach` pass. The full PWA has an existing large-chunk warning. Browser/device layout QA was unavailable in this environment; React interactions were exercised in jsdom.
