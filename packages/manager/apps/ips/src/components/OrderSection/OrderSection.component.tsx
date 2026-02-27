import React from 'react';

import {
  SPINNER_SIZE,
  TEXT_PRESET,
  Divider,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

export const OrderSection: React.FC<React.PropsWithChildren<{
  title: string;
  description?: string;
  loading?: boolean;
}>> = ({ title, description, loading, children }) => (
  <section className="mb-8 max-w-[1368px]">
    <Text className="mb-3 block" preset={TEXT_PRESET.heading2}>
      {title}
    </Text>
    <Text className="mb-3 block" preset={TEXT_PRESET.paragraph}>
      {description}
    </Text>
    {loading ? (
      <div className="text-center">
        <Spinner size={SPINNER_SIZE.md} />
      </div>
    ) : (
      children
    )}
    <Divider className="mt-8 block" />
  </section>
);
