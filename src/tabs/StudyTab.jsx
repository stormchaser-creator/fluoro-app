import { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useApp } from '../context/AppContext';
import { useStudy } from '../context/StudyContext';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import STUDY_MATERIAL from '../studyMaterial';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import ProgressBar from '../components/shared/ProgressBar';
import { getIllustration } from '../components/study/StudyIllustrations';

export default function StudyTab({ onLaunchRsvp, navContext, onNavigate }) {
  const { theme, domainColors } = useTheme();
  const { state, dispatch } = useApp();
  const { study, studyDispatch } = useStudy();

  const [subView, setSubView] = useState('read'); // 'read' | 'quiz' | 'topics'
  const [readDomain, setReadDomain] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [quizDomain, setQuizDomain] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState(null);

  // Handle navigation context from HomeTab (resume where left off)
  useEffect(() => {
    if (!navContext?.domain) return;
    // Small delay to ensure study state is hydrated from cloud
    const timer = setTimeout(() => {
      setSubView('read');
      setReadDomain(navContext.domain);
      const material = STUDY_MATERIAL[navContext.domain];
      if (material) {
        const readSet = study.readSections[navContext.domain] || [];
        const nextUnread = material.findIndex((_, i) => !readSet.includes(i));
        setExpandedSection(nextUnread >= 0 ? nextUnread : 0);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [navContext]);

  // Auto-scroll expanded section into view
  useEffect(() => {
    if (expandedSection !== null && readDomain) {
      setTimeout(() => {
        const el = document.getElementById(`study-section-${expandedSection}`);
        if (el) {
          const yOffset = -12;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    }
  }, [expandedSection, readDomain]);

  const filteredQuestions = quizDomain
    ? QUESTIONS.filter(q => q.domain === quizDomain)
    : (() => {
        // Fisher-Yates shuffle for uniform distribution
        const arr = [...QUESTIONS];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      })();

  const markQuiz = (correct) => {
    const q = filteredQuestions[quizIndex];
    studyDispatch({ type: 'RECORD_ANSWER', domain: q.domain, correct, questionIndex: quizIndex });
    dispatch({ type: 'ADD_XP', amount: correct ? 10 : 3 });
    dispatch({ type: 'UPDATE_STREAK' });
    setShowAnswer(false);
    setQuizIndex(prev => Math.min(prev + 1, filteredQuestions.length - 1));
  };

  // Sub-nav pills
  const subNav = (
    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
      {[
        { id: 'read', label: 'Read' },
        { id: 'quiz', label: 'Quiz' },
        { id: 'topics', label: 'Topics' },
      ].map(s => (
        <button
          key={s.id}
          onClick={() => setSubView(s.id)}
          style={{
            flex: 1, padding: '10px 16px', borderRadius: 10,
            border: subView === s.id ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
            background: subView === s.id ? theme.primaryLight : theme.surface,
            color: subView === s.id ? theme.primary : theme.textMuted,
            fontWeight: subView === s.id ? 600 : 400,
            fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
            minHeight: 44,
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );

  // READ SUB-VIEW
  const renderRead = () => {
    if (!readDomain) {
      return (
        <div>
          <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16 }}>
            Select a domain to read study material.
          </div>
          {DOMAINS.map(d => {
            const sections = STUDY_MATERIAL[d.id] || [];
            const readCount = (study.readSections[d.id] || []).length;
            const pct = sections.length > 0 ? Math.round((readCount / sections.length) * 100) : 0;
            return (
              <Card key={d.id} accent={domainColors[d.id]} onClick={() => {
                setReadDomain(d.id);
                // Jump to first unread section
                const readSet = study.readSections[d.id] || [];
                const firstUnread = sections.findIndex((_, i) => !readSet.includes(i));
                setExpandedSection(firstUnread >= 0 ? firstUnread : null);
              }} style={{ marginBottom: 10, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{d.icon}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: theme.text }}>{d.name}</div>
                      <div style={{ fontSize: 13, color: theme.textMuted }}>
                        {readCount}/{sections.length} sections read
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {readCount > 0 && (
                      <span style={{
                        fontSize: 13, fontWeight: 600,
                        color: pct === 100 ? theme.success : domainColors[d.id],
                      }}>
                        {pct === 100 ? '✓' : `${pct}%`}
                      </span>
                    )}
                    <span style={{ color: theme.textDim, fontSize: 18 }}>›</span>
                  </div>
                </div>
                {readCount > 0 && (
                  <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: theme.border }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: pct === 100 ? theme.success : domainColors[d.id],
                      width: `${pct}%`, transition: 'width 0.3s',
                    }} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      );
    }

    const sections = STUDY_MATERIAL[readDomain] || [];
    const domain = DOMAINS.find(d => d.id === readDomain);
    const dc = domainColors[readDomain] || domain?.color;
    const readSet = study.readSections[readDomain] || [];
    const readCount = readSet.length;
    const readPct = sections.length > 0 ? Math.round((readCount / sections.length) * 100) : 0;

    return (
      <div>
        <button
          onClick={() => { setReadDomain(null); setExpandedSection(null); }}
          style={{
            background: 'none', border: 'none', color: theme.primary,
            fontSize: 15, fontWeight: 500, cursor: 'pointer', padding: '8px 0',
            marginBottom: 12, fontFamily: 'inherit',
          }}
        >
          ← Back to Domains
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>{domain?.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{domain?.name}</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>{readCount}/{sections.length} sections read</div>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: readPct === 100 ? theme.success : dc }}>{readPct}%</span>
        </div>
        {/* Reading progress bar */}
        <div style={{ height: 6, borderRadius: 3, background: theme.border, marginBottom: 16 }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: readPct === 100 ? theme.success : dc,
            width: `${readPct}%`, transition: 'width 0.3s',
          }} />
        </div>
        {/* Jump to where you left off */}
        {readCount > 0 && readCount < sections.length && (() => {
          const nextUnread = sections.findIndex((_, i) => !readSet.includes(i));
          if (nextUnread < 0) return null;
          return (
            <button
              onClick={() => setExpandedSection(nextUnread)}
              style={{
                width: '100%', padding: '10px 16px', borderRadius: 10,
                border: `2px solid ${dc}`, background: 'transparent', color: dc,
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                marginBottom: 10, fontFamily: 'inherit', minHeight: 44,
              }}
            >
              📍 Continue from §{nextUnread + 1}: {sections[nextUnread]?.title}
            </button>
          );
        })()}
        {/* Speed Read All */}
        <button
          onClick={() => {
            const allText = sections.map(s => s.title + '.\n' + s.content).join('\n\n');
            onLaunchRsvp(allText, domain?.name + ' — All Sections');
          }}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 10,
            border: 'none', background: dc, color: '#FFF',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            marginBottom: 16, fontFamily: 'inherit', minHeight: 48,
          }}
        >
          ⚡ Speed Read All ({Math.ceil(sections.reduce((sum, s) => sum + s.content.split(/\s+/).length, 0) / (state.rsvpWpm || 300) * 60)}s)
        </button>
        {sections.map((section, idx) => (
          <div key={idx} id={`study-section-${idx}`} style={{ marginBottom: 8 }}>
            <Card
              accent={dc}
              onClick={() => {
                const newIdx = expandedSection === idx ? null : idx;
                setExpandedSection(newIdx);
                if (newIdx !== null) {
                  studyDispatch({ type: 'MARK_SECTION_READ', domain: readDomain, sectionIndex: idx });
                }
              }}
              padding="sm"
              style={{
                cursor: 'pointer',
                borderRadius: expandedSection === idx ? '12px 12px 0 0' : 12,
                background: expandedSection === idx ? theme.surfaceActive : theme.surface,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: theme.text, lineHeight: 1.4 }}>
                  {idx + 1}. {section.title}
                </span>
                <span style={{ color: theme.textDim, fontSize: 16, flexShrink: 0, marginLeft: 8 }}>
                  {expandedSection === idx ? '▾' : '›'}
                </span>
              </div>
            </Card>
            {expandedSection === idx && (
              <div style={{
                background: theme.bg,
                borderRadius: '0 0 12px 12px',
                padding: '16px 16px 20px',
                borderLeft: `3px solid ${dc}`,
                borderBottom: `1px solid ${dc}22`,
              }}>
                <button
                  onClick={() => onLaunchRsvp(section.content, section.title)}
                  style={{
                    width: '100%', padding: '10px 16px', borderRadius: 8,
                    border: 'none', background: dc, color: '#FFF',
                    fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    marginBottom: 14, fontFamily: 'inherit', minHeight: 44,
                  }}
                >
                  ⚡ Speed Read ({Math.ceil(section.content.split(/\s+/).length / (state.rsvpWpm || 300) * 60)}s at {state.rsvpWpm} WPM)
                </button>
                {(() => {
                  const Illustration = getIllustration(section.title);
                  return Illustration ? <Illustration /> : null;
                })()}
                <div style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {section.content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} style={{ color: theme.text, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
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

  // QUIZ SUB-VIEW
  const renderQuiz = () => {
    if (!filteredQuestions.length) return <div style={{ color: theme.textMuted }}>No questions available.</div>;
    const q = filteredQuestions[quizIndex];
    const domain = DOMAINS.find(d => d.id === q.domain);
    const dc = domainColors[q.domain] || domain?.color;

    return (
      <div>
        {/* Mock Exam CTA */}
        {onNavigate && (
          <Card
            onClick={() => onNavigate('mockExam')}
            style={{
              marginBottom: 16, cursor: 'pointer',
              background: `linear-gradient(135deg, ${theme.primaryLight}, ${theme.surface})`,
              border: `1px solid ${theme.primary}30`,
            }}
            padding="sm"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🏆</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Take a Mock Exam</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>90 questions, timed, ARRT-weighted</div>
              </div>
              <span style={{ color: theme.primary, fontSize: 18 }}>›</span>
            </div>
          </Card>
        )}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <button
            onClick={() => { setQuizDomain(null); setQuizIndex(0); setShowAnswer(false); }}
            style={{
              padding: '8px 14px', borderRadius: 8,
              border: !quizDomain ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
              background: !quizDomain ? theme.primaryLight : theme.surface,
              color: !quizDomain ? theme.primary : theme.textMuted,
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            All
          </button>
          {DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => { setQuizDomain(d.id); setQuizIndex(0); setShowAnswer(false); }}
              style={{
                padding: '8px 12px', borderRadius: 8,
                border: quizDomain === d.id ? `2px solid ${domainColors[d.id]}` : `1px solid ${theme.border}`,
                background: quizDomain === d.id ? (domainColors[d.id] + '18') : theme.surface,
                fontSize: 16, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {d.icon}
            </button>
          ))}
        </div>

        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{
              background: dc + '18', color: dc,
              padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500,
            }}>
              {domain?.icon} {domain?.name}
            </span>
            <span style={{ color: theme.textDim, fontSize: 14 }}>
              {quizIndex + 1} / {filteredQuestions.length}
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: theme.text, lineHeight: 1.5, marginBottom: 20 }}>
            {q.q}
          </div>
          {!showAnswer ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: theme.textDim, fontSize: 14, marginBottom: 12, fontStyle: 'italic' }}>
                Try to answer from memory before revealing...
              </div>
              <Button onClick={() => setShowAnswer(true)} fullWidth>
                Reveal Answer
              </Button>
            </div>
          ) : (
            <div>
              <div style={{
                background: theme.answerBg, borderRadius: 10, padding: 16,
                marginBottom: 16, borderLeft: `3px solid ${theme.answerBorder}`,
              }}>
                <div style={{ color: theme.answerText, fontSize: 15, lineHeight: 1.7 }}>{q.a}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button variant="danger" onClick={() => markQuiz(false)} style={{ flex: 1 }}>
                  ✕ Wrong
                </Button>
                <Button variant="success" onClick={() => markQuiz(true)} style={{ flex: 1 }}>
                  ✓ Right
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Results summary */}
        {Object.keys(study.quizResults).length > 0 && (
          <Card>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              Session Results
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {Object.entries(study.quizResults).map(([domId, res]) => {
                const dom = DOMAINS.find(d => d.id === domId);
                const total = res.correct + res.wrong;
                const pct = total > 0 ? Math.round((res.correct / total) * 100) : 0;
                return (
                  <div key={domId} style={{ background: theme.bg, borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 13, color: domainColors[domId], fontWeight: 600 }}>{dom?.icon} {dom?.name}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: pct >= 80 ? theme.success : pct >= 60 ? theme.warning : theme.error }}>
                      {pct}%
                    </div>
                    <div style={{ fontSize: 13, color: theme.textDim }}>{res.correct}/{total}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    );
  };

  // TOPICS SUB-VIEW
  const renderTopics = () => (
    <div>
      <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16 }}>
        Tap a domain to explore subtopics, key numbers, and start practice.
      </div>
      {DOMAINS.map(domain => {
        const dc = domainColors[domain.id] || domain.color;
        const isExpanded = expandedDomain === domain.id;
        const res = study.quizResults[domain.id];
        const total = res ? res.correct + res.wrong : 0;
        const pct = total > 0 ? Math.round((res.correct / total) * 100) : 0;

        return (
          <div key={domain.id} style={{ marginBottom: 10 }}>
            <Card
              accent={dc}
              onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
              style={{ cursor: 'pointer', borderRadius: isExpanded ? '12px 12px 0 0' : 12 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{domain.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: theme.text }}>{domain.name}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>{domain.weight}% of exam</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {total > 0 && <div style={{ fontSize: 16, fontWeight: 700, color: pct >= 70 ? theme.success : theme.warning }}>{pct}%</div>}
                  <span style={{ color: theme.textDim, fontSize: 16 }}>{isExpanded ? '▾' : '›'}</span>
                </div>
              </div>
            </Card>
            {isExpanded && (
              <div style={{ background: theme.bg, borderRadius: '0 0 12px 12px', padding: 20, borderLeft: `3px solid ${dc}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: dc, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  Subtopics
                </div>
                {domain.subtopics.map((s, i) => (
                  <div key={i} style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 6, paddingLeft: 8, lineHeight: 1.5 }}>
                    • {s}
                  </div>
                ))}
                <div style={{ fontSize: 12, fontWeight: 600, color: theme.warning, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 16, marginBottom: 10 }}>
                  Key Numbers
                </div>
                {domain.keyNumbers.map((n, i) => (
                  <div key={i} style={{ color: theme.warning, fontSize: 14, marginBottom: 4, paddingLeft: 8, lineHeight: 1.5 }}>
                    ▸ {n}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <Button onClick={() => { setSubView('read'); setReadDomain(domain.id); setExpandedSection(null); }} style={{ flex: 1 }}>
                    📖 Read
                  </Button>
                  <Button variant="secondary" onClick={() => { setSubView('quiz'); setQuizDomain(domain.id); setQuizIndex(0); setShowAnswer(false); }} style={{ flex: 1 }}>
                    ⚡ Quiz
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      {subNav}
      {subView === 'read' && renderRead()}
      {subView === 'quiz' && renderQuiz()}
      {subView === 'topics' && renderTopics()}
    </div>
  );
}
