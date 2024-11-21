import { TodoCounter } from './components/TodoCounter/TodoCounter';
import { TodoSearch } from './components/TodoSearch/TodoSearch';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { CreateTodoButton } from './components/CreateTodoButton/CreateTodoButton';
import { useTodos } from './hooks/useTodos';
import { getTodoListContent } from './hooks/getTodoListContent';
import { TaskSkeleton } from './components/TaskSkeleton';
import { TodoForm } from './components/TodoForm/TodoForm';
import './App.css'
import { Modal } from './components/Modal/Modal';

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
  } = useTodos();
  
  return (
    <>

      <TodoCounter completed={loading ? 0 : completedTodos} total={loading ? 0 : totalTodos}/>
      <TodoSearch searchValue={searchValue} setSearchValue={setSearchValue} />
      <TodoList>
        {loading ? <TaskSkeleton /> : getTodoListContent(searchedTodos, searchValue, onCompleted, onDelete, TodoItem)}
      </TodoList>
      <CreateTodoButton setIsOpen={setIsOpen}/>
      {isOpen && (
        <Modal setIsOpen={setIsOpen}>
          <TodoForm setIsOpen={setIsOpen} addTask={addTask} />
        </Modal>
      )}
    </>
  );
}

export default App;