// Per-browser settings of the site: theme, token names, address book. Storage can be missing (private windows,
// blocked site data), so every read and write is guarded and the site works without it.
import { useState } from 'react';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/** React state that is saved in localStorage. */
export function useLocal<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback));
  const set = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Not saved: the value lasts until the page closes.
    }
  };
  return [value, set] as const;
}

export type Theme = 'system' | 'light' | 'dark';
// The page always has a data-theme. For 'system' it follows the OS setting, also when the OS setting changes.
const systemDark = matchMedia('(prefers-color-scheme: dark)');
let chosen: Theme = 'system';
export const applyTheme = (theme: Theme) => {
  chosen = theme;
  document.documentElement.dataset.theme = theme === 'system' ? (systemDark.matches ? 'dark' : 'light') : theme;
};
systemDark.addEventListener('change', () => applyTheme(chosen));
applyTheme(read<Theme>('theme', 'system'));

/** A saved address. `kind` comes from the address prefix. */
export type Contact = { name: string; address: string };
export const addressKind = (address: string) => {
  const m = /^mn_(addr|shield-addr|dust)_([a-z0-9-]+)1/.exec(address.trim());
  return m ? { kind: ({ addr: 'unshielded', 'shield-addr': 'shielded', dust: 'dust' } as const)[m[1] as 'addr'], network: m[2]! } : null;
};
