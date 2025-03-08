Was genau ist von dir verlangt?

1 Ziel:
Erstellen einer Index-Ansicht mit Karten für GitHub Actions Workflows, die wichtige Informationen auf einen Blickzeigt.
2 Features, die zwingend umgesetzt werden müssen (MVP – Minimum Viable Product)
Eine Übersichtsseite mit Karten (Cards) für jede Workflow-Aktion in einem GitHub-Repository.

Jede Karte enthält folgende Infos:
Name des Workflows
Status des letzten Workflow-Laufs (Erfolgreich oder Fehlgeschlagen)
Event, das den Workflow ausgelöst hat (PR, Merge, manuelle Ausführung + Name der Person)
Status-Farbe (Rot = Fehler, Grün = Erfolg)
Branch, auf dem der Workflow ausgeführt wurde

Sortiermöglichkeiten:
Nach Name
Nach Datum des letzten Laufs

Links:
Zur Detailseite des Workflow-Runs
Zur allgemeinen Workflow-Übersichtsseite in GitHub

3 Usability-Features (Optional, aber erwünscht für eine bessere Nutzung)
Favoriten-Funktion:
Workflows können mit einem Stern markiert werden und erscheinen dann immer oben in der Liste.
Filter-Funktionen:
Nach "Run by" (wer hat es gestartet?)
Nach Ergebnis (Erfolgreich/Fehlgeschlagen)
Textsuche (z. B. „Re“ würde „Robert Redford“ und „Redeploy Prod“ matchen)
Multi-Repo-Support:
Möglichkeit, zwischen Repositories zu wechseln (Dropdown-Menü)
Gesamtansicht aller Workflows aus verschiedenen Repos in einer einzigen Liste
Bereitstellung im Internet:
Gehostet über GitHub Pages.  POWER 
Automatische Deployments via GitHub Actions

4 Bonus-Features (für extra Learning & Verbesserung)
Falls du mehr lernen willst, kannst du weitere Features umsetzen:
Responsive Design für Desktop & Mobile
Mehrsprachigkeit (i18n) → Englisch/Deutsch
Toast-Benachrichtigungen für abgeschlossene Builds
Progressive Web App (PWA)
System-Benachrichtigungen für beendete oder fehlgeschlagene Workflows
OAuth-Login & Zugriff auf private Repos
Linting (Code-Qualität sichern)
Unit- & E2E-Tests für Stabilität

