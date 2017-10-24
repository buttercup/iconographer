# Iconographer

> Icon fetching, caching and queuing library

[![Build Status](https://travis-ci.org/buttercup/iconographer.svg?branch=master)](https://travis-ci.org/buttercup/iconographer)

## About

This library provides icon fetching functionality originally intended for use with the [**Buttercup** suite of products](https://github.com/buttercup). It allows the fetching of icons (primarily _favicons_) from URLs stored within user archives.

## Installation

Install as a dependency:

```shell
npm install @buttercup/iconographer --save
```

## Usage

Instantiate the `Iconographer` class to get started:

```javascript
const { Iconographer } = require("@buttercup/iconographer");
const ic = new Iconographer();

const targetURL = "https://buttercup.pw";

ic.once("iconAdded", pageURL => {
    if (pageURL === targetURL) {
        ic.getIconForURL(targetURL).then(buttercupIconData => {
            // do something with the buffered data
        });
    }
});
ic.processIconForURL(targetURL);
```

Read the [API documentation](https://github.com/buttercup/iconographer/blob/master/API.md) for more detailed instructions on method usage.
