import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useStudy } from '../../context/StudyContext';
import { XP_AWARDS } from '../../data/badges';

// Punctuation pause multipliers
function getDelayMultiplier(word) {
  if (!word) return 1;
  const last = word[word.length - 1];
  if ('.!?'.includes(last)) return 3;
  if (',;:'.includes(last)) return 1.8;
  if ('—–)'.includes(last)) return 1.5;
  return 1;
}

// Persist reading position per title
const STORAGE_KEY = 'fluoro_rsvp_positions';

function getSavedPosition(title) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return saved[title] || 0;
  } catch { return 0; }
}

function savePosition(title, index) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (index <= 0) {
      delete saved[title];
    } else {
      saved[title] = index;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch { /* ignore */ }
}

export default function SpeedReader({ words, title, onClose }) {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const { studyDispatch } = useStudy();

  const savedPos = getSavedPosition(title);
  const [index, setIndex] = useState(savedPos > 0 && savedPos < words.length ? savedPos : 0);
  const [playing, setPlaying] = useState(false);
  const [resumed, setResumed] = useState(savedPos > 0 && savedPos < words.length);
  const timer = useRef(null);

  const wpm = state.rsvpWpm;
  const chunk = state.rsvpChunk;

  // Timer logic with punctuation-aware pausing
  useEffect(() => {
    if (playing && index < words.length) {
      const msPerWord = 60000 / wpm;
      const currentWord = words[Math.min(index + chunk - 1, words.length - 1)] || '';
      const multiplier = getDelayMultiplier(currentWord);
      const delay = msPerWord * chunk * multiplier;

      timer.current = setTimeout(() => {
        setIndex(prev => {
          const next = prev + chunk;
          if (next >= words.length) {
            setPlaying(false);
            dispatch({ type: 'ADD_XP', amount: XP_AWARDS.speedRead });
            savePosition(title, 0); // Clear saved position on completion
            return words.length - 1;
          }
          return next;
        });
      }, delay);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, index, wpm, chunk, words, title, dispatch]);

  // Track max WPM
  useEffect(() => {
    if (playing) {
      studyDispatch({ type: 'SET_MAX_WPM', wpm });
    }
  }, [playing, wpm, studyDispatch]);

  // Save position periodically while playing
  useEffect(() => {
    if (playing && index > 0) {
      savePosition(title, index);
    }
  }, [index, playing, title]);

  const currentChunk = words.slice(index, index + chunk).join(' ');
  const progress = words.length > 0 ? ((index + chunk) / words.length) * 100 : 0;
  const progressClamped = Math.min(progress, 100);
  const timeLeft = words.length > 0 ? Math.ceil(((words.length - index) / wpm) * 60) : 0;
  const timeMin = Math.floor(timeLeft / 60);
  const timeSec = timeLeft % 60;

  const handleClose = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setPlaying(false);
    savePosition(title, index);
    onClose();
  }, [title, index, onClose]);

  function togglePlay() {
    setResumed(false);
    if (index >= words.length - 1) {
      setIndex(0);
      savePosition(title, 0);
      setPlaying(true);
    } else {
      setPlaying(p => !p);
    }
  }

  function handleRestart() {
    setIndex(0);
    setResumed(false);
    savePosition(title, 0);
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: theme.rsvpBg, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: `1px solid ${theme.border}`,
      }}>
        <button
          onClick={handleClose}
          style={{
            background: 'none', border: 'none', color: theme.error,
            fontSize: 16, fontWeight: 600, cursor: 'pointer', padding: '8px 12px',
            fontFamily: 'inherit',
          }}
        >
          Close
        </button>
        <div style={{
          color: theme.textMuted, fontSize: 13, textAlign: 'center',
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {title}
        </div>
        <div style={{ color: theme.textDim, fontSize: 13, minWidth: 60, textAlign: 'right' }}>
          {timeMin}:{String(timeSec).padStart(2, '0')} left
        </div>
      </div>

      {/* Progress bar — prominent */}
      <div style={{ position: 'relative', height: 6, background: theme.border }}>
        <div style={{
          height: '100%', background: theme.primary,
          width: `${progressClamped}%`,
          transition: 'width 0.15s linear',
          borderRadius: '0 3px 3px 0',
        }} />
      </div>
      {/* Progress percentage + word count */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 16px',
        fontSize: 12, color: theme.textDim, fontWeight: 600,
      }}>
        <span>{Math.round(progressClamped)}%</span>
        <span>{Math.min(index + chunk, words.length)} / {words.length} words</span>
      </div>

      {/* Resume banner */}
      {resumed && !playing && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12, padding: '10px 16px',
          background: theme.primary + '18',
          borderBottom: `1px solid ${theme.primary}30`,
        }}>
          <span style={{ fontSize: 13, color: theme.primary, fontWeight: 600 }}>
            Resuming from word {index} of {words.length}
          </span>
          <button
            onClick={handleRestart}
            style={{
              padding: '4px 12px', borderRadius: 6, border: `1px solid ${theme.primary}`,
              background: 'transparent', color: theme.primary,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Start Over
          </button>
        </div>
      )}

      {/* Main word display — tap to play/pause */}
      <div
        onClick={togglePlay}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          cursor: 'pointer', userSelect: 'none', padding: '0 20px',
        }}
      >
        <div style={{ width: '80%', maxWidth: 500, position: 'relative' }}>
          <div style={{ borderBottom: `2px solid ${theme.border}`, marginBottom: 16 }} />
          <div style={{
            fontSize: chunk === 1 ? 44 : chunk === 2 ? 36 : 30,
            fontWeight: 700, color: theme.text, textAlign: 'center',
            minHeight: 60, display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: chunk === 1 ? 2 : 1,
            lineHeight: 1.2,
          }}>
            {index >= words.length ? 'Done' : currentChunk}
          </div>
          <div style={{ borderTop: `2px solid ${theme.border}`, marginTop: 16 }} />
        </div>
        <div style={{ marginTop: 24, color: theme.textDim, fontSize: 14 }}>
          {index >= words.length - 1 && !playing
            ? 'Tap to restart'
            : playing ? 'Tap to pause' : 'Tap to play'}
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: 16, borderTop: `1px solid ${theme.border}` }}>
        {/* WPM control */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ color: theme.textMuted, fontSize: 13 }}>Speed</span>
            <span style={{ color: theme.primary, fontSize: 15, fontWeight: 700 }}>{wpm} WPM</span>
          </div>
          <input
            type="range"
            min={100} max={800} step={25}
            value={wpm}
            onChange={(e) => dispatch({ type: 'SET_RSVP_WPM', wpm: parseInt(e.target.value) })}
            style={{ width: '100%', accentColor: theme.primary }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.textDim }}>
            <span>100</span><span>300</span><span>500</span><span>800</span>
          </div>
        </div>

        {/* Chunk size + navigation */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => dispatch({ type: 'SET_RSVP_CHUNK', chunk: n })}
                style={{
                  padding: '8px 12px', borderRadius: 6, border: 'none',
                  background: chunk === n ? theme.primary : theme.surfaceHover,
                  color: chunk === n ? '#FFF' : theme.textMuted,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {n}w
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={() => setIndex(prev => Math.max(0, prev - 20))}
            style={{
              padding: '8px 14px', borderRadius: 6, border: 'none',
              background: theme.surfaceHover, color: theme.textMuted,
              fontSize: 14, cursor: 'pointer',
            }}
          >
            ⏪
          </button>
          <button
            onClick={togglePlay}
            style={{
              padding: '8px 20px', borderRadius: 6, border: 'none',
              background: theme.primary, color: '#FFF',
              fontSize: 18, cursor: 'pointer', fontWeight: 700,
            }}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button
            onClick={() => setIndex(prev => Math.min(words.length - 1, prev + 20))}
            style={{
              padding: '8px 14px', borderRadius: 6, border: 'none',
              background: theme.surfaceHover, color: theme.textMuted,
              fontSize: 14, cursor: 'pointer',
            }}
          >
            ⏩
          </button>
        </div>
      </div>
    </div>
  );
}
