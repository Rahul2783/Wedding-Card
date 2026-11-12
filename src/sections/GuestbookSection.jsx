import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Sparkles, Send } from 'lucide-react';
import {
  getWishes,
  submitWish,
  subscribeToWishes,
  normalizeWishes,
  validateWish,
} from '../api/guestbook';
import './GuestbookSection.css';

const COOLDOWN_DURATION = 30; // 30-second submission cooldown to reduce spam
const INITIAL_WISH_LIMIT = 4; // Display top 4 wishes initially

export default function GuestbookSection({ lang, onFlowerShower }) {
  const [wishes, setWishes] = useState([]);
  const [showAllWishes, setShowAllWishes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Form input fields
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [text, setText] = useState('');

  // Anti-spam honeypot field
  const [honeypot, setHoneypot] = useState('');

  // Client-side submission cooldown
  const [cooldownRemaining, setCooldownRemaining] = useState(() => {
    try {
      const lastTime = Number(localStorage.getItem('sachin_anjali_guestbook_cooldown')) || 0;
      const elapsed = Math.floor((Date.now() - lastTime) / 1000);
      return elapsed < COOLDOWN_DURATION ? COOLDOWN_DURATION - elapsed : 0;
    } catch {
      return 0;
    }
  });

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  // Keep ref of latest wishes for real-time delta updates and deduplication
  const wishesRef = useRef([]);
  useEffect(() => {
    wishesRef.current = wishes;
  }, [wishes]);

  // Load wishes from Firebase
  const loadWishesFromFirebase = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const remoteWishes = await getWishes(lang);
      setWishes(remoteWishes);
      setErrorMessage('');
      return remoteWishes;
    } catch (err) {
      console.error('[Guestbook] Failed to load wishes:', err);
      if (!isSilent) {
        setErrorMessage(
          lang === 'hi'
            ? 'आशीर्वाद संदेश लोड करने में असमर्थ। कृपया पुनः प्रयास करें।'
            : 'Unable to load blessings right now. Please try again.'
        );
      }
      return null;
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [lang]);

  // Migrate any previous local-only wishes on mount (runs once per client)
  const migrateLocalWishesOnce = useCallback(async (existingRemoteList) => {
    try {
      const isAlreadyMigrated = localStorage.getItem('sachin_anjali_guestbook_migrated');
      if (isAlreadyMigrated) return;

      const rawSaved = localStorage.getItem('sachin_anjali_guestbook');
      if (!rawSaved) {
        localStorage.setItem('sachin_anjali_guestbook_migrated', 'true');
        return;
      }

      const localList = JSON.parse(rawSaved);
      if (!Array.isArray(localList) || localList.length === 0) {
        localStorage.setItem('sachin_anjali_guestbook_migrated', 'true');
        return;
      }

      const remote = existingRemoteList || wishesRef.current || [];
      let migratedAny = false;

      for (const item of localList) {
        if (!item || !item.name || !item.message) continue;
        const trimmedName = String(item.name).trim();
        const trimmedMessage = String(item.message).trim();

        // Check if already in Firebase
        const isDuplicate = remote.some(
          (r) => r.name === trimmedName && r.message === trimmedMessage
        );

        if (!isDuplicate) {
          try {
            await submitWish(
              {
                name: trimmedName,
                city: String(item.city || '').trim(),
                message: trimmedMessage,
              },
              lang
            );
            migratedAny = true;
          } catch (mErr) {
            console.warn('[Guestbook Migration] Skipped item:', mErr);
          }
        }
      }

      localStorage.setItem('sachin_anjali_guestbook_migrated', 'true');
      if (migratedAny) {
        loadWishesFromFirebase(true);
      }
    } catch (err) {
      console.warn('[Guestbook Migration] Error:', err);
    }
  }, [lang, loadWishesFromFirebase]);

  // Main lifecycle: Fetch + Real-time SSE Subscription + Visibility-change Catchup (NO redundant polling)
  useEffect(() => {
    let unsubscribeSSE = () => { };

    // 1. Initial Load
    loadWishesFromFirebase(false).then((initialList) => {
      if (initialList) {
        migrateLocalWishesOnce(initialList);
      }
    });

    // 2. Real-time EventSource Stream
    try {
      unsubscribeSSE = subscribeToWishes(
        (event) => {
          setIsLiveConnected(true);
          const { type, path, data } = event;

          if (type === 'put') {
            if (path === '/') {
              // Full dictionary update
              const normalized = normalizeWishes(data, lang);
              setWishes(normalized);
            } else if (path && path.length > 1) {
              const key = path.replace(/^\//, '');
              if (!data) {
                // Item deleted
                setWishes((prev) => prev.filter((w) => w.id !== key));
              } else if (typeof data === 'object') {
                // Single item added or updated
                const itemWish = {
                  id: key,
                  name: String(data.name || '').trim(),
                  city: String(data.city || '').trim() || (lang === 'hi' ? 'शुभचिंतक' : 'Well Wisher'),
                  message: String(data.message || '').trim(),
                  createdAt: Number(data.createdAt) || Date.now(),
                };

                setWishes((prev) => {
                  const filtered = prev.filter((w) => w.id !== key);
                  const updated = [itemWish, ...filtered];
                  updated.sort((a, b) => b.createdAt - a.createdAt);
                  return normalizeWishes(updated, lang);
                });
              }
            }
          } else if (type === 'patch') {
            // Re-sync on patch
            loadWishesFromFirebase(true);
          }
        },
        (err) => {
          console.warn('[Guestbook SSE connection notice]', err);
          setIsLiveConnected(false);
        }
      );
    } catch (sseErr) {
      console.warn('[Guestbook SSE init]', sseErr);
    }

    // 3. Tab Visibility-change Catchup (re-syncs cleanly when user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadWishesFromFirebase(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribeSSE();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lang, loadWishesFromFirebase, migrateLocalWishesOnce]);

  // Handle wish submission
  const handleAddWish = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setSuccessMessage('');

    // 1. Anti-spam honeypot verification
    if (honeypot && honeypot.trim().length > 0) {
      console.warn('[Guestbook] Automated submission detected via honeypot.');
      setAuthor('');
      setCity('');
      setText('');
      setHoneypot('');
      setSuccessMessage(
        lang === 'hi'
          ? '॥ आपका शुभ आशीर्वाद सफलतापूर्वक समर्पित हुआ! धन्यवाद ॥'
          : 'Your blessing has been posted successfully! Thank you.'
      );
      return;
    }

    // 2. Client-side submission cooldown verification
    if (cooldownRemaining > 0) {
      setErrorMessage(
        lang === 'hi'
          ? `कृपया अगला संदेश भेजने से पहले ${cooldownRemaining} सेकंड प्रतीक्षा करें।`
          : `Please wait ${cooldownRemaining} seconds before submitting another blessing.`
      );
      return;
    }

    // 3. Field validation
    const validation = validateWish({
      name: author,
      city: city,
      message: text,
    });

    if (!validation.isValid) {
      setErrorMessage(lang === 'hi' ? validation.errorHi : validation.error);
      return;
    }

    setIsSubmitting(true);

    try {
      const createdWish = await submitWish(
        {
          name: author,
          city: city,
          message: text,
        },
        lang
      );

      // Instantly prepend into view
      setWishes((prev) => {
        const withoutDup = prev.filter((w) => w.id !== createdWish.id);
        return [createdWish, ...withoutDup];
      });

      // Clear input fields
      setAuthor('');
      setCity('');
      setText('');
      setHoneypot('');

      // Enforce 30-second cooldown
      try {
        localStorage.setItem('sachin_anjali_guestbook_cooldown', String(Date.now()));
        setCooldownRemaining(COOLDOWN_DURATION);
      } catch {
        // ignore
      }

      // Show temporary celebratory success confirmation
      setSuccessMessage(
        lang === 'hi'
          ? '॥ आपका शुभ आशीर्वाद सफलतापूर्वक समर्पित हुआ! धन्यवाद ॥'
          : 'Your blessing has been posted successfully! Thank you.'
      );
      setTimeout(() => setSuccessMessage(''), 4500);

      // Trigger celebratory flower shower burst!
      if (onFlowerShower) {
        onFlowerShower();
      }
    } catch (err) {
      console.error('[Guestbook] Submit failed:', err);
      setErrorMessage(
        err.message ||
        (lang === 'hi'
          ? 'आशीर्वाद भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
          : 'Failed to post blessing. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedWishes = showAllWishes ? wishes : wishes.slice(0, INITIAL_WISH_LIMIT);

  return (
    <section id="guestbook" className="guestbook-royal-section">
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>✦</span>
            <span>{lang === 'hi' ? 'स्नेह संदेश' : 'Traditional Blessings'}</span>
            <span>✦</span>
          </div>
          <h2 className="section-title">॥ शुभ आशीर्वाद पुस्तिका ॥</h2>
          <div className="ornamental-divider">
            <span className="divider-line" />
            <span className="divider-symbol">🌸</span>
            <span className="divider-line" />
          </div>
          <p className="section-subtitle">
            {lang === 'hi'
              ? 'वर-वधू के नवजीवन हेतु अपने स्नेहिल शब्द एवं पावन आशीर्वाद अर्पित करें'
              : 'Leave your heartfelt blessings and warm wishes for Sachin & Anjali'}
          </p>
        </div>

        <div className="guestbook-grid">
          {/* Write Wish Card */}
          <div className="write-wish-card royal-card">
            <div className="corner-accent corner-top-left" />
            <div className="corner-accent corner-top-right" />
            <div className="corner-accent corner-bottom-left" />
            <div className="corner-accent corner-bottom-right" />

            <h3 className="card-form-heading">
              <Sparkles size={18} className="gold-sparkle" />
              <span>{lang === 'hi' ? 'शुभकामना संदेश लिखें' : 'Send Your Blessing'}</span>
            </h3>

            {/* Error Banner */}
            {errorMessage && (
              <div className="guestbook-error-banner" role="alert">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="guestbook-success-banner" role="status">
                <Heart size={16} fill="#66bb6a" color="#66bb6a" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddWish} className="guestbook-form" noValidate>
              {/* Anti-spam Honeypot Field (Hidden from real visitors) */}
              <div className="guestbook-hp-field" aria-hidden="true">
                <label htmlFor="guestbook-website-hp">Website</label>
                <input
                  type="text"
                  id="guestbook-website-hp"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  required
                  maxLength={40}
                  className="form-input"
                  placeholder={lang === 'hi' ? 'आपका नाम * (2-40 अक्षर)' : 'Your Name * (2-40 chars)'}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  maxLength={60}
                  className="form-input"
                  placeholder={lang === 'hi' ? 'स्थान / शहर (उदा. बांदा, लखनऊ)' : 'Your City / Town (Max 60 chars)'}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <textarea
                  rows="3"
                  required
                  maxLength={500}
                  className="form-textarea"
                  placeholder={lang === 'hi' ? 'वर-वधू के लिए आपका स्नेहिल आशीर्वाद...' : 'Your blessings for the couple...'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="btn-royal-primary write-submit-btn"
                disabled={isSubmitting || cooldownRemaining > 0}
              >
                {isSubmitting ? (
                  <>
                    <span className="guestbook-loading-spinner" style={{ width: 16, height: 16 }} />
                    <span>{lang === 'hi' ? 'समर्पित किया जा रहा है...' : 'Posting Blessing...'}</span>
                  </>
                ) : cooldownRemaining > 0 ? (
                  <>
                    <Heart size={16} />
                    <span>
                      {lang === 'hi'
                        ? `प्रतीक्षा करें (${cooldownRemaining}s)`
                        : `Please wait (${cooldownRemaining}s)`}
                    </span>
                  </>
                ) : (
                  <>
                    <Heart size={16} />
                    <span>{lang === 'hi' ? 'आशीर्वाद समर्पित करें' : 'Post Blessing'}</span>
                  </>
                )}
              </button>

              <div className="guestbook-demo-disclaimer">
                <span>🌸</span>
                <span>
                  {lang === 'hi'
                    ? 'आपका पावन आशीर्वाद तुरंत नवदंपति एवं सभी अतिथियों को रीयल-टाइम में दिखाई देगा।'
                    : 'Your blessing will be published instantly in real-time for the couple and all guests.'}
                </span>
                {isLiveConnected && (
                  <span className="guestbook-live-indicator" title="Live sync active">
                    <span className="live-pulse-dot" />
                    <span>{lang === 'hi' ? 'लाइव' : 'Live'}</span>
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* List of Blessings */}
          <div className="guestbook-stream-container">
            <div className="wishes-stream">
              {isLoading && wishes.length === 0 ? (
                <div className="guestbook-loading-state">
                  <div className="guestbook-loading-spinner" />
                  <span>{lang === 'hi' ? 'पावन आशीर्वाद लोड हो रहे हैं...' : 'Loading sacred blessings...'}</span>
                </div>
              ) : wishes.length === 0 ? (
                <div className="guestbook-empty-state">
                  <span>🌸</span>
                  <span>{lang === 'hi' ? 'पहला स्नेहिल आशीर्वाद संदेश आप समर्पित करें।' : 'Be the first to bless the couple!'}</span>
                </div>
              ) : (
                displayedWishes.map((w) => (
                  <div key={w.id} className="wish-card-item royal-card">
                    <div className="wish-top-row">
                      <div className="author-details">
                        <h4 className="author-name">{w.name}</h4>
                        {w.city && (
                          <span className="author-city">
                            <span className="city-pin-icon" aria-hidden="true">📍</span>
                            <span>{w.city}</span>
                          </span>
                        )}
                      </div>
                      <span className="wish-time-badge">{w.date}</span>
                    </div>
                    <p className="wish-message-body">"{w.message}"</p>
                    <div className="wish-bottom-ornament">
                      <Heart size={12} className="tiny-heart" />
                      <span className="blessing-tag">॥ सदा सुहागन रहो ॥</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {wishes.length > INITIAL_WISH_LIMIT && (
              <div className="see-all-wishes-wrap">
                <button
                  type="button"
                  className="btn-royal-outline btn-see-all-wishes"
                  onClick={() => setShowAllWishes((prev) => !prev)}
                  aria-expanded={showAllWishes}
                >
                  <span>
                    {showAllWishes
                      ? (lang === 'hi' ? 'कम संदेश देखें ▴' : 'Show Fewer Blessings ▴')
                      : (lang === 'hi' ? `सभी संदेश देखें (${wishes.length}) ▾` : `See All Messages (${wishes.length}) ▾`)}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
