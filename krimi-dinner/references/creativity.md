# Kreativität: Vorgehen gegen das immer gleiche Spiel

Ohne Gegensteuern landet jedes Modell beim wahrscheinlichsten Krimi: Villa, Testament, Gift im
Wein, Gewitter. Das liegt nicht an mangelnder Fantasie, sondern daran, dass das Modell die Mitte
der Verteilung ausgibt. Dieses Vorgehen zwingt das Spiel an den Rand, ohne dass es beliebig wird.
Es läuft vor Schritt 1 der Wahrheit-zuerst-Methode in `craft.md`.

## 1. Würfelwerte sind harte Vorgaben

`roll.mjs` liefert Werte für Ton, Epoche, Schauplatz und weitere Achsen. Sie gelten wörtlich.

- Übernimm jeden Wert so, wie er gewürfelt wurde. Deute „Leuchtturm, 1958“ nicht zu „Herrenhaus
  an der Küste“ um, sondern schreibe ein Spiel, das ohne Leuchtturm und ohne 1958 nicht
  funktioniert.
- Jeder Wert muss etwas tragen: Der Schauplatz liefert den Tatort und mindestens einen Hinweis, die
  Epoche bestimmt, welche Beweise möglich sind (keine Fingerabdruckanalyse 1890, keine Handys
  1958), der Ton bestimmt Geheimnisse und Sprache.
- Passen zwei Werte schlecht zusammen, ist das der Ausgangspunkt der Geschichte. Ein
  schwarzhumoriges Spiel in einem Kloster wird gut, gerade weil es reibt.
- Neu würfeln nur, wenn der Nutzer es will.

## 2. Zufallswörter und Wikipedia-Fund

Die Würfelausgabe enthält Zufallswörter und einen zufälligen Wikipedia-Artikel. Sie sind Rohstoff,
keine Dekoration.

- **Mindestens ein Zufallswort wird zum Kernbild oder Requisit,** um das sich die Tat dreht: Es ist
  Tatmittel, Versteck, Beweisstück oder Anlass des Abends. Es erscheint in der Einführung, in
  mindestens zwei Heften und in der Auflösung.
- **Ein weiteres Zufallswort steckt in einem Geheimnis** einer unschuldigen Figur.
- **Aus dem Wikipedia-Artikel** nimmst du einen konkreten, wenig bekannten Sachverhalt: einen
  Mechanismus, eine historische Begebenheit, einen Brauch, eine Zahl. Er treibt das Motiv, das
  Mittel oder die Wendung. „Der Artikel handelt von Bienen, also gibt es Honig zum Nachtisch“
  reicht nicht. „Ein Imker weiß, dass Rhododendronhonig giftig ist“ reicht.
- Lässt sich ein Wort wirklich nicht einbauen, nimm das nächste. Halte im Ergebnis fest, welche
  Wörter wie verwendet wurden.

## 3. Prämisse per Verbalized Sampling

Für die Prämisse (Anlass, Opfer, Kernbild, Täter, Trick, Motiv in wenigen Sätzen) fragst du nicht
nach einer Idee, sondern nach fünf mit Wahrscheinlichkeiten, und zwar aus den Rändern der
Verteilung. Das hebt die Vielfalt deutlich, ohne die Qualität zu senken. Stärkere Modelle
profitieren mehr davon.

### Wortlaut

Schreibe dir selbst (oder dem Subagent, der die Prämisse entwirft) genau diese Anweisung, mit den
Werten eingesetzt:

```
<vorgaben>
{alle Würfelwerte, Zufallswörter, Wikipedia-Fund, Spielerzahl, Rundenzahl}
</vorgaben>

<aufgabe>
Entwirf fünf mögliche Prämissen für ein Krimidinner, das alle Vorgaben wörtlich erfüllt.
Jede Prämisse steht in einem eigenen <prämisse>-Tag und enthält:
<text> in fünf bis acht Sätzen: Anlass des Abends, Opfer, Kernbild, Täter, Trick aus
tricks.md, Motiv, die Wendung am Ende </text>
<wahrscheinlichkeit> eine Zahl zwischen 0 und 1: wie wahrscheinlich ein Sprachmodell
genau diese Prämisse für diese Vorgaben vorschlagen würde </wahrscheinlichkeit>

Ziehe zufällig aus den Rändern der Verteilung, so dass die Wahrscheinlichkeit jeder
Prämisse unter 0,10 liegt. Die fünf Prämissen unterscheiden sich im Trick, im Motivtyp und
im Kernbild.
</aufgabe>
```

Das ist die deutsche Fassung des Prompts aus dem Paper und Repository zu Verbalized Sampling
(„Generate 5 responses …, each within a separate <response> tag. Each <response> must include a
<text> and a numeric <probability>. Please sample at random from the tails of the distribution,
such that the probability of each response is less than 0.10.“). k = 5 ist der dort empfohlene Wert;
größere k senken die Qualität.

### Auswahl

1. Streiche jede Prämisse, die eine Vorgabe verbiegt, am Esstisch nicht erzählbar ist (Mechanik,
   Fachwissen, Grundriss nötig) oder keine faire Lösung mit drei Hinweisen pro Schluss erlaubt.
2. Streiche jede, die mehr als zwei Punkte der Klischeeliste in `checklist.md` enthält.
3. Von den übrigen nimm die mit der **niedrigsten** Wahrscheinlichkeit. Bei Gleichstand die mit dem
   stärkeren Kernbild.
4. Bleibt keine übrig, fordere „fünf weitere, ebenfalls unter 0,10“ im selben Gespräch an und
   wiederhole.

