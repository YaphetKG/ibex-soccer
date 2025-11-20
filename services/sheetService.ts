
/* 
  DEPRECATED: This service has been replaced by services/firebase.ts
  It is kept here temporarily for reference but is no longer used by the application.
*/

export const fetchFromSheet = async (action: string) => {
  console.warn("Sheet service is deprecated. Use Firebase.");
  return [];
};

export const postToSheet = async (action: string, payload: any) => {
  console.warn("Sheet service is deprecated. Use Firebase.");
  return false;
};
