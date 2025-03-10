import { useEffect, useState } from "react";
import { fetchWorkflows, fetchWorkflowRuns } from "./api/github";
import "./App.css";

function App() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortedWorkflows, setSortedWorkflows] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [favorites, setFavorites] = useState<number[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const owner = "musrash";
        const repo = "github-actions-dashboard-project";

        const workflowsData = await fetchWorkflows(owner, repo);

        const workflowsWithRuns = await Promise.all(
          workflowsData.map(async (workflow: any) => {
            const lastRun = await fetchWorkflowRuns(owner, repo, workflow.id);
            return lastRun ? { ...workflow, lastRun } : null;
          })
        );

        setWorkflows(workflowsWithRuns.filter(Boolean)); // Entfernt Workflows ohne Runs
      } catch (err) {
        setError("Fehler beim Laden der Workflows");
      } finally {
        setLoading(false);
      }
    };

    loadWorkflows();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const sorted = [...workflows].sort((a, b) => {
      const indexA = favorites.indexOf(a.id);
      const indexB = favorites.indexOf(b.id);

      if (indexA !== -1 && indexB !== -1) {
        return indexB - indexA;
      } else if (indexA !== -1) {
        return -1;
      } else if (indexB !== -1) {
        return 1;
      }

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
  }, [workflows, sortBy, favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id);
      } else {
        return [id, ...prev];
      }
    });
  };

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
              workflow.lastRun?.conclusion === "success"
                ? "success"
                : workflow.lastRun?.conclusion === "failure"
                ? "failed"
                : "pending"
            }`}
          >
            <h2 className="workflow-name">
              {workflow.name}
              <button 
                onClick={() => toggleFavorite(workflow.id)} 
                className={`favorite-button ${favorites.includes(workflow.id) ? "favorite" : ""}`}
              >
                {favorites.includes(workflow.id) ? "★" : "☆"}
              </button>
            </h2>
            {workflow.lastRun && (
              <>
                <p className="workflow-info"><strong>Status:</strong> {workflow.lastRun.conclusion || "load..."}</p>
                <p className="workflow-info"><strong>Event:</strong> {workflow.lastRun.event}</p>
                <p className="workflow-info"><strong>Branch:</strong> {workflow.lastRun.head_branch}</p>
                <p className="workflow-info"><strong>Gestartet von:</strong> {workflow.lastRun?.actor?.login}</p>
                <p className="workflow-info"><strong>Datum:</strong> {new Date(workflow.lastRun.created_at).toLocaleString("de-DE", { 
                   day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"  })}</p>
                <a href={workflow.lastRun?.html_url} target="_blank" rel="noopener noreferrer" className="workflow-link">
                  Zur Detailseite
                </a>
                {" | "}
                <a href={`https://github.com/musrash/github-actions-dashboard-project/actions`} target="_blank" rel="noopener noreferrer" className="workflow-link">
                  Zur GitHub Actions Übersicht
                </a>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;