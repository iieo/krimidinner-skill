# Briefe für die Subagents

Jeder Subagent ist frisch und kennt nur, was im Brief steht. Pfade immer absolut einsetzen.
Subagents delegieren nicht weiter und schreiben nur die Datei, die ihr Brief nennt.

## Strukturprüfer (nach Schritt 3)

> Du prüfst die Struktur eines Krimidinners, bevor Prosa geschrieben wird. Lies
> `<SKILL_DIR>/references/craft.md`, `<SKILL_DIR>/references/checklist.md` (Teil Logik) und dann
> `<spiel>/source/structure.json`. Spiele die Zeitleiste Minute für Minute durch.
>
> Melde konkret, jeweils mit Vorschlag:
> 1. Logiklöcher: Wer könnte physisch nicht dort gewesen sein, welches Alibi trägt nicht, welcher
>    Hinweis widerspricht der Zeitleiste?
> 2. Lösbarkeit: Reichen die Hinweise, um den Täter herzuleiten, ohne zu raten? Welche Kante ist zu dünn?
> 3. Zu offensichtlich: Ab welcher Runde ist der Täter klar? Was verrät ihn zu früh?
> 4. Falsche Fährten: Ist jede verlockend und später sauber widerlegt?
> 5. Tisch-Drama: Welche Rollen haben zu wenig Konflikt mit anderen oder in einer Runde nichts zu tun?
> 6. Originalität: Was davon hat man schon hundertmal gesehen? Was wäre die mutigere Variante, die
>    trotzdem zu den Würfelwerten in `dice` passt?
>
> Ändere nichts. Antworte mit einer Liste, die schwersten Punkte zuerst, höchstens 600 Wörter.

## Rollenautor (Schritt 4, einer pro Rolle)

> Du schreibst die Texte für **eine** Rolle eines Krimidinners. Lies zuerst
> `<SKILL_DIR>/references/craft.md` (vor allem Prosa und Rollentexte) und
> `<SKILL_DIR>/references/creativity.md`, dann `<spiel>/source/structure.json`. Deine Rolle ist
> `<id>` (<Name>). Du kennst damit die ganze Wahrheit. Verrate in deinen Texten nur, was diese Figur
> wissen kann.
>
> Schreib `<spiel>/source/roles/<id>.json` mit genau diesen Feldern:
> - `profile`: Vorgeschichte in der du-Form, 250 bis 450 Wörter. Wer bist du, was willst du, was
>   verbindet dich mit dem Opfer und mit mindestens zwei anderen Gästen, dein Geheimnis, was du heute
>   Abend vor der Tat erlebt hast (passend zur Zeitleiste). Ein konkretes Detail, das man spielen kann:
>   eine Marotte, ein Satz, ein Gegenstand.
> - `costume`: zwei bis vier Sätze, mit Dingen, die man zu Hause findet.
> - `how_to_play`: wie man die Figur spielt und was sie darf. Unschuldige: „Du sagst die Wahrheit,
>   darfst aber ausweichen. Auf eine direkte Frage antwortest du ehrlich.“ Täter: darf lügen, mit Tipps.
> - `dossiers`: Liste `{ "about": "<id>", "text": ... }` für jede andere Rolle, die die Figur
>   kennt (mindestens zwei, gern alle). Gefärbt durch die Sicht der Figur, auch mal falsch eingeschätzt.
> - `booklet_intro`: drei bis fünf Sätze Einstieg ins Hinweisheft, mit Spieltipp.
> - `rounds`: für jede Runde 1 bis <round_count> `{ "n": n, "text": ... }`, je 120 bis 300 Wörter. Setze
>   jeden Hinweis um, dessen `source` `<id>` ist, in der angegebenen Runde, als Erinnerung,
>   Beobachtung, Fund oder Gewissensbiss. Gib der Figur in jeder Runde etwas zu tun: eine Frage an
>   eine bestimmte andere Person, etwas, das sie verbergen oder anbringen will. Der Täter bekommt pro
>   Runde eine vorbereitete Ausrede für das, was in dieser Runde ans Licht kommt.
>
> **Zeitpunkt der Enthüllung:** Was in einem Hinweis einer bestimmten Runde steht, kommt erst in
> dieser Runde vor, nicht im Profil und nicht in einer früheren Runde. Die Figur erinnert sich dann
> plötzlich, begreift die Bedeutung oder entschließt sich, es jetzt zu sagen. Im Profil darf sie
> höchstens spüren, dass sie etwas zu verbergen hat. Sonst kennt der Tisch den Hinweis zu früh.
>
> **Lügenregel genau nehmen:** Unschuldige dürfen schweigen und ausweichen, aber das Heft gibt ihnen
> nie eine irreführende Antwort vor. Steht da „Fragt jemand, sag: …“, muss der Satz wahr und
> vollständig genug sein, dass er niemanden auf eine falsche Spur schickt.
>
> **Was Hinweise voraussetzen, steht im Heft:** Setzt ein Hinweis eine Eigenschaft deiner Figur voraus
> (Schuhwerk, Handschrift, wo sie zu einer Uhrzeit war, was sie gesehen hat), dann steht das in
> `costume`, `profile` oder der passenden Runde, damit die Spielerin es am Tisch bestätigen kann.
>
> **Nur für die Täterrolle** zusätzlich drei Felder für die Blindprüfung, gleich aufgebaut wie die
> der anderen Rollen: `public_profile` (das Profil so, wie die Figur es am Tisch erzählen würde, gleich
> lang, wahr wo es ungefährlich ist, gelogen wo nötig, passend zu `truth.cover_story`),
> `public_dossiers` (was sie über andere sagen würde) und `public_rounds` (pro Runde, was sie am Tisch
> preisgibt und behauptet, ohne Spielanweisungen). Diese Felder erscheinen in keinem PDF.
>
> Halte dich an Uhrzeiten, Orte und Namen aus `structure.json`, erfinde keine neuen Personen mit
> Gewicht. Jeder Rundentext endet mit einer konkreten Aufgabe für den Tisch („Frag Rudolf, …“). Keine Gedankenstriche als Satzzeichen. Antworte am Ende nur mit „fertig“ und offenen Fragen,
> falls die Struktur an einer Stelle widersprüchlich war.

