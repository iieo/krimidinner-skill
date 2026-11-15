# Handwerk: So entsteht ein gutes Krimidinner

Diese Datei ist die Arbeitsanleitung für jedes Spiel. Sie beschreibt, was am Tisch funktioniert und
in welcher Reihenfolge du baust. Das Datenformat steht in `schema.md`, die Tricks in
`tricks.md`, die Prüfung in `checklist.md`, das Vorgehen gegen Gleichförmigkeit in
`creativity.md`.

## 1. Spielprinzipien

Ein Krimidinner ist kein Roman. Acht Leute sitzen drei Stunden am Tisch, essen und reden. Jede
Entscheidung beim Schreiben dient diesem Abend.

- **Fair.** Alles, was zur Lösung nötig ist, liegt irgendwann offen auf dem Tisch: in einem
  Hinweisheft, im Text des Ermittlers oder in einem Beweisstück. Kein entscheidendes Wissen steckt
  nur im Kopf des Täters.
- **Lösbar.** Eine aufmerksame Runde kann den Täter vor der Auflösung benennen und begründen. Die
  Begründung stützt sich auf Hinweise, nicht auf Bauchgefühl oder darauf, wer am nervösesten wirkt.
- **Alle verdächtig.** Jede Figur hat ein Motiv oder eine Gelegenheit, die man ihr vorhalten kann,
  und etwas, das sie verbergen will. Wer kein Geheimnis hat, fällt sofort als harmlos auf, und das
  verrät dann den Täter.
- **Alle beschäftigt.** Jede Rolle hat in jeder Runde etwas zu sagen, zu fragen oder zu verbergen.
  Keine Figur ist Beiwerk. Die Hefte sind ungefähr gleich lang (Abweichung höchstens ein Fünftel).
- **Lügenregel.** Nur der Täter darf lügen. Alle anderen müssen eine direkte Frage wahr beantworten,
  dürfen aber ausweichen, schweigen, solange niemand konkret fragt, und Lücken in ihrer Geschichte
  frei und harmlos ausschmücken. Wer merkt, dass er versehentlich etwas Falsches gesagt hat, stellt
  es richtig. Diese Regel steht in jedem Heft und in `how_to_play`.

## 2. Wahrheit zuerst

Schreib nie die Szene und dann die Hinweise in der Hoffnung, dass sich ein Täter ergibt. Dann zeigen
alle Hinweise auf alle, und die Lösung passt nicht. Die Reihenfolge ist fest:

1. **Kernbild und Ausgangslage.** Ein konkretes Bild, an das sich der Tisch später erinnert (siehe
   Abschnitt 10), dazu Ort, Anlass und Epoche aus den Würfelwerten.
2. **Die Tat.** Wer, womit, warum, wann, wo. Dazu der Trick aus `tricks.md`, der das
   Rätsel trägt. In einem Satz formulierbar: „X hat Y um 20:10 im Wintergarten mit Z getötet, weil …“
3. **Die Deckgeschichte des Täters.** Was er erzählt, und warum es auf den ersten Blick hält.
4. **Die Zeitleiste** (Abschnitt 3).
5. **Die Hinweiskette rückwärts.** Für jede Schlussfolgerung, die der Tisch ziehen muss, mindestens
   drei Hinweise (Abschnitt 4). Danach die Entlastung jedes Unschuldigen.
6. **Figuren und Geheimnisse.** Erst jetzt die übrigen Rollen, so verwoben, dass ihre Geheimnisse
   falsche Fährten liefern und sich gegenseitig auffliegen lassen (Abschnitt 6).
7. **Texte.** Profile, Steckbriefe, Hefte pro Runde, Ermittlertexte, Einführung.
8. **Auflösung** (Abschnitt 9), dann die Prüfung nach `checklist.md`.

Jeder Schritt bekommt die Ergebnisse der vorigen als feste Vorgabe. Wenn ein späterer Schritt an
einer früheren Entscheidung zerbricht, geh zurück und ändere die Entscheidung. Flicke nicht mit
Zufällen.

## 3. Zeitleisten-Methode

Die Zeitleiste ist das Skelett. Spieler rechnen am Tisch nach, jeder Widerspruch fällt auf.

1. **Drei Fixpunkte** auf die Minute: zuletzt lebend gesehen, Tod, Fund der Leiche.
2. **Der Weg des Täters** in Schritten mit Uhrzeit, Ort, möglichem Zeugen und hinterlassener Spur:
   Vorbereitung, Annäherung, Tat, Spuren beseitigen, Alibi herstellen, Rückkehr unter die Gäste.
   Prüfe Wege und Dauer: Schafft man die Treppe in vier Minuten? Wie lange wirkt das Mittel?
