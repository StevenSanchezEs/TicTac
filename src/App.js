import { TodoCounter } from './components/TodoCounter/TodoCounter';
import { TodoSearch } from './components/TodoSearch/TodoSearch';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { useTodos } from './hooks/useTodos';
import { TaskSkeleton } from './components/TaskSkeleton';
import { TodoForm } from './components/TodoForm/TodoForm';
import './App.css'
import { Modal } from './components/Modal/Modal';
import { useEffect, useState } from 'react';
import { LaneManager } from './components/LaneManager/LaneManager';
import { ProjectManager } from './components/ProjectManager/ProjectManager';

/* const defaultTodos = [
  { text: 'Cortar cebolla', completed: true},
  { text: 'Completar el curso de React', completed: false},
  { text: 'Llorar con la Llorona', completed: false},
  { text: 'LALALALA', completed: false},
  { text: 'Mostrar al Mr. James mis avances', completed: true},
  { text: 'Comprar la comida', completed: true},
  { text: 'Hacer ejercicio', completed: false},
  { text: 'Comer saludable', completed: false},
]; */

function App() {
  
  const {
    todos,
    filters,
    setFilters,
    completedTodos,
    totalTodos,
    searchedTodos,
    onCompleted,
    onDelete,
    loading,
    setIsOpen,
    isOpen,
    addTask,
    moveTask,
    updateTask,
    addProject,
    renameProject,
    deleteProject,
    lanes,
    projects,
    addLane,
    renameLane,
    moveLane,
    reorderLane,
    deleteLane,
    doneLaneId,
    setDoneLane,
  } = useTodos();
  const [modalMode, setModalMode] = useState('task');
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [draggedLaneId, setDraggedLaneId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('tictac-theme') || 'light');
  const [settingsSection, setSettingsSection] = useState('lanes');
  const isDarkTheme = theme === 'dark';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('tictac-theme', theme);
  }, [theme]);

  const openModal = (mode) => {
    setModalMode(mode);
    setIsOpen(true);
  };

  const handleDropTask = (laneId) => {
    if (draggedTaskId) moveTask(draggedTaskId, laneId);
    setDraggedTaskId(null);
  };

  const handleDropLane = (targetLaneId) => {
    if (draggedLaneId) reorderLane(draggedLaneId, targetLaneId);
    setDraggedLaneId(null);
  };
  
  return (
    <main className="appShell">
      <header className="appHeader">
        <div>
          <p className="eyebrow">ORGANIZA TU DÍA</p>
          <h1>Mi tablero</h1>
          <TodoCounter completed={loading ? 0 : completedTodos} total={loading ? 0 : totalTodos}/>
        </div>
        <div className="headerActions">
          <button
            className="themeButton"
            type="button"
            onClick={() => setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark')}
            aria-label={isDarkTheme ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            aria-pressed={isDarkTheme}
          >
            <i className={`bi ${isDarkTheme ? 'bi-sun' : 'bi-moon-stars'}`}></i>
            {isDarkTheme ? 'Tema claro' : 'Tema oscuro'}
          </button>
          <button className="primaryButton" onClick={() => openModal('task')}>
            <span>+</span> Nueva tarea
          </button>
          <button className="profileButton" onClick={() => openModal('settings')} aria-label="Abrir perfil y configuración">
            <i className="bi bi-person-circle"></i>
            Perfil
          </button>
        </div>
      </header>

      <TodoSearch
        filters={filters}
        setFilters={setFilters}
        lanes={lanes}
        projects={projects}
      />
      <section className="board" aria-label="Tablero de tareas">
        {lanes.map(lane => {
          const laneTodos = searchedTodos.filter(todo => (todo.laneId || 'todo') === lane.id);
          return (
            <TodoList
              key={lane.id}
              lane={lane}
              count={laneTodos.length}
              isDoneLane={lane.id === doneLaneId}
              onDropTask={() => handleDropTask(lane.id)}
              isDraggingTask={Boolean(draggedTaskId)}
              onDropLane={() => handleDropLane(lane.id)}
              isDraggingLane={Boolean(draggedLaneId)}
              onLaneDragStart={() => setDraggedLaneId(lane.id)}
              onLaneDragEnd={() => setDraggedLaneId(null)}
            >
              {loading ? <TaskSkeleton /> : laneTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  {...todo}
                  lanes={lanes}
                  projects={projects}
                  onCompleted={() => onCompleted(todo.id)}
                  onDelete={() => onDelete(todo.id)}
                  onUpdate={(text, dueAt, projectId) => updateTask(todo.id, text, dueAt, projectId)}
                  onMove={(laneId) => moveTask(todo.id, laneId)}
                  onDragStart={() => setDraggedTaskId(todo.id)}
                  onDragEnd={() => setDraggedTaskId(null)}
                />
              ))}
            </TodoList>
          );
        })}
      </section>
      {/* <CreateTodoButton onClick={() => openModal('task')}/> */}
      {isOpen && (
        <Modal setIsOpen={setIsOpen}>
          {modalMode === 'settings' ? (
            <section className="settingsPanel" aria-labelledby="settings-title">
              <button type="button" className="settingsClose" onClick={() => setIsOpen(false)} aria-label="Cerrar">×</button>
              <div className="settingsHeader">
                <p className="eyebrow">PERFIL Y CONFIGURACIÓN</p>
                <h1 id="settings-title">Configurar tablero</h1>
              </div>
              <div className="settingsTabs" role="tablist" aria-label="Módulos de configuración">
                <button
                  type="button"
                  className={settingsSection === 'lanes' ? 'settingsTabActive' : ''}
                  onClick={() => setSettingsSection('lanes')}
                  role="tab"
                  aria-selected={settingsSection === 'lanes'}
                >
                  <i className="bi bi-kanban"></i>
                  Carriles
                </button>
                <button
                  type="button"
                  className={settingsSection === 'projects' ? 'settingsTabActive' : ''}
                  onClick={() => setSettingsSection('projects')}
                  role="tab"
                  aria-selected={settingsSection === 'projects'}
                >
                  <i className="bi bi-folder2-open"></i>
                  Proyectos
                </button>
              </div>
              <div className="settingsContent">
                {settingsSection === 'lanes' ? (
                  <LaneManager
                    lanes={lanes}
                    todos={todos}
                    addLane={addLane}
                    renameLane={renameLane}
                    moveLane={moveLane}
                    deleteLane={deleteLane}
                    doneLaneId={doneLaneId}
                    setDoneLane={setDoneLane}
                    embedded
                  />
                ) : (
                  <ProjectManager
                    projects={projects}
                    todos={todos}
                    addProject={addProject}
                    renameProject={renameProject}
                    deleteProject={deleteProject}
                  />
                )}
              </div>
            </section>
          ) : (
            <TodoForm
              mode={modalMode}
              setIsOpen={setIsOpen}
              addTask={addTask}
              addLane={addLane}
              addProject={addProject}
              lanes={lanes}
              projects={projects}
            />
          )}
        </Modal>
      )}
    </main>
  );
}

export default App;
