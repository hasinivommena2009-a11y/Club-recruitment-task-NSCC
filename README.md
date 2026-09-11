# Vertex Club — Recruitment Website

A responsive, multi-page recruitment site for a college club, built with
plain HTML, CSS, and JavaScript (no frameworks, no build step).

**Live pages:**
- `index.html` — Home page (hero, about, why join us, activities, CTA)
- `signup.html` — Recruitment signup form with validation
- `dashboard.html` — Recruitment team dashboard (view + delete applicants)

## Features

- **Form validation** — username, email format, and password strength are
  validated with JavaScript, with clear inline error messages and no
  server needed.
- **localStorage persistence** — every successful signup is saved to the
  browser's `localStorage` as a JSON array, so applicants accumulate
  across visits without a backend.
- **Live dashboard** — reads directly from `localStorage` and renders an
  auto-numbered, responsive table of applicants.
- **Delete with confirmation** — each row has a Delete button that asks
  for confirmation, removes just that applicant, and re-renders instantly.
- **Responsive, card-based UI** — built with CSS variables for easy
  re-theming, and a table that collapses into stacked cards on mobile.

## Project structure

```
club-recruitment/
│
├── index.html      # Home page
├── signup.html      # Signup / recruitment form
├── dashboard.html    # Applicant dashboard
├── style.css        # All styling (design tokens live at the top)
├── script.js        # Form validation + localStorage + dashboard logic
└── README.md
```

## Running it locally

No build tools or dependencies required — it's static HTML/CSS/JS.

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/club-recruitment.git
   cd club-recruitment
   ```
2. Open `index.html` directly in a browser, **or** serve it locally so
   relative paths behave exactly like a real deployment:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

## Notes for reviewers / graders

- This is a front-end learning project. Passwords are stored in
  `localStorage` in plain text purely to demonstrate the required
  `localStorage` / `JSON.stringify()` / `JSON.parse()` workflow. **A real
  application must never store plain-text passwords** — it should hash
  them server-side (e.g. with bcrypt) and never keep credentials in the
  browser at all.
- `localStorage` is scoped to your browser only. Data entered on the
  signup form will only appear on the dashboard when opened in the
  **same browser on the same device** (not shared across devices).

## Customizing the theme

All colors, fonts, and radii are defined as CSS variables at the top of
`style.css`:

```css
:root {
  --primary-color: #16213e;
  --accent-color: #ffb454;
  --background-color: #f7f7f4;
  --text-color: #1c1f2a;
}
```

Change these to re-theme the whole site without touching layout code.

## License

Free to use and adapt for your own club or student project.
