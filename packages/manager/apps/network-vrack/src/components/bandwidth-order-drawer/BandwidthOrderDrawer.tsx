import { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

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
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { CurrencyCode } from '@ovh-ux/manager-module-common-api';
import { BandwidthOption, DEFAULT_BANDWIDTH_PLAN_CODE } from '@ovh-ux/manager-network-common';

import { ApiErrorMessage } from '@/components/api-error-message/ApiErrorMessage';
import { useDowngradeBandwidth } from '@/hooks/order/useDowngradeBandwidth';
import { useUpgradeBandwidth } from '@/hooks/order/useUpgradeBandwidth';
import { useBandwidthFormatConverter } from '@/hooks/useBandwidthFormatConverter';
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState('');
  const [isUpgrade, setIsUpgrade] = useState(false);
  const bandwidthConverter = useBandwidthFormatConverter();

  const {
    mutate: upgradeBandwidth,
    isPending: isUpgradePending,
    error: upgradeError,
  } = useUpgradeBandwidth({
    serviceName,
    currentBandwidthLimit: bandwidthLimit,
    region,
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const {
    mutate: downgradeBandwidth,
    isPending: isDowngradePending,
    error: downgradeError,
  } = useDowngradeBandwidth({
    serviceName,
    region,
    onSuccess: () => {
      setIsOpen(false);
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
        setIsUpgrade(false);
      }}
    >
      <DrawerTrigger asChild>
        <Link className="flex items-center my-4" disabled={bandwidthOptionList.length < 2}>
          {t('publicIpRouting_modify_bandwidth_button')}
          <Icon name={ICON_NAME.arrowRight} className="ml-2" />
        </Link>
      </DrawerTrigger>
      <DrawerContent position={DRAWER_POSITION.right}>
        <DrawerBody className="flex flex-col h-[96%]">
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
                  className={`flex items-center mb-2 px-5 py-4 ${
                    option.state !== BandwidthOptionState.CURRENT
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed'
                  } ${selectedPlanCode === option.planCode ? 'border-2' : 'border-1'} ${
                    option.state === BandwidthOptionState.CURRENT
                      ? 'bg-[var(--ods-theme-background-color-disabled)]'
                      : ''
                  }`}
                  onKeyDown={handleEnterAndEscapeKeyDown({
                    onEnter: () => {
                      if (option.state !== BandwidthOptionState.CURRENT) {
                        setSelectedPlanCode(option.planCode);
                        setIsUpgrade(option.state === BandwidthOptionState.UPGRADE);
                      }
                    },
                  })}
                  color={
                    selectedPlanCode === option.planCode ? CARD_COLOR.primary : CARD_COLOR.neutral
                  }
                  onClick={() => {
                    if (option.state !== BandwidthOptionState.CURRENT) {
                      setSelectedPlanCode(option.planCode);
                      setIsUpgrade(option.state === BandwidthOptionState.UPGRADE);
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
                        </Text>
                      </RadioLabel>
                    </Radio>
                    {option.state !== BandwidthOptionState.CURRENT && (
                      <Message
                        className="mt-3 p-0 border-none text-sm"
                        dismissible={false}
                        variant={MESSAGE_VARIANT.light}
                        color={
                          option.state === BandwidthOptionState.DOWNGRADE
                            ? MESSAGE_COLOR.warning
                            : MESSAGE_COLOR.success
                        }
                      >
                        <Icon
                          name={
                            option.state === BandwidthOptionState.DOWNGRADE
                              ? ICON_NAME.timer
                              : ICON_NAME.circleCheck
                          }
                        />
                        <MessageBody>
                          {option.state === BandwidthOptionState.DOWNGRADE
                            ? t('publicIpRouting_effective_next_cycle_message')
                            : t('publicIpRouting_effective_directly_message')}
                        </MessageBody>
                      </Message>
                    )}
                  </div>
                  <div className="ml-auto flex flex-col items-end justify-center min-w-[80px]">
                    <Text
                      preset={TEXT_PRESET.heading6}
                      className="mt-4 text-[var(--ods-theme-information-color)]"
                    >
                      {option.price.value === 0
                        ? t('free_public_ip_routing_bandwidth_option_price')
                        : option.price.text}
                    </Text>
                  </div>
                </Card>
              ))}
            </RadioGroup>
            <Message className="mt-8" dismissible={false} color={MESSAGE_COLOR.information}>
              <Icon name={ICON_NAME.circleInfo} />
              {t('publicIpRouting_modify_bandwidth_bottom_info')}
            </Message>
            <ApiErrorMessage className="mt-4" error={downgradeError || upgradeError} />
          </div>
          <div className="mt-auto flex gap-4">
            <Button variant={BUTTON_VARIANT.ghost} onClick={() => setIsOpen(false)}>
              {t('cancel', { ns: NAMESPACES.ACTIONS })}
            </Button>
            <Button
              disabled={!selectedPlanCode}
              loading={isUpgradePending || isDowngradePending}
              onClick={() =>
                isUpgrade
                  ? upgradeBandwidth({ planCode: selectedPlanCode })
                  : downgradeBandwidth({ planCode: selectedPlanCode })
              }
            >
              {t('order', { ns: NAMESPACES.ACTIONS })}
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
