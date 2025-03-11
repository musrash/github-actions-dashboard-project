const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export async function fetchWorkflows(owner: string, repo: string) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API Fehler: ${response.statusText}`);
  }

  const data = await response.json();
  return data.workflows; // Gibt eine Liste von Workflows zurück
}

export async function fetchWorkflowRuns(owner: string, repo: string, workflowId: number) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs?per_page=1`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API Fehler: ${response.statusText}`);
  }

  const data = await response.json();
  return data.workflow_runs.length > 0 ? data.workflow_runs[0] : null;
}

export async function fetchWorkflowJobs(owner: string, repo: string, runId: number) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/jobs`
  );
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Job-Daten");
  }
  return await response.json();
}
