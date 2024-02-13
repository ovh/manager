import { useEffect, useState } from 'react';
import { Params, useMatches } from 'react-router-dom';
import { useShell, useNavigation } from '@ovh-ux/manager-react-shell-client';

type BreadcrumbItem = {
  label: string | undefined;
  href: string;
};

type BreadcrumbHandleParams = {
  data: unknown;
  params: Params<string>;
};

type BreadcrumbHandle = (params: BreadcrumbHandleParams) => Promise<string>;

type MatchHandle = {
  breadcrumb?: BreadcrumbHandle;
};

export interface BreadcrumbProps {
  rootLabel?: string;
  appName?: string;
}

const isMatchHandle = (obj: any): obj is MatchHandle => {
  return obj && typeof obj === 'object' && 'breadcrumb' in obj;
};

export const useBreadcrumb = ({ rootLabel, appName }: BreadcrumbProps) => {
  const matches = useMatches();
  const shell = useShell();
  const navigation = useNavigation();

  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const [matchCrumbs, setMatchCrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = await navigation.getURL(appName, '#/', {});

        const rootItem = {
          label: rootLabel,
          href: String(response),
        };
        setRoot([rootItem]);
      } catch (error) {
        console.error('Error fetching root URL:', error);
      }
    };

    fetchRoot();
  }, [rootLabel, appName, navigation]);

  useEffect(() => {
    const fetchMatchCrumbs = async () => {
      try {
        const items = await Promise.all(
          matches.map(async (match) => {
            const { handle, data, params } = match;

            if (isMatchHandle(handle)) {
              const breadcrumb = await handle.breadcrumb;
              const label = await breadcrumb?.({ data, params });

              return {
                label: label ?? '',
                href: match.pathname,
              } as BreadcrumbItem;
            }
            return {
              label: match.params.serviceName,
              href: match.pathname,
            };
          }),
        );
        const validCrumbs = items.filter(
          ({ label, href }) => label !== undefined && !!href,
        );
        setMatchCrumbs(validCrumbs);
      } catch (error) {
        console.error('Error fetching breadcrumbs:', error);
      }
    };

    fetchMatchCrumbs();
  }, [matches]);

  return [...root, ...matchCrumbs].filter(
    (crumb) => crumb.label !== undefined && crumb.label !== '',
  );
};
