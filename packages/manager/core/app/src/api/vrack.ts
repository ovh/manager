export type Vrack = {
  serviceName?: string;
  description: string;
  name: string;
};

export async function getVrack(serviceName: string): Promise<Vrack> {
  const response = await fetch(`/engine/api/vrack/${serviceName}`);
  const data = await response.json();
  return {
    serviceName,
    ...data,
  };
}

export default Vrack;
