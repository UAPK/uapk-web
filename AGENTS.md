# Agentenvertrag — uapk-web (C-12)

Toolneutrale Hauptautoritaet dieser Cell. CLAUDE.md ergaenzt nur Claude-Spezifisches.

- Portblock: 9110-9119 · GCP-Projekt: `uapk-web-prod` · UAPK-Geschwister: keins
- Produktion laeuft aus `/srv/releases/<digest>/`, nie aus dem Worktree (Norm §4.2)
- Keine Cross-Cell-Pfade, keine geteilten Credentials (Norm §10)
- dotenv-Werte, Schluessel, Kundendaten: niemals committen
- Tests muessen vor jedem Release gruen sein; Deploy nur ueber CI-Artefakt
