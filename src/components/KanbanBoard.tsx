import { MoreHorizontal, Calendar, User, Flag, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "progress" | "completed";
  dueDate?: string;
  assignee?: string;
  createdAt: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskStatusChange: (taskId: string, newStatus: Task["status"]) => void;
}

const KanbanBoard = ({ tasks, onTaskEdit, onTaskDelete, onTaskStatusChange }: KanbanBoardProps) => {
  const columns = [
    {
      id: "todo",
      title: "To Do",
      status: "todo" as const,
      color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
      headerColor: "text-blue-700 dark:text-blue-300"
    },
    {
      id: "progress", 
      title: "In Progress",
      status: "progress" as const,
      color: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
      headerColor: "text-orange-700 dark:text-orange-300"
    },
    {
      id: "completed",
      title: "Completed", 
      status: "completed" as const,
      color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
      headerColor: "text-green-700 dark:text-green-300"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter(task => task.status === column.status);
        
        return (
          <div key={column.id} className="space-y-4">
            {/* Column Header */}
            <Card className={`${column.color} border-2`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm font-semibold ${column.headerColor} flex items-center justify-between`}>
                  <span>{column.title}</span>
                  <Badge variant="secondary" className="bg-white/50 dark:bg-black/20">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Task Cards */}
            <div className="space-y-3 min-h-[400px]">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  className="bg-card hover:shadow-task-hover transition-all duration-200 cursor-pointer group border border-border/50"
                  onClick={() => onTaskEdit(task)}
                >
                  <CardContent className="p-4">
                    {/* Header with priority and actions */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-medium ${getPriorityColor(task.priority)}`}
                      >
                        <Flag className="h-3 w-3 mr-1" />
                        {task.priority}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onTaskEdit(task);
                          }}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {task.status !== "todo" && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onTaskStatusChange(task.id, "todo");
                            }}>
                              Move to To Do
                            </DropdownMenuItem>
                          )}
                          {task.status !== "progress" && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onTaskStatusChange(task.id, "progress");
                            }}>
                              Move to In Progress
                            </DropdownMenuItem>
                          )}
                          {task.status !== "completed" && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onTaskStatusChange(task.id, "completed");
                            }}>
                              Move to Completed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskDelete(task.id);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Task Title */}
                    <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">
                      {task.title}
                    </h3>

                    {/* Task Description */}
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Footer with due date and assignee */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {task.dueDate && (
                        <div className={`flex items-center gap-1 ${
                          isOverdue(task.dueDate) && task.status !== "completed" 
                            ? "text-destructive" 
                            : ""
                        }`}>
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="truncate max-w-[100px]">{task.assignee}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Empty State */}
              {columnTasks.length === 0 && (
                <Card className="border-dashed border-2 border-muted-foreground/20">
                  <CardContent className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground text-sm">No tasks</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;