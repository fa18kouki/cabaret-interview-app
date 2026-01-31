// Mock for next/server
export const cookies = () => ({
  get: () => null,
  set: () => {},
  delete: () => {},
  getAll: () => [],
  has: () => false,
});

export const headers = () => ({
  get: () => null,
  getAll: () => [],
  has: () => false,
  forEach: () => {},
  entries: () => [][Symbol.iterator](),
  keys: () => [][Symbol.iterator](),
  values: () => [][Symbol.iterator](),
});

export class NextRequest {
  url: string;
  method: string;
  headers: Headers;

  constructor(url: string, init?: RequestInit) {
    this.url = url;
    this.method = init?.method ?? "GET";
    this.headers = new Headers(init?.headers);
  }

  nextUrl = {
    pathname: "/",
    searchParams: new URLSearchParams(),
  };
}

export class NextResponse {
  static json(body: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
      ...init,
      headers: {
        ...init?.headers,
        "content-type": "application/json",
      },
    });
  }

  static redirect(url: string | URL, status?: number) {
    return new Response(null, {
      status: status ?? 307,
      headers: { Location: url.toString() },
    });
  }

  static next() {
    return new Response(null, { status: 200 });
  }
}

export { cookies as unstable_rethrow };
