import { useEffect, useState } from "react";
import { fetchWorkflows, fetchWorkflowRuns } from "./api/github";

function App() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortedWorkflows, setSortedWorkflows] = useState<any[]>([]); // Neuer State für sortierte Workflows
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

  // 🔹 useEffect für Sortierung - wird ausgeführt, wenn sich "sortBy" ändert
  useEffect(() => {
    const sorted = [...workflows].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "date") {
        const dateA = a.lastRun ? new Date(a.lastRun.created_at).getTime() : 0;
        const dateB = b.lastRun ? new Date(b.lastRun.created_at).getTime() : 0;
        return dateB - dateA; // Immer Neueste zuerst
      }
      return 0;
    });

    setSortedWorkflows(sorted); // Aktualisiere die sortierte Liste
  }, [workflows, sortBy]); // ⬅️ useEffect wird getriggert, wenn sich sortBy ändert

  return (
    <div>
      <h1>GitHub Actions Workflows</h1>

      {/* 🔹 Sortier-Steuerung */}
      <div>
        <label>Sortieren nach: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "date")}>
          <option value="date">Datum</option>
          <option value="name">Name</option>
        </select>
      </div>

      {loading && <p>Lade Workflows...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gap: "10px" }}>
        {sortedWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: workflow.lastRun?.conclusion === "success" ? "#d4edda" : "#f8d7da",
            }}
          >
            <h2>{workflow.name}</h2>
            <p><strong>Status:</strong> {workflow.lastRun ? workflow.lastRun.conclusion : "Noch nicht ausgeführt"}</p>
            <p><strong>Event:</strong> {workflow.lastRun ? workflow.lastRun.event : "Unbekannt"}</p>
            <p><strong>Branch:</strong> {workflow.lastRun ? workflow.lastRun.head_branch : "Unbekannt"}</p>
            <p><strong>Gestartet von:</strong> {workflow.lastRun?.actor?.login || "Unbekannt"}</p>
            <p><strong>Datum:</strong> {workflow.lastRun ? new Date(workflow.lastRun.created_at).toLocaleString() : "Unbekannt"}</p>
            <a href={workflow.lastRun?.html_url} target="_blank" rel="noopener noreferrer">
              Zur Detailseite
            </a>
            {" | "}
            <a href={`https://github.com/musrash/github-actions-dashboard-project/actions`} target="_blank" rel="noopener noreferrer">
              Zur GitHub Actions Übersicht
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
