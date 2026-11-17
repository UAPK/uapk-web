---
title: UAPK Value Standard (DE)
description: Vergütungsstandard für KI-getragene Beratungsleistungen — Token × Nützlichkeit × Expertise (Vertragsbaustein v1)
sidebar_position: 55
---

# UAPK Value — Vergütungsstandard (Vertragsbaustein v1)

**Version:** 1.0 (17.11.2026) · **Sprache:** Deutsch (Vertragssprache) ·
**Einordnung:** Baustein für Beratungs-, Wissens-, Strategie- und Investigation-Leistungen.
Ersetzt die Stundenvergütung. Value Units sind reine Abrechnungseinheiten — kein Krypto-Asset,
kein Wertpapier, keine Blockchain.

---

## Präambel (Warum dieser Standard)

Die Vergütung nach Stunden misst in der KI-Welt den falschen Wert: nicht die Zeit des
Menschen, sondern das Ergebnis der Arbeit ist der Wert. Gleichzeitig bleibt die Abrechnung
maximal transparent: Jede Token-Einheit ist nachvollziehbar, jeder Faktor ist veröffentlicht.
Erfahrung und Seniorität spiegeln sich im Expertisefaktor; der Nutzen für den Auftraggeber
spiegelt sich im Nützlichkeitsfaktor — inklusive eines Erfolgsanteils.

## § 1 Vergütungsformel

Die Vergütung beträgt:

> **Vergütung = U × P × N × E**

| Bestandteil | Bedeutung | Wert |
|---|---|---|
| **U** | Anzahl **Value Units** (Abrechnungseinheit) | verbrauchte Token des Auftrags ÷ 10.000 |
| **P** | Unit-Grundpreis | 1 EUR je Value Unit |
| **N** | Nützlichkeitsfaktor | 1 / 5 / 10 (§ 3) |
| **E** | Expertisefaktor | 1 (Freundschaftspreis) bzw. veröffentlichte Formel (§ 5) |

**1 Value Unit = 10.000 Token** des Auftragsdurchlaufs.

Der Unit-Grundpreis preist nicht Roh-Compute, sondern das Gesamtsystem: spezialisiertes
Setup, Qualitätssicherung, Haftung und Gewähr.

**Beispielrechnung:** 2.000.000 Token = 200 Value Units; N = 5, E = 1 (Freundschaftspreis)
→ **200 × 1 × 5 × 1 = 1.000 EUR**.

## § 2 Token-Erfassung, Budget und Transparenz

1. **Erfassung:** Die Token werden am vom Dienstleister betriebenen Modell/Setup erfasst
   (je Auftragsschritt: Recherche, Analyse, Verdichtung, Qualitätssicherung).
   **Abrechnungsbasis sind Input- und Output-Token je API-Aufruf**; Cache-Lesungen und
   Cache-Erstellungen werden im Ledger erfasst, aber nicht abgerechnet.
2. **Token-Budget:** Vor Auftragsbeginn wird ein Budget (Obergrenze in Value Units)
   vereinbart. Verbrauch über Budget hinaus wird nur mit Freigabe des Auftraggebers
   vergütet. (Schutz vor Ineffizienz: Über das vereinbarte Budget hinaus erhöht mehr Token
   ohne Mehrnutzen die Vergütung nicht.)
3. **Ledger:** Der Auftrag erhält ein Ledger (Auftragsschritt, Zeitpunkt, Token). Es liegt
   der Rechnung bei.
4. **Nachweis:** Das Ledger wird vom Dienstleister signiert; die Integrität wird über
   Hash-Anker in der Audit-Kette des Betriebs nachgewiesen (off-chain).

## § 3 Nützlichkeitsfaktor N

| Stufe | Definition |
|---|---|
| **1** | Ergebnis bringt für den Auftrag nichts oder wenig |
| **5** | Ordentliches Ergebnis mit gutem Nutzen für den Auftrag |
| **10** | Herausragendes Ergebnis, das ohne das spezialisierte Setup in vergleichbarer Qualität nicht erreichbar gewesen wäre |

**Verfahren:** Der Dienstleister schlägt die Stufe mit schriftlicher Begründung vor; das
Einvernehmen mit dem Auftraggeber ist anzustreben. **Bei Nichteinigung wird vorläufig nach
N = 5 abgerechnet**; die Differenz wird nach Einigung oder Entscheidung (§ 7) nachgezahlt
oder erstattet.

