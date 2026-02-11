import { urlApi } from "@/api/url.api";
import type { urlResponse } from "@/interfaces/urlResponse.interface";

export const createShortUrl = async (longUrl: string): Promise<urlResponse | null> => {
  try {
    const response = await urlApi.post("/url", { longUrl });

    if (response.status !== 201) return null;

    return response.data;
  } catch {
    return null;
  }
};
