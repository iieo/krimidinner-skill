#import "lib.typ": *

#let investigator-full = case.investigator.title + " " + case.investigator.name
#let n = case.round_count
#let speaker = person(case.intro.speaker)

#show: booklet.with(kind: "Spielanleitung")

#title-page(
  kind: "Spielanleitung",
  name: "Für die Gastgeber",
  subline: "Spielablauf, Vorbereitung, Namenskarten und Einführungstext",
  warning: [Dieses Heft darfst du lesen, auch wenn du mitspielst. Es verrät nicht, wer es war. Alle anderen Hefte sind nur für die Person bestimmt, deren Name daraufsteht.],
)

= Willkommen

Heute Abend wird gegessen, getrunken und gemordet. Jedenfalls auf dem Papier. #case.players Personen schlüpfen in eine Rolle, und eine davon hat das Opfer auf dem Gewissen. Wer, weiß zu Beginn nur der Täter selbst. Alle anderen haben eigene Geheimnisse und geraten früher oder später ebenfalls in Verdacht.

Im Lauf des Abends tauchen in #n Runden neue Hinweise auf. Ihr redet, verdächtigt und verteidigt euch. Am Ende stimmt ihr verdeckt ab, wer es war, und erst dann wird die Auflösung vorgelesen.

#grid(
  columns: (1fr, 1fr, 1fr),
  column-gutter: 10pt,
  ..(
    ("Personen", str(case.players)),
    ("Dauer", case.at("duration", default: "etwa 3 Stunden")),
    ("Alter", if case.at("min_age", default: none) != none { "ab " + str(case.min_age) + " Jahren" } else { "für Erwachsene" }),
  ).map(((k, value)) => block(width: 100%, stroke: 0.5pt + muted.lighten(50%), inset: 10pt, {
    set align(center)
    caps(k, size: 7.5pt)
    v(0.1em)
    text(font: serif, size: 15pt, value)
  })),
)

== Was ist passiert?

#paragraphs(case.what_happened)

= Vorbereitung

=== Drucken

Drucke diese Spielanleitung, die Hinweishefte aller Rollen, das Hinweisheft von #investigator-full und die Auflösung#if data.has-props [ sowie die Requisiten]. Die Hinweishefte am besten einseitig, damit niemand durch das Papier auf die nächste Runde schielt. Die Rollenhefte musst du nicht drucken, wenn du sie vorher per E-Mail verschickst.

Wenn du selbst mitspielst, öffnest du außer dieser Anleitung nur dein eigenes Rollenheft und dein eigenes Hinweisheft. Hefte von anderen Rollen, das Heft der Ermittlung und die Auflösung bleiben zu, bis sie im Spiel dran sind.

=== Einladungen vorher verschicken

Verteile die Rollen ein paar Tage vorher und schick jeder Person ihr Rollenheft (die Dateien „02 Rolle“). Darin stehen Einladung, Vorgeschichte und Kostümtipps. So haben alle Zeit, sich einzulesen und etwas Passendes zum Anziehen zu finden. Spontan geht es auch: Dann teilst du die Rollenhefte zu Beginn aus und gibst allen eine Viertelstunde zum Lesen.

Rollen kannst du frei verteilen, auch über Geschlecht und Alter hinweg. Wer zum ersten Mal mitspielt, hat es mit einer Rolle leichter, die ihm ein bisschen ähnelt.

=== Essen in Gängen

Das Spiel passt gut zu einem Menü in mehreren Gängen. Ihr lest die neuen Hinweise in der Pause zwischen zwei Gängen und diskutiert beim Essen. Plane das Essen so, dass du nicht stundenlang in der Küche stehst, denn du spielst ja mit. Ein Vorschlag steht unten im Ablauf.

=== Namenskarten und Tisch

Am Ende dieses Hefts findest du Namenskarten zum Ausschneiden. Mit Klebeband oder einer Sicherheitsnadel an die Kleidung heften, dann muss niemand nach Namen fragen. Kerzen, gedämpftes Licht und ein bisschen Deko zur Epoche helfen mehr als man denkt. Leg außerdem für jede Person einen Stift und einen kleinen Zettel für die Abstimmung bereit.

= Die Personen

=== Das Opfer
Diese Rolle wird nicht verteilt.

#panel[
  #text(font: serif, size: 13pt, case.victim.name) #text(fill: muted, "(" + str(case.victim.age) + ")") \
  #paragraphs(case.victim.description)
]

=== Die Ermittlung
Auch diese Rolle wird nicht verteilt. Ihre Ergebnisse werden zu Beginn jeder Runde vorgelesen.

#panel[
  #text(font: serif, size: 13pt, investigator-full) \
  #paragraphs(case.investigator.description)
]

=== Die Verdächtigen
Diese #case.players Rollen werden verteilt.

#for r in case.roles {
  block(breakable: false, above: 0.9em, below: 0.9em, {
    text(font: serif, size: 13pt, r.name)
    h(0.4em)
    text(fill: muted, "(" + str(r.age) + "), " + r.occupation)
    linebreak()
    r.tagline
  })
}

= Ablauf

#let phases = (
  ("Ankommen", "Begrüßung, Getränke, Namenskarten anstecken.", data.menu.at(0)),
  ("Vorstellungsrunde", speaker + " liest den Einführungstext vor. Dann stellt sich jede Figur kurz vor.", data.menu.at(1)),
  ..range(1, n + 1).map(k => ("Hinweisrunde " + str(k), "Hinweisheft Runde " + str(k) + " lesen, Ermittlung vorlesen, diskutieren.", data.menu.at(k + 1))),
  ("Auflösung", "Verdeckte Abstimmung, Begründungen, Auflösung vorlesen.", data.menu.at(n + 2)),
)

