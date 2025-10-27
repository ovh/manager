import { useObjectBrowser } from "./context";

export function ObjectBrowserContentHeader() {
  const { prefix, query } = useObjectBrowser<any>();
  return (
    <div className="py-2 px-3 border-b bg-muted/50 text-sm shrink-0">
      <strong>Prefix:</strong>{" "}
      <code className="font-mono">{prefix || "(root)"}</code>
      {query && (
        <span className="ml-2 text-xs text-muted-foreground">
          Filter: <code>{query}</code>
        </span>
      )}
    </div>
  );
}
