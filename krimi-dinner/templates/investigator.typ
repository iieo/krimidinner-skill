#import "lib.typ": *

#let n = case.round_count
#let inv = case.investigator
#let full = inv.title + " " + inv.name

#show: booklet.with(kind: "Ermittlung " + full)

#title-page(
  kind: "Hinweisheft der Ermittlung",
  name: full,
  subline: "Wird zu Beginn jeder Runde laut vorgelesen",
  warning: [Diese Rolle spielt niemand. Zu Beginn jeder Hinweisrunde liest eine Person die Seite dieser Runde laut vor. Vorher nicht weiterblättern.],
)

= So wird dieses Heft benutzt

#paragraphs(inv.description)

Sobald alle ihre eigenen Hinweise für die Runde gelesen haben, liest eine Person die Seite der Runde vor. Die Beweisstücke werden mit vorgelesen#if data.has-props [, Requisiten aus dem Heft „Requisiten“ kommen in die Tischmitte]. Wer vorliest, darf das Heft danach reihum weitergeben, damit nicht immer dieselbe Person den Vorsprung hat.

#stop(1)

#for k in range(1, n + 1) {
  let ir = case.investigator_rounds.find(x => x.n == k)
  round-header(k, sub: "Bitte laut vorlesen")
  block(inset: (x: 0.5em), {
    set text(font: serif, size: 12.5pt)
    set par(leading: 0.75em)
    if ir != none { paragraphs(ir.text) }
  })
  if ir != none { for e in ir.at("evidence", default: ()) { evidence(e.title, e.content) } }
  let props = case.at("props", default: ()).filter(q => q.round == k)
  if props.len() > 0 {
    panel(title: "Requisiten für diese Runde")[
      Jetzt aus dem Heft „Requisiten“ auf den Tisch legen: #props.map(q => "„" + q.title + "“").join(", ", last: " und ").
    ]
  }
  if k < n { stop(k + 1) }
}
