
import { TeamEvent, HistoryItem } from "../types";

const STORAGE_KEY = 'IBEX_SHEET_URL';

export const getSheetUrl = () => localStorage.getItem(STORAGE_KEY) || '';
export const setSheetUrl = (url: string) => localStorage.setItem(STORAGE_KEY, url);

interface SheetResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
}

export const fetchFromSheet = async (action: 'getEvents' | 'getHistory'): Promise<any[] | null> => {
  const url = getSheetUrl();
  if (!url) return null;

  try {
    const response = await fetch(`${url}?action=${action}`);
    const json = await response.json();
    return Array.isArray(json) ? json : null;
  } catch (e) {
    console.error("Failed to fetch from sheet", e);
    return null;
  }
};

export const postToSheet = async (action: 'addEvent' | 'addHistory', payload: any): Promise<boolean> => {
  const url = getSheetUrl();
  if (!url) return false;

  try {
    // We use text/plain to avoid CORS preflight options request issues with simple GAS deployments
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action, ...payload })
    });
    return true;
  } catch (e) {
    console.error("Failed to post to sheet", e);
    return false;
  }
};
