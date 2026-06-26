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
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isDetailEditing, setIsDetailEditing] = useState(false);
  const [detailText, setDetailText] = useState('');
  const [detailDueAt, setDetailDueAt] = useState('');
  const [detailProjectId, setDetailProjectId] = useState('none');
  const isDarkTheme = theme === 'dark';
  const selectedProject = projects.find(project => project.id === filters.projectId);
  const workspaceLabel = selectedProject?.name || (filters.projectId === 'none' ? 'Sin proyecto' : 'Todos los proyectos');
  const selectedTodoProject = selectedTodo
    ? projects.find(project => project.id === selectedTodo.projectId)
    : null;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('tictac-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!selectedTodo) return;
    setIsDetailEditing(false);
    setDetailText(selectedTodo.text);
    setDetailDueAt(selectedTodo.dueAt ? selectedTodo.dueAt.slice(0, 16) : '');
    setDetailProjectId(selectedTodo.projectId || 'none');
  }, [selectedTodo]);

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

  const formatTaskDate = (date) => {
    if (!date) return 'Sin registro';
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  const closeTaskDetail = () => {
    setSelectedTodo(null);
    setIsDetailEditing(false);
  };

  const saveTaskDetail = (event) => {
    event.preventDefault();
    if (!selectedTodo) return;

    const nextProjectId = detailProjectId === 'none' ? null : detailProjectId;
    if (!updateTask(selectedTodo.id, detailText, detailDueAt || null, nextProjectId)) return;
    setSelectedTodo({
      ...selectedTodo,
      text: detailText.trim(),
      dueAt: detailDueAt || null,
      projectId: nextProjectId,
    });
    setIsDetailEditing(false);
  };
  
  return (
    <main className="appShell">
      <div className="workspaceControls">
        <TodoSearch
          filters={filters}
          setFilters={setFilters}
          lanes={lanes}
        />

        <header className="appHeader">
          <div>
            <p className="eyebrow">TicTac</p>
            <div className="workspaceTitle">
              <h1>Espacio de trabajo</h1>
              <label className="projectWorkspaceSelector" aria-label="Proyecto del espacio de trabajo">
                <span>{workspaceLabel}</span>
                <select
                  value={filters.projectId}
                  onChange={(event) => setFilters(currentFilters => ({
                    ...currentFilters,
                    projectId: event.target.value,
                  }))}
                >
                  <option value="all">Todos los proyectos</option>
                  <option value="none">Sin proyecto</option>
                  {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
                <i className="bi bi-chevron-down"></i>
              </label>
            </div>
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
      </div>
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
                  onOpenDetails={() => setSelectedTodo(todo)}
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
      {selectedTodo && (
        <Modal setIsOpen={closeTaskDetail}>
          <section className="taskDetailPanel" aria-labelledby="task-detail-title">
            <button type="button" className="settingsClose" onClick={closeTaskDetail} aria-label="Cerrar">×</button>
            <p className="eyebrow">TAREA</p>
            <div className="taskDetailHeader">
              <h1 id="task-detail-title">Detalle de la tarea</h1>
              {!isDetailEditing && (
                <button type="button" className="taskDetailEditButton" onClick={() => setIsDetailEditing(true)}>
                  <i className="bi bi-pencil"></i>
                  Editar
                </button>
              )}
            </div>
            {isDetailEditing ? (
              <form className="taskDetailForm" onSubmit={saveTaskDetail}>
                <label htmlFor="detail-task-text">Descripción</label>
                <textarea
                  id="detail-task-text"
                  value={detailText}
                  onChange={(event) => setDetailText(event.target.value)}
                  rows="6"
                  required
                />
                <label htmlFor="detail-task-due">Fecha y hora de vencimiento</label>
                <input
                  id="detail-task-due"
                  type="datetime-local"
                  value={detailDueAt}
                  onChange={(event) => setDetailDueAt(event.target.value)}
                />
                <label htmlFor="detail-task-project">Proyecto</label>
                <select
                  id="detail-task-project"
                  value={detailProjectId}
                  onChange={(event) => setDetailProjectId(event.target.value)}
                >
                  <option value="none">Sin proyecto</option>
                  {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
                <div className="taskDetailActions">
                  <button type="button" className="taskDetailCancel" onClick={() => setIsDetailEditing(false)}>Cancelar</button>
                  <button type="submit" className="taskDetailSave">Guardar</button>
                </div>
              </form>
            ) : (
              <>
                <p className="taskDetailText">{selectedTodo.text}</p>
                <div className="taskDetailMeta">
                  <span><i className="bi bi-folder2-open"></i>{selectedTodoProject?.name || 'Sin proyecto'}</span>
                  <span><i className="bi bi-plus-circle"></i>Creada: {formatTaskDate(selectedTodo.createdAt)}</span>
                  <span><i className="bi bi-calendar3"></i>Vence: {selectedTodo.dueAt ? formatTaskDate(selectedTodo.dueAt) : 'Sin vencimiento'}</span>
                </div>
              </>
            )}
          </section>
        </Modal>
      )}
    </main>
  );
}

export default App;
