import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  ICON_NAME,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  POPOVER_POSITION,
  TEXT_PRESET,
  Text,
  RadioGroup,
  Radio,
  RadioControl,
  RadioLabel,
  Badge,
  BADGE_COLOR,
  BADGE_SIZE,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@ovh-ux/muk';
import { MAX_VIEWS_NUMBER, STANDARD_VIEW_ID } from './manageView.constants';
import { ViewType } from './types';
import ManageViewDrawer from './manageViewDrawer';
import { ViewContext } from './viewContext';
import ManageViewDelete from './manageViewDelete';

export const ManageViewButton = () => {
  const { t } = useTranslation('manage-view');
  const { views, currentView, setCurrentView } = useContext(ViewContext);
  const [isOpoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [viewToEdit, selectViewToEdit] = useState<ViewType>(null);

  const popoverChange = ({ open }: { open: boolean }) => {
    setIsPopoverOpen(open);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const changeView = ({ value: viewId }: { value: string }) => {
    setCurrentView(views.find(({ id }) => id === viewId));
  };

  return (
    <div className="ml-auto">
      <Popover
        position={POPOVER_POSITION.bottomStart}
        open={isOpoverOpen}
        onOpenChange={popoverChange}
      >
        <PopoverTrigger aria-haspopup="manage-view-menu" asChild>
          <Button
            variant={BUTTON_VARIANT.outline}
            size={BUTTON_SIZE.sm}
            className="ml-3 whitespace-nowrap"
            data-testid="manage-view-button"
          >
            <Icon name={ICON_NAME.eye} aria-hidden={true} />
            <span>{t('manage_view')}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent aria-label={t('manage_view')} className="p-3" withArrow>
          <div role="menu" className="flex flex-col">
            <Text preset={TEXT_PRESET.heading6} className="mb-2">
              {t('current_view')}
            </Text>

            <Button
              onClick={() => {
                selectViewToEdit(currentView);
                setIsPopoverOpen(false);
                setIsDrawerOpen(true);
              }}
              role="menuitem"
              variant={BUTTON_VARIANT.ghost}
              disabled={currentView?.id === STANDARD_VIEW_ID}
            >
              <Icon name={ICON_NAME.pen} aria-hidden={true} />
              <span>{t('configure_current_view')}</span>
            </Button>
            <ManageViewDelete
              views={views}
              view={currentView}
              disabled={currentView?.id === STANDARD_VIEW_ID}
              onOpenModal={() => {
                setIsPopoverOpen(false);
              }}
            />

            <Divider className="my-3 w-full" />

            <Text preset={TEXT_PRESET.heading6} className="mb-2">
              {t('views')}
            </Text>

            <RadioGroup
              value={currentView?.id}
              onValueChange={changeView}
              name="user-views"
              className="mb-2"
            >
              {views.map((view) => (
                <Radio value={view.id} key={view.id}>
                  <RadioControl />

                  <RadioLabel className="flex items-center gap-2">
                    <span>{view.name}</span>
                    {view.default && (
                      <Badge color={BADGE_COLOR.neutral} size={BADGE_SIZE.sm}>
                        {t('default')}
                      </Badge>
                    )}
                  </RadioLabel>
                </Radio>
              ))}
            </RadioGroup>

            <Button
              role="menuitem"
              variant={BUTTON_VARIANT.ghost}
              onClick={() => {
                selectViewToEdit(null);
                setIsPopoverOpen(false);
                setIsDrawerOpen(true);
              }}
              disabled={views.length >= MAX_VIEWS_NUMBER}
              tool
            >
              <Icon name={ICON_NAME.plus} aria-hidden={true} />
              <span>{t('add_new_view')}</span>
              {views.length >= MAX_VIEWS_NUMBER && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name={ICON_NAME.circleQuestion} />
                  </TooltipTrigger>

                  <TooltipContent>
                    {t('maximum_views_number_reached')}
                  </TooltipContent>
                </Tooltip>
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <ManageViewDrawer
        view={viewToEdit}
        views={views}
        isOpen={isDrawerOpen}
        handleCancel={closeDrawer}
        handleConfirm={closeDrawer}
        handleDismiss={closeDrawer}
      />
    </div>
  );
};

export default ManageViewButton;
