### Browser UI

This folder provides an in-browser tool for assembling a compressed HTML page.
It uses the same on-chain libraries as the command line utilities but lets you
experiment without running `make`.

#### Usage

1. Open `index.html` in your browser.
2. Select the libraries you want to include.
3. Paste or write your JavaScript/HTML code.
4. Click **Compile** to generate a ready-to-inscribe page.

The generated page is based on `template.html`. For offline testing you can set
`isTesting` to `true` in that file, which prepends `https://ordinals.com` to
fetch calls.

