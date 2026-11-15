#import "lib.typ": *

#let r = case.roles.find(x => x.id == sys.inputs.role)
#let t = case.truth

#show: booklet.with(kind: "Rolle " + r.name, owner: r.name)

#title-page(
  kind: "Einladung und Rolle",
  name: r.name,
  subline: str(r.age) + " Jahre, " + r.occupation,
  warning: [*Nur für #r.name.* Dieses Heft ist für die Person, die #r.name spielt. Nicht weitergeben, nicht vorlesen, auch nicht am Spielabend.],
)

= Herzliche Einladung

#text(font: serif, size: 13pt, style: "italic")[zum Krimidinner „#case.title“]

An diesem Abend wollen wir gemeinsam einen Mordfall lösen. Jede Person am Tisch spielt eine Rolle, und du spielst *#r.name*. Doch Vorsicht: Der Täter sitzt mit am Tisch und wird alles tun, um nicht entdeckt zu werden.

=== Lies deine Rolle
Auf den nächsten Seiten steht alles, was du für den Abend brauchst: wer du bist, was du über die anderen weißt und was du lieber für dich behältst. Lies es in Ruhe und bring das Heft am Abend mit.

=== Verrate nichts
Deinen Namen und deinen Beruf darfst du allen sagen. Alles andere behältst du bis zum Spielabend für dich.

=== Verkleide dich
Hinten im Heft stehen ein paar Kostümtipps. Es muss nicht perfekt sein. Ein Hut, eine Schürze oder eine Brille reichen oft schon, um in die Rolle zu finden.

Die Regeln erklären wir am Abend. Nur eins vorab: Außer dem Täter sagen alle die Wahrheit.

#v(1em)
#align(right, text(font: serif, size: 13pt, style: "italic")[Bis bald am Tatort!])

#pagebreak()

= Was ist passiert?

#paragraphs(case.what_happened)

#panel(title: "Das Opfer")[
  #text(font: serif, size: 12.5pt, case.victim.name) #text(fill: muted, "(" + str(case.victim.age) + ")") \
  #paragraphs(case.victim.description)
]

= Deine Rolle: #r.name

#text(fill: muted)[#r.age Jahre, #r.occupation]

#paragraphs(r.profile)

#panel(title: "Was niemand erfahren soll")[#paragraphs(r.secret)]
#panel(title: "Warum man dich verdächtigen könnte")[#paragraphs(r.motive)]
#panel(title: "Dein Ziel heute Abend")[#paragraphs(r.goal)]

#if r.is_culprit {
  block(width: 100%, breakable: false, above: 1.4em, below: 1.4em, stroke: 1.2pt + accent, inset: 14pt, {
    caps("Nur für dich: Du hast es getan")
    v(0.5em)
    grid(
      columns: (auto, 1fr),
      column-gutter: 12pt,
      row-gutter: 8pt,
      text(weight: "semibold", "Tatzeit"), t.time_of_death + " Uhr",
      text(weight: "semibold", "Wie"), t.means,
      text(weight: "semibold", "Warum"), t.motive,
    )
    v(0.6em)
    caps("Deine Geschichte für die anderen", size: 8pt)
    v(0.2em)
    paragraphs(t.cover_story)
    v(0.4em)
    text(size: 10pt, style: "italic")[Du darfst lügen, die anderen nicht. Verstrick dich nicht in deinen eigenen Geschichten.]
  })
}

== Verkleidungstipps

#paragraphs(r.costume)

== Spielweise

#paragraphs(r.how_to_play)

== Was du über die anderen weißt

#for s in data.dossiers.at(r.id) {
  block(breakable: false, above: 0.9em, below: 0.9em, {
    text(font: serif, size: 12.5pt, s.name)
    h(0.4em)
    text(fill: muted, "(" + str(s.age) + "), " + s.occupation)
    linebreak()
    paragraphs(s.text)
  })
}
