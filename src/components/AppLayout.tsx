import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { useGrainMonitor } from "@/hooks/use-grain-monitor";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const { data, lastUpdated, refresh } = useGrainMonitor();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar
            lastUpdated={lastUpdated}
            alertCount={data?.alerts.length ?? 0}
            alerts={data?.alerts ?? []}
            onRefresh={refresh}
          />
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
