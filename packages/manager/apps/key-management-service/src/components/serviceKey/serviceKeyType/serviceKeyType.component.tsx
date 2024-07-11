import React from 'react';
import { OkmsKeyTypes } from '@/types/okmsServiceKey.type';
import { TileValue } from '@/components/dashboard/tileValue/tileValue.component';
import { useServiceKeyTypeTranslations } from '@/hooks/serviceKey/useServiceKeyTypeTranslations';

type KeyStatusProps = {
  type: OkmsKeyTypes;
};

export const ServiceKeyType = ({ type }: KeyStatusProps) => {
  const translatedValue = useServiceKeyTypeTranslations(type);

  return <TileValue value={translatedValue} />;
};
