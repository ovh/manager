export interface Person extends Record<string, unknown> {
  id: string;
  name: string;
  age: number;
  subRows?: Person[];
}

export interface ResourceTagsHookResult {
  tags: string[];
  isError: boolean;
  isLoading: boolean;
}

export interface MockPage {
  data?: unknown;
  nextCursor?: number | string | null;
}
