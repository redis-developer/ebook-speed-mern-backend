# Folder Structure

## .vscode

Contains VS Code specific settings like debugging

## dist

Contains the distributable (or output) from your TypeScript build.

## docs

documentation

## src

Contains your source code that will be compiled to the dist dir

### src/controllers

Controllers define functions that respond to various http requests

### src/config

Configuration code like connections, constants..etc

### src/models

Database schemas

### src/utils

Collection of utility functions

### src/server.ts

Entry point to your express app

## .eslintignore

Config settings for paths to exclude from linting

## .eslintrc

Config settings for ESLint code style checking

## .gitignore

paths to exclude from committing in git repo

## package.json

npm dependencies and build scripts

## tsconfig.json

Config settings for compiling server code written in TypeScript

## dependencies.ts

All external npm package dependencies
