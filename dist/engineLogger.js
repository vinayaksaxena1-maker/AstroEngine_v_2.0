/**
 * Centralized Engine Logger Service
 * Manages Astronomical Engine diagnostic logging policies across Debug and Production builds.
 */
export const ENGINE_VERSION = 'v1.0.0';
export const isDebugBuild = () => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return !!import.meta.env.DEV;
    }
    return false;
};
class EngineLoggerService {
    crashListeners = [];
    liveLogs = [];
    logListeners = [];
    nextId = 1;
    pushLog(level, message, details) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
        let detailsStr = '';
        if (details !== undefined) {
            try {
                detailsStr = typeof details === 'string' ? details : JSON.stringify(details);
            }
            catch {
                detailsStr = String(details);
            }
        }
        const entry = {
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
            try {
                l();
            }
            catch { }
        });
    }
    getLiveLogs() {
        return [...this.liveLogs];
    }
    clearLogs() {
        this.liveLogs = [];
        this.logListeners.forEach(l => {
            try {
                l();
            }
            catch { }
        });
    }
    subscribeLiveLogs(listener) {
        this.logListeners.push(listener);
        return () => {
            this.logListeners = this.logListeners.filter(l => l !== listener);
        };
    }
    /**
     * Registers a listener for future remote crash reporting integration (Crashlytics, Sentry, Bugsnag)
     */
    registerCrashReportListener(listener) {
        this.crashListeners.push(listener);
    }
    /**
     * Logs full diagnostic report during Debug builds. Suppressed in Production builds.
     */
    logDiagnostics(report) {
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
    logDebug(message, ...args) {
        this.pushLog('DEBUG', message, args.length > 0 ? args : undefined);
        if (isDebugBuild()) {
            console.log(`[Engine Debug] ${message}`, ...args);
        }
    }
    /**
     * Critical failure logs printed in ALL builds (Debug and Release/Production).
     * Also dispatches to registered crash reporting listeners.
     */
    logCriticalFailure(code, errorMsg, context) {
        this.pushLog('ERROR', `[${code}] ${errorMsg}`, context);
        console.error(`[Engine Critical Failure] [${code}] ${errorMsg}`, context || '');
        this.crashListeners.forEach(listener => {
            try {
                listener(code, errorMsg, context);
            }
            catch (e) {
                // Protect logger execution from subscriber errors
            }
        });
    }
}
export const EngineLogger = new EngineLoggerService();
