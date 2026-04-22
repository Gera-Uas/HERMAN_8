// Logger utility for development
const isDev = import.meta.env.DEV;

export const logger = {
  info: (label, data) => {
    if (isDev) {
      console.log(
        `%c[INFO] ${label}`,
        'color: #0ea5e9; font-weight: bold;',
        data
      );
    }
  },

  success: (label, data) => {
    if (isDev) {
      console.log(
        `%c[SUCCESS] ${label}`,
        'color: #10b981; font-weight: bold;',
        data
      );
    }
  },

  error: (label, data) => {
    if (isDev) {
      console.error(
        `%c[ERROR] ${label}`,
        'color: #ef4444; font-weight: bold;',
        data
      );
    }
  },

  warn: (label, data) => {
    if (isDev) {
      console.warn(
        `%c[WARN] ${label}`,
        'color: #f59e0b; font-weight: bold;',
        data
      );
    }
  },

  api: (method, endpoint, data) => {
    if (isDev) {
      console.group(
        `%c🔗 ${method.toUpperCase()} ${endpoint}`,
        'color: #8b5cf6; font-weight: bold; font-size: 12px;'
      );
      if (data) console.log('Payload:', data);
      console.groupEnd();
    }
  },

  apiResponse: (method, endpoint, status, data) => {
    if (isDev) {
      const color = status >= 400 ? '#ef4444' : '#10b981';
      console.log(
        `%c✓ ${method.toUpperCase()} ${endpoint} [${status}]`,
        `color: ${color}; font-weight: bold; font-size: 12px;`,
        data
      );
    }
  }
};

export default logger;
