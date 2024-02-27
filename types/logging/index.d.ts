export type LoggingContext = {
    [key: string]: string;
};

export declare namespace Logging {
    enum constants {
        CRITICAL = 50,
        ERROR = 40,
        WARNING = 30,
        INFO = 20,
        DEBUG = 10,
        NOTSET = 0,
        DEFAULT_LEVEL = 20,
        CRITICAL_VALUE = "CRITICAL",
        ERROR_VALUE = "ERROR",
        WARNING_VALUE = "WARNING",
        INFO_VALUE = "INFO",
        DEBUG_VALUE = "DEBUG",
        NOTSET_VALUE = "NOTSET",
        DEFAULT_LEVEL_VALUE = "INFO",
        DEFAULT_LOGGER_NAME = "default"
    }

    function getLogger(
        loggerName?: string,
        defaults?: {
            handlers?: Handler[];
            formatter?: Formatter;
            level?: number;
        }
    ): Logger;
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

    class Record {
        constructor(message: string, level: number);

        getMessage(): string;
        getLevel(): number;
        getLevelString(): string;
    }

    class Formatter {}
    class SimpleFormatter extends Formatter {
        constructor(formatString?: string);
    }

    class Handler {}
    class ConsolaHandler extends Handler {
        static isReady(): boolean;
    }
    class LoggyHandler extends Handler {}
    class LogstashHandler extends Handler {
        constructor(url: string, ctx?: LoggingContext);
        static isReady(url: string): boolean;
    }
    class StreamHandler {}
}
