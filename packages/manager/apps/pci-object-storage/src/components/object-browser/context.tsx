import React, { createContext, useContext } from "react";
import type { AnyWithName, PrefixIndex } from "./types";

export interface ObjectBrowserContextValue<T> {
  objects: (T & { name: string })[];
  prefix: string;
  selectedPrefix: string;
  setPrefix: (p: string) => void;
  setSelectedPrefix: (p: string) => void;

  // search/filter
  query: string;
  setQuery: (q: string) => void;

  // simple prefix model
  index: PrefixIndex<AnyWithName>;

  // callbacks
  onObjectClick: (object: T) => void;
  onDropFiles: (files: File[], folderPrefix: string) => void;

  treeScrollRef: React.RefObject<HTMLDivElement>;
  contentScrollRef: React.RefObject<HTMLDivElement>;
}

const Ctx = createContext<ObjectBrowserContextValue<any> | null>(null);

export function useObjectBrowser<T>() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useObjectBrowser must be used within <ObjectBrowser.Root>");
  return ctx as ObjectBrowserContextValue<T>;
}

export { Ctx };
