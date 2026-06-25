export type FamilyMember = {
  id: string;
  name: string;
  role: "admin" | "member";
  emoji: string;
};

export const FAMILY: FamilyMember[] = [
  { id: "sumit",        name: "Sumit",        role: "admin",  emoji: "👨" },
  { id: "aishwarya",   name: "Aishwarya",    role: "admin",  emoji: "👩" },
  { id: "dinesh",      name: "Dinesh",       role: "member", emoji: "👴" },
  { id: "chermanywati",name: "Chermanywati", role: "member", emoji: "👵" },
  { id: "mira",        name: "Mira",         role: "member", emoji: "👧" },
  { id: "komal",       name: "Komal",        role: "member", emoji: "👩‍💼" },
];

const PIN = "1234";
const KEY = "europa_user";

export function login(memberId: string, pin: string): boolean {
  if (pin !== PIN) return false;
  const member = FAMILY.find((m) => m.id === memberId);
  if (!member) return false;
  localStorage.setItem(KEY, JSON.stringify(member));
  return true;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getCurrentUser(): FamilyMember | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
