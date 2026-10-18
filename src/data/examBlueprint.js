// Current published ARRT fluoroscopy specification, effective January 1, 2023.
export const BLUEPRINT_URL = 'https://assets-us-01.kc-usercontent.com/406ac8c6-58e8-00b3-e3c1-0c312965deb2/fa4e374a-dfe8-4e45-a28a-cc512ee1b224/FO_CSTI_2023.pdf';
export const EXAM_CATEGORIES = [
  { id: 'patient_care', name: 'Patient Care', count: 9, color: '#F97316', icon: '🩺', domainIds: ['patientcare'] },
  { id: 'rad_physics_bio', name: 'Radiation Physics & Biology', count: 22, color: '#10B981', icon: '🧬', domainIds: ['radbio', 'skineffects'] },
  { id: 'rad_protection', name: 'Radiation Protection', count: 24, color: '#EF4444', icon: '🛡️', domainIds: ['radprotection', 'doselimits'] },
  { id: 'equip_operation', name: 'Equipment Operation', count: 22, color: '#8B5CF6', icon: '⚡', domainIds: ['equipment', 'digital'] },
  { id: 'image_eval_qc', name: 'Image Evaluation & QC', count: 13, color: '#06B6D4', icon: '✅', domainIds: ['qa'] },
].map(c => ({ ...c, pct: Math.round(c.count / 90 * 100) }));

// Existing recall items use domain-local indices in saved review queues.
export function questionIndexInDomain(questions, question) {
  return questions.filter(q => q.domain === question.domain).findIndex(q => q.q === question.q);
}
