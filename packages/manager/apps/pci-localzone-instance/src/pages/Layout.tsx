import BreadCrumbs from "@/components/BreadCrumbs";
import { ShellRoutingSync } from "@/core/ShellRoutingSync";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <BreadCrumbs />
      <ShellRoutingSync />
      <Outlet />
    </>
  );
}
