/**
 * Centralized Engine Logger Service
 * Manages Astronomical Engine diagnostic logging policies across Debug and Production builds.
 */
export declare const ENGINE_VERSION = "v1.0.0";
export type EngineErrorCode = 'ENG-001' | 'ENG-002' | 'ENG-003' | 'ENG-004' | 'ENG-005' | 'ENG-006';
export declare const isDebugBuild: () => boolean;
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
declare class EngineLoggerService {
    private crashListeners;
    private liveLogs;
    private logListeners;
    private nextId;
    pushLog(level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR', message: string, details?: any): void;
    getLiveLogs(): LiveLogEntry[];
    clearLogs(): void;
    subscribeLiveLogs(listener: () => void): () => void;
    /**
     * Registers a listener for future remote crash reporting integration (Crashlytics, Sentry, Bugsnag)
     */
    registerCrashReportListener(listener: CrashReportListener): void;
    /**
     * Logs full diagnostic report during Debug builds. Suppressed in Production builds.
     */
    logDiagnostics(report: EngineDiagnosticReport): void;
    /**
     * Debug-only timing and progress logs.
     */
    logDebug(message: string, ...args: any[]): void;
    /**
     * Critical failure logs printed in ALL builds (Debug and Release/Production).
     * Also dispatches to registered crash reporting listeners.
     */
    logCriticalFailure(code: EngineErrorCode, errorMsg: string, context?: Record<string, any>): void;
}
export declare const EngineLogger: EngineLoggerService;
export {};
//# sourceMappingURL=engineLogger.d.ts.map