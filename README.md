# Flippinout

An animated split-flap display for the browser, tuned for fullscreen use on TVs, dashboards, kiosks, and GitHub Pages.

This repo is based on [mathmati/flippinout](https://github.com/mathmati/flippinout), which itself built on [magnum6actual/flipoff](https://github.com/magnum6actual/flipoff). This version keeps that lineage visible while adding a cleaner presentation, better interaction behavior, and a more authentic flap-sequence feel.

## Highlights

- Four monochrome display themes
- Fullscreen-friendly layout
- Rotating message board
- Live clock mode with date
- Keyboard shortcuts and mobile controls
- Embedded transition audio with mute toggle
- Ordered split-flap character cycling instead of random scramble

## Controls

| Key | Action |
| --- | --- |
| `Enter` | Next message |
| `←` | Previous message |
| `C` | Toggle clock mode |
| `T` | Cycle theme |
| `F` | Toggle fullscreen |
| `M` | Mute or unmute |
| `N` | Show shortcuts |

## Running It

Because the app is fully static, you can:

1. Open [`index.html`](/Users/jeffeberhard/Documents/github/flippinout/index.html) directly in a browser.
2. Or publish the repo with GitHub Pages and use it as a hosted display page.

If you want to customize the content:

- Edit the rotating messages in [`js/constants.js`](/Users/jeffeberhard/Documents/github/flippinout/js/constants.js)
- Adjust timing values in [`js/constants.js`](/Users/jeffeberhard/Documents/github/flippinout/js/constants.js)
- Tweak themes in [`js/constants.js`](/Users/jeffeberhard/Documents/github/flippinout/js/constants.js)

## Recent Changes

Recent updates in this fork include:

- Fixed clock mode so it can keep updating instead of getting blocked by long transitions
- Fixed next/previous navigation so inputs are not dropped during an active flip
- Prevented `T` and `C` hotkeys from firing while typing in the email field
- Changed tile animation from random scramble behavior to an ordered split-flap wheel
- Expanded the character wheel to cover letters, digits, and common punctuation in sequence

## Character Wheel

The board now advances through a fixed ordered character set to better match the feel of a real flap mechanism:

` ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=,./?!':;`

Messages are still normalized to uppercase in the current UI.

## Attribution

Credit where it is due:

- Original inspiration and upstream fork base: [mathmati/flippinout](https://github.com/mathmati/flippinout)
- Earlier upstream project: [magnum6actual/flipoff](https://github.com/magnum6actual/flipoff)

This repository is a derivative presentation and behavior update, not a claim of authorship over the original concept or prior implementation.

## GitHub Pages Notes

To publish this as your own GitHub Pages site:

1. Push this repository to your GitHub account.
2. In GitHub, open `Settings` -> `Pages`.
3. Set the source to the branch you want to publish from.
4. Use the repository root as the published folder.

Since the app is static, no build step is required.

## License

Please follow the license terms from the upstream project(s). If you plan to redistribute publicly, it is worth confirming the exact upstream license text is present in this repo as well.
