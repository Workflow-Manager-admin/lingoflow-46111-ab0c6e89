import React, { useState } from 'react';
import './App.css';

/**
 * Hardcoded language list for MVP.
 */
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' }
];

// For accessible labeling of the Auto-Detect toggle.
function AutoDetectToggle({ enabled, onChange, labelId, ariaDescribedBy }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-labelledby={labelId}
      aria-describedby={ariaDescribedBy}
      tabIndex={0}
      className="translationui-autodetect-toggle"
      style={{
        marginLeft: 8,
        minWidth: 44, minHeight: 36,
        padding: '5px 13px',
        border: 'none',
        borderRadius: 8,
        fontWeight: 500,
        fontSize: '1rem',
        background: enabled ? '#F5A623' : '#e5eaf2',
        color: enabled ? '#282008' : '#6d7586',
        boxShadow: enabled ? '0 1px 6px 0 #ffe5bc90' : 'none',
        cursor: 'pointer',
        outline: !enabled ? '2px solid #F5A62340' : 'none',
        transition: 'background 0.17s, color 0.08s'
      }}
      onClick={() => onChange(!enabled)}
      onKeyDown={e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange(!enabled);
        }
      }}
    >
      {enabled ? 'Auto-detect ON' : 'Auto-detect'}
    </button>
  );
}

