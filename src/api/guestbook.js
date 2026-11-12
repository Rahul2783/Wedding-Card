/**
 * Firebase Realtime Database API for Royal Wedding Guestbook
 * Uses native fetch() and Firebase REST API with SSE EventSource streaming.
 * No Firebase SDK required.
 */

const DEFAULT_DATABASE_URL =
  'https://wedding-invitation-guest-fd88f-default-rtdb.asia-southeast1.firebasedatabase.app';

/**
 * Returns the normalized Firebase database URL without trailing slashes.
 */
export const getDatabaseUrl = () => {
  const envUrl = import.meta.env?.VITE_FIREBASE_DATABASE_URL;
  const url = (envUrl && typeof envUrl === 'string' && envUrl.trim()) || DEFAULT_DATABASE_URL;
  return url.replace(/\/+$/, '');
};

/**
 * Validates wish input fields according to specifications:
 * - name: 2–40 characters
 * - city: max 60 characters
 * - message: 1–500 characters
 */
export const validateWish = (wishData = {}) => {
  const name = typeof wishData.name === 'string' ? wishData.name.trim() : '';
  const city = typeof wishData.city === 'string' ? wishData.city.trim() : '';
  const message = typeof wishData.message === 'string' ? wishData.message.trim() : '';

  if (name.length < 2 || name.length > 40) {
    return {
      isValid: false,
      error: 'Name must be between 2 and 40 characters.',
      errorHi: 'कृपया अपना नाम दर्ज करें (2 से 40 अक्षर)।',
    };
  }

  if (city.length > 60) {
    return {
      isValid: false,
      error: 'City must be at most 60 characters.',
      errorHi: 'शहर का नाम 60 अक्षरों से अधिक नहीं होना चाहिए।',
    };
  }

  if (message.length < 1 || message.length > 500) {
    return {
      isValid: false,
      error: 'Message must be between 1 and 500 characters.',
      errorHi: 'कृपया शुभकामना संदेश दर्ज करें (1 से 500 अक्षर)।',
    };
  }

  return {
    isValid: true,
    data: {
      name,
      city,
      message,
    },
  };
};

/**
 * Formats a timestamp into a human-friendly relative or localized date string.
 *
 * @param {number|string} timestamp - Unix timestamp in ms
 * @param {string} lang - 'hi' or 'en'
 * @returns {string}
 */
export const formatWishDate = (timestamp, lang = 'hi') => {
  if (!timestamp) return lang === 'hi' ? 'अभी-अभी' : 'Just now';

  const numTime = Number(timestamp);
  if (isNaN(numTime) || numTime <= 0) {
    return lang === 'hi' ? 'अभी-अभी' : 'Just now';
  }

  const now = Date.now();
  const diffMs = now - numTime;

  if (diffMs < 60 * 1000) {
    return lang === 'hi' ? 'अभी-अभी' : 'Just now';
  }

  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  if (diffMinutes < 60) {
    return lang === 'hi' ? `${diffMinutes} मिनट पहले` : `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  if (diffHours < 24) {
    return lang === 'hi'
      ? diffHours === 1
        ? '1 घंटा पहले'
        : `${diffHours} घंटे पहले`
      : `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 1) {
    return lang === 'hi' ? 'कल' : 'Yesterday';
  }
  if (diffDays < 7) {
    return lang === 'hi' ? `${diffDays} दिन पहले` : `${diffDays}d ago`;
  }

  try {
    const d = new Date(numTime);
    return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return lang === 'hi' ? 'हाल ही में' : 'Recently';
  }
};

/**
 * Converts Firebase wishes object or map into a clean, normalized array sorted newest first.
 *
 * @param {Object|Array|null} data - Raw data from Firebase RTDB
 * @param {string} lang - Language code for date formatting
 * @returns {Array} Array of wish objects
 */
export const normalizeWishes = (data, lang = 'hi') => {
  if (!data) return [];

  const list = [];

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      if (item && typeof item === 'object') {
        const createdAt = Number(item.createdAt) || Date.now();
        list.push({
          id: item.id || `wish-${index}`,
          name: String(item.name || '').trim() || 'अनाम शुभचिंतक',
          city: String(item.city || '').trim() || (lang === 'hi' ? 'शुभचिंतक' : 'Well Wisher'),
          message: String(item.message || '').trim(),
          createdAt,
          date: formatWishDate(createdAt, lang),
        });
      }
    });
  } else if (typeof data === 'object') {
    Object.entries(data).forEach(([key, item]) => {
      if (item && typeof item === 'object') {
        const createdAt = Number(item.createdAt) || Date.now();
        list.push({
          id: key,
          name: String(item.name || '').trim() || 'अनाम शुभचिंतक',
          city: String(item.city || '').trim() || (lang === 'hi' ? 'शुभचिंतक' : 'Well Wisher'),
          message: String(item.message || '').trim(),
          createdAt,
          date: formatWishDate(createdAt, lang),
        });
      }
    });
  }

  // Sort newest first
  list.sort((a, b) => b.createdAt - a.createdAt);
  return list;
};

