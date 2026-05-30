type EvermindMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const EVERMIND_BASE_URL =
  process.env.EVERMIND_BASE_URL?.replace(/\/$/, "") ?? "https://api.evermind.ai";

function evermindKey() {
  return process.env.EVERMIND_API_KEY?.trim() || null;
}

function defaultEvermindUserId() {
  return process.env.EVERMIND_USER_ID?.trim() || "foundry-hackathon-demo";
}

export function isEvermindConfigured() {
  return Boolean(evermindKey());
}

function resolveUserId(userId?: string | null) {
  const trimmed = userId?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : defaultEvermindUserId();
}

function formatMemoryHits(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const root = data as Record<string, unknown>;
  const items = Array.isArray(root.results)
    ? root.results
    : Array.isArray(root.memories)
      ? root.memories
      : Array.isArray(root.data)
        ? root.data
        : null;
  if (!items?.length) return "";
  const lines = items.slice(0, 6).map((item, i) => {
    if (!item || typeof item !== "object") return `${i + 1}. (memory)`;
    const row = item as Record<string, unknown>;
    const text =
      (typeof row.content === "string" && row.content) ||
      (typeof row.episode === "string" && row.episode) ||
      (typeof row.text === "string" && row.text) ||
      JSON.stringify(row).slice(0, 280);
    return `${i + 1}. ${text}`;
  });
  return lines.join("\n");
}

export async function searchEvermindMemories(
  query: string,
  userId?: string | null,
) {
  const key = evermindKey();
  if (!key || !query.trim()) return "";

  try {
    const res = await fetch(`${EVERMIND_BASE_URL}/api/v1/memories/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query.slice(0, 2000),
        filters: { user_id: resolveUserId(userId) },
        method: "hybrid",
        memory_types: [
          "episodic_memory",
          "profile",
          "agent_memory",
          "agent_case",
          "agent_skill",
        ],
        top_k: 6,
      }),
    });
    if (!res.ok) return "";
    const data = (await res.json()) as unknown;
    const formatted = formatMemoryHits(data);
    return formatted || JSON.stringify(data).slice(0, 4000);
  } catch (error) {
    console.warn("[evermind] memory search failed", error);
    return "";
  }
}

export async function rememberWithEvermind(
  sessionId: string,
  messages: EvermindMessage[],
  userId?: string | null,
) {
  const key = evermindKey();
  const clean = messages
    .map((message) => ({
      role: message.role,
      timestamp: Date.now(),
      content: message.content.slice(0, 4000),
    }))
    .filter((message) => message.content.trim().length > 0);

  if (!key || clean.length === 0) return false;

  try {
    const res = await fetch(`${EVERMIND_BASE_URL}/api/v1/memories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: resolveUserId(userId),
        session_id: sessionId.slice(0, 200),
        messages: clean,
        async_mode: true,
      }),
    });
    return res.ok;
  } catch (error) {
    console.warn("[evermind] memory write failed", error);
    return false;
  }
}

/** Persist a hackathon-visible milestone (AR, checkout, workspace) into EverOS. */
export async function recordEvermindMilestone(
  sessionId: string,
  summary: string,
  userId?: string | null,
) {
  return rememberWithEvermind(
    sessionId,
    [{ role: "user", content: summary }],
    userId,
  );
}