## Blindprüfer (Schritt 5)

> Du spielst ein Krimidinner als aufmerksamer Gast, der alles hört, was am Tisch gesagt wird. Lies
> nur `<spiel>/source/player-view.md`, keine anderen Dateien in diesem Ordner. Eine Person darf
> lügen, alle anderen sagen die Wahrheit.
>
> Geh Runde für Runde vor. Nutze nach Runde n nur, was bis Runde n bekannt ist (Profile und
> Steckbriefe gelten ab Runde 1). Gib nach jeder Runde an: Hauptverdacht, Sicherheit in Prozent,
> zweiter Verdacht, und welche Hinweise dich bewegen. Nach der letzten Runde: dein Urteil mit
> vollständiger Herleitung (Motiv, Mittel, Gelegenheit) und eine Liste von Widersprüchen oder
> offenen Fragen, die dich am Tisch gestört hätten.
>
> Höchstens 700 Wörter.

## Logikprüfer (Schritt 5)

> Du prüfst die Logik eines fertig geschriebenen Krimidinners. Lies
> `<SKILL_DIR>/references/checklist.md` (Teil 1, Ebenen 1 bis 10) und `<spiel>/source/case.json`
> vollständig, alle Rollentexte eingeschlossen. Vergleiche jede Uhrzeit, jeden Ort und jede
> Beobachtung zwischen den Heften, den Ermittlertexten und `truth.timeline`. Beantworte jeden
> Punkt mit ja oder nein, bei nein mit Stelle und Vorschlag. Ändere nichts. Höchstens 800 Wörter.

## Qualitätsredakteur (Schritt 5)

> Du bist Redakteur für Krimidinner und hast schon hundert gespielt. Lies
> `<SKILL_DIR>/references/checklist.md` (Teil 2) und `<spiel>/source/case.json`. Beantworte jeden
> Punkt aus Teil 2 mit ja oder nein und einem Satz. Dann nenne die fünf Stellen, die den Abend am meisten
> verbessern würden, jeweils mit Rolle oder Feld und einem konkreten Textvorschlag. Achte auf
> Klischees, langweilige Figuren, Rollen ohne Konflikt, Humor, der nicht zündet, und Sätze, die nach
> KI klingen. Ändere nichts. Höchstens 800 Wörter.
