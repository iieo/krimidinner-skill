#import "lib.typ": *

#show: booklet.with(kind: "Requisiten")

#title-page(
  kind: "Requisiten",
  name: "Zum Ausschneiden",
  warning: [Erst in der Runde auf den Tisch legen, die über dem Requisit steht. Vorher nicht lesen.],
)

#for q in case.props.sorted(key: q => q.round) {
  block(width: 100%, breakable: false, above: 1.2em, below: 1.6em, {
    caps("Runde " + str(q.round) + " · " + q.title, size: 7.5pt, color: muted)
    v(0.2em)
    rect(width: 100%, stroke: (paint: muted, thickness: 0.6pt, dash: "dashed"), inset: 8pt,
      block(width: 100%, fill: paper-tone, stroke: 0.7pt + ink.lighten(30%), inset: 16pt, {
        set text(font: mono, size: 11pt)
        set par(justify: false, leading: 0.8em)
        paragraphs(q.content)
      }))
  })
}
