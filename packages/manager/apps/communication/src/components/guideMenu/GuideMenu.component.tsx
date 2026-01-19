
import { useTranslation } from 'react-i18next';
import { Link as ManagerLink, LinkType } from '@ovh-ux/muk';
import { Button, BUTTON_SIZE, BUTTON_VARIANT, Icon, ICON_NAME, Popover, POPOVER_POSITION, PopoverContent, PopoverTrigger, Link } from '@ovhcloud/ods-react';
import useHelpLink from '@/hooks/useHelpLink/useHelpLink';
import { ACCOUNT_MESSAGES_PATHS } from './guideMenu.constants';
import { useGuidedTour } from '@/hooks/useGuidedTour';

export const GuideMenu = () => {

  const { start } = useGuidedTour();
  const { t } = useTranslation('common');

  const accountMessagesLink = useHelpLink({ paths: ACCOUNT_MESSAGES_PATHS });
  const onClickStartGuide = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    start();
  };

  return (
    <Popover position={POPOVER_POSITION.bottom}>
      <PopoverTrigger asChild>
        <Button
          aria-label={t('guide_menu_header')}
          variant={BUTTON_VARIANT.ghost}
          size={BUTTON_SIZE.sm}
        >
          <>
            <Icon name={ICON_NAME.book} aria-hidden={true} />
            {t('guide_menu_header')}
          </>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 py-1">
          <Link onClick={onClickStartGuide}>
            {t('guide_menu_start_guide')}
          </Link>
          <ManagerLink href={accountMessagesLink} target="_blank" type={LinkType.external}>
            {t('guide_menu_account_messages')}
          </ManagerLink>
        </div>
      </PopoverContent>
    </Popover>
  );
};
