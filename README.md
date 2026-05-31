# Adopty Landing Page

Statische HTML/CSS/JS Landing Page für adopty.de — gebaut mit Vite, deployt via GitHub auf Hostinger.

---

## Struktur

```
adopty-landing/
├── site/                  # Quellcode (Vite root)
│   ├── index.html         # DE Hauptseite
│   ├── en/index.html      # EN Hauptseite
│   ├── impressum/         # Impressum
│   ├── datenschutz/       # Datenschutzerklärung
│   ├── css/styles.css     # Custom CSS (Animationen, Keyframes)
│   ├── js/main.js         # Vanilla JS (Interaktivität, Vergleichstabelle, Formular)
│   └── public/            # Statische Dateien (Vite kopiert 1:1 in dist/)
│       ├── favicon.svg
│       ├── robots.txt
│       └── sitemap.xml
├── vite.config.js         # Vite Konfiguration (Multi-Page Build)
├── package.json           # Nur vite@5 als Abhängigkeit
└── .gitignore
```

---

## Lokal entwickeln

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build testen

```bash
npm run build
# → dist/
```

---

## Formspree einrichten (Warteliste)

1. [formspree.io](https://formspree.io) → neues Formular anlegen
2. Form-ID kopieren (z.B. `xbjnavep`)
3. In `site/js/main.js` Zeile 4 ersetzen:
   ```js
   const FORMSPREE = 'https://formspree.io/f/DEINE-FORM-ID';
   ```

---

## Deployment via GitHub → Hostinger

1. Repo auf GitHub pushen
2. In Hostinger hPanel → **GitHub Import**
   - Framework: **Vite** (wird automatisch erkannt)
   - Build Command: `vite build`
   - Output Directory: `dist`
3. Bei jedem Push auf `main` wird automatisch neu deployt
