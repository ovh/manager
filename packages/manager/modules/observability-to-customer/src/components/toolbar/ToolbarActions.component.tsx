import { BUTTON_SIZE, BUTTON_VARIANT, Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { useActionClick } from '../../hooks';
import { ToolbarActionsProps } from './ToolbarActions.props';

export const ToolbarActions: React.FC<Readonly<ToolbarActionsProps>> = ({ items }): JSX.Element => {
  const onActionClick = useActionClick();

  return (
    <div className="w-full flex flex-col justify-end items-end gap-6">
      <div className="flex justify-center items-center gap-4">
        {items.map(
          ({
            id,
            label,
            link,
            variant = BUTTON_VARIANT.default,
            isDisabled = false,
            isExternal = false,
            icon = isExternal ? ICON_NAME.externalLink : undefined,
          }) => (
            <Button
              key={`obs-toolbar-action-${id}`}
              className="[&::part(button)]:w-full sm:w-auto"
              size={BUTTON_SIZE.md}
              variant={variant}
              onClick={() => {
                onActionClick(link, isExternal);
              }}
              disabled={isDisabled}
            >
              <div className="flex flex-col gap-2">
                <span>{label}</span>
                {icon && <Icon name={icon} />}
              </div>
            </Button>
          ),
        )}
      </div>
    </div>
  );
};

export default ToolbarActions;
