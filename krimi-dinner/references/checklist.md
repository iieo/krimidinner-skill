# Prüfliste

Drei Prüfer lesen jedes Spiel, bevor PDFs gebaut werden, alle als frische Subagents ohne die
Begründungen des Autors: der Blindprüfer (Schritt 0, kennt nur `player-view.md`), der Logikprüfer
(Ebenen 1 bis 10, kennt `case.json` und das Ergebnis des Blindprüfers, falls vorhanden) und der
Qualitätsredakteur (Teil 2). `check.mjs` deckt die zählbaren Regeln ab (siehe `schema.md`). Diese
Liste prüft, was ein Skript nicht sieht.

Jeder Punkt wird mit **ja** oder **nein** beantwortet. Bei **nein** steht dabei: Stelle (Feld in
`case.json`, Rollen-id, Hinweis-id), was falsch ist, ein konkreter Vorschlag. Punkte mit (P) sind
Pflicht: Ein einziges Nein heißt Überarbeiten. Bei den übrigen sind höchstens zwei Nein erlaubt.

## Teil 1: Blindprüfer und Logikprüfer

### Schritt 0: Lösen, ohne die Lösung zu kennen

Der Blindprüfer liest nur `source/player-view.md`. Die Datei enthält, was am Tisch gesagt werden
kann: Profile, Steckbriefe und Rundentexte der Unschuldigen, vom Täter nur seine Deckgeschichte,
dazu Ermittlertexte, Beweise und Requisiten. Wahrheit, Hinweisgraph und Auflösung fehlen.

Gehe Runde für Runde vor und notiere nach jeder Runde: deine Hauptverdächtigen, wie sicher du
bist (in Prozent), welche Fakten du dafür nutzt. Nach der letzten Runde: Wer ist es, womit, warum,
wann? Begründe mit konkreten Textstellen. Ob du richtig liegst, beurteilt danach der Orchestrator.

- [ ] (P) Du hast den richtigen Täter mit einer Begründung aus Textstellen benannt, nicht geraten.
- [ ] (P) Nach Runde 1 lag deine Sicherheit für den Täter unter 50 Prozent, und mindestens zwei
      andere Figuren wirkten ähnlich verdächtig.
- [ ] (P) Vor der letzten Runde konntest du den Täter nicht sicher benennen.
- [ ] Die Lösung hat dich überrascht, aber beim Nachlesen fandest du die Hinweise.

Die Ebenen 1 bis 10 prüft der Logikprüfer mit dem ganzen `case.json`.

### Ebene 1: Zeitleiste

- [ ] (P) Keine Figur ist zur selben Zeit an zwei Orten, über alle Hefte hinweg.
- [ ] (P) Zuletzt lebend gesehen, Tod und Fund sind festgelegt und stehen in der richtigen
      Reihenfolge.
- [ ] (P) Der Todeszeitpunkt stützt sich auf mindestens zwei unabhängige Belege.
- [ ] (P) Der Weg des Täters ist in der angegebenen Zeit machbar (Wege, Wirkdauer).
- [ ] Mindestens drei Unschuldige haben eine unbezeugte Lücke, die das Tatfenster berührt.
- [ ] Jede Uhrzeit in Heften und Ermittlertexten passt zu `truth.timeline`, oder die Abweichung
      ist gewollt und wird aufgedeckt.

### Ebene 2: Alibis

- [ ] (P) Jedes Alibi, das in der Auflösung als gültig gilt, wird im Spiel von einer zweiten
      Quelle bestätigt.
- [ ] (P) Das Alibi des Täters hat eine Bruchstelle, die ein Hinweis offenlegt.
- [ ] Gegenseitige Alibis sind entweder echt oder ihr Bruch ist durch einen Hinweis erklärt.

### Ebene 3: Mittel

- [ ] (P) Woher hatte der Täter das Mittel, wie gelangte er an das Opfer, warum schrie oder wehrte
      sich das Opfer nicht, wie kehrte er unauffällig zurück? Alle vier Fragen sind beantwortet.
- [ ] (P) Das Mittel taucht im Spiel auf (Beweis, Befund oder Aussage), es wird nicht erst in der
      Auflösung eingeführt.
- [ ] Wer die Leiche fand und warum gerade diese Person, ist schlüssig.

### Ebene 4: Motiv

- [ ] (P) Das Motiv des Täters ist stark genug, dass ein Mitspieler sagen würde: „Verstehe ich, aber
      verzeihe ich nicht.“
- [ ] (P) Jede unschuldige Figur hat mindestens ein Motiv oder eine Gelegenheit, die man ihr am
      Tisch vorhalten kann.
- [ ] Keine zwei Figuren haben denselben Motivtyp gegenüber dem Opfer.

### Ebene 5: Hinweiskette

- [ ] (P) Für Motiv, Mittel und Gelegenheit des Täters gibt es je mindestens drei Hinweise aus
      verschiedenen Quellen.
