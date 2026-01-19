import { useAddMePreferences, useMePreferences } from '@/data/hooks/useMePreferences/useMePreferences';
import { useGuidedTour } from '@/hooks/useGuidedTour';
import { GUIDED_TOUR_DONE_PREFERENCE } from './GuidedTour.constants';
import { Card, Text, Button, BUTTON_VARIANT, BUTTON_SIZE, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

export default function Introduction() {

  const { isActive, start } = useGuidedTour();
  const { data: hasFinishedGuidedTour, isLoading: hasFinishedGuidedTourLoading } = useMePreferences(GUIDED_TOUR_DONE_PREFERENCE);
  const { mutate: addMePreferences, isPending: isUpdatingGuidedTourDone } = useAddMePreferences(GUIDED_TOUR_DONE_PREFERENCE);

  const { t } = useTranslation('common');

  const handleStart = () => {
    addMePreferences(true);
    start();
  };

  const handleDontDisplayAgain = () => {
    addMePreferences(true);
  };

  if (isActive || hasFinishedGuidedTour || hasFinishedGuidedTourLoading || isUpdatingGuidedTourDone) return null;

  return (
    <div className="absolute top-0 left-0 pointer-events-none z-[99] w-full h-full py-8 px-4 md:px-10">
      <Card className="pointer-events-auto min-w-[300px] max-w-[450px] bg-white w-full min-h-content pointer-events-auto border-none shadow-[0_2px_8px_rgba(0,14,156,0.2)]" role="dialog">
        <div className="p-5 relative flex flex-col gap-4 max-h-full">
          <Text preset={TEXT_PRESET.heading3}>{t('guided_tour_introduction_title')}</Text>
          <Text className="flex-1 min-h-min mb-5 flex-1">{t('guided_tour_introduction_content')}</Text>
          <div className="flex flex-row gap-4 items-center">
            <div className="flex-grow">
              <Button
                variant={BUTTON_VARIANT.ghost}
                size={BUTTON_SIZE.sm}
                onClick={handleDontDisplayAgain}
              >
                {t('guided_tour_introduction_dont_display_again')}
              </Button>
            </div>

            <Button
              variant={BUTTON_VARIANT.default}
              size={BUTTON_SIZE.sm}
              onClick={handleStart}
            >
              {t('guided_tour_introduction_start_guide')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
    );
  }
