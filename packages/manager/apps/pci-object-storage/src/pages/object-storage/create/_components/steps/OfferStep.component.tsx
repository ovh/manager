import {
  Badge,
  RadioGroup,
  RadioIndicator,
  RadioTile,
  Separator,
} from '@datatr-ux/uxlib';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ObjectContainerOffers } from '../orderFunnel.const';

interface OfferStepProps {
  value?: ObjectContainerOffers;
  onChange?: (newValue: ObjectContainerOffers) => void;
}

const OfferStep = React.forwardRef<HTMLInputElement, OfferStepProps>(
  ({ value, onChange }, ref) => {
    const { t } = useTranslation('pci-object-storage/order-funnel');
    const OFFERS_TYPES: ObjectContainerOffers[] = [
      ObjectContainerOffers['s3-standard'],
      ObjectContainerOffers.swift,
    ];
    const RECOMENDED_OFFER = ObjectContainerOffers['s3-standard'];
    return (
      <RadioGroup
        data-testid="offer-select-container"
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
        value={value}
        onValueChange={onChange}
      >
        {OFFERS_TYPES.map((offer) => (
          <RadioTile data-testid="offer-radio-tile-s3-api" value={offer}>
            <div className="flex h-full flex-col">
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  <RadioIndicator />
                  <h5>{t(`offerTypeLabel-${offer}`)}</h5>
                </div>
                {offer === RECOMENDED_OFFER && (
                  <div>
                    <Badge
                      data-testid={`offer-tile-badge-recommended`}
                      variant={'info'}
                      className="text-xs h-4"
                    >
                      {t('offerTypeRecommended')}
                    </Badge>
                  </div>
                )}
              </div>
              <Separator className="my-2" />
              <div className="text-xs flex-1 flex flex-col">
                {t(`offerTypeDescription-${offer}`)}
              </div>
            </div>
          </RadioTile>
        ))}
      </RadioGroup>
    );
  },
);

OfferStep.displayName = 'OfferStep';
export default OfferStep;
