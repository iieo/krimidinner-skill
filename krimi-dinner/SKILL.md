---
name: krimi-dinner
description: Erzeugt ein komplettes, spielbares Krimidinner auf Deutsch mit eigener Geschichte, Rollenheften, Hinweisrunden, Ermittlertexten und Auflösung als druckfertige PDFs. Nutzen, wenn jemand "/krimi-dinner" schreibt, ein Krimidinner, Murder-Mystery-Dinner oder Mörderspiel für einen Abend generieren will oder ein bestehendes generiertes Krimidinner überarbeiten möchte.
argument-hint: "<Spielerzahl> Personen, <Runden> Runden [Ton, Epoche, Schauplatz, Gäste, Wünsche]"
---

# Krimidinner-Generator

Ziel ist ein Abend, über den die Gäste noch Wochen reden: eine Geschichte mit einem starken Bild,
Figuren mit saftigen Geheimnissen, ein Fall, den man aus den Hinweisen wirklich lösen kann, und ein
Täter, der nicht nach Runde 1 feststeht. Qualität geht vor Tempo. Nimm dir die Zeit für alle Schritte.

`SKILL_DIR` ist der Ordner dieser Datei (meist `~/.claude/skills/krimi-dinner`). Lies vor dem Start:

- `references/craft.md`: wie ein gutes Krimidinner gebaut ist. Pflicht.
- `references/creativity.md`: wie du der immer gleichen Geschichte entkommst. Pflicht.
- `references/schema.md`: das Datenformat `case.json`.
- `references/tricks.md`: Tricks und Wendungen, bei Schritt 3.
- `references/checklist.md` und `references/briefs.md`: für die Prüfungen und die Subagents.

## 0. Parameter

Aus den Argumenten lesen. Pflicht sind **Spielerzahl** (4 bis 14) und **Anzahl der Hinweisrunden**
(2 bis 6, üblich sind 3 oder 4). Fehlt eins davon, frag mit AskUserQuestion danach, zusammen mit den
optionalen Wünschen in derselben Frage. Optional:

- Ton (z. B. schwarzhumorig, klassisch, absurd), Epoche, Schauplatz
- Gäste: Namen, Geschlecht oder Eigenheiten, damit Rollen passend zugeschnitten werden können.
  Die Rollennamen bleiben fiktiv.
- Mindestalter (Standard 16), Dinge, die tabu sind
- Spielt der Gastgeber mit? Standard ja, dann darf niemand außer den Rollen alles kennen.
- `auto`: keine Rückfragen, du entscheidest alles selbst.

Ausgabeordner: `output_dir` aus `~/.krimi-dinner/config.json`, sonst `~/Documents/Krimidinner`. Darin
ein neuer Unterordner mit dem Spieltitel (wird nach Schritt 2 festgelegt). Alle Zwischenstände
kommen nach `<spiel>/source/`.

## 1. Würfeln

```bash
node SKILL_DIR/scripts/roll.mjs --players <n> [--era ..] [--tone ..] [--setting ..] > "${TMPDIR:-/tmp}/krimi-dice.json"
```

Das Skript zieht Epoche, Schauplatz, Anlass, Milieu, Opfertyp, Tatmittel, Motivfamilien, Wendung,
Ton, drei Zufallswörter, zwei zufällige Wikipedia-Artikel als Inspiration und einen Namenspool. Es
meidet, was in den letzten Spielen schon dran war. **Diese Werte sind harte Vorgaben.** Du darfst
sie kombinieren und deuten, aber nicht durch Bequemeres ersetzen. Namen kommen nur aus dem Pool.
Passt ein Wert gar nicht zu den Wünschen des Nutzers, würfle diesen einen Wert neu (Parameter
setzen), statt ihn zu ignorieren.

## 2. Prämisse

Nach `references/creativity.md` (Verbalized Sampling): Schreib fünf deutlich verschiedene
Prämissen, jede mit geschätzter Wahrscheinlichkeit, dass ein Sprachmodell sie so vorschlagen würde.
Jede enthält Schauplatz, Anlass, Opfer, das zentrale Bild, die Wendung und warum gerade diese acht
(n) Menschen am Tisch sitzen. Verwirf alles, was nach Standardkrimi klingt. Wähle dann die beste aus
den unwahrscheinlicheren drei.

Ohne `auto`: Leg dem Nutzer die zwei oder drei stärksten Prämissen mit AskUserQuestion vor, je zwei
Sätze plus Titelvorschlag, **ohne Täter, Trick und Wendung**, denn der Nutzer spielt vielleicht
selbst mit. Mit `auto`: selbst wählen. Auch sonst im Chat nie verraten, wer es war, solange der
Nutzer nicht ausdrücklich danach fragt.

Lege den Spielordner an und speichere Würfel und Prämissen in `source/dice.json` und
`source/premises.md`.

## 3. Wahrheit und Hinweisgraph (`source/structure.json`)

Erst die Wahrheit, dann alles andere. Schreib `structure.json` nach dem Schema mit diesen Feldern:
`title, subtitle, players, round_count, tone, era, setting, duration, min_age, dice,
what_happened, victim, investigator, truth, clues` und `roles` nur mit den Grundfeldern
`id, name, age, occupation, tagline, secret, motive, goal, is_culprit, may_lie`.

Reihenfolge:

1. **Tat aus Sicht des Täters:** wer, warum, wie, wann. Das Motiv muss man nachfühlen können.
2. **Zeitleiste** vom Nachmittag bis zum Fund der Leiche, im Abstand von etwa 10 Minuten. Für jede
   Rolle: wo war sie, wer hat sie gesehen. Jede Rolle hat eine Lücke oder eine Heimlichkeit, die sie
   verdächtig macht.
