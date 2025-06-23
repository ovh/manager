import { useState, useMemo } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import DOMPurify from 'dompurify';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import ReactMarkdown from 'react-markdown';
import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';
import { ROADMAP_CHANGELOG_DATAGRID_COLLAPSED_LENGTH } from '@/changelog.constants';

export const RoadmapChangelogItemDescriptionCell = ({
  item,
}: {
  item: RoadmapChangelogItem;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const sanitizedMessage = useMemo(() => {
    return DOMPurify.sanitize(item.description);
  }, [item, DOMPurify]);

  return (
    <>
      {item.title && (
        <div>
          <div className="flex flex-row justify-start items-center">
            <div
              className="flex w-[24px] h-[24px] cursor-pointer hover:bg-[--ods-color-blue-100] items-center justify-center mr-2"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="chevron-button"
            >
              {item.description && (
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
                  aria-hidden="true"
                ></OsdsIcon>
              )}
            </div>
            <div className="w-[24rem]" style={{ textOverflow: 'ellipsis' }}>
              {item.title}
            </div>
          </div>
          {isOpen && (
            <div className="w-[24rem]" style={{ textOverflow: 'ellipsis' }}>
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
                {sanitizedMessage}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </>
  );
};
