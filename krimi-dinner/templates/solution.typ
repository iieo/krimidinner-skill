#import "lib.typ": *

#let t = case.truth
#let culprit = person(t.culprit)

#show: booklet.with(kind: "Auflösung")

#title-page(
  kind: "Auflösung",
  name: "Wer war es?",
  warning: [*Erst nach der Abstimmung öffnen.* Alle haben ihren Verdacht aufgeschrieben und begründet? Dann darf eine Person dieses Heft laut vorlesen.],
)

= Die Auflösung

#text(style: "italic", fill: muted)[Zum Vorlesen.]

#block(inset: (x: 0.5em), {
  set text(font: serif, size: 12.5pt)
  set par(leading: 0.78em, spacing: 1.2em)
  paragraphs(case.solution)
})

#pagebreak()

= Was wirklich geschah

#text(fill: muted)[Für alle, die es genau wissen wollen.]

#panel(title: "Die Tat")[
  #grid(
    columns: (auto, 1fr),
    column-gutter: 12pt,
    row-gutter: 8pt,
    text(weight: "semibold", "Täter"), culprit,
    ..if t.accomplices.len() > 0 { (text(weight: "semibold", "Beteiligt"), t.accomplices.map(person).join(", ")) } else { () },
    text(weight: "semibold", "Tatzeit"), t.time_of_death + " Uhr",
    text(weight: "semibold", "Mittel"), t.means,
    text(weight: "semibold", "Motiv"), t.motive,
    text(weight: "semibold", "Ausrede"), t.cover_story,
  )
]

== Zeitleiste

#table(
  columns: (auto, auto, 1fr, auto),
  stroke: (x, y) => (bottom: if y == 0 { 0.8pt + accent } else { 0.4pt + muted.lighten(50%) }),
  inset: (x: 5pt, y: 6pt),
  table.header(..("Zeit", "Ort", "Was geschah", "Bezeugt von").map(h => caps(h, size: 7pt))),
  ..t.timeline.map(z => (
    text(font: serif, size: 11pt, z.time),
    text(size: 9.5pt, z.place),
    text(size: 9.5pt, z.what),
    text(size: 9.5pt, if z.seen_by.len() > 0 { z.seen_by.map(person).join(", ") } else { "niemand" }),
  )).flatten(),
)

== Alle Hinweise im Überblick

#let kind-label = ("true": "echt", red_herring: "falsche Fährte", secret: "Geheimnis")
#for k in range(1, case.round_count + 1) [
  === Runde #k
  #table(
    columns: (auto, 1fr, auto),
    stroke: (x, y) => (bottom: 0.4pt + muted.lighten(50%)),
    inset: (x: 5pt, y: 5pt),
    ..case.clues.filter(h => h.round == k).map(h => (
      text(size: 9pt, fill: muted, person(h.source)),
      text(size: 9.5pt, h.text),
      text(size: 9pt, style: "italic", fill: if h.kind == "true" { ink } else { accent }, kind-label.at(h.kind, default: h.kind)),
    )).flatten(),
  )
]