3. **Alle anderen Figuren** im Viertelstundenraster vom Eintreffen bis zum Fund. Jede Figur
   - begegnet mindestens zwei anderen zu bestimmten Zeiten (das erzeugt Zeugenaussagen),
   - hat eine Lücke, in der sie niemand gesehen hat,
   - und mindestens drei Unschuldige haben eine Lücke, die das Tatfenster berührt.
4. **Ein Element Zeitnebel**, aber nur eins oder zwei: eine verstellte Uhr, ein Zeuge, der eine
   Viertelstunde falsch schätzt, eine Person, die von hinten für eine andere gehalten wird.
   Jeder Nebel hat einen Hinweis, der ihn lichtet.
5. **Der Todeszeitpunkt** stützt sich auf mindestens zwei voneinander unabhängige Belege, nie nur
   auf eine stehengebliebene Uhr.

Trag jede Zeile in `truth.timeline` ein, mit `seen_by`. Was eine Figur in ihrem Heft über
eine Uhrzeit sagt, muss zu dieser Tabelle passen. Abweichungen sind nur erlaubt, wenn sie gewollt
sind (Irrtum, Lüge des Täters) und ein Hinweis sie aufdeckt.

## 4. Hinweis-Design

### Drei-Hinweise-Regel

Für jede Schlussfolgerung, die der Tisch ziehen muss, gibt es mindestens drei Hinweise. Spieler
überhören einen, vergessen einen und deuten einen falsch. Drei Hinweise heißen: ein Weg und zwei
Reserven. Das gilt für Motiv, Mittel und Gelegenheit des Täters, für den Bruch seines Alibis und für
die Wendung, falls es eine gibt. Die drei Hinweise kommen aus verschiedenen Quellen und Arten.

### Hinweisarten

| Art | Beispiel | Stärke |
|---|---|---|
| Physisch | Handschuh im Papierkorb, Fingerabdruck, Fleck am Ärmel | hart, schwer wegzureden |
| Aussage | „Um zehn nach acht hörte ich die Tür zum Weinkeller.“ | lebendig, kann irren |
| Dokument | Brief, Kassenbuch, Testament, Fahrplan, Rezept | Wortlaut zum Vorlesen |
| Beobachtung | Was eine Figur bemerkt hat, ohne seine Bedeutung zu kennen | verbindet Figuren |

Jeder Hinweis hat eine glaubwürdige Quelle: Wer konnte das sehen, hören oder finden? Die Köchin
weiß, wer in der Küche war, nicht, was im Arbeitszimmer gesagt wurde.

### Gute Hinweise

- **Kein Hinweis allein überführt.** Jeder zeigt in eine Richtung, erst die Kombination schließt.
  Besonders gut: zwei Figuren halten je eine Hälfte (sie sah jemanden mit nassem Mantel, er weiß,
  dass nur der Hinterausgang durch den Regen führt).
- **Doppelte Lesart.** Wichtige Hinweise haben eine erste, naheliegende Deutung und eine zweite,
  richtige. Der Hinweis, der die zweite Lesart erzwingt, kommt später.
- **Fakten sind über alle Hefte gleich.** Deutungen dürfen auseinandergehen, Tatsachen nie.
- **Abwechslung.** Nicht dreimal Fingerabdrücke. Jede Runde mischt Arten und Quellen.

### Verteilung über die Runden

| Runde | Funktion | Typische Hinweise |
|---|---|---|
| 1 | Wer war wann wo? | Ankunftszeiten, Begegnungen, letzte Sichtung, Todesart grob. Mindestens ein Hinweis zu Todesart oder Tatzeit. Alle wirken verdächtig, nichts zeigt allein auf den Täter. |
| Mitte | Motive und Geheimnisse explodieren | Dokumente, Beziehungen, Geldflüsse. Geheimnisse Unschuldiger fliegen auf, falsche Fährten tragen. Erste Indizien gegen den Täter, alle mehrdeutig. |
| Letzte | Schlussstein | Der Hinweis, der die richtige Lesart erzwingt oder das Alibi bricht. Dazu die Widerlegung der letzten falschen Fährten. |

Bei mehr als drei Runden verteilt sich die Mitte auf zwei Runden. Der entscheidende Hinweis kommt
nie vor der letzten Runde.

