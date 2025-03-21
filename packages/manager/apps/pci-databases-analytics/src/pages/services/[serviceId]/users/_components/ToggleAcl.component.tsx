import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Switch, useToast } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import * as database from '@/types/cloud/project/database';

const ToggleAcl = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const { projectId, service, serviceQuery } = useServiceData<
    database.opensearch.Service
  >();
  const aclsEnabled = !!('aclsEnabled' in service && service.aclsEnabled);
  const [switchState, setSwitchState] = useState(aclsEnabled);

  const toast = useToast();
  const { editService, isPending } = useEditService<
    database.opensearch.Service
  >({
    onError: (err) => {
      toast.toast({
        title: t('toggleAclErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      setSwitchState(aclsEnabled);
    },
    onEditSuccess: (updatedService) => {
      toast.toast({
        title: t('toggleAclSuccessTitle'),
        description: updatedService.aclsEnabled
          ? t('toggleAclEnabledSuccessDescription')
          : t('toggleAclADisabledSuccessDescription'),
      });
      serviceQuery.refetch();
    },
  });

  useEffect(() => {
    setSwitchState(service.aclsEnabled);
  }, [service.aclsEnabled]);

  const handleSwitchChange = (newValue: boolean) => {
    setSwitchState(newValue);
    editService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        aclsEnabled: newValue,
      },
    });
  };
  return (
    <div className="flex items-center gap-2 !mb-4" data-testid="toggle-acl">
      <Switch
        checked={switchState}
        disabled={
          isPending ||
          service.capabilities.userAcls?.update !==
            database.service.capability.StateEnum.enabled
        }
        onCheckedChange={handleSwitchChange}
      />
      <Label htmlFor="airplane-mode">{t('toggleACLsLabel')}</Label>
    </div>
  );
};

export default ToggleAcl;