- [ ] (P) Jeder Hinweis hat eine glaubwürdige Quelle: Die Figur konnte das wirklich sehen, hören oder
      finden.
- [ ] (P) Jede falsche Fährte hat eine unschuldige Erklärung und wird durch einen konkreten Hinweis
      widerlegt, nicht durch eine Einschätzung.
- [ ] Kein einzelner Hinweis überführt den Täter allein.
- [ ] Hinweise wiederholen sich nicht in Art und Inhalt (nicht dreimal Fingerabdrücke).
- [ ] Falsche Fährten machen höchstens ein Viertel der Hinweise aus.
- [ ] Jede Runde des Ermittlers enthält mindestens ein konkretes Beweisstück mit Wortlaut oder
      genauer Beschreibung, auch Runde 1.

### Ebene 6: Widerspruchsfreiheit zwischen den Heften

- [ ] (P) Dieselbe Tatsache (Uhrzeit, Ort, Gegenstand, Wortlaut eines Briefs) ist in allen Heften,
      im Ermittlertext und in der Auflösung gleich.
- [ ] (P) Namen, Titel, Orte und Gegenstände sind überall gleich geschrieben. Keine Reste eines
      früheren Entwurfs.
- [ ] (P) Die Auflösung zitiert nur Hinweise, die im Spiel tatsächlich vorkommen.
- [ ] (P) Die Deckgeschichte des Täters widerspricht keinem Beweisstück, das ihm vorgelegt wird.
- [ ] Steckbriefe über eine Figur passen zu ihrem Profil, oder der Irrtum ist gewollt und klärt
      sich.

### Ebene 7: Lösbarkeit ohne Auflösung

- [ ] (P) Aus den Hinweisen lässt sich eine Herleitung bauen: Tatfenster, Kreis der Möglichen,
      Mittel, Bruch des Alibis, Motiv.
- [ ] (P) Die Gegenprobe gelingt: Für jede andere Figur als Täter bleibt mindestens ein Hinweis
      unerklärt.
- [ ] (P) Jeder Unschuldige wird in der Auflösung durch einen konkreten Hinweis entlastet, nicht
      durch „wohl kein Motiv“ oder „eher unwahrscheinlich“.
- [ ] Eine Wendung (falls vorhanden) beruht auf Hinweisen, die vorher im Spiel standen.

### Ebene 8: Täter nicht zu offensichtlich

- [ ] (P) Das öffentliche Profil (`tagline`, Steckbriefe anderer) des Täters wirkt nicht verdächtiger
      als das der anderen.
- [ ] Der Täter ist nicht die einzige Figur ohne auffälliges Geheimnis und nicht die einzige ohne
      Alibi.
- [ ] Das Heft des Täters verrät ihn nicht, wenn ein Nachbar einen Blick darauf wirft (keine
      Überschrift „Du bist der Mörder“ in Rundentexten, das steht nur in Profil und Spielweise).

### Ebene 9: Spielbarkeit

- [ ] (P) Jede Rolle hat in jeder Runde etwas Eigenes: einen Hinweis, den sie einbringt, eine Frage
      an eine bestimmte Figur, oder etwas, das sie verteidigen muss.
- [ ] (P) Jede Rolle ist mit mindestens zwei anderen Rollen verstrickt (Geheimnis, Konflikt,
      gemeinsame Vergangenheit), nicht nur mit dem Opfer.
- [ ] (P) Jedes Geheimnis wird im Laufe des Spiels durch ein fremdes Heft oder den Ermittler
      angestoßen.
- [ ] Die Hefte sind ungefähr gleich lang (Abweichung höchstens ein Fünftel).
- [ ] Jede Figur hat ein Ziel für den Abend, das sich mit dem Ziel einer anderen kreuzt.
- [ ] Der Täter hat eine Deckgeschichte und vorbereitete Antworten auf mindestens fünf Fragen.
- [ ] Die Auflösung lässt sich in höchstens zehn Minuten vorlesen.

### Ebene 10: Lügenregel

- [ ] (P) Nur der Täter hat `may_lie: true`, und jedes Heft nennt die Regel.
- [ ] (P) Kein Unschuldiger muss lügen, um sein Geheimnis zu schützen. Schweigen und Ausweichen
      reichen, bis jemand direkt fragt.
- [ ] Unwissende Helfer haben Texte, die ehrlich gespielt werden können, und ihre
      Erinnerungslücken sind als solche markiert.

## Teil 2: Qualitätsredakteur

Lies das ganze Spiel wie eine Person, die es kaufen soll. Prüfe nicht die Logik, sondern ob der
Abend gut wird.

### Aufhänger

- [ ] (P) Es gibt ein konkretes, starkes Bild (Gegenstand, Ort, Moment), das man in einem Satz
      weitererzählt.
