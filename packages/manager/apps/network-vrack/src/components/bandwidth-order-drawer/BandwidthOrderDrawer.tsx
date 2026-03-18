import { useMemo, useState } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  CARD_COLOR,
  Card,
  DRAWER_POSITION,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerTrigger,
  ICON_NAME,
  Icon,
  Link,
  MESSAGE_COLOR,
  MESSAGE_VARIANT,
  Message,
  MessageBody,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BandwidthOption,
  CurrencyCode,
  DEFAULT_BANDWIDTH_PLAN_CODE,
  useBandwidthFormatConverter,
  useUpgradeDowngradeBandwidth,
} from '@ovh-ux/manager-network-common';
import { useNotifications } from '@ovh-ux/muk';

import { ApiErrorMessage } from '@/components/api-error-message/ApiErrorMessage';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { handleEnterAndEscapeKeyDown } from '@/utils/handleEnterAndEscapeKeyDown';

enum BandwidthOptionState {
  CURRENT = 'current',
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
}

type BandwidthOptionWithState = BandwidthOption & { state: BandwidthOptionState };

export const BandwidthOrderDrawer = ({
  bandwidthLimit,
  bandwidthOptionList = [],
  region,
  serviceName,
}: {
  bandwidthLimit: number;
  region: string;
  serviceName: string;
  bandwidthOptionList?: BandwidthOption[];
}) => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting, NAMESPACES.ACTIONS]);
  const { addSuccess } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState('');
  const bandwidthConverter = useBandwidthFormatConverter();

  const {
    mutate: upgradeOrDowngradeBandwidth,
    isPending,
    error,
  } = useUpgradeDowngradeBandwidth({
    serviceName,
    currentBandwidthLimit: bandwidthLimit,
    region,
    onSuccess: (response) => {
      setIsOpen(false);

      if (response?.order?.url) {
        window.open(response.order.url, '_blank', 'noopener,noreferrer');
      }

      addSuccess(
        <Message className="my-3" color={MESSAGE_COLOR.success} dismissible={false}>
          <MessageBody className="block">
            {response?.order?.url ? (
              <Trans
                t={t}
                i18nKey="publicIpRouting_success_order_message"
                components={{
                  Link: (
                    <Link
                      onClick={() => {
                        window.open(response.order.url, '_blank', 'noopener,noreferrer');
                      }}
                    />
                  ),
                }}
              />
            ) : (
              t('publicIpRouting_success_downgrade_to_default_bandwidth_message')
            )}
          </MessageBody>
        </Message>,
        true,
      );
    },
  });

  const currentBandwidthOption = useMemo(
    () => bandwidthOptionList.find((option) => option.bandwidthLimit === bandwidthLimit),
    [bandwidthLimit, bandwidthOptionList],
  );

  const vrackBandwidthOptionList: BandwidthOptionWithState[] = useMemo(
    () =>
      [
        currentBandwidthOption
          ? { ...currentBandwidthOption, state: BandwidthOptionState.CURRENT }
          : {
              bandwidthLimit,
              planCode: DEFAULT_BANDWIDTH_PLAN_CODE,
              price: { currencyCode: CurrencyCode.EUR, value: 0, text: '0 €' },
              priceInUcents: 0,
              state: BandwidthOptionState.CURRENT,
            },
        ...bandwidthOptionList
          .filter((option) => option.bandwidthLimit !== currentBandwidthOption?.bandwidthLimit)
          .map((option) => ({
            ...option,
            state:
              option.bandwidthLimit < bandwidthLimit
                ? BandwidthOptionState.DOWNGRADE
                : BandwidthOptionState.UPGRADE,
          })),
      ].sort((a, b) => a.bandwidthLimit - b.bandwidthLimit),
    [bandwidthOptionList, bandwidthLimit, currentBandwidthOption],
  );

  return (
    <Drawer
      open={isOpen}
      closeOnInteractOutside
      closeOnEscape
      onOpenChange={(e) => {
        setIsOpen(e.open);
        setSelectedPlanCode('');
      }}
    >
      <DrawerTrigger asChild>
        <Link className="my-4 flex items-center" disabled={bandwidthOptionList.length < 2}>
          {t('publicIpRouting_modify_bandwidth_button')}
          <Icon name={ICON_NAME.arrowRight} className="ml-2" />
        </Link>
      </DrawerTrigger>
      <DrawerContent position={DRAWER_POSITION.right}>
        <DrawerBody className="flex flex-col" style={{ height: '96%' }}>
          <div>
            <Text preset={TEXT_PRESET.heading4} className="mb-10">
              {t('publicIpRouting_modify_bandwidth_header1', { region })}
            </Text>
            <Text preset={TEXT_PRESET.heading6} className="mb-2">
              {t('publicIpRouting_modify_bandwidth_header2')}
            </Text>
            <Text preset={TEXT_PRESET.paragraph} className="mb-4">
              {t('publicIpRouting_modify_bandwidth_content', { region, vrack: serviceName })}
            </Text>
            <RadioGroup
              value={selectedPlanCode}
              onValueChange={(e) => setSelectedPlanCode(e.value || '')}
            >
              {vrackBandwidthOptionList.map((option) => (
                <Card
                  role="radio"
                  aria-checked={selectedPlanCode === option.planCode}
                  tabIndex={option.state !== BandwidthOptionState.CURRENT ? 0 : -1}
                  key={option.planCode}
                  className={`mb-2 flex items-center px-5 py-4 ${
                    option.state !== BandwidthOptionState.CURRENT
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed'
                  } ${selectedPlanCode === option.planCode ? 'border-2' : 'border'}`}
                  style={
                    option.state === BandwidthOptionState.CURRENT
                      ? { backgroundColor: 'var(--ods-theme-background-color-disabled)' }
                      : undefined
                  }
                  onKeyDown={handleEnterAndEscapeKeyDown({
                    onEnter: () => {
                      if (option.state !== BandwidthOptionState.CURRENT) {
                        setSelectedPlanCode(option.planCode);
                      }
                    },
                  })}
                  color={
                    selectedPlanCode === option.planCode ? CARD_COLOR.primary : CARD_COLOR.neutral
                  }
                  onClick={() => {
                    if (option.state !== BandwidthOptionState.CURRENT) {
                      setSelectedPlanCode(option.planCode);
                    }
                  }}
                >
                  <div>
                    <Radio
                      aria-hidden="true"
                      tabIndex={-1}
                      value={option.planCode}
                      disabled={option.state === BandwidthOptionState.CURRENT}
                    >
                      <RadioControl />
                      <RadioLabel>
                        <Text preset={TEXT_PRESET.heading6}>
                          {bandwidthConverter(option.bandwidthLimit).perSecondFormat}
                          {option.state === BandwidthOptionState.UPGRADE && (
                            <Tooltip positionerStyle={{ zIndex: 9999 }}>
                              <TooltipTrigger asChild>
                                <Icon className="ml-3" name={ICON_NAME.circleInfo} />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-64" withArrow>
                                {t('upgrade_bandwidth_info_tooltip')}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </Text>
                      </RadioLabel>
                    </Radio>
                    {option.state !== BandwidthOptionState.CURRENT && (
                      <Message
                        className="mt-4 border-none p-0 text-sm"
                        dismissible={false}
                        variant={MESSAGE_VARIANT.light}
                        color={MESSAGE_COLOR.success}
                      >
                        <Icon name={ICON_NAME.circleCheck} />
                        <MessageBody>{t('publicIpRouting_effective_directly_message')}</MessageBody>
                      </Message>
                    )}
                  </div>
                  <div className="ml-auto flex flex-col items-end" style={{ minWidth: '80px' }}>
                    <Text
                      preset={TEXT_PRESET.heading6}
                      className="mt-4"
                      style={{ color: 'var(--ods-theme-information-color)' }}
                    >
                      {option.price.value === 0
                        ? t('free_public_ip_routing_bandwidth_option_price')
                        : option.price.text}
                    </Text>
                    {option.price.value > 0 && (
                      <Text preset={TEXT_PRESET.small}>{t('tax_excluded_notice_label')}</Text>
                    )}
                  </div>
                </Card>
              ))}
            </RadioGroup>
            <Message className="mt-8" dismissible={false} color={MESSAGE_COLOR.information}>
              <Icon name={ICON_NAME.circleInfo} />
              <MessageBody>{t('publicIpRouting_modify_bandwidth_bottom_info')}</MessageBody>
            </Message>
            <ApiErrorMessage className="mt-4" error={error} />
          </div>
          <div className="mt-auto flex gap-4">
            <Button variant={BUTTON_VARIANT.ghost} onClick={() => setIsOpen(false)}>
              {t('cancel', { ns: NAMESPACES.ACTIONS })}
            </Button>
            <Button
              disabled={!selectedPlanCode}
              loading={isPending}
              onClick={() => upgradeOrDowngradeBandwidth({ planCode: selectedPlanCode })}
            >
              {t('order', { ns: NAMESPACES.ACTIONS })}
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
