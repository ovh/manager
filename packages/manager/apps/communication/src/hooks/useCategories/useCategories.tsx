import { TFunction } from 'i18next';

export default function useCategories(t: TFunction, categories: string[]) {
  return categories
    .map((category) => t(`category_${category.toLowerCase()}`))
    .join(', ');
}
