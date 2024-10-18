import { useFeatureAvailability } from "@ovh-ux/manager-react-components"
import { useQuery } from "@tanstack/react-query"

const COMMON_HEADER = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  } as const

export type ProcedureResponse = {
  status: string
}

export async function fetchIdentityProcedure(): Promise<ProcedureResponse> {
  return (await fetch('/engine/me/procedure/identity', COMMON_HEADER)).json()
}

export function useProcedureIdentity() {
  const {data: featureList, isSuccess} =  useFeatureAvailability(['identity-documents'])


  return useQuery<ProcedureResponse>({
    queryKey: ["procedure", "identity"],
    queryFn: fetchIdentityProcedure,
    enabled: () => isSuccess && featureList?.['identity-documents']
  })
}
