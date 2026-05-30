const BUTTERBASE_BASE_URL =
  process.env.BUTTERBASE_BASE_URL?.replace(/\/$/, "") ??
  "https://api.butterbase.ai";

const HACKATHON_SUBMISSION_CODE =
  process.env.BUTTERBASE_SUBMISSION_CODE?.trim() || "build0530";

function butterbaseKey() {
  return process.env.BUTTERBASE_API_KEY?.trim() || null;
}

function butterbaseAppId() {
  return process.env.BUTTERBASE_APP_ID?.trim() || null;
}

function butterbaseEventsTable() {
  return process.env.BUTTERBASE_EVENTS_TABLE?.trim() || "foundry_events";
}

export function isButterbaseConfigured() {
  return Boolean(butterbaseKey() && butterbaseAppId());
}

export function hackathonSubmissionCode() {
  return HACKATHON_SUBMISSION_CODE;
}

export async function logButterbaseEvent(
  event: string,
  payload: Record<string, unknown>,
) {
  const key = butterbaseKey();
  const appId = butterbaseAppId();
  if (!key || !appId) return false;

  try {
    const res = await fetch(
      `${BUTTERBASE_BASE_URL}/v1/${encodeURIComponent(appId)}/${encodeURIComponent(
        butterbaseEventsTable(),
      )}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          submission_code: HACKATHON_SUBMISSION_CODE,
          payload,
          created_at: new Date().toISOString(),
        }),
      },
    );
    return res.ok;
  } catch (error) {
    console.warn("[butterbase] event log failed", error);
    return false;
  }
}
