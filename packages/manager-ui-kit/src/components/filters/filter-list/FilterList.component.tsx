import { Tag, TAG_COLOR } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { formatFilter } from '../filters.utils';
import { FilterListProps } from './FilterList.props';
import '../translations';

export function FilterList({
  filters,
  onRemoveFilter,
}: Readonly<FilterListProps>) {
  const { t, i18n } = useTranslation('filters');
  const tComp = (comparator: string) =>
    t(`common_criteria_adder_operator_${comparator}`);
  const locale = i18n.language?.replace('_', '-') || 'FR-fr';

  return (
    <>
      {filters?.map((filter, key) => (
        <Tag
          className="mr-3"
          color={TAG_COLOR.information}
          size="lg"
          key={key}
          onClick={() => onRemoveFilter(filter)}
          data-testid="filter-list_tag_item"
        >
          {`${filter.label && `${filter.label} ${tComp(filter.comparator)} ${formatFilter(filter, locale)}`}`}
        </Tag>
      ))}
    </>
  );
}
