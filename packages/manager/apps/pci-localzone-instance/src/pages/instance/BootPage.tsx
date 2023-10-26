import Boot from "@/components/instance/Boot";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { LoaderData as DashboardLoaderData } from "./DashboardPage";

export function Component() {
  const { instance } = useRouteLoaderData("instances.dashboard") as DashboardLoaderData;
  const navigate = useNavigate();

  const onClose = () => {
    navigate('..');
  }
  return <>
    <Boot instance={instance} onClose={() => onClose()}/>
  </>
}

Component.displayName = "BootPage";
