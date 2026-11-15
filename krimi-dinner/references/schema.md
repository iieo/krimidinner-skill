# Datenformat `case.json`

Ein Spiel liegt vollständig in `source/case.json`. Alle PDFs werden daraus gebaut, alle Prüfungen
laufen darauf. Die Schlüssel sind englisch, die Texte deutscher Fließtext, Absätze getrennt durch
`\n\n`. Rollentexte sprechen die Spielerin oder den Spieler mit „du“ an.

```jsonc
{
  "title": "Tod im Kurhaus Bad Lichtenau",
  "subtitle": "Ein Krimidinner für 8 Personen",
  "players": 8,                    // Anzahl der verteilten Rollen
  "round_count": 4,                // Anzahl der Hinweisrunden (ohne Vorstellung und Auflösung)
  "tone": "schwarzhumorig",
  "era": "1927",
  "setting": "Kurhaus in einem Schwarzwälder Badeort",
  "duration": "3 bis 4 Stunden",
  "min_age": 16,
  "dice": { },                     // unverändert die Ausgabe von roll.mjs, zur Nachvollziehbarkeit

  "what_happened": "Text für alle, steht in Anleitung und Einladung.",
  "intro": {
    "speaker": "r1",               // Rollen-id, die den Einführungstext vorliest
    "text": "Liebe Gäste, ..."
  },

  "victim": { "name": "...", "age": 71, "description": "öffentliche Beschreibung" },
  "investigator": { "name": "...", "title": "Kommissarin", "description": "..." },

  "roles": [
    {
      "id": "r1",
      "name": "Henriette Vogelsang",
      "age": 45,
      "occupation": "Kurärztin",
      "tagline": "Ein Satz für die Rollenübersicht, den alle kennen dürfen.",
      "profile": "Vorgeschichte in der zweiten Person, 250 bis 450 Wörter.",
      "secret": "Was die Figur verbergen will (jede Figur hat eins).",
      "motive": "Warum sie das Opfer tot sehen könnte.",
      "goal": "Was sie heute Abend erreichen will, außer nicht beschuldigt zu werden.",
      "costume": "Kostümtipps.",
      "how_to_play": "Wie man die Figur spielt, Lügenregel für diese Figur.",
      "is_culprit": false,
      // only for the culprit, used for the blind test, never printed:
      // "public_profile": "...", "public_dossiers": [ ... ], "public_rounds": [ { "n": 1, "text": "..." } ],
      "may_lie": false,
      "dossiers": [ { "about": "r2", "text": "Was r1 über r2 weiß." } ],
      "booklet_intro": "Einleitung des Hinweishefts für diese Rolle.",
      "rounds": [ { "n": 1, "text": "Was die Figur in Runde 1 erfährt oder sich erinnert." } ]
    }
  ],

  "investigator_rounds": [
    {
      "n": 1,
      "text": "Wird zu Rundenbeginn vorgelesen.",
      "evidence": [ { "title": "Brief aus dem Schreibtisch", "content": "Wortlaut, wird als Kasten gesetzt" } ]
    }
  ],

  "truth": {
    "culprit": "r3",
    "accomplices": [],             // Rollen-ids, die unwissentlich oder wissentlich mitgewirkt haben
    "means": "Wie getötet wurde.",
    "motive": "Das echte Motiv.",
    "time_of_death": "19:40",
    "timeline": [
      {
        "time": "19:20",
        "place": "Lesesaal",
        "who": ["r3", "r5"],
        "what": "Was geschah.",
        "seen_by": ["r5"]          // wer das bezeugen kann; in "who" und "seen_by" ist auch "victim" erlaubt
      }
    ],
    "cover_story": "Was der Täter erzählt, widerspricht keinem Beweis."
  },

  "clues": [
    {
      "id": "h1",
      "round": 2,
      "source": "investigator",    // "investigator" oder eine Rollen-id
      "text": "Kurzfassung des Hinweises.",
      "kind": "true",              // "true" (echt) | "red_herring" (falsche Fährte) | "secret" (Geheimnis)
      "points": [ { "to": "r3", "aspect": "opportunity" } ],
                                   // aspect: "motive" | "means" | "opportunity" | "clears" (entlastet)
                                   // leere Liste erlaubt: ein neutraler Fakt, der auf niemanden zeigt
      "refuted_by": []             // bei falscher Fährte: ids der Hinweise, die sie entkräften
    }
  ],

  "solution": "Vorlesetext. Leitet den Täter aus den Hinweisen her und entlastet jeden anderen konkret.",
  "props": [ { "title": "Zeitungsausschnitt", "round": 2, "content": "..." } ]
}
```

## Regeln, die `check.mjs` erzwingt

- `roles.length === players`, ids eindeutig, jede Rolle hat `rounds` 1 bis `round_count`, jeweils nicht leer.
- Genau eine Rolle hat `is_culprit: true`, und das ist `truth.culprit`. Nur der Täter hat `may_lie: true`.
- Jede Rolle hat `dossiers` über mindestens zwei andere Rollen.
- `investigator_rounds` deckt 1 bis `round_count` ab.
- Drei-Hinweise-Regel: Für den Täter gibt es je mindestens 3 echte Hinweise (`kind: "true"`) auf
  `motive`, `means` und `opportunity`, aus mindestens 2 verschiedenen Quellen.
- Der entscheidende Hinweis kommt nicht vor der letzten Runde, und vor der letzten Runde zeigt kein
  einzelner Hinweis allein eindeutig auf den Täter (Warnung, wenn in Runde 1 schon 2 Aspekte belegt sind).
- Jede falsche Fährte (`red_herring`) hat mindestens einen Hinweis in `refuted_by`, der in derselben
  oder einer späteren Runde kommt.
- Kein Unschuldiger ist am Ende auf allen drei Aspekten belastet, ohne dass ein Hinweis ihn entlastet
  (`clears`).
- Jede Rolle bekommt mindestens einen belastenden Hinweis (`motive`, `means` oder `opportunity`),
  damit alle verdächtig sind.
- Jede Rolle ist `source` mindestens eines Hinweises, damit alle etwas beizutragen haben.
- Alle referenzierten ids existieren.

Mit `--structure` prüft `check.mjs` nur die Struktur aus `structure.json`: Prosafelder (`profile`,
`costume`, `how_to_play`, `booklet_intro`, `what_happened`, `solution`, Einführungstext) dürfen
fehlen, ebenso `rounds`, `dossiers` und `investigator_rounds`.
