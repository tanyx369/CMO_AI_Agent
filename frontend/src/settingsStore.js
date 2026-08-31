import { useSyncExternalStore } from 'react'
import { DEFAULT_MODELS } from './modelData'

/**
 * App-wide settings — the user profile and the AI model chosen per content type.
 *
 * A module-level store rather than context: the Content Generator needs to read
 * the selected model from inside `contentApi.js`, which is a plain module and
 * cannot use hooks. Components subscribe with the hooks at the bottom.
 *
 * Persisted to localStorage so choices survive a reload. Every access is wrapped
 * — private windows and blocked site data make it throw.
 */

const STORAGE_KEY = 'apex.settings.v1'

const DEFAULT_PROFILE = {
  name: 'Sarah Chen',
  role: 'Chief Marketing Officer',
  email: 'sarah.chen@apexwear.com',
  organization: 'APEX Wearables',
  timezone: 'Asia/Kuala_Lumpur',
  initials: 'SC',
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null // private window, blocked storage, or corrupt JSON
  }
}

const stored = readStored()

let state = {
  profile: { ...DEFAULT_PROFILE, ...(stored?.profile || {}) },
  // Unknown keys from an older build are ignored; missing ones fall back.
  models: { ...DEFAULT_MODELS, ...(stored?.models || {}) },
}

const listeners = new Set()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage unavailable — settings still work for this session */
  }
}

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/* ------------------------------------------------------------------ */
/* Reads — safe to call from plain modules                             */
/* ------------------------------------------------------------------ */

export const getSettings = () => state
export const getProfile = () => state.profile
export const getModels = () => state.models

/** The model id selected for one content type. Email shares the text model. */
export function getModelFor(type) {
  const group = type === 'email' ? 'text' : type
  return state.models[group] || DEFAULT_MODELS[group] || null
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

export function setModel(group, modelId) {
  if (state.models[group] === modelId) return
  state = { ...state, models: { ...state.models, [group]: modelId } }
  persist()
  emit()
}

export function updateProfile(patch) {
  state = { ...state, profile: { ...state.profile, ...patch } }
  persist()
  emit()
}

export function resetModels() {
  state = { ...state, models: { ...DEFAULT_MODELS } }
  persist()
  emit()
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

export function useSettings() {
  return useSyncExternalStore(subscribe, getSettings, getSettings)
}

export function useProfile() {
  return useSyncExternalStore(subscribe, getProfile, getProfile)
}

export function useModels() {
  return useSyncExternalStore(subscribe, getModels, getModels)
}
