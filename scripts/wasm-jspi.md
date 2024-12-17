# JSPI

## Table of Contents

<!-- toc -->

- [Overview](#overview)
- [Core Features](#core-features)
  * [Suspension & Resumption](#suspension--resumption)
  * [Transparent Handling](#transparent-handling)
  * [Constant Overhead](#constant-overhead)
- [Usage](#usage)
  * [Emscripten Integration](#emscripten-integration)
- [Current Status](#current-status)
  * [Experimental](#experimental)
  * [Standardization](#standardization)
- [Goal](#goal)

<!-- tocstop -->

## Overview
JSPI allows WebAssembly code to "suspend" execution when encountering JavaScript Promise objects and resume once the Promise is resolved. This eliminates the need for complex callback mechanisms when integrating WebAssembly with asynchronous JavaScript functions.

## Core Features

### Suspension & Resumption
- When a WebAssembly function calls an async JavaScript API (e.g., returning a Promise), the WebAssembly code suspends execution.
- Once the Promise resolves, execution resumes as if it never paused.

### Transparent Handling
- JSPI modifies how functions interact at the WebAssembly-JavaScript boundary.
- It does not require changes to the JavaScript or WebAssembly specifications.

### Constant Overhead
- JSPI introduces minimal, constant-time overhead during execution.
- The actual resumption time depends on the browser's event loop and task scheduling.

## Usage

### Emscripten Integration
- The JSPI spec works with tools like Emscripten (v3.1.61+), allowing developers to write async C/C++ code seamlessly.
- Example: A C++ function using `EM_ASYNC_JS` can interact with Promises, such as fetching data or performing async operations.

## Current Status

### Experimental
- JSPI is currently being tested in Chrome via flags or the origin trial.

### Standardization
- It's under active development and open for community feedback.

## Goal
JSPI simplifies the integration of synchronous WebAssembly applications with the asynchronous JavaScript environment, improving developer experience and enabling efficient hybrid applications.