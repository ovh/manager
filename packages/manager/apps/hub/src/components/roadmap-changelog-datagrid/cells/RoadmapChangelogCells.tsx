import { useState } from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OsdsChip, OsdsIcon } from '@ovhcloud/ods-components/react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

export const RoadmapChangelogItemProductCell = ({
  item,
}: {
  item: RoadmapChangelogItem;
}) => {
  return (
    <DataGridTextCell>
      <OsdsChip inline size={ODS_CHIP_SIZE.sm} className="whitespace-nowrap">
        {item.product}
      </OsdsChip>
    </DataGridTextCell>
  );
};

export const RoadmapChangelogItemTitleCell = ({
  item,
}: {
  item: RoadmapChangelogItem;
}) => {
  return (
    <DataGridTextCell>
      <div className="max-w-[12rem]">{item.title}</div>
    </DataGridTextCell>
  );
};

export const RoadmapChangelogItemDescriptionCell = ({
  item,
}: {
  item: RoadmapChangelogItem;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {item.description && (
        <div className="flex flex-row justify-start">
          {item.description.length > 80 && (
            <div
              className="flex w-[24px] h-[24px] cursor-pointer hover:bg-[--ods-color-blue-100] items-center justify-center mr-2"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="chevron-button"
            >
              <OsdsIcon
                className="flex min-w-[24px] max-w-[24px]"
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_ICON_SIZE.xs}
                name={
                  isOpen
                    ? ODS_ICON_NAME.CHEVRON_DOWN
                    : ODS_ICON_NAME.CHEVRON_RIGHT
                }
                data-testid="chevron-icon"
              ></OsdsIcon>
            </div>
          )}
          <div className="w-[24rem]">
            <ReactMarkdown
              components={{
                h2: 'strong',
                h3: 'em',
                p: 'div',
                pre: 'p',
                img: 'span',
                a: 'span',
              }}
            >
              {isOpen
                ? item.description
                : `${item.description.slice(0, 80)}${
                    item.description?.length > 80 ? '...' : ''
                  }`}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
};

export const RoadmapChangelogItemReleaseDateCell = ({
  item,
}: {
  item: RoadmapChangelogItem;
}) => {
  const { i18n } = useTranslation('changelog');
  const locale = i18n?.language?.replace('_', '-');
  return (
    <DataGridTextCell>
      {item.releaseDate
        ? new Date(item.releaseDate).toLocaleDateString(locale, {
            dateStyle: 'medium',
          })
        : ''}
    </DataGridTextCell>
  );
};

export const RoadmapChangelogItemStatusCell = ({ item }: { item: any }) => {
  const colors: Record<string, ODS_TEXT_COLOR_INTENT> = {
    Done: ODS_TEXT_COLOR_INTENT.success,
    'Partially released': ODS_TEXT_COLOR_INTENT.info,
    Planned: ODS_TEXT_COLOR_INTENT.default,
    Acknowledged: ODS_TEXT_COLOR_INTENT.warning,
    Prioritized: ODS_TEXT_COLOR_INTENT.accent,
  };
  return (
    <DataGridTextCell>
      <OsdsChip
        inline
        size={ODS_CHIP_SIZE.sm}
        color={colors[item.status]}
        className="whitespace-nowrap"
      >
        {item.status}
      </OsdsChip>
    </DataGridTextCell>
  );
};