Dasselbe Verfahren, mit k = 5 und Schwelle 0,10, lohnt sich noch zweimal: für die Wendung, wenn
sie nach dem Ausarbeiten flach wirkt, und für die Geheimnisse der unschuldigen Figuren.

## 4. Was Claude in diesem Genre von selbst macht, und was stattdessen

Diese Liste beschreibt Standardgriffe. Steht einer davon im Entwurf, ersetze ihn durch die
Alternative oder begründe, warum er hier einen eigenen Dreh hat.

| Standardgriff | Stattdessen |
|---|---|
| Villa oder Herrenhaus | Der gewürfelte Ort, und zwar dessen Alltag: Lagerraum, Dienstplan, Geräusche, die nur dort vorkommen. |
| Testamentseröffnung als Anlass | Ein Anlass aus Ort und Epoche: Richtfest, Preisverleihung, Weinlese, Abschiedsfeier, Probe, Jubiläum. |
| Reicher, verhasster Patriarch als Opfer | Ein Opfer, das jemand vermissen wird, und dessen Tod einer Figur am Tisch wirklich wehtut. |
| Gift im Wein, Arsen, Zyankali | Ein Mittel, das aus dem Schauplatz kommt und das der Tisch selbst verstehen kann. |
| Gewitter, Stromausfall, eingeschneit | Ein Grund aus der Handlung, warum alle bleiben: Das Ergebnis wird um Mitternacht verkündet, die Fähre fährt erst morgen. |
| Butler, Haushälterin, Gärtner als Statisten | Personal als volle Rollen mit eigenem Geheimnis, oder gar kein Personal. |
| Erpressung oder Affäre als Motiv für fast alle | Pro Figur ein anderer Motivtyp: Schulden, Scham, Rache, Schutz, Ehrgeiz, Angst vor Entdeckung, verletzte Ehre. |
| Tagebuch des Opfers mit allen Antworten | Bruchstücke in verschiedenen Händen, die erst zusammen etwas ergeben. |
| Kommissar mit Hut und trockenem Spruch | Ein Ermittler mit einer Eigenheit aus dem Ort oder der Epoche: der Dorfpolizist, der den Täter seit der Schule kennt; die Versicherungsprüferin. |
| Der Arzt als offensichtlichster Verdächtiger | Zugang zum Mittel liegt bei mindestens drei Figuren. |
| Täterin ist die Netteste | Der Täter hat eine erkennbare, verständliche Kante, wie andere auch. |
| Adelstitel und Doppelnamen für Komik | Komik aus dem, was Figuren tun und verbergen. |
| Einleitung mit Schrei in der Nacht | Einleitung mit einem konkreten Gegenstand oder einer Szene aus dem Abend vor dem Mord. |
| Sätze wie „Nichts ist, wie es scheint“ | Ein Satz, der eine konkrete Tatsache des Falls nennt. |

Die Beispielwerte in `schema.md` (Namen, Titel, Kurhaus) sind Platzhalter für das Format. Übernimm
sie nie.

## 5. Namen nur aus der gezogenen Liste

Die Würfelausgabe enthält eine Namensliste. Jede Figur, auch Opfer, Ermittler und nur erwähnte
Nebenfiguren, bekommt ihren Namen aus dieser Liste.

- Erfinde keine Namen dazu und ändere keine. Ausnahme: Ein Nachname, der in eine Familie passen
  muss, darf für Verwandte wiederholt werden.
- Ordne Namen nach Alter, Herkunft und Epoche zu, so wie sie klingen. Bei zu wenigen passenden
  Namen nimm die nächstbesten und lass die Figur mit der Unstimmigkeit leben (ein Spitzname, eine
  Erklärung im Profil).
- Keine zwei Figuren mit gleichem Anfangsbuchstaben im Vornamen, wenn die Liste genug hergibt. Am
  Tisch verwechselt man sonst.
- Verwende jeden Namen nur für eine Figur.

## 6. Warum das funktioniert

Eine Anweisung wirkt besser, wenn sie sagt, was zu tun ist, und warum. Deshalb steht in jeder Zeile
der Tabelle eine Alternative statt eines Verbots. Beispiele im Prompt werden gern kopiert. Deshalb
gibt es hier keine fertige Musterprämisse, und die Platzhalter in `schema.md` sind zu meiden. Ein
langer Auftrag verliert Details. Deshalb läuft die Prämisse als eigener, kurzer Schritt vor allem
anderen.

## Quellen

- Zhang u. a., „Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity“,
  https://arxiv.org/abs/2510.01171, und Prompt aus https://github.com/CHATS-lab/verbalized-sampling
- Anthropic, „Prompting best practices“ (sagen, was zu tun ist statt was nicht; Motivation
  mitgeben; Modelle konvergieren ohne Steuerung auf generische Ergebnisse):
  https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Murder Mystery Writer (zjoe2111, MIT-0), Namensregeln und abgenutzte Muster in `SKILL.md` und
  `common-mistakes.md`: https://clawhub.ai/zjoe2111/murder-mystery-writer
- Murder Mystery Creator (gongsunyanming, MIT-0), `writing-techniques.md` (Gegenstände statt
  Adjektive): https://clawhub.ai/gongsunyanming/murder-mystery-creator
- Apartment 304 (beschreiben statt verbieten; Vielfalt bleibt ohne Gegenmaßnahme ein offenes
  Problem): https://blog.apartment304.com/whodunit-llm-murder-mysteries
- M. Siebert (Modell greift auf frühere Hinweise im Kontext zurück, Vielfalt ausdrücklich fordern):
  https://msiebert.github.io/blog/harry-potter-murder-mystery
