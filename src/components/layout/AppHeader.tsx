import { Sun, Moon, FileText, Plus, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppHeaderProps {
  activePage: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onQuickNote: () => void;
  onAddTask: () => void;
  showAddTask: boolean;
}

export function AppHeader({
  activePage,
  theme,
  onToggleTheme,
  onQuickNote,
  onAddTask,
  showAddTask,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />

      <h1 className="text-sm font-semibold text-foreground">{activePage}</h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-8 w-44 pl-8 text-sm bg-muted/50 border-border placeholder:text-muted-foreground focus-visible:ring-ring"
          />
        </div>

        <Button variant="ghost" size="icon" onClick={onToggleTheme} className="h-8 w-8">
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </Button>

        <Button variant="ghost" size="icon" onClick={onQuickNote} className="h-8 w-8">
          <FileText size={15} />
        </Button>

        {showAddTask && (
          <Button size="sm" onClick={onAddTask} className="h-8 gap-1.5">
            <Plus size={14} />
            Add Task
          </Button>
        )}
      </div>
    </header>
  );
}
