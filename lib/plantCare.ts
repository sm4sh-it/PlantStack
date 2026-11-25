export type UrgencyLevel = "overdue" | "today" | "soon" | "ok";

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getDaysLeft(
  last: Date | string | null | undefined,
  interval: number | null | undefined
): number | null {
  if (!interval || !last) return null;
  const due = addDays(new Date(last), interval);
  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  return Math.round((dueDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function getUrgency(days: number | null): UrgencyLevel {
  if (days === null) return "ok";
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 2) return "soon";
  return "ok";
}
