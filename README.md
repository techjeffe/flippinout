# Flippinout

An animated split-flap display for the browser, tuned for fullscreen use on TVs, dashboards, kiosks, and GitHub Pages.

This repo is based on [mathmati/flippinout](https://github.com/mathmati/flippinout), which itself built on [magnum6actual/flipoff](https://github.com/magnum6actual/flipoff). This version keeps that lineage visible while adding a cleaner presentation, slower mechanical transitions, and a more practical message-editing workflow.

## Highlights

- Four monochrome display themes
- Clean board-first homepage layout
- Fullscreen-friendly presentation
- Editable multi-screen message playlist
- Seven-line screen editor below the board
- Local browser persistence for custom screens
- Random quote-prefill when adding a new screen
- Live clock mode with date
- Keyboard shortcuts and mobile controls
- Embedded transition audio with mute toggle
- Ordered split-flap character cycling instead of random scramble

## Controls

| Key | Action |
| --- | --- |
| `Enter` | Next screen |
| `←` | Previous screen |
| `C` | Toggle clock mode |
| `T` | Cycle theme |
| `F` | Toggle fullscreen |
| `M` | Mute or unmute |
| `N` | Show shortcuts |

## Using It

Because the app is fully static, you can:

1. Open [`index.html`](/Users/jeffeberhard/Documents/github/flippinout/index.html) directly in a browser.
2. Or publish the repo with GitHub Pages and use it as a hosted display page.

The homepage now keeps the board front and center, with the `Screens` editor below it. The `Edit Screens` button and the header link scroll down to the editor when needed.

## Screens Editor

The built-in `Screens` editor works like this:

- Each screen is exactly 7 lines tall
- You start with one screen by default
- Use `+ Add Screen` to create more
- New screens are prefilled with a random quote from a curated set of 20 fitting options
- The board rotates through your screens automatically
- Screens are saved in `localStorage` in the current browser

## Editor Rules

The editor enforces the board constraints directly:

- A line cannot exceed the display width
- Typing past the line limit is blocked
- Extra pasted characters are trimmed to fit
- Extra lines beyond the 7 visible rows are ignored
- Press `Enter` to create the next row, up to 7 rows
- Screen content is normalized before it is shown on the board

## Transition Style

Screen changes are intentionally slow and theatrical:

- The board clears first
- It pauses briefly while blank
- Then each tile continues forward through the flap wheel into the next screen
- Each flap takes about one third of a second
- Automatic screen rotation waits at least one minute between changes

That means a full board change can take a long time on purpose, which is now part of the display style.

## Character Wheel

The board advances through a fixed ordered character set to better match the feel of a real flap mechanism:

` ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=,./?!':;`

Messages are still normalized to uppercase in the current UI.

## Recent Changes

Recent updates in this fork include:

- Fixed clock mode so it can keep updating instead of getting blocked by long transitions
- Fixed next/previous navigation so inputs are not dropped during an active flip
- Replaced the fake email CTA and placeholder marketing links with a real screen settings editor
- Moved the editor below the board so the homepage stays visually clean
- Added support for multiple saved custom screens with a `+ Add Screen` workflow
- Prefilled new screens with random quotes that already fit the board
- Enforced per-line width directly in the editor so users cannot overflow the board
- Changed screen transitions to clear the board first, then flap all the way through the sequence
- Slowed each flap to a more mechanical pace and increased the minimum interval between screen changes

## GitHub Pages Notes

To publish this as your own GitHub Pages site:

1. Push this repository to your GitHub account.
2. In GitHub, open `Settings` -> `Pages`.
3. Set the source to the branch you want to publish from.
4. Use the repository root as the published folder.

Since the app is static, no build step is required.

## Attribution

Credit where it is due:

- Original inspiration and upstream fork base: [mathmati/flippinout](https://github.com/mathmati/flippinout)
- Earlier upstream project: [magnum6actual/flipoff](https://github.com/magnum6actual/flipoff)

This repository is a derivative presentation and behavior update, not a claim of authorship over the original concept or prior implementation.

## License

Please follow the license terms from the upstream project(s). If you plan to redistribute publicly, it is worth confirming the exact upstream license text is present in this repo as well.
