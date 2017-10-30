# Iconographer

> Icon queuing, fetching and caching library

[![Build Status](https://travis-ci.org/buttercup/iconographer.svg?branch=master)](https://travis-ci.org/buttercup/iconographer)

## About

This library provides icon fetching functionality originally intended for use with the [**Buttercup** suite of products](https://github.com/buttercup). It allows the fetching of icons (primarily _favicons_) from URLs stored within user archives.

## Installation

Install as a dependency:

```shell
npm install @buttercup/iconographer --save
```

## Usage

There's 2 ways to use this library to fetch icons: The simplistic method, which is suitable for grabbing a couple of icons manually, and the managed method, which requires interfacing with the `Iconographer` class and its events:

### Simple icon fetching

You can grab icons from a URL by running the following:

```javascript
const { getIconForURL } = require("@buttercup/iconographer");

getIconForURL("https://buttercup.pw").then(iconData => {
    // iconData is either a buffer or null
});
```

Icons fetched using `getIconForURL` are cached using a private `Iconographer` instance and an in-memory data store, so be careful not to over-use it.

It is also possible, when using Iconographer in a **controlled** environment (where no other imports of Iconographer exist), to set the `Iconographer` instance within the library. This would be useful when specifying your own storage platform. Checkout the [`hybrid.js`](https://github.com/buttercup/iconographer/blob/master/example/hybrid.js) example for how to use this method.

### Managed (batch) icon fetching

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
