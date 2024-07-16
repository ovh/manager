import React from 'react';
import { OkmsKeyTypes } from '@/types/okmsServiceKey.type';
import { TileValue } from '@/components/dashboard/tile-value/tileValue.component';
import { useServiceKeyTypeTranslations } from '@/hooks/serviceKey/useServiceKeyTypeTranslations';

type KeyStatusProps = {
  type: OkmsKeyTypes;
  isText?: boolean;
};

export const ServiceKeyType = ({ type, isText = false }: KeyStatusProps) => {
  const translatedValue = useServiceKeyTypeTranslations(type);

  return <TileValue value={translatedValue} isText={isText} />;
};
