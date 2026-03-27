# Flippinout

An animated split-flap display for the browser, tuned for fullscreen use on TVs, dashboards, kiosks, and GitHub Pages.

This repo is based on [mathmati/flippinout](https://github.com/mathmati/flippinout), which itself built on [magnum6actual/flipoff](https://github.com/magnum6actual/flipoff). This version keeps that lineage visible while adding a cleaner presentation, better interaction behavior, and a more practical message-editing workflow.

## Highlights

- Four monochrome display themes
- Fullscreen-friendly layout
- Editable multi-screen message playlist
- Seven-line screen editor built into the page
- Local browser persistence for custom screens
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

The page now includes a built-in `Screens` editor:

- Each screen is exactly 7 lines tall
- You start with one screen by default
- Use `+ Add Screen` to create more
- The board rotates through your screens automatically
- Screens are saved in `localStorage` in the current browser

## Editor Rules

The editor now enforces the board constraints directly:

- A line cannot exceed the display width
- Extra pasted characters are trimmed to fit
- Extra lines beyond the 7 visible rows are ignored
- Screen content is normalized before it is shown on the board

## Character Wheel

The board advances through a fixed ordered character set to better match the feel of a real flap mechanism:

` ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=,./?!':;`

Messages are still normalized to uppercase in the current UI.

## Recent Changes

Recent updates in this fork include:

- Fixed clock mode so it can keep updating instead of getting blocked by long transitions
- Fixed next/previous navigation so inputs are not dropped during an active flip
- Replaced the fake email CTA and placeholder marketing links with a real screen settings editor
- Added support for multiple saved custom screens with a `+ Add Screen` workflow
- Enforced per-line width directly in the editor so users cannot overflow the board
- Changed tile animation from random scramble behavior to an ordered split-flap wheel
- Expanded the character wheel to cover letters, digits, and common punctuation in sequence

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
