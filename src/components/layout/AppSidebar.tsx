import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  FolderKanban,
  GraduationCap,
  Plus,
  PenLine,
  Sparkles,
} from "lucide-react";

const navItems = [
  { id: "Dashboard", title: "Dashboard", icon: LayoutDashboard },
  { id: "Calendar", title: "Calendar", icon: CalendarDays },
  { id: "Notepad", title: "Notepad", icon: BookOpen },
  { id: "Projects", title: "Projects", icon: FolderKanban },
  { id: "Learnings", title: "Learnings", icon: GraduationCap },
];

interface AppSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onAddTask: () => void;
  onQuickNote: () => void;
}

export function AppSidebar({ activePage, onNavigate, onAddTask, onQuickNote }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles size={15} />
          </div>
          <div className="group-data-[collapsible=icon]:hidden min-w-0">
            <p className="text-sm font-semibold leading-none text-sidebar-foreground">Habit Tracker</p>
            <p className="mt-0.5 text-xs text-sidebar-foreground/60 truncate">Plan, note &amp; review</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activePage === item.id}
                    tooltip={item.title}
                    onClick={() => onNavigate(item.id)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarSeparator />
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Add Task" onClick={onAddTask}>
                  <Plus />
                  <span>Add Task</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Quick Note" onClick={onQuickNote}>
                  <PenLine />
                  <span>Quick Note</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs font-semibold bg-sidebar-primary text-sidebar-primary-foreground">
              MT
            </AvatarFallback>
          </Avatar>
          <div className="group-data-[collapsible=icon]:hidden min-w-0">
            <p className="text-sm font-medium leading-none text-sidebar-foreground">Mourya</p>
            <p className="mt-0.5 text-xs text-sidebar-foreground/60 truncate">Personal workspace</p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
