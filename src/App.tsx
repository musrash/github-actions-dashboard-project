import { useEffect, useState } from "react";
import { fetchWorkflows, fetchWorkflowRuns } from "./api/github";
import "./App.css"; 

function App() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortedWorkflows, setSortedWorkflows] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "date">("date");

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const owner = "musrash";
        const repo = "github-actions-dashboard-project";

        // Workflows abrufen
        const workflowsData = await fetchWorkflows(owner, repo);

        // Für jeden Workflow den letzten Lauf abrufen
        const workflowsWithRuns = await Promise.all(
          workflowsData.map(async (workflow: any) => {
            const lastRun = await fetchWorkflowRuns(owner, repo, workflow.id);
            return { ...workflow, lastRun };
          })
        );

        setWorkflows(workflowsWithRuns);
      } catch (err) {
        setError("Fehler beim Laden der Workflows");
      } finally {
        setLoading(false);
      }
    };

    loadWorkflows();
  }, []);

  //  Sortierung basierend auf "sortBy"
  useEffect(() => {
    const sorted = [...workflows].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "date") {
        const dateA = a.lastRun ? new Date(a.lastRun.created_at).getTime() : 0;
        const dateB = b.lastRun ? new Date(b.lastRun.created_at).getTime() : 0;
        return dateB - dateA; 
      }
      return 0;
    });

    setSortedWorkflows(sorted);
  }, [workflows, sortBy]);

  return (
    <div className="app-container">
      <h1 className="title">GitHub Actions Workflows</h1>

      <div className="sort-container">
        <label>Sortieren nach: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "date")}>
          <option value="date">Datum</option>
          <option value="name">Name</option>
        </select>
      </div>

      {loading && <p className="loading-text">Lade Workflows...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="workflow-container">
        {sortedWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            className={`workflow-card ${
              loading
                ? "pending" 
                : workflow.lastRun?.conclusion === "success"
                ? "success"
                : workflow.lastRun?.conclusion === "failure"
                ? "failed"
                : "pending"
            }`}
          >
            <h2 className="workflow-name">{workflow.name}</h2>
            <p className="workflow-info"><strong>Status:</strong> {workflow.lastRun ? workflow.lastRun.conclusion || "Läuft..." : "Noch nicht ausgeführt"}</p>
            <p className="workflow-info"><strong>Event:</strong> {workflow.lastRun ? workflow.lastRun.event : "Unbekannt"}</p>
            <p className="workflow-info"><strong>Branch:</strong> {workflow.lastRun ? workflow.lastRun.head_branch : "Unbekannt"}</p>
            <p className="workflow-info"><strong>Gestartet von:</strong> {workflow.lastRun?.actor?.login || "Unbekannt"}</p>
            <p className="workflow-info"><strong>Datum:</strong> {workflow.lastRun ? new Date(workflow.lastRun.created_at).toLocaleString() : "Unbekannt"}</p>
            <a href={workflow.lastRun?.html_url} target="_blank" rel="noopener noreferrer" className="workflow-link">
              Zur Detailseite
            </a>
            {" | "}
            <a href={`https://github.com/musrash/github-actions-dashboard-project/actions`} target="_blank" rel="noopener noreferrer" className="workflow-link">
              Zur GitHub Actions Übersicht
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
