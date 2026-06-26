# origenganadero.com — your website package

Last updated June 2026.

## What's here
This folder is your whole website. `index.html` is the English home page and
`es/index.html` is the Spanish one (a full translation, same sections). Your
photos and logo live under `assets/images/`, and your colors and fonts live in one
file, `assets/css/tokens.css`.

## Replace the photos
Drop your originals into `_source/photos-original/` (and any logo into
`_source/logos-original/`). Any format works, we convert them. The web-ready
versions go under `assets/images/` in the right folder:

| Drop it as | Where it appears | Goes to | Recommended size |
|---|---|---|---|
| best wide cattle/landscape shot | Top of the page (hero) | `assets/images/hero/` | min 1600 × 1000px |
| founder portraits | "Who we are" | `assets/images/team/` | square, min 700 × 700px |
| field photos | Gallery + sections | `assets/images/gallery/` | min 1000 × 800px |
| your logo | Header / footer | `assets/images/logos/` | vector (SVG) if possible |

## Change your colors
All colors and fonts are in `assets/css/tokens.css`. Editing that one file
re-skins the whole site (English and Spanish stay in sync).

## Things to finish before launch
- The "Connect with us" button currently points to a placeholder. Replace
  `https://forms.gle/REPLACE-WITH-OG-FORM` (in `index.html` and `es/index.html`)
  with your real Google Form link.
- Confirm the contact email `hola@origenganadero.com` (or give us the one to use).
- Add a Privacy Policy and Terms page, then point the footer links at them.
- Add your social links once the accounts are registered (we will add them to the
  footer and to the site's structured data).

## Request a change
Message Nelson with what you'd like changed. Small text or photo changes are
quick. The site will be live at https://origenganadero.com.
