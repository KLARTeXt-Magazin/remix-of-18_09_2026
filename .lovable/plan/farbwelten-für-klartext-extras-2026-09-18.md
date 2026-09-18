# Farbwelten für KLARTeXt. Extras

Die Extras bekommen die Farblogik aus der Design-Datei: warme Materialbasis bleibt, aber jede Audio-Welt trägt eine eigene tiefe Farbfläche mit hellem Gegenpart und einem winzigen Farb-Pop. Schriften bleiben vorerst unverändert.

## Farbzuordnung

| Bereich | Tiefe Fläche | Heller Gegenpart | Kleiner Pop |
| --- | --- | --- | --- |
| Ausgabe 01 – Audio | Deep Wine #550000 | Blush #FFC5D3 | Pink #E484AC |
| Nikolaus | Deep Olive #142E00 | Honeydew #EAFFDA | Chartreuse #D9CF12 |
| Heiligabend | Wine #4A0404 | Lavender #B6B6D6 | Pink-Pop #FAA3FC |
| Ein kleiner Moment für dich | Deep Violet #341C67 | Lilac #C4AEF4 | Periwinkle #9A9FDA |
| PMR / Übungsbereich | hell: Pearl #FFFFFA | Deep Green #1B2518 als Textfarbe | Mint #83BE9D |

Der ruhige PMR-Bereich bleibt bewusst hell – nicht jede Fläche konkurriert um Aufmerksamkeit.

## Was sich sichtbar ändert

- Der Audiobereich und der Begleittext darunter laufen je nach gewähltem Audio auf einer vollen, tiefen Farbfläche; Schrift und Bedienelemente wechseln auf den hellen Gegenpart.
- Beim Wischen zwischen den Audios wechselt die Farbwelt sanft (ca. 600 ms), bei reduzierter Bewegung sofort.
- Die Audiokacheln selbst bleiben warmweiß und materialartig (leicht transluzent, weiche Schatten) – bewusst als helles Objekt in der farbigen Welt, nicht eingefärbt.
- Das Band „Weiterhören · Ausgabe 01“ und der Seitenkopf bleiben warm-neutral als Übergang zwischen den Farbwelten.
- Kleine Pop-Farben nur an Punkten: aktiver Karussell-Punkt, Fortschrittsbalken, Play-Indikator, kleine Labels.
- Hero und Seitenhintergrund bleiben die warme Materialbasis (Linen/Pearl), damit die Tiefe als Kontrast wirkt.

## Barrierefreiheit

- Alle Text-auf-Farbe-Kombinationen werden auf ausreichenden Kontrast geprüft; helle Gegenparts werden nur für Text genutzt, wenn der Kontrast passt, sonst Pearl.
- Fokusrahmen bekommen auf den tiefen Flächen eine helle Variante, damit sie sichtbar bleiben.
- Aktive Zustände bleiben zusätzlich durch Text/Form erkennbar, nicht nur durch Farbe.
- 44px-Ziele, ARIA-Beschriftungen und `prefers-reduced-motion` bleiben unverändert erhalten.

## Technische Umsetzung

- `src/styles.css`: neue Tokens für Foundation (`--linen`, `--pearl`, `--sand`, `--clay`), Deep-Farben, Soft-Counterparts und Pops. Pro Audio-Welt ein Token-Set (`--band-deep`, `--band-soft`, `--band-pop`, `--band-ink`), gesetzt über die bestehenden Klassen `audio-tone-1..4` / `companion-tone-1..4` sowie `audio-band--ausgabe-1`.
- `.audio-band`, `.companion-band`, Player, Karussell-Punkte und Buttons lesen nur noch diese Band-Tokens, damit Farbwechsel rein über die Tonklasse laufen.
- `.audio-player-card` behält den Soft-Material-Glass (warmweiß, `blur(18px)`, feine helle Kante) statt Section-Farbe.
- `src/routes/index.tsx` und `src/routes/lichtblicke.tsx`: Tonklassen auf Audio- und Begleitbereich konsistent setzen, PMR-Abschnitt von `bg-sage-soft` auf die ruhige Pearl/Deep-Green-Kombination umstellen, `continue-band` auf warm-neutral.
- Bestehende Kopfdaten je Seite, Menü, Homescreen-Installation und Audiologik bleiben unverändert.
- Prüfung: mobile Ansicht (402x725) und Desktop, Farbwechsel beim Wischen, Fokus-Sichtbarkeit auf tiefen Flächen, Kontrastwerte, Build.
