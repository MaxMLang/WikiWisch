# WikiWisch

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Doomscrolling, but you actually learn something.

**👉 [Try it live](https://wikiwisch.vercel.app/)**

![WikiWisch Demo](assets/demo.png)

## The idea

I've always been the person who opens one Wikipedia article and somehow ends up three hours later reading about the mating habits of sea slugs. Classic rabbit hole stuff. At some point I thought, why not just have an app that throws random interesting content at me? Like Social Media, but instead of posts, images, and videos it's "knowledge".

So I built WikiWisch. "Wisch" is German for swipe/wipe, felt fitting.

## What's in there

The app pulls from five different sources:

- **Wikipedia** — Random articles filtered by topic (history, science, tech, etc.)
- **arXiv** — Latest research papers. Yes, actual academic papers. Pick your field.
- **Art Institute of Chicago** — Public domain artwork. Paintings, sculptures, the good stuff.
- **NASA APOD** — Astronomy Picture of the Day. Space photos with explanations.
- **On This Day** — What happened on today's date throughout history.

You can reorder the tabs however you want. Everything's saved in your browser — bookmarks, preferences, tab order. No accounts, no backend, no cookies tracking you around the internet.

## Running it yourself

```bash
git clone https://github.com/MaxMLang/wikiwisch.git
cd wikiwisch
npm install
npm run dev
```

That's it. Opens on `localhost:5173`.

## Credits & Data Sources

This wouldn't exist without these APIs:

- [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) — Content under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)
- [arXiv API](https://arxiv.org/help/api) — Papers subject to individual author licenses
- [Art Institute of Chicago API](https://api.artic.edu/docs/) — Public domain images
- [NASA APOD API](https://api.nasa.gov/) — Generally public domain
- [Wikimedia Feed API](https://api.wikimedia.org/wiki/Feed_API/Reference/On_this_day) — On This Day data

## Tech

React 18 + Vite for the build, Tailwind for styling, TanStack Query for data fetching. Pretty standard stack, nothing fancy. Dark mode works, responsive on mobile.

---

Built by [Max](https://github.com/MaxMLang) because I wanted something like this to exist.
