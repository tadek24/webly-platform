type BridgeOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | number>;
  authenticated?: boolean;
  cache?: RequestCache;
};

export class BridgeError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export async function bridgeRequest<T>(route: string, options: BridgeOptions = {}): Promise<T> {
  const baseUrl = process.env.WP_BASE_URL?.replace(/\/$/, "");
  const token = process.env.WP_API_TOKEN;
  const authenticated = options.authenticated ?? true;

  if (!baseUrl || (authenticated && !token)) {
    throw new BridgeError("Połączenie z WordPressem nie jest skonfigurowane.", 503);
  }

  const url = new URL(baseUrl);
  url.searchParams.set("rest_route", `/webly/v1${route}`);
  Object.entries(options.searchParams ?? {}).forEach(([key, value]) => url.searchParams.set(key, String(value)));

  const response = await fetch(url, {
    method: options.method ?? "GET",
    cache: options.cache ?? "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(authenticated && token ? { "X-Webly-Token": token } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const data = await response.json().catch(() => ({ message: "Nieprawidłowa odpowiedź WordPressa." })) as T & { message?: string; error?: string };
  if (!response.ok) {
    throw new BridgeError(data.message ?? data.error ?? "Operacja nie powiodła się.", response.status);
  }

  return data;
}