// PUBLIC_INTERFACE
function TranslationUI() {
  /**
   * State definition
   */
  const [input, setInput] = useState('');
  // If autoDetect is true, sourceLang is always "auto"
  const [autoDetect, setAutoDetect] = useState(true);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [output, setOutput] = useState('');
  const [copyStatus, setCopyStatus] = useState(''); // '', 'copied'

  /**
   * Handles the translation action (stubbed in MVP)
   */
  const handleTranslate = (e) => {
    e.preventDefault();
    setIsTranslating(true);
    setCopyStatus('');
    // Simulate async translation (stub, static output for demo)
    setTimeout(() => {
      const realSourceLang = autoDetect ? 'auto' : sourceLang;
      const sourceName = autoDetect
        ? "Auto-detect"
        : (LANGUAGES.find(l => l.code === sourceLang)?.label || "Lang");
      const targetName = LANGUAGES.find(l => l.code === targetLang)?.label || "Lang";
      setOutput(
        input.trim()
          ? `[${sourceName}→${targetName}]:\n${input}`
          : ''
      );
      setIsTranslating(false);
    }, 1000);
  };

  /**
   * Handles copying translated output to clipboard
   */
  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus(''), 1500);
    } catch (err) {
      setCopyStatus('failure');
      setTimeout(() => setCopyStatus(''), 1500);
    }
  };

  // Accessibility: unique IDs for labels
  const inputId = 'translate-input';
  const sourceId = 'source-lang-select';
  const targetId = 'target-lang-select';
  const outputId = 'translation-output';

  return (
    <div className="translationui-container" style={{
      maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 16,
      boxShadow: '0 2px 16px rgba(74,144,226,0.05)',
      padding: '2.5rem 1.25rem 2rem 1.25rem', marginTop: 96, marginBottom: 48
    }}>
      <form onSubmit={handleTranslate} aria-label="Translation Form">
        <div className="translationui-label-group">
          <label htmlFor={inputId} className="translationui-label">
            Text to translate
            <span 
              style={{position: 'absolute', left: '-9999px', height: 0, width: 0, overflow: 'hidden'}}
              id={`${inputId}-emoji-info`}
            >
              You can enter emojis and special characters here.
            </span>
          </label>
          <textarea
            id={inputId}
            className="translationui-input"
            value={input}
            onChange={e => {
              if (e.target.value.length <= 2000) setInput(e.target.value);
            }}
            rows={5}
            inputMode="text"
            placeholder="Enter text to translate (emoji supported)…"
            aria-label="Input text area for translation. Emoji supported."
            aria-describedby={`${inputId}-emoji-info`}
            maxLength={2000}
            autoFocus
            required
            style={{
              width: '100%',
              minHeight: 88,
              resize: 'vertical',
              fontSize: '1.08rem',
              padding: '14px',
              border: '1.5px solid #ecf1f5',
              borderRadius: 10,
              background: '#fcfdff',
              color: '#171c22',
              marginBottom: 18,
              fontFamily: 'inherit',
              outlineColor: '#4A90E2',
              boxShadow: '0 0 0 2px transparent'
            }}
            spellCheck={true}
            autoComplete="off"
            tabIndex={0}
            enterKeyHint="enter"
            aria-multiline="true"
          />
          <div className="translationui-charcount" aria-live="polite" style={{fontSize: 12, color: '#b0b6be', textAlign: 'right', marginBottom: 10}}>
            {input.length}/2000
          </div>
        </div>
        <div className="translationui-lang-row" style={{
          display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 18, flexWrap: 'wrap'
        }}>
          {/* Source Language Select + Auto-Detect Toggle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <label htmlFor={sourceId} className="translationui-label" id="from-label" style={{marginBottom:2}}>
                From
              </label>
              <AutoDetectToggle
                enabled={autoDetect}
                onChange={on => {
                  setAutoDetect(on);
                  // Reset sourceLang to English as a default when disabling Auto-detect (UX choice)
                  if (!on && sourceLang === 'auto') setSourceLang('en');
                }}
                labelId="autodetect-toggle-label"
                ariaDescribedBy="autodetect-desc"
              />
            </div>
            <select
              id={sourceId}
              className="translationui-select"
              value={autoDetect ? 'auto' : sourceLang}
              onChange={e => {
                setSourceLang(e.target.value);
                if (autoDetect) setAutoDetect(false);
              }}
              aria-label="Source language"
              aria-labelledby="from-label"
              aria-describedby={autoDetect ? 'autodetect-desc' : undefined}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 8,
                border: '1.5px solid #e5eaf2',
                background: '#f6fbff',
                fontSize: '1rem',
                marginTop: 4,
                opacity: autoDetect ? 0.7 : 1,
                cursor: autoDetect ? 'not-allowed' : 'pointer'
              }}
              disabled={autoDetect}
              tabIndex={0}
            >
              {/* Only allow selecting non-auto languages directly */}
              {LANGUAGES.map(lang =>
                <option
                  key={lang.code}
                  value={lang.code}
                  style={lang.code === 'auto' ? {display:'none'} : {}}
                >
                  {lang.label}
                </option>
              )}
            </select>
            <span
              id="autodetect-desc"
              style={{
                fontSize: 12,
                color: '#b0b6be',
                display: autoDetect ? 'block' : 'none',
                marginLeft: 2
              }}
            >
              Auto-detect enabled: source language will be detected automatically
            </span>
          </div>
          <span
            style={{
              fontSize: 20, marginTop: 18, marginLeft: 6, marginRight: 6,
              color: '#C8CAD0', alignSelf: 'center'
            }}
            role="img"
            aria-label="to"
          >
            →
          </span>
          {/* Target Language Select */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <label htmlFor={targetId} className="translationui-label" id="to-label" style={{marginBottom:2}}>To</label>
            <select
              id={targetId}
              className="translationui-select"
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
              aria-label="Target language"
              aria-labelledby="to-label"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 8,
                border: '1.5px solid #e5eaf2',
                background: '#f6fbff',
                fontSize: '1rem',
                marginTop: 4
              }}
              tabIndex={0}
            >
              {LANGUAGES.map(lang =>
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              )}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="translationui-translate-btn"
          style={{
            width: '100%',
            backgroundColor: input && targetLang && !isTranslating ? '#4A90E2' : '#C8DBF6',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            fontFamily: 'inherit',
            fontSize: '1.35rem',
            fontWeight: 700,
            padding: '22px 0',
            marginTop: 10,
            marginBottom: 28,
            boxShadow: input && targetLang && !isTranslating ? '0 4px 18px 0 #DCE7F5' : 'none',
            letterSpacing: '0.01em',
            cursor: (!input.trim() || !targetLang || isTranslating) ? 'not-allowed' : 'pointer',
            outline: 'none',
            transition: 'background 0.15s, box-shadow 0.15s'
          }}
          disabled={!input.trim() || !targetLang || isTranslating}
          aria-label="Translate"
          aria-disabled={!input.trim() || !targetLang || isTranslating}
          tabIndex={0}
          onKeyDown={e => {
            if (
              (e.key === 'Enter' || e.key === ' ') &&
              !(!input.trim() || !targetLang || isTranslating)
            ) {
              e.preventDefault();
              handleTranslate(e);
            }
          }}
        >
          {isTranslating ? (
            <span aria-live="polite" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
              <span className="translationui-spinner" aria-label="Translating"></span> Translating…
            </span>
          ) : (
            <span style={{
              letterSpacing: '.03em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
            }}>
              <svg height="24" width="24" viewBox="0 0 28 28" aria-hidden="true" focusable="false" style={{marginRight: 6, verticalAlign:'middle', fill: 'currentColor'}}>
                <path d="M5.3 18.7a1 1 0 01.2-1.4C7 15.8 8.5 14 10 11.5l1.1-2 .2.5c.3 1 .8 2 1.3 2.7.5.8 1.3 1.6 2.3 2.2a1 1 0 01.4 1.2c-.2.5-.6.7-1.1.6A8.8 8.8 0 0111.4 14c-1.5 2.2-3 4.2-5 6.3a1 1 0 01-1.4.1zm11-12l.9 2.2A1 1 0 0018 10h4.2a1 1 0 110 2h-3.7l-.8-2-2.6 6.1a1 1 0 00.6 1.3c.6.2 1.2-.1 1.3-.7L17 14h2.3c.6 0 1-.4 1-1a1 1 0 00-1-1H17l-.5-1.3 2.3-5.6z"/>
              </svg>
              Translate
            </span>
          )}
        </button>
      </form>
      <section
        aria-live="polite"
        aria-atomic="true"
        className="translationui-output-section"
        style={{
          minHeight: '80px',
          borderRadius: 12,
          border: '1.6px solid #e8eeff',
          background: '#fafdff',
          boxSizing: 'border-box',
          padding: output ? '22px 18px 14px 18px' : '18px 18px',
          marginBottom: 0,
          marginTop: 4,
          position: 'relative',
          textAlign: 'left',
          boxShadow: '0 2px 6px #e3e8ef22'
        }}
      >
        <div className="translationui-label"
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: 15.5,
            marginBottom: 5,
            color: 'var(--base-light, #4A90E2)',
            letterSpacing: '.015em',
            display: 'flex',
            alignItems: 'center'
          }}>
          Output
          <span style={{fontSize: 0, height: 0, overflow: 'hidden', position: 'absolute'}}>
            Translated text will appear here.
          </span>
        </div>
        <div
          id={outputId}
          tabIndex={0}
          role="region"
          aria-label="Translated output text"
          aria-describedby={output ? undefined : 'empty-output-desc'}
          style={{
            fontSize: '1.09rem',
            color: output ? '#202A34' : '#b7bac2',
            minHeight: 28,
            marginTop: 7,
            wordBreak: 'break-word',
            outline: 'none',
            lineHeight: 1.55,
            paddingRight: 60, // leaves room for the copy button
            whiteSpace: 'pre-line',
            background: 'transparent'
          }}
          onFocus={e => { e.target.style.outline = '2px solid #4A90E2'; }}
          onBlur={e => { e.target.style.outline = 'none'; }}
        >
          {isTranslating
            ? <span style={{color: '#50E3C2'}}>Translating…</span>
            : (output
                ? output
                : <span id="empty-output-desc" style={{fontStyle: 'italic'}}>Your translation will appear here.</span>
              )
          }
        </div>
        <button
          type="button"
          className="translationui-copy-btn"
          aria-label={output ? "Copy translated text" : "Copy disabled (no output)"}
          title={output ? "Copy translated text" : "Copy disabled"}
          tabIndex={0}
          onClick={handleCopy}
          onKeyDown={e => {
            if (output && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              handleCopy();
            }
          }}
          disabled={!output}
          aria-disabled={!output}
          style={{
            position: 'absolute',
            top: 18,
            right: 19,
            background: output ? '#50E3C2' : '#E8FAF6',
            color: output ? '#18363a' : '#abbdbb',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 14.2,
            minWidth: 44,
            minHeight: 36,
            border: 'none',
            display: 'inline-flex',
            gap: 8,
            justifyContent: 'center',
            alignItems: 'center',
            padding: '7px 14px',
            cursor: output ? 'pointer' : 'not-allowed',
            boxShadow: output ? '0 1.5px 5px #70e3d640' : 'none',
            outline: 'none',
            transition: 'background 0.13s'
          }}
          onFocus={e => e.currentTarget.style.outline = "2px solid #4A90E2"}
          onBlur={e => e.currentTarget.style.outline = "none"}
        >
          {copyStatus === 'copied'
            ? <span role="status" aria-live="polite" style={{fontWeight: 700}}>Copied!</span>
            : <>
                <svg
                  width="18" height="18" viewBox="0 0 20 20"
                  aria-hidden="true" focusable="false"
                  style={{
                    verticalAlign: 'middle',
                    marginRight: 4,
                    fill: 'currentColor',
                    opacity: output ? 1 : 0.65
                  }}
                >
                  <path d="M5 3c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1h2v3H7v2h8c.55 0 1-.45 1-1V12c0-.55-.45-1-1-1h-1V4c0-.55-.45-1-1-1H5zm6 9H7V5h4v7z"/>
                </svg>
                Copy
              </>
          }
        </button>
        <span style={{
          fontSize: 0,
          height: 0,
          width: 0,
          overflow: 'hidden',
          position: 'absolute'
        }} aria-live="polite">
          {copyStatus === "copied" && output ? "Translation copied to clipboard." : ""}
        </span>
      </section>
    </div>
  );
}

