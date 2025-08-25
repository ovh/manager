export interface PrometheusQueryParams {
  query: string;
  start: number | string;
  end: number | string;
  step: number | string;
}

export interface PrometheusResult {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      metric: Record<string, string>;
      values: [number, string][];
    }>;
  };
}

export const fetchPrometheusData = async (
  params: PrometheusQueryParams,
): Promise<PrometheusResult> => {
  const url = new URL('https://demo.promlabs.com/api/v1/query_range');
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString()),
  );

  const res = await fetch(url.toString());
  if (!res.ok)
    throw new Error(`Failed to fetch Prometheus data: ${res.status}`);
  return res.json();
};
