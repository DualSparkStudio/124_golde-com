// Redis stub — not used in mock/localStorage mode.
export const redis = {
  get: async (_key: string) => null,
  set: async (_key: string, _value: string, ..._args: unknown[]) => "OK",
  del: async (..._keys: string[]) => 0,
  keys: async (_pattern: string) => [] as string[],
} as unknown as import("ioredis").Redis;
