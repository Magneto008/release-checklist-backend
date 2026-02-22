export type ReleaseStatus = "planned" | "ongoing" | "done";

export function computeStatus(steps: Record<string, boolean>): ReleaseStatus {
  const values = Object.values(steps);

  if (values.every((v) => !v)) return "planned";
  if (values.every((v) => v)) return "done";
  return "ongoing";
}
