# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

*

### Changed

*

### Fixed

*

## [0.6.0] - 2026-10-01

### Added

* Colors in the log messages, in the browser console and in terminals, respecting the standard environment variables that disable or force them - [#7](https://github.com/hivesolutions/js-util/issues/7)
* Name of the logger and extra values, such as objects, in the log messages - [#7](https://github.com/hivesolutions/js-util/issues/7)
* Propagation of the log messages of a logger to the default logger - [#7](https://github.com/hivesolutions/js-util/issues/7)

### Changed

* Warnings and errors are printed as such by the console, meaning to the standard error under Node.js - [#7](https://github.com/hivesolutions/js-util/issues/7)
* The time of the log messages is the time they were logged instead of the time they were formatted - [#7](https://github.com/hivesolutions/js-util/issues/7)

### Fixed

* Loading the logging more than once (eg: bundled in other libraries) keeps the existing loggers - [#7](https://github.com/hivesolutions/js-util/issues/7)
* Time of the log messages formatted in older browsers, with no support for padding strings - [#7](https://github.com/hivesolutions/js-util/issues/7)
* Types of the levels, messages and defaults of the loggers - [#7](https://github.com/hivesolutions/js-util/issues/7)

## [0.5.4] - 2026-05-21

### Fixed

* Zero-padding for hours, minutes, seconds and milliseconds in logging timestamp
* `ConsolaHandler` constructor no longer crashes with `TypeError: Cannot read properties of undefined (reading 'Debug')` when paired with `consola@^3`, which dropped the `LogLevel` enum that `consola@^2` exposed; the handler now resolves the numeric debug level defensively as `consola.LogLevel ? consola.LogLevel.Debug : 4`, falling back to the same numeric value `consola@^2`'s `LogLevel.Debug` resolved to (4) and that `consola@^3` still accepts as a level value, so the handler is backward compatible across both major versions without requiring downstream consumers to pin a specific consola version

## [0.5.3] - 2024-02-28

### Added

* Support for more base param in logging

## [0.5.2] - 2024-02-27

### Fixed

* `LoggingContext` structure

## [0.5.1] - 2024-02-27

### Changed

* Added `ctx` support for logstash logging

## [0.5.0] - 2024-02-27

### Changed

* Rename repository to `js-util`
* Support for the Logstash handler

## [0.4.1] - 2022-02-13

### Fixed

* Issue with constant enumeration in Typescript declaration file

## [0.4.0] - 2021-10-23

### Fixed

* Support for the `DEBUG` level in the `consola` logging handler
