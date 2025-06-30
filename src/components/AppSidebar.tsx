
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Scale,
  UserPlus,
  Beef,
  MapPin,
  Search,
  Shield,
  BarChart3
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Register Animal", href: "/register-animal", icon: UserPlus },
  { name: "Weight & Vaccination", href: "/weights-vaccination", icon: Scale },
  { name: "Weight Performance", href: "/performance", icon: TrendingUp },
  { name: "Find Animals", href: "/find-animals", icon: Search },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Quarantine", href: "/quarantine", icon: Shield },
  { name: "Slaughter Recording", href: "/slaughter-recording", icon: Beef },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Investors", href: "/investors", icon: Users },
  { name: "Farms", href: "/farms", icon: MapPin },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";
  
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} border-r border-gray-200 bg-white`}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🐄</span>
            </div>
            <span className="font-bold text-gray-900">LPMS</span>
          </div>
        )}
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                          navIsActive || isActive(item.href)
                            ? "bg-green-50 text-green-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <item.icon className={`${collapsed ? "mr-0" : "mr-3"} h-5 w-5 flex-shrink-0`} />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
