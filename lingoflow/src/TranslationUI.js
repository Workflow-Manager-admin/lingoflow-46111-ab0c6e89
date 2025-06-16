import React, { useState } from 'react';
import './App.css';

/**
 * Hardcoded language list for MVP.
 */
const LANGUAGES = [
  { code: 'auto', label: 'Auto-detect' }, // Only available for source
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' }
];

// PUBLIC_INTERFACE
function TranslationUI() {
  /**
   * State definition
   */
  const [input, setInput] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
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
      setOutput(
        input.trim()
          ? `[${LANGUAGES.find(l => l.code === sourceLang)?.label || "Lang"}→${LANGUAGES.find(l => l.code === targetLang)?.label || "Lang"}]:\n${input}`
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
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label htmlFor={sourceId} className="translationui-label">From</label>
            <select
              id={sourceId}
              className="translationui-select"
              value={sourceLang}
              onChange={e => setSourceLang(e.target.value)}
              aria-label="Source language"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 8,
                border: '1.5px solid #e5eaf2',
                background: '#f6fbff',
                fontSize: '1rem'
              }}
            >
              {LANGUAGES.map(lang =>
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              )}
            </select>
          </div>
          <span
            style={{
              fontSize: 20, marginTop: 18, marginLeft: 6, marginRight: 6,
              color: '#C8CAD0'
            }}
            role="img"
            aria-label="to"
          >
            →
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label htmlFor={targetId} className="translationui-label">To</label>
            <select
              id={targetId}
              className="translationui-select"
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
              aria-label="Target language"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 8,
                border: '1.5px solid #e5eaf2',
                background: '#f6fbff',
                fontSize: '1rem'
              }}
            >
              {LANGUAGES.filter(lang => lang.code !== 'auto').map(lang =>
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              )}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-large"
          style={{
            width: '100%',
            backgroundColor: input && targetLang ? '#4A90E2' : '#C8DBF6',
            color: '#fff',
            borderRadius: 8,
            fontSize: '1.1rem',
            fontWeight: 600,
            padding: '14px 0',
            marginTop: 6,
            marginBottom: 20,
            transition: 'background 0.15s'
          }}
          disabled={!input.trim() || !targetLang || isTranslating}
          aria-label="Translate"
        >
          {isTranslating ? (
            <span aria-live="polite"><span className="translationui-spinner" aria-label="Translating"></span> Translating…</span>
          ) : 'Translate'}
        </button>
      </form>
      <section
        aria-live="polite"
        aria-atomic="true"
        style={{
          minHeight: '70px', // ensure output area doesn't jump
          borderRadius: 10,
          border: '1.5px solid #f1f5fa',
          background: '#fafdff',
          boxSizing: 'border-box',
          padding: output ? '19px 18px 10px 18px' : '16px 18px',
          marginBottom: 0,
          marginTop: 4,
          position: 'relative',
          textAlign: 'left',
        }}
      >
        <div className="translationui-label" style={{margin: 0, fontWeight: 500, fontSize: 15, marginBottom: 4, color: '#4A90E2'}}>
          Output
        </div>
        <div
          id={outputId}
          tabIndex={0}
          style={{
            fontSize: '1.08rem',
            color: output ? '#202A34' : '#b7bac2',
            minHeight: 30,
            marginTop: 5,
            wordBreak: 'break-word'
          }}
          aria-label="Translation output"
          aria-describedby={output ? undefined : 'empty-output-desc'}
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
          className="btn"
          aria-label="Copy translated text"
          onClick={handleCopy}
          disabled={!output}
          style={{
            position: 'absolute',
            top: 10,
            right: 16,
            background: output ? '#50E3C2' : '#E8FAF6',
            color: '#1d4160',
            borderRadius: 6,
            fontWeight: 500,
            fontSize: 14,
            padding: '6px 14px',
            minWidth: 44,
            minHeight: 28,
            border: 'none',
            cursor: output ? 'pointer' : 'not-allowed',
            transition: 'background 0.13s'
          }}
          tabIndex={0}
        >
          {copyStatus === 'copied'
            ? <span role="status" aria-live="polite">Copied!</span>
            : 'Copy'}
        </button>
      </section>
    </div>
  );
}

export default TranslationUI;
