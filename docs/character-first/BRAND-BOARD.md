# Character First — Brand Board (v1.0)

> **Tagline:** Win the person. Win the team.
> Evidence-based karakterontwikkeling voor sporters vanaf 14 jaar · characterfirst.be
> HTML-versies: `docs/character-first/brand-board.html` (NL) · `docs/character-first/en/brand-board.html` (EN)

---

## 01 — Merkkern

Het merk leeft op het snijpunt van twee krachten: het vuur van het individu en de rust van groei en karakter.

**Missie:** Elke jonge sporter laten groeien als mens, niet alleen als atleet. Sport is het perfecte podium om levenswaarden te ontwikkelen. Wij geven coaches en clubs een evidence-based raamwerk om mentale weerbaarheid, teamgeest, zelfkennis en leiderschap te trainen — naast techniek en tactiek.

**Visie:** Een generatie die wint op het veld én in het leven. Een toekomst waar karakter net zo systematisch getraind wordt als techniek, en waar Character First de standaard is, niet de uitzondering.

**Kernwaarden:**
- 🔥 **Moedig** — We dagen uit, vragen lef en vermijden de comfortzone niet.
- 🌱 **Groeigericht** — Vooruitgang boven perfectie. De mens van morgen telt.
- 🎯 **Onderbouwd** — Geen hype, wel wetenschap. Elke oefening heeft een bron.
- 🤝 **Samen** — De sterkste speler maakt het team sterker, niet zichzelf.

---

## 02 — Logo (Summit CF)

Het merkteken is een **bergpiek** binnen een cirkel: ambitie, doorzettingsvermogen, de top halen als mens én als sporter. De letters **CF** vormen het fundament onder de berg — karakter als basis van alles. Het witte **sneeuwpunt** geeft diepte en aankomst.

**Het verhaal:** *CF is de basis. De berg is waar je naartoe gaat.*
- **De berg** (oranje piek) = ambitie en actie, de vonk in elke atleet die de top wil halen.
- **Het fundament** (CF) = Character First. De berg rust op wie je bent, niet op wat je presteert.
- **Het sneeuwpunt** (wit) = het moment van aankomst; niet het einde, maar het bewijs van de weg.
- **De cirkel** omsluit alles: team, coach, gemeenschap — samen houd je de berg overeind.

### Vier kleurvarianten
| Variant | Cirkel | Berg | Sneeuwpunt | CF-tekst | Gebruik |
|---------|--------|------|-----------|----------|---------|
| **Primair — Navy** | `#1C2433` | `#F05A28` | `#FAF7F2` | wit | Voorkeur op donkere achtergrond |
| **Op Oranje** | `#F05A28` | `#F05A28` + **witte outline** (`stroke #fff, width 3, linejoin round`) | wit | wit | Outline nodig voor contrast op egaal oranje |
| **Op Licht** | `#FAF7F2` | `#F05A28` | `#FAF7F2` | `#1C2433` | Dagelijks gebruik op canvas/wit |
| **Mono** | wit | `#1C2433` | wit | `#1C2433` | Print, stempel, gravure — één kleur |

### Logo SVG (navy, primair)
```html
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#1C2433"/>
  <path d="M10 78 L50 14 L90 78 Z" fill="#F05A28"/>
  <path d="M50 14 L36 38 L50 31 L64 38 Z" fill="#FAF7F2"/>
  <line x1="18" y1="87" x2="82" y2="87" stroke="#F05A28" stroke-width="2" opacity=".45"/>
  <text x="50" y="96" text-anchor="middle" dominant-baseline="central"
        font-family="Archivo,Arial Black,sans-serif" font-weight="900"
        font-size="14" fill="#fff" letter-spacing="3">CF</text>
</svg>
```
> Oranje-variant: zet `fill="#F05A28"` op de berg met `stroke="#fff" stroke-width="3" stroke-linejoin="round"`.

### Wel doen
- Houd rondom het logo vrije ruimte ter grootte van de bergbreedte.
- Minimale breedte wordmark: 120 px (digitaal) / 30 mm (print).
- Op oranje achtergrond: gebruik altijd de outline-variant.
- Gebruik het beeldmerk solo enkel waar de naam al elders staat.

### Niet doen
- Het logo uitrekken, kantelen of de berg vervormen.
- Schaduwen, gloed of verlopen toevoegen.
- De CF-letters in een andere letter dan Archivo zetten.
- De oranje berg op rode/drukke achtergrond zonder outline plaatsen.

