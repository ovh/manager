import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  FormField,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Spinner,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import {
  useNashaPartitionAccesses,
  useNashaPartitionAuthorizableIps,
  useNashaPartitionAuthorizableBlocks,
  useCreateNashaPartitionAccess,
} from '@/hooks/nasha/useAccesses';
import { formatAclTypeEnum, ipBlockToNumber } from '@/utils/nasha.utils';
import {
  NFS_PROTOCOL,
  READONLY_TYPE,
  PREFIX_TRACKING_PARTITION_ACL,
  NASHA_ACL_TYPE_ENUM,
} from '@/constants/nasha.constants';
import { urls } from '@/routes/Routes.constants';
import type { Nasha, NashaPartition, NashaAccess } from '@/types/nasha.type';

interface PartitionContext {
  nasha: Nasha;
  partition: NashaPartition;
  serviceName: string;
  partitionName: string;
}

interface AuthorizedAccess {
  type: 'IP' | 'IP/Block';
  ip: string;
}

export default function AccessesPage() {
  const { partition, serviceName, partitionName } = useOutletContext<PartitionContext>();
  const { t } = useTranslation('partition');
  const navigate = useNavigate();
  const { tracking } = React.useContext(ShellContext).shell;

  const [isFormShown, setIsFormShown] = useState(false);
  const [selectedIp, setSelectedIp] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [description, setDescription] = useState('');

  const { data: accesses = [], isLoading: isLoadingAccesses, refetch } = useNashaPartitionAccesses(serviceName, partitionName);
  const { data: authorizableIps = [], isLoading: isLoadingIps } = useNashaPartitionAuthorizableIps(serviceName, partitionName, isFormShown);
  const { data: authorizableBlocks = [], isLoading: isLoadingBlocks } = useNashaPartitionAuthorizableBlocks(serviceName, partitionName, isFormShown);
  const createAccess = useCreateNashaPartitionAccess();

  // Filter type options based on protocol
  const typeOptions = useMemo(() => {
    return NASHA_ACL_TYPE_ENUM.filter((type) =>
      type === READONLY_TYPE ? partition.protocol === NFS_PROTOCOL : true,
    ).map((type) => ({
      value: type,
      label: formatAclTypeEnum(type, t),
    }));
  }, [partition.protocol, t]);

  // Prepare authorized accesses list
  const authorizedAccesses = useMemo<AuthorizedAccess[]>(() => {
    const existingIps = new Set(accesses.map((a) => a.ip));
    
    const ips: AuthorizedAccess[] = authorizableIps
      .filter((ip: string) => !existingIps.has(`${ip}/32`))
      .map((ip: string) => ({ type: 'IP' as const, ip }));
    
    const blocks: AuthorizedAccess[] = authorizableBlocks
      .filter((block: string) => !existingIps.has(block))
      .map((block: string) => ({ type: 'IP/Block' as const, ip: block }));

    return [...ips, ...blocks].sort(
      (a, b) => ipBlockToNumber(a.ip) - ipBlockToNumber(b.ip),
    );
  }, [authorizableIps, authorizableBlocks, accesses]);

  const isLoadingForm = isLoadingIps || isLoadingBlocks;

  const handleShowForm = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_PARTITION_ACL}::add-access`,
      type: 'action',
    });
    setIsFormShown(true);
    setSelectedIp('');
    setSelectedType('');
    setDescription('');
  };

  const handleHideForm = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_PARTITION_ACL}::cancel-add-access`,
      type: 'action',
    });
    setIsFormShown(false);
  };

  const handleSubmit = async () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_PARTITION_ACL}::confirm-add-access`,
      type: 'action',
    });

    try {
      await createAccess.mutateAsync({
        serviceName,
        partitionName,
        data: {
          ip: selectedIp,
          type: selectedType,
          aclDescription: description || undefined,
        },
      });
      setIsFormShown(false);
      refetch();
    } catch (error) {
      // Error handling is done via React Query
    }
  };

  const handleDeleteClick = (ip: string) => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_PARTITION_ACL}::delete-access`,
      type: 'action',
    });
    navigate(urls.partitionAccessDelete(serviceName, partitionName, ip));
  };

  const canCreateAccess = selectedIp && selectedType && !createAccess.isPending;
  const canShowForm = !isFormShown && !isLoadingAccesses && !isLoadingForm;

  const columns: DatagridColumn<NashaAccess>[] = [
    {
      id: 'ip',
      label: 'IP',
      cell: (access) => access.ip,
    },
    {
      id: 'type',
      label: t('nasha_dashboard_partition_accesses_list_type'),
      cell: (access) => formatAclTypeEnum(access.type, t),
    },
    {
      id: 'aclDescription',
      label: t('nasha_dashboard_partition_accesses_list_description'),
      cell: (access) => access.aclDescription || '-',
    },
    {
      id: 'actions',
      label: '',
      cell: (access) => (
        <Button
          variant={BUTTON_VARIANT.ghost}
          color={BUTTON_COLOR.critical}
          onClick={() => handleDeleteClick(access.ip)}
          aria-label={t('nasha_dashboard_partition_accesses_delete')}
        >
          {t('nasha_dashboard_partition_accesses_delete')}
        </Button>
      ),
    },
  ];

  return (
    <div className="py-4">
      {/* Header */}
      <div className="mb-6">
        <Text preset={TEXT_PRESET.heading4} className="mb-2">
          {t('nasha_dashboard_partition_accesses_heading')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph} className="text-gray-600">
          {t('nasha_dashboard_partition_accesses_description')}
        </Text>
      </div>

      <Text preset={TEXT_PRESET.heading5} className="mb-4">
        {t('nasha_dashboard_partition_accesses_subtitle')}
      </Text>

      {/* Add Access Button */}
      <div className="mb-4 flex items-center gap-2">
        <Button
          color={BUTTON_COLOR.primary}
          onClick={handleShowForm}
          disabled={!canShowForm}
        >
          {t('nasha_dashboard_partition_accesses_create')}
        </Button>
        {isLoadingForm && <Spinner size="sm" />}
      </div>

      {/* Add Access Form */}
      {isFormShown && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* IP Select */}
            <FormField>
              <Text preset={TEXT_PRESET.caption} className="mb-1 block">
                IP
              </Text>
              <Select value={selectedIp} onValueChange={setSelectedIp}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('nasha_dashboard_partition_accesses_select_ip')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>IP</SelectLabel>
                    {authorizedAccesses
                      .filter((a) => a.type === 'IP')
                      .map((access) => (
                        <SelectItem key={access.ip} value={access.ip}>
                          {access.ip}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>IP/Block</SelectLabel>
                    {authorizedAccesses
                      .filter((a) => a.type === 'IP/Block')
                      .map((access) => (
                        <SelectItem key={access.ip} value={access.ip}>
                          {access.ip}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormField>

            {/* Type Select */}
            <FormField>
              <Text preset={TEXT_PRESET.caption} className="mb-1 block">
                {t('nasha_dashboard_partition_accesses_list_type')}
              </Text>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('nasha_dashboard_partition_accesses_select_type')} />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Description Input */}
            <FormField>
              <Text preset={TEXT_PRESET.caption} className="mb-1 block">
                {t('nasha_dashboard_partition_accesses_list_description')}
              </Text>
              <Input
                type="text"
                name="aclDescription"
                value={description}
                onOdsChange={(e) => setDescription(e.detail.value || '')}
              />
            </FormField>

            {/* Actions */}
            <div className="flex gap-2">
              {createAccess.isPending && <Spinner size="sm" />}
              <Button
                color={BUTTON_COLOR.primary}
                onClick={handleSubmit}
                disabled={!canCreateAccess}
              >
                {t('nasha_dashboard_partition_accesses_confirm')}
              </Button>
              <Button
                variant={BUTTON_VARIANT.outline}
                color={BUTTON_COLOR.neutral}
                onClick={handleHideForm}
                disabled={createAccess.isPending}
              >
                {t('nasha_dashboard_partition_accesses_cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Accesses Datagrid */}
      <Datagrid
        columns={columns}
        items={accesses}
        totalItems={accesses.length}
        isLoading={isLoadingAccesses}
      />

      {/* Outlet for delete modal */}
      <Outlet />
    </div>
  );
}

