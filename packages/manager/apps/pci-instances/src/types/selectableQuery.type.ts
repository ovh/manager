/**
 * Options type for hooks that require a select function.
 * Enforces hexagonal architecture by making data transformation mandatory.
 *
 * @template TEntity - The domain entity type returned by the query
 * @template TData - The view data type returned by the select function
 *
 * @example
 * export const useSshKeys = <TData>(
 *   region: string,
 *   options: SelectOptions<TSshKey[], TData>
 * ) => { ... }
 */
export type SelectOptions<TEntity, TData> = {
  /** Required: transforms domain entities to view data (hexagonal architecture) */
  select: (data?: TEntity) => TData;
};
