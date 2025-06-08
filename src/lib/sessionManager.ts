// filepath: src/lib/sessionManager.ts
// セッション管理システム実装
import { idbGet, idbGetAll, idbPut, idbDelete } from './db';
import type { SessionData } from './db';
import { v4 as uuidv4 } from 'uuid';

export async function createSession(name: string): Promise<SessionData> {
  const session: SessionData = {
    id: uuidv4(),
    name,
    createdAt: new Date(),
  };
  await idbPut('sessions', session);
  return session;
}

export async function getSession(id: string): Promise<SessionData | undefined> {
  return idbGet('sessions', id);
}

export async function getAllSessions(): Promise<SessionData[]> {
  return idbGetAll('sessions');
}

export async function updateSession(id: string, patch: Partial<SessionData>): Promise<void> {
  const session = await idbGet('sessions', id);
  if (!session) throw new Error('Session not found');
  await idbPut('sessions', { ...session, ...patch });
}

export async function deleteSession(id: string): Promise<void> {
  await idbDelete('sessions', id);
}
