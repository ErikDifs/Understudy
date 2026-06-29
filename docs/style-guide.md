# Understudy Design Style Guide

Guiding aesthetic: **calm authority**. The Understudy is a trusted stand-in — reliable, professional, understated. Closer to Notion/Linear than a consumer chatbot. Minimal chrome, breathing room, one dominant action per screen.

---

## Colors

Zinc-based neutral palette. No accent color yet — pure black-on-white earns trust first. Add a single accent only when the product needs to distinguish a new concept (e.g. Realm/Match work).

| Token | Light class | Dark class | Use |
|---|---|---|---|
| Page background | `bg-white` | `dark:bg-zinc-950` | Set on `<body>` |
| Surface / card | `bg-zinc-50` | `dark:bg-zinc-900` | Cards, panels, profile card |
| Border | `border-zinc-200` | `dark:border-zinc-800` | All borders |
| Text primary | `text-zinc-900` | `dark:text-zinc-100` | Body, headings |
| Text secondary | `text-zinc-500` | `dark:text-zinc-400` | Meta, status, timestamps |
| Text muted | `text-zinc-400` | `dark:text-zinc-600` | Placeholders, empty states |
| Label | `text-zinc-700` | `dark:text-zinc-300` | Form labels |
| Destructive | `text-red-600` | `dark:text-red-400` | Errors only |
| Success | `text-emerald-600` | `dark:text-emerald-400` | Completed/done |

Dark mode is system-preference driven (`prefers-color-scheme`). No manual toggle planned until there's a user settings page.

---

## Typography

System font stack (`font-sans` default) — no custom font until launch.

| Level | Classes | Use |
|---|---|---|
| Page title | `text-2xl font-semibold tracking-tight` | One per page (`<h1>`) |
| Section heading | `text-base font-semibold` | Section `<h2>` |
| Body | `text-sm leading-relaxed` | Default content |
| Meta / label | `text-xs font-medium` | Timestamps, status tags, uppercase labels |
| Muted | `text-sm text-zinc-400` | Empty states, hints |
| Form label | `text-sm font-medium` | `<span>` inside `<label>` |

---

## Spacing & Layout

- **Content width:** `max-w-2xl mx-auto` — consistent on every page
- **Page padding:** `px-4 py-6 sm:px-6 sm:py-8`
- **Section gap:** `mt-6` between major sections
- **List gap:** `space-y-2` for lists, `space-y-3` for chat messages, `space-y-4` for form fields

---

## Components

### Primary button
```
rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white
transition-colors hover:bg-zinc-700 disabled:opacity-40
dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
```

### Secondary button
```
rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900
transition-colors hover:bg-zinc-50
dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800
```

### Back link
```
text-sm text-zinc-500 underline underline-offset-2
hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100
```

### Card
```
rounded-xl border border-zinc-200 bg-zinc-50 p-4
dark:border-zinc-800 dark:bg-zinc-900
```

### Text input / textarea
```
w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm
placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none
dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
dark:placeholder:text-zinc-600 dark:focus:border-zinc-400
```

### Chat — user bubble
```
rounded-2xl rounded-br-sm bg-zinc-900 px-4 py-2 text-sm text-white
dark:bg-zinc-100 dark:text-zinc-900
```

### Chat — assistant bubble
```
rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-2 text-sm text-zinc-900
dark:bg-zinc-800 dark:text-zinc-100
```

### Status badge (future)
```
pending:   bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400
active:    bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400
done:      bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400

shared wrapper: inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
```

---

## Interaction

- **Transitions:** `transition-colors duration-150` on buttons and interactive elements
- **Focus ring:** `focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2` for keyboard nav (add when building more complex interactive components)
- **Hover:** One step on the zinc scale (zinc-900 → zinc-700, zinc-50 → zinc-100)
- **No motion** on page transitions or content loads — keep it fast and quiet

---

## Tone

- Address the user directly: "Your Understudy will…"
- No exclamation marks
- Empty states describe what *will* happen, not what's missing
  - "No meetings yet" → "Your Understudy's reports will appear here"
- Labels are sentence-case, not title-case (exception: ALL-CAPS micro-labels with `tracking-wide`)

---

## When to add an accent color

Add a single accent when the product introduces a concept that needs to stand out from the operational chrome — likely when Realm/Match work begins. Candidate: `indigo-600` (AI-adjacent without being clichéd). Until then, black is the accent.
