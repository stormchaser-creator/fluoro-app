import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useStudy } from '../context/StudyContext';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { CONFUSABLE_PAIRS } from '../data/confusables';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

const SUB_TABS = [
  { id: 'Missed', label: 'Missed' },
  { id: 'Confusables', label: 'Confusables' },
  { id: 'Numbers', label: 'Numbers' },
  { id: 'Flagged', label: 'Flagged' },
];

export default function ReviewTab() {
  const { theme, domainColors } = useTheme();
  const { study, studyDispatch } = useStudy();
  const [subTab, setSubTab] = useState('Missed');
  const [revealedPairs, setRevealedPairs] = useState({});
  const [numberDomain, setNumberDomain] = useState(null);
  const [revealedNums, setRevealedNums] = useState({});
  const [missedIdx, setMissedIdx] = useState(0);
  const [showMissedAnswer, setShowMissedAnswer] = useState(false);

  // Missed questions
  const missedQuestions = study.missedQuestions.map(id => {
    const [domain, idx] = id.split('-');
    const q = QUESTIONS.filter(q => q.domain === domain)[parseInt(idx)];
    return q ? { ...q, id } : null;
  }).filter(Boolean);

  // Flagged questions
  const flaggedQuestions = study.flaggedQuestions.map(id => {
    const [domain, idx] = id.split('-');
    const q = QUESTIONS.filter(q => q.domain === domain)[parseInt(idx)];
    return q ? { ...q, id } : null;
  }).filter(Boolean);

  return (
    <div>
      {/* Sub-tab segmented control */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: 20,
        backgroundColor: theme.surfaceHover,
        borderRadius: 12,
        padding: 3,
        overflowX: 'auto',
      }}>
        {SUB_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              flex: 1, padding: '9px 12px', borderRadius: 10,
              border: 'none',
              background: subTab === tab.id ? theme.surface : 'transparent',
              color: subTab === tab.id ? theme.primary : theme.textMuted,
              fontWeight: subTab === tab.id ? 700 : 500,
              fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', whiteSpace: 'nowrap',
              minHeight: 38,
              transition: 'all 0.2s',
              boxShadow: subTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              position: 'relative',
            }}
          >
            {tab.label}
            {tab.id === 'Missed' && missedQuestions.length > 0 && (
              <span style={{
                marginLeft: 5,
                background: subTab === tab.id ? theme.error + '20' : theme.errorBg,
                color: subTab === tab.id ? theme.error : theme.error,
                padding: '1px 6px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              }}>
                {missedQuestions.length}
              </span>
            )}
            {tab.id === 'Flagged' && flaggedQuestions.length > 0 && (
              <span style={{
                marginLeft: 5,
                background: subTab === tab.id ? theme.warning + '20' : theme.warningBg,
                color: theme.warning,
                padding: '1px 6px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              }}>
                {flaggedQuestions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Missed Questions */}
      {subTab === 'Missed' && (
        <div>
          {missedQuestions.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: theme.primaryLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 6 }}>No Missed Questions</div>
              <div style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.5 }}>Questions you get wrong will appear here for review.</div>
            </Card>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.textSecondary }}>
                  <span style={{ color: theme.text }}>{missedIdx + 1}</span>
                  <span style={{ color: theme.textDim }}> / {missedQuestions.length}</span>
                </div>
                <button
                  onClick={() => { studyDispatch({ type: 'CLEAR_MISSED' }); setMissedIdx(0); }}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: `1px solid ${theme.border}`,
                    background: 'transparent', color: theme.textMuted, fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.2s',
                  }}
                >
                  Clear All
                </button>
              </div>
              <Card accent={domainColors[missedQuestions[missedIdx].domain]} style={{ marginBottom: 16 }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: domainColors[missedQuestions[missedIdx].domain],
                  textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5,
                }}>
                  {DOMAINS.find(d => d.id === missedQuestions[missedIdx].domain)?.name}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: theme.text, lineHeight: 1.5, marginBottom: 16 }}>
                  {missedQuestions[missedIdx].q}
                </div>
                {showMissedAnswer ? (
                  <div style={{
                    background: theme.answerBg,
                    borderRadius: 10, padding: 16,
                    borderLeft: `3px solid ${theme.answerBorder}`,
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: theme.answerBorder,
                      textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
                    }}>
                      Answer
                    </div>
                    <div style={{ fontSize: 14, color: theme.answerText, lineHeight: 1.7 }}>
                      {missedQuestions[missedIdx].a}
                    </div>
                  </div>
                ) : (
                  <Button fullWidth variant="secondary" onClick={() => setShowMissedAnswer(true)}>
                    Show Answer
                  </Button>
                )}
              </Card>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  fullWidth variant="ghost"
                  disabled={missedIdx === 0}
                  onClick={() => { setMissedIdx(i => i - 1); setShowMissedAnswer(false); }}
                >
                  Previous
                </Button>
                <Button
                  fullWidth variant="primary"
                  disabled={missedIdx >= missedQuestions.length - 1}
                  onClick={() => { setMissedIdx(i => i + 1); setShowMissedAnswer(false); }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confusable Pairs */}
      {subTab === 'Confusables' && (
        <div>
          <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16, lineHeight: 1.5 }}>
            Tap a pair to reveal why they are commonly confused on exams.
          </div>
          {CONFUSABLE_PAIRS.map((item, i) => (
            <Card
              key={i}
              onClick={() => setRevealedPairs(prev => ({ ...prev, [i]: !prev[i] }))}
              style={{ marginBottom: 10, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {item.pair.map((term, j) => (
                    <span key={j}>
                      <span style={{
                        background: theme.primaryLight, color: theme.primary,
                        padding: '5px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                        display: 'inline-block',
                      }}>
                        {term}
                      </span>
                      {j < item.pair.length - 1 && (
                        <span style={{ color: theme.textDim, margin: '0 6px', fontSize: 13, fontWeight: 600 }}>vs</span>
                      )}
                    </span>
                  ))}
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={theme.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    flexShrink: 0, marginLeft: 8,
                    transform: revealedPairs[i] ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              {revealedPairs[i] && (
                <div style={{
                  marginTop: 12, paddingTop: 12,
                  borderTop: `1px solid ${theme.border}`,
                  fontSize: 14, color: theme.textSecondary, lineHeight: 1.7,
                }}>
                  {item.why}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Key Numbers */}
      {subTab === 'Numbers' && (
        <div>
          {!numberDomain ? (
            <div>
              <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16, lineHeight: 1.5 }}>
                Select a domain to drill key numbers and values.
              </div>
              {DOMAINS.map(d => (
                <Card
                  key={d.id}
                  onClick={() => { setNumberDomain(d.id); setRevealedNums({}); }}
                  accent={domainColors[d.id]}
                  style={{ marginBottom: 10, cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{d.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{d.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 600, color: domainColors[d.id],
                        background: (domainColors[d.id] || d.color) + '15',
                        padding: '2px 10px', borderRadius: 10,
                      }}>
                        {d.keyNumbers.length}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setNumberDomain(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none', color: theme.primary,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0,
                  marginBottom: 16, fontFamily: 'inherit',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                All Domains
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }}>{DOMAINS.find(d => d.id === numberDomain)?.icon}</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>
                  {DOMAINS.find(d => d.id === numberDomain)?.name}
                </div>
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>
                Tap each value to reveal or hide it.
              </div>
              {DOMAINS.find(d => d.id === numberDomain)?.keyNumbers.map((num, i) => (
                <Card
                  key={i}
                  onClick={() => setRevealedNums(prev => ({ ...prev, [i]: !prev[i] }))}
                  padding="sm"
                  style={{
                    marginBottom: 8, cursor: 'pointer',
                    borderLeft: `3px solid ${domainColors[numberDomain]}`,
                  }}
                >
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div style={{
                      fontSize: 14,
                      color: revealedNums[i] ? theme.text : theme.textMuted,
                      lineHeight: 1.6,
                      fontWeight: revealedNums[i] ? 500 : 400,
                      filter: revealedNums[i] ? 'none' : 'blur(5px)',
                      transition: 'filter 0.2s, color 0.2s',
                      userSelect: revealedNums[i] ? 'auto' : 'none',
                      flex: 1,
                    }}>
                      {num}
                    </div>
                    <div style={{
                      width: 24, height: 24, borderRadius: 12,
                      background: revealedNums[i] ? theme.primary + '20' : theme.surfaceHover,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginLeft: 8,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke={revealedNums[i] ? theme.primary : theme.textDim}
                        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      >
                        {revealedNums[i] ? (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </>
                        ) : (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </>
                        )}
                      </svg>
                    </div>
                  </div>
                </Card>
              ))}
              <Button
                fullWidth variant="ghost"
                onClick={() => setRevealedNums(prev => {
                  const all = DOMAINS.find(d => d.id === numberDomain)?.keyNumbers.length || 0;
                  const allRevealed = Object.keys(prev).length >= all;
                  if (allRevealed) return {};
                  const obj = {};
                  for (let i = 0; i < all; i++) obj[i] = true;
                  return obj;
                })}
                style={{ marginTop: 12 }}
              >
                {(() => {
                  const all = DOMAINS.find(d => d.id === numberDomain)?.keyNumbers.length || 0;
                  const revealed = Object.keys(revealedNums).length;
                  return revealed >= all ? 'Hide All' : 'Reveal All';
                })()}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Flagged Questions */}
      {subTab === 'Flagged' && (
        <div>
          {flaggedQuestions.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: theme.warningBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.warning} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                  <line x1="4" y1="22" x2="4" y2="15"/>
                </svg>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 6 }}>No Flagged Questions</div>
              <div style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.5 }}>Flag questions during quizzes or mock exams to review them later.</div>
            </Card>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 12 }}>
                {flaggedQuestions.length} flagged question{flaggedQuestions.length !== 1 ? 's' : ''}
              </div>
              {flaggedQuestions.map((q, i) => (
                <Card key={i} accent={domainColors[q.domain]} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: domainColors[q.domain],
                      textTransform: 'uppercase', letterSpacing: 0.5,
                    }}>
                      {DOMAINS.find(d => d.id === q.domain)?.name}
                    </div>
                    <button
                      onClick={() => studyDispatch({ type: 'TOGGLE_FLAG', questionId: q.id })}
                      aria-label="Remove flag"
                      style={{
                        background: theme.warningBg, border: `1px solid ${theme.warning}30`,
                        cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 12, color: theme.warning, fontWeight: 600, fontFamily: 'inherit',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Unflag
                    </button>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, lineHeight: 1.5, marginBottom: 10 }}>
                    {q.q}
                  </div>
                  <div style={{
                    background: theme.answerBg,
                    borderRadius: 8, padding: 12,
                    borderLeft: `3px solid ${theme.answerBorder}`,
                  }}>
                    <div style={{ fontSize: 13, color: theme.answerText, lineHeight: 1.6 }}>
                      {q.a}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
