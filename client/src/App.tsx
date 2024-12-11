import  { useState, useEffect } from 'react';
import GanttChart from './components/GanttChart';

export interface Task {
  id: string;
  name: string;
  assigned_to: string;
  start: string; 
  end: string; 
  progress: number;
}
const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tasks');
        const data = await response.json();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center">
          <p>Loading . . .</p>
        </div>
      ) : (
        <GanttChart tasks={tasks} />
      )}
    </div>
  );
};

export default App;