3. **Geheimnisse und Verflechtungen:** Jede Rolle hat ein Geheimnis, ein Motiv und ein Ziel für den
   Abend. Jede ist mit mindestens zwei anderen verstrickt (Schulden, Affäre, Erpressung, alte
   Schuld, gemeinsamer Plan). Mindestens ein Geheimnis ist harmlos, wirkt aber schlimm.
4. **Hinweisgraph:** nach der Drei-Hinweise-Regel, verteilt über die Runden nach `craft.md`.
   Falsche Fährten nur, wenn eine spätere Runde sie widerlegt. Jede Rolle ist Quelle von Hinweisen.
5. **Deckgeschichte** des Täters, die keinem Beweis widerspricht.

Dann prüfen:

```bash
node SKILL_DIR/scripts/check.mjs <spiel>/source/structure.json --structure
```

Fehler beheben, bis es durchläuft. Danach **Strukturprüfung** durch einen frischen Subagent
(Brief in `references/briefs.md`, Abschnitt „Strukturprüfer“). Berechtigte Punkte einarbeiten.
Das ist der wichtigste Moment für die Qualität: Eine schwache Struktur rettet keine Prosa.

## 4. Texte

**Rollen parallel:** Für jede Rolle ein Subagent (`model: "opus"`), alle in einer Nachricht, Brief
„Rollenautor“ aus `references/briefs.md`. Jeder bekommt `structure.json`, seine Rollen-id und die
Pfade zu `craft.md` und `creativity.md`, und schreibt `source/roles/<id>.json` mit `profile,
costume, how_to_play, dossiers, booklet_intro, rounds`. Die Rundentexte setzen genau die
Hinweise um, deren `source` diese Rolle ist, plus Erinnerungen und Spielanweisungen für die Figur.
Beim Täter zusätzlich vorbereitete Ausreden pro Runde.

**Rahmen selbst schreiben** in `source/frame.json`: `intro`, `investigator_rounds` (mit
Beweisen im Wortlaut in `evidence`, z. B. Briefe, Notizen, Laborbefunde), `solution`, `props`.
Die Auflösung leitet den Täter Schritt für Schritt aus den Hinweisen her und entlastet jede andere Rolle mit einem
konkreten Hinweis, nicht mit „hatte wohl kein Motiv“.

Zusammenführen und prüfen:

```bash
node SKILL_DIR/scripts/merge.mjs <spiel>/source --player-view
node SKILL_DIR/scripts/check.mjs <spiel>/source/case.json
```

Rollentexte, die sich widersprechen (Uhrzeiten, Orte, wer wen gesehen hat), korrigierst du in den
Rollendateien und führst erneut zusammen.

## 5. Blindprüfung und Redaktion

Drei frische Subagents parallel, Briefe in `references/briefs.md`:

- **Blindprüfer** bekommt nur `source/player-view.md`, also keine Wahrheit und keine Auflösung. Er
  spielt den Abend Runde für Runde durch und nennt nach jeder Runde seinen Hauptverdacht mit
  Sicherheit in Prozent. Ziel: nach Runde 1 niemand über 35 %, nach der letzten Runde der richtige
  Täter mit klarer Begründung. Liegt er falsch oder ist er zu früh sicher, ist der Hinweisgraph
  schlecht, nicht die Auflösung.
- **Logikprüfer** bekommt `case.json` und prüft Teil 1 der Prüfliste: Zeitleiste, Alibis,
  Widersprüche zwischen den Heften.
- **Qualitätsredakteur** bekommt `case.json` und prüft Teil 2: Hook, Originalität, Figuren, Humor,
  Sprache, Spielbarkeit pro Rolle und Runde.

Überarbeiten, wo die Kritik trifft, dann Schritt 4 (zusammenführen, prüfen) wiederholen. Höchstens
zwei Runden Blindprüfung. Wenn es danach noch hakt, dem Nutzer offen sagen, was.

## 6. PDFs bauen und ansehen

```bash
node SKILL_DIR/scripts/build.mjs <spiel>/source/case.json <spiel>
```

Ein paar Seiten mit `pdftoppm -png -r 60 -f 1 -l 2` rendern und mit Read ansehen: Titelseite,
eine Rolle, eine Hinweisrunde. Überläufe und kaputte Umbrüche beheben.

Danach den Lauf merken, damit das nächste Spiel anders wird:

```bash
node SKILL_DIR/scripts/roll.mjs --remember <spiel>/source/case.json
```

## 7. Übergabe

Dem Nutzer kurz sagen: Titel, Prämisse in zwei Sätzen **ohne Täter**, Ordnerpfad, welche PDFs
wohin gehören (02 vorher als Einladung verschicken, 03 und 04 erst am Abend), und das Ergebnis der
Blindprüfung. Den Täter nicht nennen, denn der Gastgeber spielt vielleicht mit. Wer ihn wissen will,
findet ihn in `04 Auflösung.pdf`. Hinweis an den Gastgeber: Der Ordner `source/` enthält die ganze
Lösung und gehört nicht in die Einladungsmail.

## Regeln für alle Texte

- Rollentexte duzen die Spielenden. Konkrete Sinnesdetails statt Adjektivketten.
- Keine Gedankenstriche als Satzzeichen (— oder –), keine KI-Floskeln, keine Dreier-Aufzählungen
  als Reflex. Kurze und lange Sätze mischen.
- Namen nur aus dem Würfel-Pool. Keine echten lebenden Personen, keine echten Firmen als Täter.
- Humor entsteht aus den Figuren und ihren Widersprüchen, nicht aus Witzen im Erzähltext.
