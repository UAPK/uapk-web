# Agentenvertrag — uapk-web (C-12)

Toolneutrale Hauptautoritaet dieser Cell. CLAUDE.md ergaenzt nur Claude-Spezifisches.

- **UAPK-VM-Cell** (A17). Portblock 9110-9119 ist auf der Projects VM nur RESERVIERT,
  damit ihn niemand neu vergibt — hier laeuft nichts unter diesen Ports.
- GCP-Projekt: `uapk-web-prod` · UAPK-Geschwister: keins
- **Dieses Repo ist OEFFENTLICH** und traegt die ausgelieferte Seite uapk.info.
  Nichts hineinlegen, was nicht oeffentlich sein darf: keine Implementierung, keine
  Manifeste, keine internen Strategiepapiere. Genau daran ist die Vorgaenger-Loesung
  gescheitert.
- Produktion laeuft aus `/srv/releases/<digest>/`, nie aus dem Worktree (Norm §4.2)
- Keine Cross-Cell-Pfade, keine geteilten Credentials (Norm §10)
- dotenv-Werte, Schluessel, Kundendaten: niemals committen
- Tests muessen vor jedem Release gruen sein; Deploy nur ueber CI-Artefakt
