# Character First — PDF Generator Scripts

Genereer alle werkbladen opnieuw met onderstaande commando's.
Email: info@characterfirst.be

## Vereisten
- Node.js
- Playwright: `/opt/node22/lib/node_modules/playwright`

## Scripts

| Script | Output | Beschrijving |
|--------|--------|--------------|
| `gen_speler.cjs` | `werkbladen-pdf/speler/` + `speler-en/` | Spelerswerkbladen NL+EN, 2 pagina's, met mentale weerbaarheid + quote |
| `gen_coach.cjs` | `werkbladen-pdf/coach/` + `coach-en/` | Coach/moderator werkbladen NL+EN |
| `gen_volledig.cjs` | `werkbladen-pdf/volledig/` + `volledig-en/` | Volledige werkbladen (speler + coach) NL+EN |

## Alles opnieuw genereren

```bash
cd /home/user/ruflo

node docs/character-first/scripts/gen_speler.cjs
node docs/character-first/scripts/gen_coach.cjs
node docs/character-first/scripts/gen_volledig.cjs
```

## ZIP bouwen

```bash
BASE=docs/character-first
TMP=/tmp/CF_Pakket
rm -rf $TMP
mkdir -p "$TMP/Moderator/Werkbladen_NL" "$TMP/Moderator/Werkbladen_EN"
mkdir -p "$TMP/Moderator/Werkbladen_Volledig_NL" "$TMP/Moderator/Werkbladen_Volledig_EN"
mkdir -p "$TMP/Moderator/Presentaties"
mkdir -p "$TMP/Spelers/Werkbladen_NL" "$TMP/Spelers/Werkbladen_EN"

cp $BASE/werkbladen-pdf/coach/*.pdf       "$TMP/Moderator/Werkbladen_NL/"
cp $BASE/werkbladen-pdf/coach-en/*.pdf    "$TMP/Moderator/Werkbladen_EN/"
cp $BASE/werkbladen-pdf/volledig/*.pdf    "$TMP/Moderator/Werkbladen_Volledig_NL/"
cp $BASE/werkbladen-pdf/volledig-en/*.pdf "$TMP/Moderator/Werkbladen_Volledig_EN/"
cp $BASE/werkbladen-pdf/speler/*.pdf      "$TMP/Spelers/Werkbladen_NL/"
cp $BASE/werkbladen-pdf/speler-en/*.pdf   "$TMP/Spelers/Werkbladen_EN/"

cd /tmp && zip -r CF_Compleet_Pakket.zip CF_Pakket/
cp /tmp/CF_Compleet_Pakket.zip $BASE/CF_Compleet_Pakket.zip
```

## Inhoud (64 PDFs)

- **Spelers** (16): M1–M8 NL + M1–M8 EN — 2 pagina's per les, mentale weerbaarheid, inspirerende quote
- **Coach/Moderator** (16): M1–M8 NL + M1–M8 EN
- **Volledig** (32): M1–M8 NL + M1–M8 EN (speler + coach gecombineerd, 2 pagina's)