#table(
  columns: (auto, 1fr, auto),
  stroke: (x, y) => (bottom: if y == 0 { 0.8pt + accent } else { 0.4pt + muted.lighten(50%) }),
  inset: (x: 6pt, y: 7pt),
  table.header(
    caps("Phase", size: 7.5pt), caps("Was passiert", size: 7.5pt), caps("Essen", size: 7.5pt),
  ),
  ..phases.map(((p, w, e)) => (text(font: serif, size: 11.5pt, p), text(size: 10pt, w), text(size: 10pt, style: "italic", e))).flatten(),
)

=== Vorstellungsrunde

#speaker liest den Einführungstext vor (letzte Seite dieses Hefts). Danach stellt sich jede Figur kurz vor: Name, Beruf, und warum sie heute hier ist. Fragen gibt es in dieser Runde noch nicht.

#for k in range(1, n + 1) [
  === Hinweisrunde #k

  #if k == 1 [
    Alle schlagen in ihrem Hinweisheft die Seite „Runde 1“ auf und lesen still für sich. Danach liest eine Person aus dem Heft von #investigator-full die Seite „Runde 1“ laut vor und legt die Beweisstücke in die Mitte. Dann wird geredet: Jede Person bringt ein, was sie erfahren hat, und alle dürfen fragen, verdächtigen und sich verteidigen. Was einen selbst belastet, muss man nicht von sich aus erzählen.

    Die Runde endet, wenn niemand mehr Fragen hat. Meist dauert das 20 bis 40 Minuten.
  ] else [
    Wie Runde 1, nur mit den Seiten „Runde #k“.#if k == n [ Das ist die letzte Hinweisrunde. Danach wird abgestimmt.]
  ]
]

=== Auflösung mit verdeckter Abstimmung

Jede Person schreibt verdeckt auf ihren Zettel, wer es war und warum. Dann deckt ihr reihum auf und begründet kurz. Wer der Täter ist, tut dabei so, als wäre es jemand anderes. Erst wenn alle dran waren, liest eine Person das Heft „Auflösung“ laut vor.

#panel(title: "Die Lügenregel", breakable: true)[
  *Nur der Täter darf lügen.* Alle anderen sagen die Wahrheit.

  Das heißt nicht, dass alle alles erzählen müssen. Man darf ausweichen, das Thema wechseln oder eine Frage geschickt umgehen. Wer aber direkt gefragt wird, muss wahr antworten. „Waren Sie um acht im Keller?“ verlangt ein ehrliches Ja oder Nein.

  Wo das Heft nichts sagt, dürft ihr improvisieren. Woher eure Figur das Opfer kennt, was sie zum Frühstück hatte, wie ihr Hund heißt: Erfindet es, solange es nichts verändert, was im Heft steht.

  Wer merkt, dass er aus Versehen etwas Falsches gesagt hat, korrigiert es so bald wie möglich. Und falls jemand eine Regel großzügig auslegt: Lasst es laufen. Es geht um einen schönen Abend.
]

#pagebreak()

= Checkliste für den Gastgeber

#let check-item(t) = block(above: 1.1em, below: 1.1em, grid(
  columns: (auto, 1fr),
  column-gutter: 10pt,
  box(width: 10pt, height: 10pt, stroke: 0.8pt + ink, baseline: 1pt),
  t,
))

=== Eine Woche vorher
#check-item[Gäste einladen und Rollen verteilen]
#check-item[Jeder Person ihr Rollenheft schicken („02 Rolle“)]
#check-item[Menü planen, möglichst mit Gängen, die sich gut vorbereiten lassen]

=== Am Tag davor
#check-item[Hinweishefte drucken, einseitig, eins pro Rolle]
#check-item[Heft von #investigator-full und Auflösung drucken]
#if data.has-props { check-item[Requisiten drucken und ausschneiden] }
#check-item[Namenskarten drucken und ausschneiden]
#check-item[Ein paar Ersatzausdrucke der Rollenhefte für Vergessliche]

=== Am Abend
#check-item[Stifte und Abstimmungszettel auf den Tisch]
#check-item[Hinweishefte mit Namen nach außen bereitlegen, nicht aufschlagen]
#check-item[Einführungstext an #speaker geben]
#check-item[Bestimmen, wer die Ermittlung vorliest und wer die Auflösung]
#check-item[Musik leise, Kerzen an]

#pagebreak()

= Namenskarten

#text(fill: muted, size: 10pt)[Ausschneiden und mit Klebeband oder Sicherheitsnadel anstecken.]
#v(0.6em)

#grid(
  columns: (1fr, 1fr),
  rows: 4.6cm,
  ..case.roles.map(r => rect(
    width: 100%, height: 100%,
    stroke: (paint: muted, thickness: 0.6pt, dash: "dashed"),
    inset: 10pt,
    align(center + horizon, {
      set par(justify: false)
      text(font: serif, size: 21pt, r.name)
      v(0.2em)
      line(length: 2cm, stroke: 0.6pt + accent)
      v(0.2em)
      caps(r.occupation, size: 8.5pt)
    }),
  )),
)

#pagebreak()

= Einführungstext

#text(style: "italic", fill: muted)[#speaker liest vor, sobald alle am Tisch sitzen.]

#v(0.8em)
#block(inset: (x: 1em), {
  set text(font: serif, size: 13pt)
  set par(leading: 0.8em, spacing: 1.2em)
  paragraphs(case.intro.text)
})

#v(1em)
#text(style: "italic", fill: muted)[Danach folgt die Vorstellungsrunde. Anschließend schlagen alle Runde 1 in ihrem Hinweisheft auf.]