### Mengen

Pro Runde bekommt jede Figur ein bis drei Absätze im Heft, der Ermittler ein bis zwei Beweisstücke.
Echte Hinweise sind deutlich in der Mehrheit. Falsche Fährten machen höchstens ein Viertel aller
Hinweise aus.

## 5. Falsche Fährten

Falsche Fährten sind Würze, keine Hauptspeise. Spieler erfinden ohnehin eigene Verdächtige.

- Jede falsche Fährte entsteht aus einem echten Geheimnis eines Unschuldigen. Der Handschuh im
  Garten gehört dem Gärtner, weil er heimlich Wein aus dem Keller schmuggelt, nicht weil er mordet.
- Jede hat eine unschuldige Erklärung, die im Spiel auftaucht, und einen Hinweis, der sie
  widerlegt (`refuted_by`), in derselben oder einer späteren Runde. Die Widerlegung ist
  handfest: ein Beleg, eine Uhrzeit, ein Zeuge. „Er hätte doch keinen Grund gehabt“ zählt nicht.
- Die stärkste falsche Fährte kann zu einer Scheinlösung werden: In der vorletzten Runde spricht
  viel gegen eine Person, die letzte Runde dreht es. Dann muss die Scheinlösung alle bisherigen
  Hinweise erklären außer einem, und genau dieser eine wird später wichtig.

## 6. Geheimnisse und Verstrickung

Am Tisch entsteht Spannung zwischen zwei Menschen, die sich etwas vorwerfen können. Das
Geheimnis lebt erst, wenn jemand anderes es auffliegen lassen kann.

- **Jede Rolle ist mit mindestens zwei anderen verstrickt**, nicht nur mit dem Opfer. Baue Paare
  mit Reibung: Sie schuldet ihm Geld, er kennt ihre wahre Herkunft, beide wollen dasselbe Erbe.
- **Drei Schichten von Beziehungen.** Öffentlich (alle wissen, dass die beiden Geschwister sind),
  halb verborgen (ein Hinweis zeigt, dass sie sich heimlich treffen), tief verborgen (nur eine
  dritte Figur weiß, warum).
- **Jedes Geheimnis hat einen Zünder** in einem fremden Heft oder beim Ermittler, meist in der
  Mitte des Spiels. Dann muss die Figur reagieren, und der Tisch hat ein Thema.
- **Geheimnisse sehen nach Motiv aus.** Wer etwas verbirgt, wirkt schuldig. Gut ist ein Geheimnis,
  das peinlich, teuer oder gefährlich ist, aber nicht mörderisch.
- **Jede Figur hat ein eigenes Ziel** für den Abend, neben „nicht beschuldigt werden“: einen Brief
  zurückholen, jemanden zu einer Aussage bringen, eine Verlobung verhindern. Ziele, die sich
  kreuzen, erzeugen Gespräche ohne Zutun des Ermittlers.
- **Jede Figur hat ein anderes Verhältnis zum Opfer.** Keine zwei Rollen mit demselben Motivtyp.
- **Steckbriefe** (was eine Figur über andere weiß) sind Munition: eine Beobachtung, ein Gerücht,
  eine Vermutung, die man am Tisch ansprechen kann. Mindestens zwei pro Rolle, gern mit einem
  Vorurteil, das sich als falsch herausstellt.

## 7. Wie der Täter spielt

Der Täter hat die schwerste Rolle. Gib ihm Werkzeug.

- **Deckgeschichte:** eine vollständige, zur Zeitleiste passende Version des Abends mit genau den
  Lücken, die er füllen muss. Sie widerspricht keinem Beweisstück, denn harte Fakten kann er nicht
  leugnen, nur umdeuten.
- **Vorbereitete Antworten** auf fünf bis acht Fragen, die sicher kommen: Wo warst du zwischen …?
  Woher kennst du das Opfer? Wie kommt dein Abdruck auf …? Dazu jeweils: was er zugibt, was er
  verschweigt, welche harmlose Erklärung er anbietet.
- **Pro Runde ein Hinweis,** was gleich gegen ihn auftaucht und wie er reagieren kann, ohne dass das
  Heft ihn verrät, falls jemand mitliest.
- **Eine Ablenkung:** ein echtes Geheimnis einer anderen Figur, auf das er lenken kann.
- **Eine Schwäche,** die er nicht kontrolliert: ein Detail, das er nur als Täter wissen kann, eine
  Spur, die er übersehen hat.
