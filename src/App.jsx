import { TaskProvider } from './context/TaskContext.jsx';
import { Header } from './components/Header.jsx';
import { DayTabs } from './components/DayTabs.jsx';
import { TaskList } from './components/TaskList.jsx';
import { AddTaskForm } from './components/AddTaskForm.jsx';

export default function App() {
  return (
    <TaskProvider>
      <div className="page-shell">
        <main className="app-card">
          <Header />
          <DayTabs />
          <TaskList />
          <AddTaskForm />
        </main>
      </div>
    </TaskProvider>
  );
}
