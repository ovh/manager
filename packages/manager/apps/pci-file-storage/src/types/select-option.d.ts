export type DataSelector<TEntity, TData> = (data?: TEntity) => TData;

export type SelectOption<TEntity, TData> = {
  select: DataSelector<TEntity, TData>;
};
