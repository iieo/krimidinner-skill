# krimidinner-skill

Ein Skill für [Claude Code](https://claude.com/claude-code), der ein komplettes Krimidinner erzeugt:
eigene Geschichte, ein Einladungs- und Rollenheft pro Person, Hinweishefte für jede Runde,
Ermittlertexte mit Beweisstücken, Auflösung und Spielanleitung. Alles als druckfertige PDFs auf Deutsch.

```
/krimi-dinner 8 Personen, 4 Runden
/krimi-dinner 6 Personen, 3 Runden, schwarzhumorig, 1920er, auto
```

## Warum nicht einfach „schreib mir ein Krimidinner“?

Weil dann jedes Mal dieselbe Geschichte kommt: Villa, reicher Onkel, Testament, Gift im Wein. Und
weil ein einzelner Prompt Hinweise erzeugt, die sich widersprechen oder den Täter in Runde 1 verraten.
Der Skill arbeitet deshalb so:

1. **Würfeln statt Wählen.** `roll.mjs` zieht Epoche, Schauplatz, Anlass, Milieu, Opfertyp,
   Tatmittel, Motive, Wendung und Ton aus großen Tabellen, dazu drei Zufallswörter, zwei zufällige
   Wikipedia-Artikel als Inspiration und einen Namenspool passend zur Epoche. Zufall kommt von
   random.org (sonst `crypto`). Was in den letzten Spielen dran war, wird gemieden.
2. **Prämisse per Verbalized Sampling.** Fünf Prämissen mit geschätzter Wahrscheinlichkeit, gewählt
   wird vom Rand der Verteilung.
3. **Wahrheit zuerst.** Tat, Zeitleiste auf die Minute, Geheimnisse und ein Hinweisgraph nach der
   Drei-Hinweise-Regel, bevor eine Zeile Prosa entsteht. `check.mjs` prüft den Graphen maschinell:
   mindestens drei Hinweise für Motiv, Mittel und Gelegenheit des Täters, jede falsche Fährte
   widerlegt, alle verdächtig, alle beschäftigt, der Täter nicht vor der letzten Runde überführt.
4. **Prüfung durch frische Subagents.** Ein Strukturprüfer vor dem Schreiben. Danach ein
   Blindprüfer, der nur sieht, was am Tisch gesagt wird, und den Fall lösen muss, ein Logikprüfer
   und ein Qualitätsredakteur.
5. **Rollen parallel.** Jede Rolle schreibt ein eigener Subagent gegen dieselbe Faktenbasis.
6. **PDFs mit Typst.** Hinweishefte mit einer Runde pro Seite, damit niemand vorblättert.

## Installation

Voraussetzungen: Claude Code, Node.js 18+, [Typst](https://typst.app) (`brew install typst`).

```bash
git clone https://github.com/iieo/krimidinner-skill.git
cd krimidinner-skill
./install.sh --output-dir "$HOME/Documents/Krimidinner"
```

`install.sh` verlinkt `krimi-dinner/` nach `~/.claude/skills/krimi-dinner` und legt den
Ausgabeordner in `~/.krimi-dinner/config.json` fest.

## Was herauskommt

```
<Titel>/
  01 Spielanleitung.pdf           Ablauf, Regeln, Rollenübersicht, Namenskarten, Einführungstext
  02 Rolle - <Name>.pdf           pro Person, vorher als Einladung verschicken
  03 Hinweise - <Name>.pdf        pro Person, erst am Abend austeilen
  03 Hinweise - <Ermittler>.pdf   wird zu jeder Runde vorgelesen
  04 Auflösung.pdf                zum Schluss vorlesen
  05 Requisiten.pdf               falls es Briefe, Zeitungsausschnitte o. Ä. gibt
  source/                         Würfel, Prämissen, case.json, Prüfberichte (enthält die Lösung!)
```

## Aufbau

```
krimi-dinner/
  SKILL.md                Ablauf für Claude
  scripts/roll.mjs        Würfeln, Inspiration, Namen, Verlauf
  scripts/check.mjs       prüft case.json bzw. structure.json (--structure)
  scripts/merge.mjs       führt Struktur, Rahmen und Rollen zusammen, exportiert die Spielersicht
  scripts/build.mjs       baut die PDFs
  templates/*.typ         Typst-Vorlagen
  data/*.json             Würfeltabellen und Namenslisten
  references/             Handwerk, Kreativität, Tricks, Prüfliste, Briefe für Subagents, Schema
  example/case.json       kleines Beispiel mit 4 Rollen
```

Einzelne Skripte lassen sich auch ohne Claude nutzen, etwa
`node krimi-dinner/scripts/roll.mjs --players 8` für einen Satz Würfelwerte.

## Quellen und Dank

Die Referenzen fassen zusammen und adaptieren Ideen aus:

- murder-mystery-creator (gongsunyanming) und murder-mystery-writer (zjoe2111) auf ClawHub, beide MIT-0
- Justin Alexander, „Three Clue Rule“ (The Alexandrian)
- Freeform Games, „Writing a murder“ und „Golden rules“
- Apartment 304, „Whodunit: LLM murder mysteries“
- Zhang u. a., „Verbalized Sampling“ (arXiv 2510.01171)
- hamogu/DinnerMurderGames (Aufbau der Hefte)

Lizenz: MIT.
