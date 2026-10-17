/**
 * Centralized Engine Logger Service
 * Manages Astronomical Engine diagnostic logging policies across Debug and Production builds.
 */

export const ENGINE_VERSION = 'v1.0.0';

export type EngineErrorCode = 
  | 'ENG-001' // Worker Creation Failed
  | 'ENG-002' // Swiss Ephemeris WASM Init Failed
  | 'ENG-003' // Maximum Retry Limit Reached
  | 'ENG-004' // Web Worker Runtime Crash / Error
  | 'ENG-005' // Ephemeris Buffer Missing
  | 'ENG-006'; // 30-Second Initialization Timeout Reached

export const isDebugBuild = (): boolean => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return !!import.meta.env.DEV;
  }
  return false;
};

export type CrashReportListener = (code: EngineErrorCode, error: Error | string, context?: Record<string, any>) => void;

export interface EngineDiagnosticReport {
  workerCreationTime: number;
  wasmCompilationTime?: number;
  ephemerisLoadingTime?: number;
  engineReadyTime: number;
  totalDuration: number;
  retryCount: number;
  result: string;
}

export interface LiveLogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR';
  message: string;
  details?: string;
}

class EngineLoggerService {
  private crashListeners: CrashReportListener[] = [];
  private liveLogs: LiveLogEntry[] = [];
  private logListeners: Array<() => void> = [];
  private nextId = 1;

  public pushLog(level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR', message: string, details?: any) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    let detailsStr = '';
    if (details !== undefined) {
      try {
        detailsStr = typeof details === 'string' ? details : JSON.stringify(details);
      } catch {
        detailsStr = String(details);
      }
    }

    const entry: LiveLogEntry = {
      id: this.nextId++,
      timestamp: timeStr,
      level,
      message,
      details: detailsStr || undefined
    };

    this.liveLogs.push(entry);
    if (this.liveLogs.length > 500) {
      this.liveLogs.shift();
    }

    this.logListeners.forEach(l => {
      try { l(); } catch {}
    });
  }

  public getLiveLogs(): LiveLogEntry[] {
    return [...this.liveLogs];
  }

  public clearLogs() {
    this.liveLogs = [];
    this.logListeners.forEach(l => {
      try { l(); } catch {}
    });
  }

  public subscribeLiveLogs(listener: () => void): () => void {
    this.logListeners.push(listener);
    return () => {
      this.logListeners = this.logListeners.filter(l => l !== listener);
    };
  }

  /**
   * Registers a listener for future remote crash reporting integration (Crashlytics, Sentry, Bugsnag)
   */
  public registerCrashReportListener(listener: CrashReportListener) {
    this.crashListeners.push(listener);
  }

  /**
   * Logs full diagnostic report during Debug builds. Suppressed in Production builds.
   */
  public logDiagnostics(report: EngineDiagnosticReport) {
    this.pushLog('INFO', `Diagnostic Report (${ENGINE_VERSION}): Total ${report.totalDuration.toFixed(0)}ms | Worker ${report.workerCreationTime.toFixed(0)}ms | WASM ${report.wasmCompilationTime?.toFixed(0) || 0}ms | Eph ${report.ephemerisLoadingTime?.toFixed(0) || 0}ms | Result: ${report.result}`);
    if (isDebugBuild()) {
      console.log('======================================================');
      console.log(`       ASTRONOMICAL ENGINE DIAGNOSTIC REPORT (${ENGINE_VERSION})`);
      console.log('======================================================');
      console.log(`• Worker Creation Time:          ${report.workerCreationTime.toFixed(2)} ms`);
      console.log(`• WASM Compilation Time:        ${report.wasmCompilationTime ? report.wasmCompilationTime.toFixed(2) + ' ms' : 'N/A'}`);
      console.log(`• Ephemeris Loading Time:       ${report.ephemerisLoadingTime ? report.ephemerisLoadingTime.toFixed(2) + ' ms' : 'N/A'}`);
      console.log(`• Engine Ready Time:             ${report.engineReadyTime.toFixed(2)} ms`);
      console.log(`• Total Initialization Duration: ${report.totalDuration.toFixed(2)} ms`);
      console.log(`• Retry Count:                   ${report.retryCount}`);
      console.log(`• Initialization Result:         ${report.result}`);
      console.log('======================================================');
    }
  }

  /**
   * Debug-only timing and progress logs.
   */
  public logDebug(message: string, ...args: any[]) {
    this.pushLog('DEBUG', message, args.length > 0 ? args : undefined);
    if (isDebugBuild()) {
      console.log(`[Engine Debug] ${message}`, ...args);
    }
  }

  /**
   * Critical failure logs printed in ALL builds (Debug and Release/Production).
   * Also dispatches to registered crash reporting listeners.
   */
  public logCriticalFailure(code: EngineErrorCode, errorMsg: string, context?: Record<string, any>) {
    this.pushLog('ERROR', `[${code}] ${errorMsg}`, context);
    console.error(`[Engine Critical Failure] [${code}] ${errorMsg}`, context || '');
    this.crashListeners.forEach(listener => {
      try {
        listener(code, errorMsg, context);
      } catch (e) {
        // Protect logger execution from subscriber errors
      }
    });
  }
}

export const EngineLogger = new EngineLoggerService();
