import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
interface Task {
  id: string;
  name: string;
  assigned_to: string;
  start: string; // Can be of type string or Date
  end: string; // Can be of type string or Date
  progress: number;
}

const GanttChart: React.FC = () => {
  const [isGMT, setIsGMT] = useState(true); // State to toggle between GMT and IST

  const toggleTimeZone = () => setIsGMT(!isGMT);

  const tasks: Task[] = [
    {
      id: "1",
      assigned_to: "mahesh desilva",
      name: "Analysis",
      start: "2024-12-01T00:00:00Z",
      end: "2024-12-05T23:59:59Z",
      progress: 100,
    },
    {
      id: "2",
      name: "Writing",
      assigned_to: "Prashant kishore",
      start: "2024-12-06T00:00:00Z",
      end: "2024-12-09T23:59:59Z",
      progress: 25,
    },
    {
      id: "3",
      name: "Citing",
      assigned_to: "Neeraj Kartikeyan",
      start: "2024-12-10T00:00:00Z",
      end: "2024-12-11T23:59:59Z",
      progress: 20,
    },
    {
      id: "4",
      name: "Design",
      assigned_to: "H shivakumar",
      start: "2024-12-12T00:00:00Z",
      end: "2024-12-13T23:59:59Z",
      progress: 0,
    },
    {
      id: "5",
      name: "Outline",
      start: "2024-12-01T00:00:00Z",
      assigned_to: "Prateek Mallikarjun",
      end: "2024-12-02T23:59:59Z",
      progress: 100,
    },
  ];

  const formatDateTime = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: isGMT ? "GMT" : "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  const DDMenu: React.FC<{ task: Task }> = ({ task }) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <ChevronDown color="white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-sm">
          <strong>Task:</strong> {task.name}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <strong>Assigned To:</strong> {task.assigned_to}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <strong>Start:</strong> {formatDateTime(task.start)}
          <span>{isGMT ? "(GMT Timezone)" : "( Indian Timezone ) "}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <strong>End:</strong> {formatDateTime(task.end)}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <strong>Progress:</strong> {task.progress}%
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const chartStartDate = new Date("2024-12-01");
  const chartEndDate = new Date("2024-12-15");

  const totalDays = Math.ceil(
    (chartEndDate.getTime() - chartStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const calculatePosition = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startOffset = Math.ceil(
      (startDate.getTime() - chartStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const duration = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { startOffset, duration };
  };

  return (
    <div className="overflow-x-auto p-4 relative">
      <div className="flex items-center gap-2">
        <Switch checked={isGMT} onCheckedChange={toggleTimeZone} />{" "}
        <Label> GMT Timezone</Label>
      </div>
      <h1 className="text-lg font-semibold fixed top-0 right-0 mt-1  bg-white p-2 z-10">
        Gantt Chart
      </h1>

      <table className="min-w-full overflow-x-auto mt-20 table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left font-semibold">Task</th>
            {[...Array(totalDays).keys()].map((day) => (
              <th
                key={day}
                className="p-2 text-xs text-center border-t border-gray-300"
              >
                {new Date(
                  chartStartDate.getTime() + day * 86400000
                ).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const { startOffset, duration } = calculatePosition(
              task.start,
              task.end
            );
            return (
              <tr key={task.id} className="even:bg-gray-50">
                <td className="p-2 font-medium w-90">{task.name}</td>
                {[...Array(totalDays).keys()].map((day) => {
                  const isPartOfTask =
                    day >= startOffset && day < startOffset + duration;

                  return (
                    <td
                      key={day}
                      className={`h-8 text-center border-t border-gray-100`}
                    >
                      {isPartOfTask && day === startOffset && duration === 1 ? (
                        <div className="bg-blue-500 rounded-lg h-2/3">
                          <DDMenu task={task} />
                        </div>
                      ) : isPartOfTask && day === startOffset ? (
                        <div className="bg-blue-500 rounded-l-lg h-2/3">
                          <DDMenu task={task} />
                        </div>
                      ) : isPartOfTask && day === startOffset + duration - 1 ? (
                        <div className="bg-blue-500 rounded-r-lg h-2/3"></div>
                      ) : isPartOfTask ? (
                        <div className="bg-blue-500 h-2/3"></div>
                      ) : (
                        <div className="bg-gray-100 h-full"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GanttChart;
