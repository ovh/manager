import { useGuidedTour } from '@/hooks/useGuidedTour';
import { useTranslation } from 'react-i18next';
import { Button, BUTTON_SIZE, BUTTON_VARIANT, Icon, ICON_NAME, Popover, POPOVER_POSITION, PopoverContent, PopoverTrigger, Link} from '@ovhcloud/ods-react';

export const GuideMenu = () => {

  const { start } = useGuidedTour();
  const { t } = useTranslation('common');

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
        </div>
      </PopoverContent>
    </Popover>
  );
};