/**
 * Fetches all wishes from Firebase via GET /wishes.json
 *
 * @param {string} lang - Language for date formatting
 * @returns {Promise<Array>} Normalized array of wishes
 */
export const getWishes = async (lang = 'hi') => {
  const url = `${getDatabaseUrl()}/wishes.json`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errJson = await response.json();
      errorDetails = errJson?.error || JSON.stringify(errJson);
    } catch {
      errorDetails = response.statusText;
    }
    throw new Error(
      `Failed to fetch wishes (${response.status}): ${errorDetails || 'Network error'}`
    );
  }

  const rawData = await response.json();
  return normalizeWishes(rawData, lang);
};

/**
 * Submits a new wish to Firebase via POST /wishes.json
 *
 * @param {Object} wishData - { name, city, message }
 * @param {string} lang - Language for error messages
 * @returns {Promise<Object>} Created wish object with Firebase id
 */
export const submitWish = async (wishData, lang = 'hi') => {
  const validation = validateWish(wishData);
  if (!validation.isValid) {
    const errorMsg = lang === 'hi' ? validation.errorHi : validation.error;
    const err = new Error(errorMsg);
    err.isValidationError = true;
    throw err;
  }

  // Use Firebase Server Timestamp via { ".sv": "timestamp" } to eliminate client clock skew
  const payload = {
    name: validation.data.name,
    city: validation.data.city || (lang === 'hi' ? 'शुभचिंतक' : 'Well Wisher'),
    message: validation.data.message,
    createdAt: { '.sv': 'timestamp' },
  };

  const url = `${getDatabaseUrl()}/wishes.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errJson = await response.json();
      errorDetails = errJson?.error || JSON.stringify(errJson);
    } catch {
      errorDetails = response.statusText;
    }
    throw new Error(
      lang === 'hi'
        ? `शुभकामना संदेश भेजने में त्रुटि (${response.status})। कृपया पुनः प्रयास करें।`
        : `Failed to submit wish (${response.status}): ${errorDetails || 'Network error'}`
    );
  }

  const resJson = await response.json();
  const generatedId = resJson?.name || `wish-${Date.now()}`;
  const localEstimatedTime = Date.now();

  return {
    id: generatedId,
    name: payload.name,
    city: payload.city,
    message: payload.message,
    createdAt: localEstimatedTime,
    date: formatWishDate(localEstimatedTime, lang),
  };
};

/**
 * Cross-device real-time synchronization using Firebase REST SSE (EventSource).
 * Subscribes to real-time events on /wishes.json.
 *
 * @param {Function} onEvent - Callback receiving { eventType, path, data }
 * @param {Function} onError - Optional error handler
 * @returns {Function} Cleanup/unsubscribe function
 */
export const subscribeToWishes = (onEvent, onError) => {
  if (typeof window === 'undefined' || typeof window.EventSource === 'undefined') {
    return () => {};
  }

  const url = `${getDatabaseUrl()}/wishes.json`;
  let eventSource = null;
  let isClosed = false;
  let reconnectTimer = null;

  const connect = () => {
    if (isClosed) return;

    try {
      eventSource = new EventSource(url);

      eventSource.addEventListener('put', (e) => {
        if (isClosed) return;
        try {
          const parsed = JSON.parse(e.data);
          if (onEvent) {
            onEvent({ type: 'put', path: parsed?.path || '/', data: parsed?.data });
          }
        } catch (err) {
          console.error('[Guestbook EventSource put error]', err);
        }
      });

      eventSource.addEventListener('patch', (e) => {
        if (isClosed) return;
        try {
          const parsed = JSON.parse(e.data);
          if (onEvent) {
            onEvent({ type: 'patch', path: parsed?.path || '/', data: parsed?.data });
          }
        } catch (err) {
          console.error('[Guestbook EventSource patch error]', err);
        }
      });

      eventSource.onerror = (err) => {
        if (isClosed) return;
        if (onError) onError(err);

        // Attempt clean reconnect after backoff
        if (eventSource) {
          try {
            eventSource.close();
          } catch {
            // ignore
          }
          eventSource = null;
        }

        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
          if (!isClosed) connect();
        }, 5000);
      };
    } catch (err) {
      if (onError) onError(err);
    }
  };

  connect();

  return () => {
    isClosed = true;
    clearTimeout(reconnectTimer);
    if (eventSource) {
      try {
        eventSource.close();
      } catch {
        // ignore
      }
      eventSource = null;
    }
  };
};