**Objektivierung:** Referenz ist der periodische Setup-Capability-Score (§ 4). Er
dokumentiert, was Standard-Werkzeuge am selben Aufgabentyp leisten — und damit, wann ein
Ergebnis „ohne dieses Setup nicht möglich" war.

## § 4 Benchmark: Setup-Capability-Score (Standard)

1. In regelmäßigen Abständen werden repräsentative Aufgabensuiten des Leistungsspektrums
   parallel ausgeführt: (a) auf dem spezialisierten Setup des Dienstleisters, (b) auf
   Standard-Abonnements allgemeiner KI-Dienste und lokalen offenen Modellen.
2. Das Vergleichsprotokoll (Aufgabe, Ergebnisqualität, Aufwand) wird dokumentiert und auf
   Anfrage offengelegt; daraus abgeleitet: der **Setup-Capability-Score**.
3. **Kein Mandats-Replay:** Die tatsächlichen Prompts und Inhalte eines Auftrags werden
   ohne ausdrückliche Einwilligung des Auftraggebers nicht an Drittmodelle übermittelt
   (Vertraulichkeit; bei Rechtsmandaten § 203 StGB; DSGVO bei personenbezogenen Daten).
   Ein Replay mit Einwilligung ist zulässig und wird gesondert vergütet.

## § 5 Expertisefaktor E — veröffentlichte Formel

Der Expertisefaktor wird nicht selbst gesetzt, sondern ergibt sich aus einer
**veröffentlichten Formel** mit verifizierbaren CV-Bestandteilen:

> **E = E\_Jahre × E\_Spezialisierung × E\_Akademie × E\_GoodWill**

| Faktor | Ausprägungen |
|---|---|
| **E\_Jahre** | 1 + 0,35 × Berufsjahre nach Qualifikation (PQE) |
| **E\_Spezialisierung** | 1 = generalistisch · 3 = fokussiert · 8 = selten und stark nachgefragt |
| **E\_Akademie** | 1 = keine · 1,5 = Aufbaustudium/MBA · 2,5 = Promotion/Professur |
| **E\_GoodWill** | 1–5, abgeleitet aus Marktdaten (Wiederbeauftragungsrate, Empfehlungsquote, abgeschlossene Engagements) — keine Selbstauskunft |

- **Freundschaftspreis:** E = 1 (ausdrücklich; kein Honorar-/Anwaltsfaktor).
- **Reguläre Kunden:** E ≥ 2 (Untergrenze).
- Die Parameter sind die **Erstkalibrierung v1**; Anpassungen werden veröffentlicht. Je
  Experte wird eine Faktor-Herkunft (CV-Nachweis) offengelegt.

## § 6 Top-up

Der Auftraggeber kann freiwillig einen individuellen Zuschlag („Top-up") erklären, wenn der
Output ihm — unabhängig vom Benchmark — besonders geholfen hat. Ein Top-up begründet keinen
Anspruch künftiger Vergütung und keinen Präzedenzfall.

## § 7 Einigung und Arbitration

1. **Stufe 1:** Vorlage von Ledger und Begründung; Erörterung.
2. **Stufe 2:** Bleibt Streit über N oder die Token-Zahl, entscheidet ein einvernehmlich
   benannter unabhängiger Sachverständiger (Schiedsgutachten). Bis zur Entscheidung gilt
   die vorläufige Abrechnung nach § 3.

## § 8 Abgrenzungen, Rechtliches

- Reine Beratungsleistungen: Preiskopffreiheit; die Parteien vereinbaren die Vergütung frei.
- **Gerichtsbezogene Mandate:** Es bleibt beim RVG; ein Erfolgshonorar wird nur innerhalb
  der Grenzen des § 4a RVG vereinbart. Bei gerichtsbezogener Vertretung gilt dieser
  Baustein nicht ohne gesonderte Prüfung.
- Sehr hohe Gesamtfaktoren sind auf standesrechtliche Angemessenheit zu prüfen, soweit
  berufsrechtliche Grenzen eingreifen.
- „Value Units" sind keine Kryptowerte; dieser Standard nutzt keine Blockchain und keinen
  Monetarisierungstoken.

---

*Dieser Baustein kann für eigene Engagements übernommen und angepasst werden. Die formale
Rechnung erfolgt über den jeweils beauftragten Dienstleister.*
