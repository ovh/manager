import Boot from "@/components/instance/Boot";
import { LoaderFunction, useLoaderData, useNavigate } from "react-router-dom";

export type LoaderData = {
  instance: { id: string };
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const instanceId = url.searchParams.get("instanceId");

  return {
    instance: { id: instanceId }
  }
}

export function Component() {
  const { instance } = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  }
  return <>
    <Boot instance={instance} onClose={() => onClose()}/>
  </>
}

Component.displayName = 'BootPage';
