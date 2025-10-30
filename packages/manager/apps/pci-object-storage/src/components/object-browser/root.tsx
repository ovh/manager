import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Ctx } from "./context";
import type { AnyWithName, DataSource, ObjectBrowserCommonProps } from "./types";
import { buildPrefixIndex } from "./prefix-index";
import DefaultLayout from "./default-layout";
import { cn } from "@/lib/utils";

export interface RootProps<T> extends ObjectBrowserCommonProps<T> {
  renderDefault?: boolean;
}

export function Root<T>({
  objects = [],
  keyField = "name" as keyof T,
  defaultPrefix = "",
  prefix: controlledPrefix,
  onPrefixChange,
  onObjectClick,
  onDropFiles,
  className,
  children,
  renderDefault = true,
}: React.PropsWithChildren<RootProps<T>>) {
  const treeScrollRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const [uncontrolledPrefix, setUncontrolledPrefix] = useState(defaultPrefix);
  const prefix = controlledPrefix ?? uncontrolledPrefix;

  const [query, setQuery] = useState("");

  const normalized = useMemo(
    () =>
      (objects ?? []).map((o) => ({
        ...(o as Record<string, any>),
        name: String((o as any).name ?? (o as any)[keyField] ?? ""),
      })) as (T & { name: string })[],
    [objects, keyField]
  );

  const setPrefix = useCallback(
    (p: string) => {
      if (controlledPrefix !== undefined) onPrefixChange?.(p);
      else setUncontrolledPrefix(p);
      setSelectedPrefix(p);
    },
    [controlledPrefix, onPrefixChange]
  );

  const [selectedPrefix, setSelectedPrefix] = useState(prefix);
  useEffect(() => {
    setSelectedPrefix(prefix);
  }, [prefix]);

  const index = useMemo(
    () => buildPrefixIndex(normalized as AnyWithName[]),
    [normalized]
  );

  const value = useMemo(
    () => ({
      objects: normalized,
      prefix,
      selectedPrefix,
      setPrefix,
      setSelectedPrefix,
      query,
      setQuery,
      index,
      onObjectClick: onObjectClick ?? (() => { }),
      onDropFiles: onDropFiles ?? (() => { }),
      treeScrollRef,
      contentScrollRef,
    }),
    [
      normalized,
      prefix,
      selectedPrefix,
      setPrefix,
      query,
      index,
      onObjectClick,
      onDropFiles,
      treeScrollRef,
      contentScrollRef,
    ]
  );

  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [prefix, query]);

  useEffect(() => {
    const container = treeScrollRef.current;
    if (!container) return;

    // find the selected folder row
    const selector = `[data-prefix="${CSS.escape(selectedPrefix)}"]`;
    const row = container.querySelector(selector) as HTMLElement | null;
    if (!row) return;

    const offsetTop = row.offsetTop - container.offsetTop;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;
    const nodeTop = offsetTop;
    const nodeBottom = offsetTop + row.offsetHeight;

    if (nodeTop < viewTop + 24) {
      container.scrollTop = nodeTop - 24;
    } else if (nodeBottom > viewBottom - 24) {
      container.scrollTop = nodeBottom - container.clientHeight + 24;
    }
  }, [selectedPrefix]);


  return (
    <Ctx.Provider value={value}>
      <div className={cn("w-full h-full min-h-0 overflow-hidden flex flex-col", className)}>
        <div className="flex-1 min-h-0 overflow-hidden">
          {children ? children : renderDefault ? <DefaultLayout /> : null}
        </div>
      </div>
    </Ctx.Provider>
  );


}

export const ObjectBrowser = { Root };