- **Unwissende Helfer** (`accomplices`) lügen nicht. Sie bekommen über die Runden Erinnerungsfetzen, die
  ihnen selbst rätselhaft sind, und haben das Ziel, ihre eigenen Lücken aufzuklären. Das ist eine der
  stärksten Rollen, wenn sie ehrlich mitdenken darf.

## 8. Ermittler-Texte

Der Ermittler wird nicht gespielt, sein Text wird zu Rundenbeginn vorgelesen.

- **Jede Runde bringt mindestens ein konkretes Beweisstück** mit Wortlaut oder genauer
  Beschreibung (`evidence`): einen Brief, einen Laborbefund, einen Fund im Papierkorb. Auch Runde 1,
  denn eine Runde nur mit Fragen fühlt sich leer an.
- Er stellt Fragen, die **Spieler beantworten können**, und richtet sie an Figuren: „Frau X, Sie
  waren um acht in der Küche. Wer kam herein?“ So redet der Tisch miteinander statt mit dem Blatt.
- Er urteilt nicht. Er nennt Befunde, keine Schlüsse. In der letzten Runde liefert er den
  Schlussstein, sagt aber nicht, was er bedeutet.
- Er treibt an, wenn es stockt: ein neuer Fund, ein Anruf, eine zweite Sache, die verschwunden ist.
- Er hat eine Stimme. Zwei, drei Eigenheiten in der Sprache genügen.

## 9. Auflösung

Die Auflösung ist der Moment, in dem der Tisch merkt, dass alles fair war. Sie wird vorgelesen und
dauert höchstens zehn Minuten.

1. **Tatfenster eingrenzen** mit den Hinweisen, die es festlegen.
2. **Kreis der Möglichen** aus der Zeitleiste.
3. **Jeden Unschuldigen einzeln entlasten, mit Hinweis.** Nie „hatte wohl nicht genug Motiv“ oder
   „ist eher unwahrscheinlich“. Immer: „Der Zeuge sah sie um 20:05 im Salon, und die Quittung
   belegt, dass sie bis 20:20 telefonierte.“ Wer nur über Motivschwäche entlastet wird, bleibt in
   den Köpfen verdächtig, und die Lösung wirkt willkürlich.
4. **Mittel und Weg des Täters,** mit den Hinweisen, die sie belegen.
5. **Den Bruch der Deckgeschichte.** Welcher Hinweis passt nicht zu seiner Version?
6. **Das Motiv** und die Vorgeschichte, so, dass der Tisch es versteht.
7. **Die Gegenprobe:** Wäre es jemand anderes gewesen, bliebe Hinweis X unerklärt.
8. **Die Wendung erklären,** indem frühe Hinweise neu gelesen werden: „Erinnert ihr euch an …?“
9. Ein kurzer Ausklang: was aus den Figuren wird.

Jede falsche Fährte wird aufgelöst, jedes aufgeflogene Geheimnis bekommt seinen Platz.

## 10. Was ein Spiel unvergesslich macht

- **Ein starkes Bild.** Ein Gegenstand oder Moment, um den sich alles dreht und den man nach Jahren
  noch nennt: eine Torte mit einem Ring darin, ein Papagei, der einen Namen ruft, eine Uhr,
  die jemand eine Stunde vorgestellt hat. Es taucht in der Einführung auf, in mehreren Heften und in der Auflösung.
- **Eine Wendung, die Früheres umdeutet.** Kein neuer Fakt aus dem Nichts, sondern ein Hinweis aus
  Runde 1, der plötzlich etwas anderes bedeutet. Der Tisch soll „ach, deshalb!“ rufen, nicht „das
  konnte keiner wissen“.
- **Ein Motiv, das man nachfühlt.** Die Reaktion soll sein: „Ich verstehe es, aber ich verzeihe es
  nicht.“ Gier allein trägt selten, Scham, Schutz, alte Kränkung, Angst vor dem Absturz tragen.
- **Ein Moment pro Figur.** Jede Rolle hat einen Auftritt, in dem sie im Mittelpunkt steht: ihr
  Geheimnis fliegt auf, sie enthüllt etwas, sie wird zu Unrecht beschuldigt.

## 11. Ton und Humor

- Der Ton aus den Würfelwerten gilt durchgehend, vom Rollentext bis zur Auflösung.
- Humor kommt aus den Figuren: aus dem Widerspruch zwischen Anspruch und Wirklichkeit (der
  Gesundheitsapostel mit Schokoladenvorrat), aus peinlichen Geheimnissen, die andere ausplaudern,
  aus Missverständnissen zwischen zwei Figuren, die Verschiedenes verbergen.
