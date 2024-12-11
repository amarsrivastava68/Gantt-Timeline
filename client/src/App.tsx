import GanttChart from './components/GanttChart'
import { useState } from 'react';
const App = () => {
  
  const [tasks , setTasks ] = useState([])
  return (
    <div>
      <GanttChart tasks = {tasks}/>
   
    </div>
  )
}

export default App
