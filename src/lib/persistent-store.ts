"use client";

import { useSyncExternalStore } from "react";

/** A localStorage-backed value usable with useSyncExternalStore (SSR-safe, cross-tab synced). */
export function createPersistentStore<T>(key: string, initial: T) {
  let cache: T = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) cache = JSON.parse(raw) as T;
    } catch {
      /* storage blocked or corrupt — fall back to initial */
    }
  }

  function emit() {
    listeners.forEach((l) => l());
  }

  function set(next: T | ((prev: T) => T)) {
    load();
    cache = typeof next === "function" ? (next as (prev: T) => T)(cache) : next;
    try {
      window.localStorage.setItem(key, JSON.stringify(cache));
    } catch {
      /* ignore quota / private mode */
    }
    emit();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      loaded = false;
      load();
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function get() {
    load();
    return cache;
  }

  function useValue() {
    return useSyncExternalStore(subscribe, get, () => initial);
  }

  return { get, set, useValue };
}
