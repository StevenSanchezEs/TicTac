import { TodoCounter } from './components/TodoCounter/TodoCounter';
import { TodoSearch } from './components/TodoSearch/TodoSearch';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { useTodos } from './hooks/useTodos';
import { TaskSkeleton } from './components/TaskSkeleton';
import { TodoForm } from './components/TodoForm/TodoForm';
import './App.css'
import { Modal } from './components/Modal/Modal';
import { useState } from 'react';
import { LaneManager } from './components/LaneManager/LaneManager';

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
    searchValue,
    setSearchValue,
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
    lanes,
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
          <button className="secondaryButton" onClick={() => openModal('manage-lanes')}>
            Gestionar carriles
          </button>
          <button className="secondaryButton" onClick={() => openModal('lane')}>
            <span>+</span> Nuevo carril
          </button>
          <button className="primaryButton" onClick={() => openModal('task')}>
            <span>+</span> Nueva tarea
          </button>
        </div>
      </header>

      <TodoSearch searchValue={searchValue} setSearchValue={setSearchValue} />
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
                  onCompleted={() => onCompleted(todo.id)}
                  onDelete={() => onDelete(todo.id)}
                  onUpdate={(text, dueAt) => updateTask(todo.id, text, dueAt)}
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
          {modalMode === 'manage-lanes' ? (
            <LaneManager
              lanes={lanes}
              todos={todos}
              setIsOpen={setIsOpen}
              renameLane={renameLane}
              moveLane={moveLane}
              deleteLane={deleteLane}
              doneLaneId={doneLaneId}
              setDoneLane={setDoneLane}
            />
          ) : (
            <TodoForm
              mode={modalMode}
              setIsOpen={setIsOpen}
              addTask={addTask}
              addLane={addLane}
              lanes={lanes}
            />
          )}
        </Modal>
      )}
    </main>
  );
}

export default App;
