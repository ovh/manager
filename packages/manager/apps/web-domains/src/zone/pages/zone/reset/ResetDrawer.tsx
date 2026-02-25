import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  type DrawerOpenChangeDetail,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  Spinner,
  TEXT_PRESET,
  Text,
  ICON_NAME,
  MessageIcon,
} from '@ovhcloud/ods-react';
import {
  useGetEmailDomain,
  useGetEmailRecommendedDNS,
  useGetHostingDetails,
  useGetHostings,
  useResetZone,
} from '@/zone/hooks/data/history.hooks';
import type { DnsRecord } from '@/zone/data/api/history.api';
import type { AType, MxEntry, MxType } from '@/zone/pages/zone/reset/reset.types';
import { DEFAULT_MX_ENTRY, isValidIpv4 } from '@/zone/pages/zone/reset/reset.types';
import MinimizedSection from '@/zone/pages/zone/reset/MinimizedSection';
import ARecordSection from '@/zone/pages/zone/reset/ARecordSection';
import MxRecordSection from '@/zone/pages/zone/reset/MxRecordSection';

export interface ResetDrawerProps {
  readonly onCloseCallback?: () => void;
  readonly onSuccessCallback?: () => void;
}

export default function ResetDrawer({
  onCloseCallback,
  onSuccessCallback,
}: ResetDrawerProps) {
  const { t } = useTranslation('zone');
  const { serviceName } = useParams<{ serviceName: string }>();
  const zoneName = serviceName ?? '';
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  // ---- Form state ---------------------------------------------------------
  const [minimized, setMinimized] = useState(false);
  const [aType, setAType] = useState<AType | null>(null);
  const [aHosting, setAHosting] = useState('');
  const [aCustomIp, setACustomIp] = useState('');
  const [ipError, setIpError] = useState('');
  const [mxType, setMxType] = useState<MxType | null>(null);
  const [mxEntries, setMxEntries] = useState<MxEntry[]>([DEFAULT_MX_ENTRY]);

  // ---- Remote data --------------------------------------------------------
  const { hostings, isLoadingHostings } = useGetHostings();
  const { hostingDetails } = useGetHostingDetails(aHosting);
  const { emailDomain, emailDomainError } = useGetEmailDomain(zoneName);
  const { emailRecommendedDNS, isLoadingEmailDNS } = useGetEmailRecommendedDNS(
    zoneName,
    mxType === 'EMAILS',
  );
  const { mutate: doReset, isPending } = useResetZone();

  // ---- Derived data -------------------------------------------------------
  const availableMxTypes: MxType[] = useMemo(() => {
    const all: MxType[] = ['REDIRECTION', 'EMAILS', 'CUSTOM'];
    if (!emailDomain || emailDomainError || emailDomain.offer === 'MXREDIRECT') {
      return all.filter((type) => type !== 'EMAILS');
    }
    return all;
  }, [emailDomain, emailDomainError]);

  const isFormValid = useMemo(() => {
    if (!aType) return false;
    if (aType === 'HOSTING_WEB' && !aHosting) return false;
    if (aType === 'CUSTOM' && (!aCustomIp || !!ipError)) return false;
    if (!mxType) return false;
    if (mxType === 'CUSTOM' && !mxEntries.some((e) => e.target.trim() !== '')) {
      return false;
    }
    return true;
  }, [aType, aHosting, aCustomIp, ipError, mxType, mxEntries]);

  const isSubDataLoading = isLoadingEmailDNS && mxType === 'EMAILS';

  // ---- Handlers -----------------------------------------------------------
  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setACustomIp(val);
    setIpError(val && !isValidIpv4(val) ? t('zone_page_form_target_ipv4_valid') : '');
  };

  const handleATypeChange = (val: AType) => {
    setAType(val);
    setAHosting('');
    setACustomIp('');
    setIpError('');
  };

  const updateMxEntry = (index: number, field: keyof MxEntry, value: string | number) => {
    setMxEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry)),
    );
  };

  const addMxEntry = () => setMxEntries((prev) => [...prev, { id: crypto.randomUUID(), target: '', priority: 0 }]);

  const removeMxEntry = (index: number) =>
    setMxEntries((prev) => prev.filter((_, i) => i !== index));

  const handleOpenChange = ({ open }: DrawerOpenChangeDetail) => {
    if (!open) onCloseCallback?.();
  };

  // ---- Build payload & submit ---------------------------------------------
  const buildDnsRecords = (): DnsRecord[] => {
    const records: DnsRecord[] = [];

    if (aType === 'HOSTING_WEB' && hostingDetails) {
      records.push({ fieldType: 'A', target: hostingDetails.hostingIp });
    } else if (aType === 'CUSTOM' && aCustomIp) {
      records.push({ fieldType: 'A', target: aCustomIp });
    }

    if (mxType === 'EMAILS') {
      emailRecommendedDNS
        .filter((r) => r.fieldType === 'MX' && !r.subDomain)
        .forEach((r) => records.push({ fieldType: 'MX', target: r.target }));
    } else if (mxType === 'CUSTOM') {
      mxEntries
        .filter((e) => e.target.trim() !== '')
        .forEach((e) =>
          records.push({ fieldType: 'MX', target: `${e.priority} ${e.target}` }),
        );
    }

    return records;
  };

  const handleConfirm = () => {
    const dnsRecords = buildDnsRecords();
    doReset(
      {
        zoneName,
        minimized,
        dnsRecords: dnsRecords.length > 0 ? dnsRecords : null,
      },
      {
        onSuccess: () => {
          addSuccess(t('zone_page_reset_success'), true);
          queryClient.invalidateQueries({ queryKey: ['zone', 'records', zoneName] });
          onSuccessCallback?.();
        },
        onError: (error: Error) => {
          addError(t('zone_page_reset_error', { message: error.message }), true);
        },
      },
    );
  };

  // ---- Render -------------------------------------------------------------
  return (
    <Drawer open onOpenChange={handleOpenChange} closeOnEscape closeOnInteractOutside>
      <DrawerContent position={DRAWER_POSITION.right} className="min-w-[34rem]">
        <DrawerBody className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-8 py-8 px-1">
            <Text preset={TEXT_PRESET.heading2}>{t('zone_page_reset_title')}</Text>

            <Message color={MESSAGE_COLOR.warning} dismissible={false}>
              <MessageIcon name={ICON_NAME.triangleExclamation} />
              <MessageBody>{t('zone_page_reset_warning')}</MessageBody>
            </Message>

            <MinimizedSection
              minimized={minimized}
              onMinimizedChange={setMinimized}
            />

            <ARecordSection
              aType={aType}
              aHosting={aHosting}
              aCustomIp={aCustomIp}
              ipError={ipError}
              hostings={hostings}
              isLoadingHostings={isLoadingHostings}
              onATypeChange={handleATypeChange}
              onHostingChange={setAHosting}
              onIpChange={handleIpChange}
            />

            <MxRecordSection
              mxType={mxType}
              mxEntries={mxEntries}
              availableMxTypes={availableMxTypes}
              onMxTypeChange={setMxType}
              onUpdateEntry={updateMxEntry}
              onAddEntry={addMxEntry}
              onRemoveEntry={removeMxEntry}
            />

            <Message color={MESSAGE_COLOR.information} dismissible={false}>
              <MessageIcon name={ICON_NAME.circleInfo} />
              <MessageBody>{t('zone_page_reset_propagation_info')}</MessageBody>
            </Message>
          </div>

          {/* Footer */}
          <div className="flex gap-4 p-6 border-t flex-shrink-0 mb-6">
            <Button
              variant={BUTTON_VARIANT.ghost}
              onClick={onCloseCallback}
              disabled={isPending}
            >
              {t('zone_page_reset_cancel')}
            </Button>
            <Button
              color={BUTTON_COLOR.critical}
              onClick={handleConfirm}
              disabled={isPending || !isFormValid || isSubDataLoading}
            >
              {isPending ? <Spinner /> : t('zone_page_reset_confirm')}
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
