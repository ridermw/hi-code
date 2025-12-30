const LOG_LEVELS = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

function normalizeLogLevel(value) {
  const normalized = String(value ?? "info").toLowerCase();
  return normalized in LOG_LEVELS ? normalized : "info";
}

function createLogger(currentLevel) {
  const activeLevel = normalizeLogLevel(currentLevel);

  function shouldLog(level) {
    return LOG_LEVELS[level] <= LOG_LEVELS[activeLevel];
  }

  function log(level, message, meta) {
    if (!shouldLog(level)) {
      return;
    }

    const logger =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : level === "debug" || level === "trace"
            ? console.debug
            : console.info;

    if (meta !== undefined) {
      logger(message, meta);
      return;
    }

    logger(message);
  }

  function formatLogValue(value) {
    if (value === undefined || value === null) {
      return value;
    }

    if (typeof value === "string") {
      return value.length > 500 ? `${value.slice(0, 500)}...` : value;
    }

    if (typeof value === "object") {
      try {
        const serialized = JSON.stringify(value);
        return serialized.length > 500
          ? `${serialized.slice(0, 500)}...`
          : value;
      } catch {
        return value;
      }
    }

    return value;
  }

  return { log, shouldLog, formatLogValue };
}

module.exports = {
  createLogger,
  normalizeLogLevel,
};
