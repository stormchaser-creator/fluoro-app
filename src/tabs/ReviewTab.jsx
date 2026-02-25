import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useStudy } from '../context/StudyContext';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { CONFUSABLE_PAIRS } from '../data/confusables';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

const SUB_TABS = ['Missed', 'Confusables', 'Numbers', 'Flagged'];

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
      {/* Sub-tab pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {SUB_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            style={{
              padding: '8px 18px', borderRadius: 20,
              border: subTab === tab ? 'none' : `1px solid ${theme.border}`,
              background: subTab === tab ? theme.primary : 'transparent',
              color: subTab === tab ? '#FFF' : theme.textSecondary,
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit', whiteSpace: 'nowrap',
              minHeight: 36,
            }}
          >
            {tab}
            {tab === 'Missed' && missedQuestions.length > 0 && (
              <span style={{
                marginLeft: 6, background: subTab === tab ? 'rgba(255,255,255,0.25)' : theme.errorBg,
                color: subTab === tab ? '#FFF' : theme.error,
                padding: '2px 7px', borderRadius: 10, fontSize: 12,
              }}>
                {missedQuestions.length}
              </span>
            )}
            {tab === 'Flagged' && flaggedQuestions.length > 0 && (
              <span style={{
                marginLeft: 6, background: subTab === tab ? 'rgba(255,255,255,0.25)' : theme.warningBg,
                color: subTab === tab ? '#FFF' : theme.warning,
                padding: '2px 7px', borderRadius: 10, fontSize: 12,
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
            <Card style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, marginBottom: 6 }}>No Missed Questions</div>
              <div style={{ fontSize: 14, color: theme.textMuted }}>Questions you get wrong will appear here for review.</div>
            </Card>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 14, color: theme.textMuted }}>
                  {missedIdx + 1} of {missedQuestions.length}
                </div>
                <button
                  onClick={() => { studyDispatch({ type: 'CLEAR_MISSED' }); setMissedIdx(0); }}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: `1px solid ${theme.border}`,
                    background: 'transparent', color: theme.textMuted, fontSize: 13,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Clear All
                </button>
              </div>
              <Card accent={domainColors[missedQuestions[missedIdx].domain]} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: domainColors[missedQuestions[missedIdx].domain], textTransform: 'uppercase', marginBottom: 8 }}>
                  {DOMAINS.find(d => d.id === missedQuestions[missedIdx].domain)?.name}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: theme.text, lineHeight: 1.5, marginBottom: 16 }}>
                  {missedQuestions[missedIdx].q}
                </div>
                {showMissedAnswer ? (
                  <div style={{
                    background: theme.answerBg, border: `1px solid ${theme.answerBorder}`,
                    borderRadius: 10, padding: 16,
                  }}>
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
          <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16 }}>
            Tap a pair to reveal why they're commonly confused on exams.
          </div>
          {CONFUSABLE_PAIRS.map((item, i) => (
            <Card
              key={i}
              onClick={() => setRevealedPairs(prev => ({ ...prev, [i]: !prev[i] }))}
              style={{ marginBottom: 10, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {item.pair.map((term, j) => (
                  <span key={j}>
                    <span style={{
                      background: theme.primaryLight, color: theme.primary,
                      padding: '4px 12px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    }}>
                      {term}
                    </span>
                    {j < item.pair.length - 1 && (
                      <span style={{ color: theme.textMuted, margin: '0 4px', fontSize: 14 }}>vs</span>
                    )}
                  </span>
                ))}
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
              <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16 }}>
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
                    <span style={{ fontSize: 13, color: theme.textMuted }}>
                      {d.keyNumbers.length} values
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setNumberDomain(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', color: theme.primary,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0,
                  marginBottom: 16, fontFamily: 'inherit',
                }}
              >
                ← All Domains
              </button>
              <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, marginBottom: 4 }}>
                {DOMAINS.find(d => d.id === numberDomain)?.icon} {DOMAINS.find(d => d.id === numberDomain)?.name}
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>
                Tap each number to reveal / hide it.
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
                    fontSize: 14,
                    color: revealedNums[i] ? theme.text : theme.textMuted,
                    lineHeight: 1.6,
                    fontWeight: revealedNums[i] ? 500 : 400,
                    filter: revealedNums[i] ? 'none' : 'blur(5px)',
                    transition: 'filter 0.2s, color 0.2s',
                    userSelect: revealedNums[i] ? 'auto' : 'none',
                  }}>
                    {num}
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
                Toggle All
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Flagged Questions */}
      {subTab === 'Flagged' && (
        <div>
          {flaggedQuestions.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏳️</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, marginBottom: 6 }}>No Flagged Questions</div>
              <div style={{ fontSize: 14, color: theme.textMuted }}>Flag questions during quizzes to review them later.</div>
            </Card>
          ) : (
            <div>
              {flaggedQuestions.map((q, i) => (
                <Card key={i} accent={domainColors[q.domain]} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: domainColors[q.domain], textTransform: 'uppercase' }}>
                      {DOMAINS.find(d => d.id === q.domain)?.name}
                    </div>
                    <button
                      onClick={() => studyDispatch({ type: 'TOGGLE_FLAG', questionId: q.id })}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 16, color: theme.warning, padding: 0,
                      }}
                    >
                      🚩
                    </button>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, lineHeight: 1.5, marginBottom: 10 }}>
                    {q.q}
                  </div>
                  <div style={{
                    background: theme.answerBg, border: `1px solid ${theme.answerBorder}`,
                    borderRadius: 8, padding: 12,
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
