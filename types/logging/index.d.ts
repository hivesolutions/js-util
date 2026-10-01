export type LoggingContext = {
    [key: string]: string | number | boolean | null | undefined;
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
            propagate?: boolean;
        }
    ): Logger;
    function debug(messageValue: any, ...args: any[]): void;
    function info(messageValue: any, ...args: any[]): void;
    function warn(messageValue: any, ...args: any[]): void;
    function warning(messageValue: any, ...args: any[]): void;
    function error(messageValue: any, ...args: any[]): void;
    function critical(messageValue: any, ...args: any[]): void;

    type LogstashOptions = {
        poweredBy?: string;
    };

    class Logger {
        constructor(loggerName: string, level?: number, handlers?: Handler[], propagate?: boolean);

        propagate: boolean;

        addHandler(handler: Handler): void;
        setLevel(level: string): void;
        debug(messageValue: any, ...args: any[]): void;
        info(messageValue: any, ...args: any[]): void;
        warn(messageValue: any, ...args: any[]): void;
        warning(messageValue: any, ...args: any[]): void;
        error(messageValue: any, ...args: any[]): void;
        critical(messageValue: any, ...args: any[]): void;
        isEnabledFor(level: string): void;
        getEffectiveLevel(): void;
        setFormatter(formatter: Formatter): void;
        handle(record: Record): void;
        callHandlers(record: Record): void;
    }

    class Record {
        constructor(message: string, level: number, name?: string, args?: any[]);

        getMessage(): string;
        getLevel(): number;
        getLevelString(): string;
        getName(): string;
        getArgs(): any[];
        getCreated(): Date;
    }

    class Formatter {
        format(record: Record): string;
        formatArgs(record: Record, colors?: string | null): any[];
    }
    class SimpleFormatter extends Formatter {
        constructor(formatString?: string);
        static selectColor(name: string, styles: string[]): string;
    }

    class Handler {}
    class ConsolaHandler extends Handler {
        static isReady(): boolean;
    }
    class LoggyHandler extends Handler {}
    class LogstashHandler extends Handler {
        constructor(url: string, ctx?: LoggingContext, options?: LogstashOptions);
        static isReady(url: string): boolean;
    }
    class StreamHandler extends Handler {
        constructor(stream?: Console, colors?: string | null);
        static getColors(): string | null;
    }
}
