import React from 'react'
import { Navigate } from '@tanstack/react-router'
import { OsdsSpinner } from '@ovhcloud/ods-components/react'
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components'

type Props = {
  route: string
  condition: boolean
  isLoading?: boolean
  isError?: boolean
  errorComponent?: React.ReactNode
  children: React.ReactNode
}

/**
 * TanStack Router compatible replacement for `@ovh-ux/manager-react-components`'s
 * RedirectionGuard (which uses react-router-dom's <Navigate />).
 */
export function RedirectionGuard({
  route,
  condition,
  isLoading,
  children,
  isError,
  errorComponent,
}: Props) {
  if (isLoading) {
    return (
      <OsdsSpinner
        data-testid="redirectionGuard_spinner"
        size={ODS_SPINNER_SIZE.md}
        inline
      />
    )
  }

  if (isError && errorComponent) {
    return <>{errorComponent}</>
  }

  return condition ? <Navigate to={route} /> : <>{children}</>
}

export default RedirectionGuard

