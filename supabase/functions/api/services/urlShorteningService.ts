import { randomInt } from "node:crypto";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export class UrlShorteningService {
  private readonly _supabaseClient;
  private readonly _shortenedLength = 7;
  private readonly _alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private readonly _baseEdgeFunctionUrl = Deno.env.get('BASE_EDGE_FUNCTION_URL');

  constructor() {
    const supabaseProjectUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseProjectUrl == undefined) {
      throw new Error("SUPABASE_URL is undefined");
    }

    if (supabaseServiceRoleKey == undefined) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is undefined");
    }

    this._supabaseClient = createClient(
      supabaseProjectUrl,
      supabaseServiceRoleKey
    );
  }

  async shortenUrl(urlToShorten: string): Promise<string> {
    while (true) {
      let code = "";
      for (let i = 0; i < this._shortenedLength; i++) {
        const randomIndex = randomInt(this._alphabet.length);
        code += this._alphabet[randomIndex];
      }

      const isUnique = await this.isCodeUnique(code);
      if (isUnique) {
        const shortUrl = `${this._baseEdgeFunctionUrl}/${code}`;

        const { error } = await this._supabaseClient
          .from("urls")
          .insert([{ code, long_url: urlToShorten, short_url: shortUrl }])
          .single();

        if (error) {
          console.error("Error inserting URL:", error);
          throw new Error("Failed to insert URL");
        }

        return shortUrl;
      }
    }
  }

  private async isCodeUnique(code: string): Promise<boolean> {
    const { data, error } = await this._supabaseClient
      .from("urls")
      .select("code")
      .eq("code", code)
      .maybeSingle();

    if (error) {
      console.error("Error checking code uniqueness:", error);
      throw new Error("Failed to check code uniqueness");
    }

    return !data;
  }

  async getLongUrl(code: string): Promise<string | null> {
    const { data, error } = await this._supabaseClient
      .from("urls")
      .select("long_url")
      .eq("code", code)
      .maybeSingle();

    if (error || !data) {
      console.error("Error fetching long URL:", error);
      return null;
    }
    
    return data.long_url;
  }
}
