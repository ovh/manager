import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { buildPrefixIndex, PrefixIndex } from './prefix-index';

export interface BrowserRootProps<T extends NonNullable<unknown>> {
  objects: T[];
  keyField: keyof T;
  getObjectKey?: (object: T & { name: string }) => string;
  onDropFiles?: (files: File[], folderPrefix: string) => void;
  onObjectClick?: (object: T) => void;
  children: React.ReactNode;
}

export interface BrowserContextValue<T extends { name: string }> {
  objects: (T & { name: string })[];
  prefix: string;
  setPrefix: (p: string) => void;
  index: PrefixIndex<T & { name: string }>;
  getObjectKey?: (object: T & { name: string }) => string;
  onDropFiles?: (files: File[], folderPrefix: string) => void;
  onObjectClick?: (object: T) => void;
  contentScrollRef: React.RefObject<HTMLDivElement>;
}

const BrowserContext = createContext<BrowserContextValue<{
  name: string;
}> | null>(null);

const useBrowser = <T extends { name: string }>() => {
  const ctx = useContext(BrowserContext);
  if (!ctx) throw new Error('useBrowser must be used within <BrowserRoot>');
  return ctx as BrowserContextValue<T>;
};

const BrowserRoot = <T extends NonNullable<unknown>>({
  objects,
  keyField,
  getObjectKey,
  onDropFiles,
  onObjectClick,
  children,
}: BrowserRootProps<T>) => {
  const [prefix, setPrefix] = useState('');
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Normalize every object to ensure it has a `name` string field
  const normalized = useMemo(() => {
    return objects.map((obj) => {
      const value = obj[keyField];
      return {
        ...obj,
        name: String(value ?? ''),
      };
    }) as (T & { name: string })[];
  }, [objects, keyField]);

  // Build folder/file index
  const index = useMemo(() => buildPrefixIndex(normalized), [normalized]);

  const value: BrowserContextValue<T & { name: string }> = {
    objects: normalized,
    prefix,
    setPrefix,
    index,
    getObjectKey,
    onDropFiles,
    onObjectClick,
    contentScrollRef,
  };

  return (
    <BrowserContext.Provider value={value}>{children}</BrowserContext.Provider>
  );
};

export { BrowserRoot, useBrowser };
