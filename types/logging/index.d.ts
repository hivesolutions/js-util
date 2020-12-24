export declare namespace Logging {
    enum constants {
        CRITICAL,
        ERROR,
        WARNING,
        INFO,
        DEBUG,
        NOTSET,
        DEFAULT_LEVEL,
        CRITICAL_VALUE,
        ERROR_VALUE,
        WARNING_VALUE,
        INFO_VALUE,
        DEBUG_VALUE,
        NOTSET_VALUE,
        DEFAULT_LEVEL_VALUE,
        DEFAULT_LOGGER_NAME
    }

    function getLogger(loggerName?: string, defaults?: {
        handlers?: Handler[],
        formatter?: Formatter,
        level?: number
    }): Logger;
    function debug(messageValue: string): void;
    function info(messageValue: string): void;
    function warn(messageValue: string): void;
    function warning(messageValue: string): void;
    function error(messageValue: string): void;
    function critical(messageValue: string): void;

    class Logger {
        addHandler(handler: Handler): void;
        setLevel(level: string): void;
        debug(messageValue: string): void;
        info(messageValue: string): void;
        warn(messageValue: string): void;
        warning(messageValue: string): void;
        error(messageValue: string): void;
        critical(messageValue: string): void;
        isEnabledFor(level: string): void;
        getEffectiveLevel(): void;
        setFormatter(formatter: Formatter): void;
        handle(record: Record): void;
        callHandlers(record: Record): void;
    }

    class Record {}

    class Formatter {}
    class SimpleFormatter extends Formatter {
        constructor(formatString?: string)
    }

    class Handler {
        static isReady(): boolean;
    }
    class ConsolaHandler extends Handler {}
    class StreamHandler {}
}
