#import "lib.typ": *

#let r = case.roles.find(x => x.id == sys.inputs.role)
#let n = case.round_count

#show: booklet.with(kind: "Hinweise " + r.name, owner: r.name)

#title-page(
  kind: "Hinweisheft",
  name: r.name,
  subline: r.occupation,
  warning: [*Nur für #r.name.* Erst am Spielabend öffnen und immer nur die Runde lesen, die gerade beginnt.],
)

= Bevor es losgeht

#paragraphs(r.booklet_intro)

#panel(title: "Zur Erinnerung")[
  #if r.may_lie [Du darfst lügen. Alle anderen müssen die Wahrheit sagen, also pass auf, dass deine Geschichte zu dem passt, was sie wissen.] else [Du darfst nicht lügen. Ausweichen ist erlaubt, aber auf eine direkte Frage antwortest du wahr. Wo dein Heft nichts sagt, darfst du improvisieren.]
]

#stop(1)

#for k in range(1, n + 1) {
  let e = r.rounds.find(x => x.n == k)
  round-header(k, sub: if k == n { "Die letzte Runde" } else { none })
  if e == none { text(fill: accent)[In dieser Runde erfährst du nichts Neues.] } else { paragraphs(e.text) }
  if k < n { stop(k + 1) }
}

#v(1fr)
#block(width: 100%, breakable: false, {
  ornament(width: 100%)
  v(0.3em)
  align(center, text(font: serif, size: 13pt, style: "italic")[Das waren alle Hinweise. Jetzt wird abgestimmt.])
})
