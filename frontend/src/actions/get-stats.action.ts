import { urlApi } from "@/api/url.api";
import type { Stats } from "@/interfaces/stats.interface";

export const getStats = async (): Promise<Stats> => {
  const emptyStats = { clicks: 0, urls: 0 };

  try {
    const response = await urlApi.get("/stats");

    if (response.status !== 200) return emptyStats

    return response.data;
  } catch {
    return emptyStats
  }
};