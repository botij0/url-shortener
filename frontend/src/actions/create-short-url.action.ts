import { urlApi } from "@/api/url.api";
import type { urlResponse } from "@/interfaces/urlResponse.interface";

export const createShortUrl = async (longUrl: string): Promise<urlResponse | null> => {
  // TODO: handle error response.
  try {
    const response = await urlApi.post("/url", { longUrl });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