- [ ] Das Bild taucht in Einführung, mehreren Heften und Auflösung auf.
- [ ] `what_happened` macht in drei Sätzen Lust, und man weiß danach, worum es geht.

### Originalität

- [ ] (P) Das Spiel benutzt die Würfelwerte und mindestens ein Zufallswort als zentrales Element
      (siehe `creativity.md`), nicht nur als Deko.
- [ ] (P) Höchstens zwei Punkte aus der Klischeeliste unten kommen vor, und jeder hat einen eigenen
      Dreh.
- [ ] Die Wendung deutet einen frühen Hinweis um und ist nicht bloß ein neuer Fakt.
- [ ] Schauplatz und Epoche prägen das Mittel, das Motiv oder einen Hinweis. Die Geschichte ließe
      sich nicht ohne Verlust woandershin verlegen.

**Klischeeliste.** Reicher Patriarch und Testament als einziger Anlass. Gift im Rotwein. Gewitter
und Stromausfall. Der Butler. Das von allen gehasste Opfer. Das Tagebuch des Opfers mit der
Lösung. Geheime Affäre als Motiv mehrerer Figuren. Zyankali mit Bittermandelgeruch. Der Arzt mit
Zugang zum Gift als offensichtlichster Verdächtiger. Der verschlossene Raum mit Schlüssel innen.
Die Wahrsagerin, die alles ahnt. Erpressung als Motiv für fast jeden.

### Figuren

- [ ] (P) Jede Figur hat einen Wunsch (was sie will) und einen Widerspruch (was nicht zu ihr
      passt): die strenge Richterin, die heimlich Groschenromane schreibt.
- [ ] Jede Figur ist in einem Satz unterscheidbar, auch für Leute, die sich nicht kennen.
- [ ] Mindestens eine Figur ist sympathisch und trotzdem verdächtig, mindestens eine unsympathisch
      und unschuldig.
- [ ] Jede Figur hat einen Moment im Mittelpunkt.
- [ ] Namen stammen aus der gezogenen Namensliste und passen zu Alter, Herkunft und Epoche.

### Humor und Ton

- [ ] Der Ton aus den Würfelwerten ist in allen Texten derselbe.
- [ ] Humor entsteht aus Figuren und Situationen, nicht aus Witzen im Erzähltext.
- [ ] Mindestens drei Geheimnisse sind so, dass der Tisch lacht oder stöhnt, wenn sie auffliegen.

### Sprache

- [ ] (P) Keine Gedankenstriche als Satzzeichen (—, –, „ - “ zwischen Satzteilen). Suche danach.
- [ ] (P) Rollentexte sprechen die Spielerin oder den Spieler durchgehend mit „du“ an.
- [ ] Keine Floskeln: „Schauer über den Rücken“, „die Luft war zum Schneiden dick“, „nichts ist, wie
      es scheint“, „ein dunkles Geheimnis“, „Augen funkelten“, „in diesem Moment wurde ihr klar“.
- [ ] Beschreibungen nutzen Gegenstände und Sinnesdetails statt Adjektive wie „geheimnisvoll“,
      „düster“, „elegant“.
- [ ] Keine Dreierreihen von Adjektiven oder Substantiven als Stilmittel.
- [ ] Sätze sind unterschiedlich lang. Kein Absatz klingt wie ein Klappentext.
- [ ] Beweisstücke (Briefe, Notizen) klingen nach der Person, die sie schrieb, und nach der Epoche.

## Rückmeldung

Beide Prüfer liefern:

1. Ergebnis: bestanden oder überarbeiten, mit Anzahl der Nein (Pflicht und sonstige).
2. Für jedes Nein: Punkt, Stelle, Problem, Vorschlag.
3. Der Blindprüfer zusätzlich: seine Lösungsnotizen pro Runde.
4. Der Qualitätsredakteur zusätzlich: die drei schwächsten Stellen des Spiels und die stärkste.

## Quellen

- Murder Mystery Writer (zjoe2111, MIT-0), siebenstufige Selbstprüfung in `SKILL.md`,
  `playtesting.md` (Fragen nach dem Testspiel), `common-mistakes.md`:
  https://clawhub.ai/zjoe2111/murder-mystery-writer
- Murder Mystery Creator (gongsunyanming, MIT-0), `logic-check.md` (Regeln T1, T2, M1, M2, C1 bis
  C3, G1 bis G3), `design-tips.md` T09 Gegenprobe:
  https://clawhub.ai/gongsunyanming/murder-mystery-creator
- Apartment 304 (eigener Redaktionsschritt, der Auftrag, Eingabe und Ergebnis prüft):
  https://blog.apartment304.com/whodunit-llm-murder-mysteries
- M. Siebert (Täter zu offensichtlich, Hinweise zu gleichförmig):
  https://msiebert.github.io/blog/harry-potter-murder-mystery
- The Alexandrian, „Three Clue Rule“:
  https://thealexandrian.net/wordpress/1118/roleplaying-games/three-clue-rule
