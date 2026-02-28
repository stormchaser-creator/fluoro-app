import { useState, memo } from 'react';
import { signIn, signUp, resetPassword } from '../../lib/supabase';

function AuthPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setError('');
    setInfo('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // Auth state change listener in AuthContext will handle the rest
    } catch (err) {
      if (err.message?.includes('Invalid login')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please check your email to confirm your account before signing in.');
      } else {
        setError(err.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await signUp(email.trim(), password);
      if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists. Try signing in instead.');
      } else if (data?.session) {
        // Auto-confirmed — auth state change will handle it
      } else {
        setInfo('Check your email for a confirmation link, then sign in.');
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      if (err.message?.includes('already registered')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else {
        setError(err.message || 'Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setInfo('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    clearMessages();
    setPassword('');
    setConfirmPassword('');
    setMode(newMode);
  };

  // FluoroPath dark theme colors (matching theme.js dark palette)
  const colors = {
    bg: '#121212',
    surface: '#1E1E1E',
    surfaceHover: '#2A2A2A',
    primary: '#4DB6AC',
    primaryDark: '#0D7377',
    text: '#E8E8E8',
    textSecondary: '#B0B0B0',
    textMuted: '#808080',
    textDim: '#555555',
    border: '#333333',
    error: '#F87171',
    errorBg: '#7F1D1D',
    success: '#34D399',
    successBg: '#064E3B',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: 15,
    fontWeight: 500,
    color: colors.text,
    backgroundColor: colors.surfaceHover,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: 16,
    fontWeight: 700,
    color: '#FFFFFF',
    background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`,
    border: 'none',
    borderRadius: 12,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    transition: 'opacity 0.2s, transform 0.1s',
    boxShadow: '0 4px 12px rgba(77,182,172,0.25)',
    fontFamily: 'inherit',
  };

  const linkStyle = {
    color: colors.primary,
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    textDecoration: 'none',
    fontFamily: 'inherit',
  };

  const eyeIcon = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
        color: colors.textMuted, display: 'flex', alignItems: 'center',
      }}
      tabIndex={-1}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  );

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: colors.bg,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
    }}>
      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 8px 24px rgba(13,115,119,0.3); }
          50% { box-shadow: 0 8px 32px rgba(77,182,172,0.45); }
        }
      `}</style>
      <div style={{
        width: '100%',
        maxWidth: 400,
        animation: 'authFadeIn 0.5s ease-out',
      }}>
        {/* Logo + App Name */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            animation: 'logoPulse 3s ease-in-out infinite',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2 L12 22" />
              <path d="M2 12 L22 12" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            color: colors.text,
            margin: '0 0 6px',
            letterSpacing: '-0.03em',
          }}>
            Fluoro<span style={{ color: colors.primary }}>Path</span>
          </h1>
          <p style={{
            fontSize: 14,
            color: colors.textMuted,
            margin: 0,
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            California Fluoroscopy Exam Prep
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: '28px 24px',
          border: `1px solid ${colors.border}`,
        }}>
          {/* Mode tabs */}
          {mode !== 'reset' && (
            <div style={{
              display: 'flex',
              gap: 0,
              marginBottom: 24,
              backgroundColor: colors.surfaceHover,
              borderRadius: 10,
              padding: 3,
            }}>
              <button
                onClick={() => switchMode('signin')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: 14,
                  fontWeight: 700,
                  color: mode === 'signin' ? colors.primary : colors.textMuted,
                  backgroundColor: mode === 'signin' ? colors.surface : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode('signup')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: 14,
                  fontWeight: 700,
                  color: mode === 'signup' ? colors.primary : colors.textMuted,
                  backgroundColor: mode === 'signup' ? colors.surface : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <div style={{ marginBottom: 20 }}>
              <button onClick={() => switchMode('signin')} style={{
                ...linkStyle,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginBottom: 8,
              }}>
                &larr; Back to Sign In
              </button>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: 0 }}>
                Reset Password
              </h2>
              <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 1.4 }}>
                Enter your email and we will send you a link to reset your password.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{
              padding: '12px 14px',
              backgroundColor: colors.errorBg,
              border: `1px solid ${colors.error}30`,
              borderRadius: 10,
              marginBottom: 16,
              fontSize: 13,
              fontWeight: 500,
              color: colors.error,
              lineHeight: 1.4,
            }}>
              {error}
            </div>
          )}

          {/* Info message */}
          {info && (
            <div style={{
              padding: '12px 14px',
              backgroundColor: colors.successBg,
              border: `1px solid ${colors.success}30`,
              borderRadius: 10,
              marginBottom: 16,
              fontSize: 13,
              fontWeight: 500,
              color: colors.success,
              lineHeight: 1.4,
            }}>
              {info}
            </div>
          )}

          {/* Forms */}
          <form onSubmit={mode === 'signin' ? handleSignIn : mode === 'signup' ? handleSignUp : handleReset}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMuted, marginBottom: 6 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = colors.primary; }}
                  onBlur={(e) => { e.target.style.borderColor = colors.border; }}
                />
              </div>

              {/* Password (not shown for reset) */}
              {mode !== 'reset' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMuted, marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      style={{ ...inputStyle, paddingRight: 44 }}
                      onFocus={(e) => { e.target.style.borderColor = colors.primary; }}
                      onBlur={(e) => { e.target.style.borderColor = colors.border; }}
                    />
                    {eyeIcon}
                  </div>
                </div>
              )}

              {/* Confirm password (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMuted, marginBottom: 6 }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      style={{ ...inputStyle, paddingRight: 44 }}
                      onFocus={(e) => { e.target.style.borderColor = colors.primary; }}
                      onBlur={(e) => { e.target.style.borderColor = colors.border; }}
                    />
                    {eyeIcon}
                  </div>
                </div>
              )}

              {/* Forgot password link (signin only) */}
              {mode === 'signin' && (
                <div style={{ textAlign: 'right', marginTop: -4 }}>
                  <button type="button" onClick={() => switchMode('reset')} style={linkStyle}>
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{ ...buttonStyle, marginTop: 4 }}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span>
                      {mode === 'signin' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending...'}
                    </span>
                  </span>
                ) : (
                  mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 28,
          fontSize: 12,
          color: colors.textDim,
          lineHeight: 1.6,
        }}>
          <div style={{ marginBottom: 4 }}>
            Your progress syncs securely across all devices.
          </div>
          <div style={{ color: colors.textDim, opacity: 0.7 }}>
            FluoroPath v2.1
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AuthPage);
