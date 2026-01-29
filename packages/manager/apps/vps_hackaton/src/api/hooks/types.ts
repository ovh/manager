export type TSelectOptions<TEntity, TData = TEntity> = {
  select?: (data: TEntity) => TData;
};
