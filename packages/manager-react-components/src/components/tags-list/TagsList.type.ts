import { ElementRef } from 'react';
import { Badge } from '@ovhcloud/ods-react';

export type TagsObj = { [key: string]: string };

export type HTMLBadgeElement = ElementRef<typeof Badge>;
