export type LogLevel = "silent" | "error" | "warn" | "info" | "debug" | "trace";

export function normalizeLogLevel(value?: string): LogLevel;

export function createLogger(currentLevel: LogLevel): {
  log: (level: LogLevel, message: string, meta?: unknown) => void;
  shouldLog: (level: LogLevel) => boolean;
  formatLogValue: (value: unknown) => unknown;
};
