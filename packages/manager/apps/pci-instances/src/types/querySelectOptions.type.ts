export type TSelectOptions<TEntity, TData> = {
  select: (data?: TEntity) => TData;
};
