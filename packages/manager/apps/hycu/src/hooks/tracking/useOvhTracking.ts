import * as React from 'react'
import { useMatches, useRouter } from '@tanstack/react-router'
import {
  getClickProps,
  getPageProps,
  PageType,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client'

type TrackingMeta = {
  tracking?: {
    pageType?: PageType
    pageName?: string
  }
}

const usePageTracking = () => {
  const matches = useMatches()
  const router = useRouter()

  const lastMatch = matches[matches.length - 1]
  const lastRoute = lastMatch ? router.looseRoutesById[lastMatch.routeId] : undefined

  return (lastRoute?.options?.staticData as TrackingMeta | undefined)?.tracking
}

export const useOvhTracking = () => {
  const pageTracking = usePageTracking()
  const { shell, tracking, environment } = React.useContext(ShellContext)

  const region = environment?.getRegion?.()
  const level2 =
    (region && tracking?.level2Config?.[region]?.config?.level2) ||
    tracking?.level2

  return {
    trackCurrentPage: () => {
      if (tracking && pageTracking) {
        shell?.tracking?.trackPage(
          getPageProps({
            ...tracking,
            ...pageTracking,
            level2,
          }),
        )
      }
    },
    trackPage: (params: Parameters<typeof getPageProps>[0]) => {
      if (tracking) {
        shell?.tracking?.trackPage(
          getPageProps({
            ...tracking,
            ...params,
            level2,
          }),
        )
      }
    },
    trackClick: (
      params: Omit<Parameters<typeof getClickProps>[0], keyof TrackingMeta> &
        Partial<TrackingMeta>,
    ) => {
      shell?.tracking?.trackClick(
        getClickProps({
          ...tracking,
          ...pageTracking,
          ...params,
          level2,
        } as any),
      )
    },
  }
}

