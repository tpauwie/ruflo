# Character First — Sessie 25/06/2026

## Cultuur Kort — Coach Guide Herontwerp (pagina 1–3)

### Wijzigingen in `gen_cultuur_kort.cjs`

**Pagina 1 — volledig herontworpen:**
- Header rechts: "Cultuur programma" (oranje, Arial Black) + "Coachgids · Sessie X van 2" (subtitel)
- Intro: ~10 zinnen over het programma met vetgedrukte kernwoorden
- Doelstellingen sessie: oranje bordered blok met ✓ checkmarks
- Oefeningen overzicht: naam + richttijd per oefening
- 5 concrete coachtips (genummerd, groen blok)
- 3 aandachtspunten (rood blok)
- Wetenschappelijke basis: demoted naar footnote onderaan pagina
- Witruimte: van `justify-content: space-between` naar `justify-content: flex-start; gap: 14px`

**Pagina's 2 & 3 — header aangepast:**
- Header rechts toont nu ook "Cultuur programma" / "Culture program" + sessienummer
- Consistent met pagina 1

**Betrokken bestanden:**
- `docs/character-first/scripts/gen_cultuur_kort.cjs`
- Uitvoer: `werkbladen-pdf/cultuur-kort/`, `cultuur-kort-en/`, `cultuur-kort-coach/`, `cultuur-kort-coach-en/`

### PDFs geleverd (CF_Cultuur_Programma_Werkbladen.zip)

| Map | Inhoud |
|-----|--------|
| `1_Verkorte-Reeks/Speler-NL/` | CF_Cultuur_Kort_Speler_S1_NL.pdf, S2 |
| `1_Verkorte-Reeks/Speler-EN/` | CF_Cultuur_Kort_Speler_S1_EN.pdf, S2 |
| `1_Verkorte-Reeks/Coach-NL/` | CF_Cultuur_Kort_Coach_NL.pdf |
| `1_Verkorte-Reeks/Coach-EN/` | CF_Cultuur_Kort_Coach_EN.pdf |
| `2_Volledig-Programma/Speler-NL/` | CF_Cultuur_Speler_S1–S5_NL.pdf (5 bestanden) |
| `2_Volledig-Programma/Speler-EN/` | CF_Cultuur_Speler_S1–S5_EN.pdf (5 bestanden) |
| `2_Volledig-Programma/Coach-NL/` | CF_Cultuur_Coach_S1–S5_NL.pdf (5 bestanden) |
| `2_Volledig-Programma/Coach-EN/` | CF_Cultuur_Coach_S1–S5_EN.pdf (5 bestanden) |
| `Uitleg/` | CF_Company_Document_NL.pdf, EN.pdf, CF_Cultuur_Handleiding_Coach.pdf |

---

# Character First — Sessie 13/06/2026

## Status GitHub PRs
- **PR #1** (homepage redesign) → ✅ MERGED
- **PR #2** (mentorship pagina + social-content update) → ✅ MERGED
- **Geen open PRs** — alles is live op characterfirst.be

## Wat er gedaan is in deze sessie

### Website
- Nieuwe pagina: `docs/character-first/mentorship.html`
  - Slogan: "Word de speler én de mens die je wil zijn."
  - Hero, herkenning (3 cards), 4 bouwstenen, 3 stappen, CTA mailto
- `social-content.html` geüpdatet:
  - Nieuwe brandboard stijl (--ignite, --ink, --canvas, Archivo+Inter)
  - Pre-launch sectie toegevoegd: Week -2 en Week -1 (6 posts)
  - Strategie-notities per post
  - NL + EN captions per post

### Social visuals (`social-visuals.html`)
- Ski-foto post 35 → vervangen door jeugdvoetbal foto
- "59 oefeningen" claim verwijderd → "Praktische oefeningen"
- 4 extra teaser posts toegevoegd (L4–L7):
  - L4: Voor coaches ("Jij bepaalt de cultuur")
  - L5: Voor spelers ("Sterker worden begint hier")
  - L6: Wetenschap (3 pijlers: sportpsychologie, PYD, pedagogiek)
  - L7: Countdown ("Deze week gaat Character First live") — EXTRA, geen caption

### Downloads geleverd
| Bestand | Inhoud |
|---------|--------|
| `CharacterFirst_SocialMedia.zip` | 42 posts NL+EN captions per week, planning overzicht |
| `CF_Posts.zip` | 42 NL afbeeldingen 1080×1080 (post-01.png t/m post-42.png) |
| `CF_Posts_EN.zip` | 42 EN afbeeldingen 1080×1080 (post-EN-01.png t/m post-EN-42.png) |
| `CF_Compleet.zip` | Afbeeldingen + captions samen |
| `CharacterFirst_Sociaal_Compleet.zip` | social-content.html + social-visuals.html |
| `CF_Instagram.zip` | Profielfoto 1080×1080 + 8 highlight covers 1080×1920 |

### Nummering posts
- post-01 t/m post-06 = pre-launch teasers (uit social-content.html)
- post-07 t/m post-42 = maand 1-3 reguliere posts
- post-EN-XX = Engelse versie van zelfde post
- Captions matchen: POST 01 in tekst = post-01.png afbeelding

### Instagram setup
- Profielfoto: CF logo (oranje driehoek op donker navy)
- 8 highlight covers: Methode, Oefeningen, Coaches, Wetenschap, Over ons, Contact, Spelers, Research
- Bio: "Karakterontwikkeling voor jongeren in sport 🔶 Evidence-based · Voor coaches & spelers 14+ 🇧🇪 België · characterfirst.be"
- Gebruikersnaam: character.first | Naam: Character First (niet Tom)

### Email
- ImprovMX actief: info@characterfirst.be forward naar pauwaert.tom@gmail.com
- Verzenden als info@: via Gmail "Send as" + Gmail SMTP (smtp.gmail.com:587) + App-wachtwoord

## Brandboard kleuren
- `--ignite: #F05A28` (oranje)
- `--ink: #1C2433` (donker navy)
- `--canvas: #FAF7F2` (warm wit)
- `--mist: #F0ECE4`
- `--stone: #6E6A63`
- `--line: #E4DFD6`
- `--growth: #1E8A5B`
- `--focus: #2F6FB0`

## Scripts (in /tmp, tijdelijk)
- `/tmp/export_posts.js` — NL screenshots per post
- `/tmp/export_posts_en.js` — EN screenshots per post
- `/tmp/export_instagram.js` — Instagram assets
- `/tmp/extract_posts.py` — Captions extractor

## Volgende stappen (niet gedaan)
- Posts inplannen via Later/Metricool (CSV import mogelijk)
- Mentorship pagina toevoegen aan navigatie (indien gewenst)
- Highlight covers vullen met echte Story content
