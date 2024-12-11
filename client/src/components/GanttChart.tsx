import React from "react";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

interface Task {
  id: string;
  name: string;
  assigned_to: string;
  start: string; // Can be of type string or Date
  end: string; // Can be of type string or Date
  progress: number;
}

const GanttChart: React.FC = () => {
  // Define the tasks with their start and end dates, and progress

  const tasks: Task[] = [
    {
      id: "1",
      assigned_to: "mahesh desilva",
      name: "Analysis",
      start: "2024-12-01",
      end: "2024-12-05",
      progress: 100,
    },
    {
      id: "2",
      name: "Write",
      assigned_to: "Prashant kishore",
      start: "2024-12-06",
      end: "2024-12-09",
      progress: 25,
    },
    {
      id: "3",
      name: "Cite",
      assigned_to: "Neeraj Kartikeyan",
      start: "2024-12-10",
      end: "2024-12-11",
      progress: 20,
    },
    {
      id: "4",
      name: "Complete",
      assigned_to: "H shivakumar",
      start: "2024-12-12",
      end: "2024-12-13",
      progress: 0,
    },
    {
      id: "5",
      name: "Outline",
      start: "2024-12-01",
      assigned_to: "Prateek Mallikarjun",
      end: "2024-12-02",
      progress: 100,
    },
  ];
  const DDMenu: React.FC<{ task: Task }> = ({ task }) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
      <ChevronDown  color="white"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-sm">
          <strong>Task:</strong> {task.name}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <strong>Assigned To:</strong> {task.assigned_to}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <strong>Start:</strong> {new Date(task.start).toLocaleDateString()}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <strong>End:</strong> {new Date(task.end).toLocaleDateString()}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <strong>Progress:</strong> {task.progress}%
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const chartStartDate = new Date("2024-12-01");
  const chartEndDate = new Date("2024-12-15");

  // Calculate the total duration in days for the chart
  const totalDays = Math.ceil(
    (chartEndDate.getTime() - chartStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Utility to calculate task position and duration
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
    <div className="overflow-x-auto p-4">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        {/* Header row */}
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

        {/* Task rows */}
        <tbody>
          {tasks.map((task) => {
            const { startOffset, duration } = calculatePosition(
              task.start,
              task.end
            );
            return (
              <tr key={task.id} className="even:bg-gray-50">
                <td className="p-2 font-medium">{task.name}</td>
                {[...Array(totalDays).keys()].map((day) => {
                  const isPartOfTask =
                    day >= startOffset && day < startOffset + duration;
                  console.log({ day, startOffset, isPartOfTask });

                  return (
                    <td
                      key={day}
                      className={` h-8 text-center border-t border-gray-100`}
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
