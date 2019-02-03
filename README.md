# Iconographer
> Static Icon Provider

[![npm version](https://badge.fury.io/js/%40buttercup%2Ficonographer.svg)](https://www.npmjs.com/package/@buttercup/iconographer) [![Build Status](https://travis-ci.org/buttercup/iconographer.svg?branch=master)](https://travis-ci.org/buttercup/iconographer)

## About

Iconographer is a small, static icon provider utility that returns an icon file for a specific domain. It will always return an icon, using a default image if the domain is not matched. No requests are made while using the library, so it's fine to use offline and in secure scenarios.

## Usage

Install the libary by running `npm install @buttercup/iconographer`.

You can fetch the absolute URL for an icon like so:

```javascript
const { getIconFilename } = require("@buttercup/iconographer");

const filename = getIconFilename("amazon.com");
```

The returned file will always be a PNG. You can get greyscale icons by using the option: `getIconFilename("amazon.com", { greyscale: true })`.

Check out the [API documentation](API.md) for more information on the other available methods.

## Development

You can build the full set of icons by running `npm run build`. This will delete all icon files and request them again, one by one. They're committed to the repository.

You can build only the missing icons by running `npm run build:missing`.

**Make sure that when contributing**, don't commit any updated icons. You're welcome to add to the list in `prepare/domains.json` but don't commit the built files.
