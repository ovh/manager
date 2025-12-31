import { Deps } from '@/deps/deps';
import { Reader } from '@/types/utils.type';

export type TOptionsData = {
  name: string;
  value: string;
  tags: string[] | null;
};
type TSelectCategoriesData = (projectId: string) => TOptionsData[];

export const selectCategories: Reader<Deps, TSelectCategoriesData> = (deps) => (
  projectId,
) => {
  const { instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  const categoriesIds = data.entities.flavorCategories.allIds;

  const categories = categoriesIds.flatMap(
    (id) => data.entities.flavorCategories.byId.get(id) ?? [],
  );

  return categories.map(({ name, tags }) => ({
    name,
    value: name,
    tags,
  }));
};

type TSelectTypesData = (
  projectId: string,
  categoryId: string | null,
) => TOptionsData[];

export const selectTypes: Reader<Deps, TSelectTypesData> = (deps) => (
  projectId,
  categoryId,
) => {
  if (!categoryId) return [];

  const { instancesCatalogPort } = deps;

  const data = instancesCatalogPort.selectInstancesCatalog(projectId);
  if (!data) return [];

  const typesIds = data.entities.flavorCategories.byId.get(categoryId)?.types;
  if (!typesIds) return [];

  const types = typesIds.flatMap(
    (id) => data.entities.flavorTypes.byId.get(id) ?? [],
  );

  return types.map(({ name, tags }) => ({
    name,
    value: name,
    tags,
  }));
};
