'use client';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { ListOrdered , Home, Package , Star , Users  } from "lucide-react"


const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Create",
      url: "/create",
      icon: Package ,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ListOrdered,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    {
      title: "Review",
      url: "/reviews",
      icon: Star,
    },
  ]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
      <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} style={{
                        fontSize: '1rem'
                    }}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
