import { OdsSelect } from '@ovhcloud/ods-components/react';
import { useObservabilityServices } from '@/data/hooks/useObservability';

export interface ObsServiceSelectorProps {
  initialServiceId?: string;
  onServiceChange?: (serviceId: string) => void;
}

export const ObsServiceSelector = ({
  initialServiceId,
  onServiceChange,
}: Readonly<ObsServiceSelectorProps>): JSX.Element => {
  const { data: services, isLoading } = useObservabilityServices();

  const handleChange = (v: CustomEvent) => {
    const value = v.detail.value ?? '';
    if (value) {
      onServiceChange?.(value);
    }
  };

  return (
    <OdsSelect
      value={initialServiceId}
      isDisabled={isLoading}
      className="md:w-[400px] sm:w-full"
      name="service-selector"
      placeholder="Select a service"
      onOdsChange={handleChange}
    >
      {services?.map((service) => (
        <option key={service.id} value={service.id}>
          {service.currentState.displayName ?? service.id}
        </option>
      ))}
    </OdsSelect>
  );
};