export default TranslationUI;

/** Minimal theme/style for accessibility and modern look, for custom elements only.
 * Should be moved to CSS file if refactoring styles.
 */
const styleSheet = `
.translationui-autodetect-toggle:focus {
  outline: 2px solid #F5A623;
  outline-offset: 2px;
}
.translationui-select:focus {
  outline: 2px solid #4A90E2;
  outline-offset: 1px;
}
.translationui-label {
  font-weight: 500;
  font-size: 14.2px;
  color: #294366;
  margin-bottom: 4px;
  display: block;
}

/* Branded translate button: modern, large, minimal, accessible */
.translationui-translate-btn {
  font-family: inherit;
  font-size: 1.35rem;
  font-weight: 700;
  border-radius: 14px;
  padding: 22px 0;
  background-color: #4A90E2;
  color: white;
  border: none;
  letter-spacing: 0.01em;
  min-height: 56px;
  box-shadow: 0 4px 18px 0 #dce7f5;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
}
.translationui-translate-btn:focus-visible, .translationui-translate-btn:focus {
  outline: 3px solid #F5A623;
  outline-offset: 2px;
}

.translationui-translate-btn:disabled, .translationui-translate-btn[aria-disabled="true"] {
  background-color: #C8DBF6 !important;
  color: #ffffffcc !important;
  cursor: not-allowed;
  box-shadow: none;
}

.translationui-translate-btn:active:not(:disabled) {
  background-color: #397fbb;
  box-shadow: 0 2px 8px 0 #dce7f5;
}

/* Responsive touch target */
.translationui-translate-btn {
  min-width: 100%;
  min-height: 56px;
}

@media (max-width: 600px) {
  .translationui-lang-row {
    flex-direction: column !important;
    gap: 10px !important;
  }
  .translationui-translate-btn {
    min-width: 100%;
    font-size: 1.16rem;
    padding: 18px 0;
    min-height: 48px;
  }
}
`;

// Inject on module load (plain approach for MVP, could be refined into App.css)
if (typeof document !== "undefined" && !document.getElementById('translationui-lang-style')) {
  const s = document.createElement('style');
  s.id = 'translationui-lang-style';
  s.innerHTML = styleSheet;
  document.head.appendChild(s);
}