- Keine Witze, die erklärt werden müssen, keine Kalauer im Erzähltext. Der Tisch macht die Witze,
  das Spiel liefert die Vorlage.
- Auch ein heiteres Spiel nimmt den Tod ernst genug, dass das Rätsel zählt.

## 12. Prosa

- **Konkret.** Statt „ein altes, geheimnisvolles Haus“: „Die Dielen im Flur knarren an der dritten
  Bohle, und im Treppenhaus riecht es nach Bohnerwachs.“ Gegenstände und Handlungen statt
  Adjektive.
- **Sinnesdetails,** pro Szene ein, zwei: Geräusch, Geruch, Temperatur, Licht.
- **Zeigen, was Figuren tun,** nicht sagen, was sie fühlen.
- **Rollentexte in du-Form,** im Präteritum für die Vorgeschichte, im Präsens für die Lage heute
  Abend. Ermittler und Einführung sprechen die Runde mit „ihr“ an oder in der Höflichkeitsform,
  passend zur Epoche.
- **Keine Gedankenstriche als Satzzeichen.** Kein langer, kein halber Strich, kein „ - “ zwischen
  Satzteilen. Stattdessen Punkt, Komma, Doppelpunkt oder „denn“, „weil“, „und“.
- **Keine Floskeln:** nicht „ein Schauer lief ihr über den Rücken“, „die Luft war zum Schneiden
  dick“, „nichts ist, wie es scheint“, „ein Geheimnis, das alles verändern könnte“. Keine
  Dreierreihen von Adjektiven. Sätze unterschiedlich lang.
- Namen, Orte, Uhrzeiten und Gegenstände sind in allen Texten exakt gleich geschrieben.
- **Keine Antithesen als Tick.** „Scham ist kein Mord.“, „ein Betrüger, aber kein Mörder“, „Wut,
  keine Tat“: Einmal im Spiel wirkt das, in jedem Heft klingt es nach Maschine. Sag stattdessen,
  was die Figur tut oder was daraus folgt.
- **Aufgaben am Rundenende verteilen.** Zielen in einer Runde mehr als zwei Hefte mit ihrer Frage
  auf dieselbe Person, spricht der Tisch im Chor. Lenke die übrigen auf Nebenkonflikte.
- **Fakten, die nur ein Heft kennt,** darf die Auflösung nicht als „erinnert ihr euch“ verwenden.
  Was der Tisch wissen soll, muss in einem Hinweis stehen.

## Quellen

- Murder Mystery Creator (gongsunyanming, MIT-0), insbesondere `logic-check.md`,
  `design-tips.md` (T02 Entlastungspfade, T03 Beziehungsschichten, T04 Scheinlösung, T08 doppelte
  Lesart, T09 Gegenprobe), `clue-template.md`, `writing-techniques.md`:
  https://clawhub.ai/gongsunyanming/murder-mystery-creator
- Murder Mystery Writer (zjoe2111, MIT-0), insbesondere `SKILL.md` (Rückwärtsmethode,
  Antwortvorlagen für den Täter, drei Runden), `timeline-design.md`, `clues.md`, `characters.md`,
  `reasoning-process.md`, `common-mistakes.md`: https://clawhub.ai/zjoe2111/murder-mystery-writer
- The Alexandrian, „Three Clue Rule“:
  https://thealexandrian.net/wordpress/1118/roleplaying-games/three-clue-rule
- Freeform Games, „Writing a murder“: https://www.freeformgames.com/blog/writing-a-murder/ und
  „Golden rules“: https://freeformgames.com/murder-mystery-party-hints-and-tips/golden-rules
- Apartment 304, „Whodunit: LLM murder mysteries“ (Lösung zuerst, Redaktionsschritt):
  https://blog.apartment304.com/whodunit-llm-murder-mysteries
- M. Siebert, „Harry Potter murder mystery“ (Hinweise wiederholen sich, Täter zu offensichtlich):
  https://msiebert.github.io/blog/harry-potter-murder-mystery
- hamogu/DinnerMurderGames (Aufbau der Hefte): https://github.com/hamogu/DinnerMurderGames
- Analyse gekaufter Krimidinner-Spiele (kein Text übernommen): Lügenregel, Beweise des Ermittlers,
  Steckbriefe; häufige Schwäche: Entlastung über „wohl kein Motiv“.
