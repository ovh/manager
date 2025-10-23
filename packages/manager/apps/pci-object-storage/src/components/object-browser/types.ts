export type AnyWithName = { name: string } & Record<string, any>;

export interface DataSource<T> {
  list?: (
    prefix: string,
    cursor?: string | null,
    query?: string
  ) => Promise<{ objects: T[]; nextCursor?: string | null }>;
}

export interface ObjectBrowserCommonProps<T> {
  objects?: T[];
  keyField?: keyof T;
  defaultPrefix?: string;
  prefix?: string;
  onPrefixChange?: (prefix: string) => void;
  onObjectClick?: (object: T) => void;
  onDropFiles?: (files: File[], folderPrefix: string) => void;
  dataSource?: DataSource<T>;
  className?: string;
}

export interface PrefixIndex<T extends { name: string }> {
  prefixes: Set<string>;
  filesUnder: Map<string, T[]>;
  parent: Map<string, string>;
  children: Map<string, Set<string>>;
}
