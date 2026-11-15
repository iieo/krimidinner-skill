#let accent = rgb("#7a1d22")
#let ink = rgb("#1d1a18")
#let muted = rgb("#6b625c")
#let paper-tone = rgb("#faf6ee")

#let serif = ("Baskerville", "Libertinus Serif")
#let sans = ("Avenir Next", "Helvetica Neue", "New Computer Modern")
#let mono = ("American Typewriter", "Courier New", "DejaVu Sans Mono")

#let data = json(sys.inputs.data)
#let case = data.case
#let names = data.names

// Paragraphs from \n\n, single line breaks are kept.
#let paragraphs(t) = {
  if t == none or t == "" { return }
  for (i, p) in t.split("\n\n").enumerate() {
    if i > 0 { parbreak() }
    p.trim().split("\n").map(z => [#z]).join(linebreak())
  }
}

#let ornament(width: 5cm) = align(center, box(width: width, {
  set align(horizon)
  grid(
    columns: (1fr, auto, 1fr),
    column-gutter: 6pt,
    line(length: 100%, stroke: 0.6pt + accent),
    rotate(45deg, square(size: 4.5pt, fill: accent)),
    line(length: 100%, stroke: 0.6pt + accent),
  )
}))

#let caps(t, size: 9pt, color: accent) = text(
  font: sans, size: size, weight: "semibold", tracking: 0.14em, fill: color, upper(t),
)

#let booklet(kind: "", owner: none, body) = {
  set document(title: case.title + " · " + kind)
  set text(font: sans, size: 11pt, lang: "de", fill: ink, hyphenate: true)
  set par(justify: true, leading: 0.68em, spacing: 1.05em)
  set page(
    paper: "a4",
    margin: (x: 2.3cm, top: 2.5cm, bottom: 2.6cm),
    header: context {
      if owner != none and counter(page).get().first() > 0 {
        align(right, caps("Nur für " + owner, size: 7.5pt, color: muted))
      }
    },
    footer: context {
      let n = counter(page).get().first()
      if n > 0 {
        line(length: 100%, stroke: 0.4pt + muted.lighten(40%))
        v(-4pt)
        set text(size: 8.5pt, fill: muted)
        grid(
          columns: (1fr, auto),
          text(font: serif, style: "italic", size: 9.5pt, case.title + " · " + kind),
          [Seite #n von #counter(page).final().first()],
        )
      }
    },
  )
  show heading: set text(font: serif, fill: ink, weight: "regular")
  show heading.where(level: 1): it => {
    set par(justify: false)
    v(0.6em)
    block(below: 0.9em, {
      text(size: 21pt, fill: accent, it.body)
      v(-8pt)
      line(length: 2.2cm, stroke: 1pt + accent)
    })
  }
  show heading.where(level: 2): it => block(above: 1.5em, below: 0.75em, text(size: 16.5pt, it.body))
  show heading.where(level: 3): it => block(above: 1.1em, below: 0.45em,
    text(font: sans, size: 10pt, weight: "semibold", tracking: 0.08em, fill: accent, upper(it.body)))
  set list(marker: text(fill: accent, sym.bullet), indent: 0.4em, body-indent: 0.6em)
  set enum(indent: 0.4em)
  counter(page).update(0)
  body
}

#let title-page(kind: "", name: none, subline: none, warning: none) = page(header: none, footer: none, margin: 2.5cm, {
  set par(justify: false)
  set align(center)
  rect(width: 100%, height: 100%, stroke: 0.8pt + accent, inset: 6pt,
    rect(width: 100%, height: 100%, stroke: 0.3pt + accent, inset: 1.6cm, {
      v(1.5cm)
      caps("Krimidinner")
      v(0.6cm)
      text(font: serif, size: 34pt, fill: ink, case.title)
      v(0.2cm)
      text(font: serif, size: 13pt, style: "italic", fill: muted, case.subtitle)
      v(0.8cm)
      ornament()
      v(1fr)
      caps(kind, size: 11pt)
      if name != none {
        v(0.35cm)
        text(font: serif, size: 24pt, name)
      }
      if subline != none {
        v(0.2cm)
        text(size: 10.5pt, fill: muted, subline)
      }
      v(1fr)
      if warning != none {
        block(width: 85%, stroke: 0.8pt + accent, inset: 12pt, radius: 2pt, {
          set text(size: 10pt)
          warning
        })
      }
      v(0.6cm)
      let place = (case.at("setting", default: none), case.at("era", default: none)).filter(x => x != none)
      if place.len() > 0 { text(size: 9pt, fill: muted, place.join(" · ")) }
    }))
})

#let panel(title: none, breakable: false, body) = block(
  width: 100%, breakable: breakable, stroke: (left: 2.5pt + accent), inset: (left: 12pt, rest: 8pt), above: 1.1em, below: 1.1em, {
    if title != none { block(below: 0.6em, caps(title)) }
    body
  },
)

#let evidence(title, content, tag: "Beweisstück") = block(width: 100%, breakable: false, above: 1.4em, below: 1.4em, {
  text(font: sans, size: 8pt, weight: "semibold", tracking: 0.12em, fill: accent, upper(tag))
  h(0.5em)
  text(font: serif, size: 12pt, style: "italic", title)
  v(0.2em)
  block(width: 100%, fill: paper-tone, stroke: 0.7pt + ink.lighten(30%), inset: 14pt, {
    set text(font: mono, size: 10pt)
    set par(justify: false, leading: 0.75em)
    paragraphs(content)
  })
})

#let stop(round) = {
  v(1fr)
  block(width: 100%, breakable: false, above: 1.5em, {
    ornament(width: 100%)
    v(0.3em)
    align(center, {
      text(font: serif, size: 13pt, style: "italic", "Halt. Erst umblättern, wenn Runde " + str(round) + " beginnt.")
    })
  })
  pagebreak()
}

#let round-header(n, sub: none) = {
  block(width: 100%, below: 1.2em, {
    set align(center)
    caps("Erst umblättern, wenn die Runde beginnt", size: 7.5pt, color: muted)
    v(0.4em)
    text(font: serif, size: 40pt, fill: accent, "Runde " + str(n))
    if sub != none {
      v(-0.2em)
      text(font: serif, size: 13pt, style: "italic", fill: muted, sub)
    }
    v(0.2em)
    ornament()
  })
}

#let person(id) = names.at(id, default: id)