---

## 03 — Kleur

| Rol | Naam | Hex | RGB | Betekenis |
|-----|------|-----|-----|-----------|
| Primair | **Ignite Orange** | `#F05A28` | 240,90,40 | De persoon: lef, energie, actie. Accent, geen vlak. |
| Fundament | **Ink Navy** | `#1C2433` | 28,36,51 | Karakter & discipline. Vertrouwen, warmer dan zwart. |
| Secundair | **Growth Green** | `#1E8A5B` | 30,138,91 | Groeien als mens. Succes-/bevestigingsmomenten. |
| Accent | **Focus Blue** | `#2F6FB0` | 47,111,176 | Mentale kant: rust, helderheid, concentratie. |
| Basis | **Canvas** | `#FAF7F2` | 250,247,242 | Warm gebroken wit, hoofdachtergrond. |
| Basis | **Mist** | `#F0ECE4` | 240,236,228 | Zachte grijs om secties af te wisselen. |
| Tekst | **Stone** | `#6E6A63` | 110,106,99 | Gedempte grijs voor secundaire tekst. |
| Lijn | **Line** | `#E4DFD6` | 228,223,214 | Subtiele randkleur voor kaders/kaarten. |
| Hover | **Ember** | `#D44A1A` | — | Donkerder oranje voor hover/actief. |

**Ignite Orange tinten (10%→100%):** `#FDEEE8 #FBD5C6 #F9BBA3 #F7A181 #F5875E #F36D3C #F05A28 #D44A1A #B03D15 #7A2A0E`
**Ink Navy tinten:** `#E8EAEE #C6CBD4 #A3ABB9 #808B9E #5D6B83 #3E4D67 #1C2433 #141A26 #0E121B #070A0F`

### Themakleuren (7 programmathema's + fysiek)
| Thema | Hex |
|-------|-----|
| Zelfkennis | `#F05A28` |
| Druk & Stress | `#2F6FB0` |
| Mijn Rol | `#7A52C7` |
| Communicatie | `#C7842F` |
| Team Eerst | `#1E8A5B` |
| Veerkracht | `#C73F62` |
| Leiderschap | `#1C2433` |
| Fysiek | `#3A8A8A` |

---

## 04 — Typografie

Gratis via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Inter:wght@400;500;600;700&display=swap
```

- **Archivo** — Display & koppen. Stevige, licht geometrische grotesk met athletische allure. Gewichten 500 / 700 / 800 / 900. Gebruik 800–900 voor lef en beweging.
- **Inter** — Tekst & interface. Ontworpen voor schermleesbaarheid. Gewichten 400 / 500 / 600 / 700.

### Type-schaal
| Niveau | Font | Grootte |
|--------|------|---------|
| Display | Archivo 900 | 64/72px |
| H1 | Archivo 900 | 40px |
| H2 | Archivo 800 | 30px |
| H3 | Archivo 700 | 22px |
| Body | Inter 400 | 16px |
| Small | Inter 500 | 14px |
| Eyebrow | Archivo 800 caps, letter-spacing .16em | 12px |

### Wordmark
**CHARACTER**`First` — Archivo 900. "CHARACTER" in wit of navy, "First" in oranje `#F05A28`, letter-spacing `.02em`.

---

## 05 — Bouwstenen

- **Knoppen:** Primair (oranje vlak, witte tekst) · Secundair (navy) · Subtiel (ghost/outline).
- **Badges:** Nieuw (oranje 14%) · Gratis (groen 14%) · U14+ (blauw 14%) · Premium (navy vlak).
- Elk thema krijgt een vaste kleur zodat een coach in één oogopslag het type oefening herkent — in de bibliotheek, op werkbladen en op social.

---

## 06 — Tone of voice & beeld

**Hoe we klinken**
- *Wel:* direct, warm en activerend. Korte zinnen. "Jij" en "wij". Een coach die naast je staat, niet boven je.
- *Niet:* wollig, belerend of overdreven motivational-quote. Geen loze hype zonder bron.

**Hoe we eruitzien**
- *Wel:* echte jonge sporters in actie en in rust, natuurlijk licht, eerlijke emotie. Veel witruimte op canvas. Oranje als accent.
- *Niet:* stockfoto-clichés, donkere zware vlakken overal, of beelden die enkel over winnen gaan.

---

*Brand Board v1.0 — 2026 · Win the person. Win the team. · info@characterfirst.be*
