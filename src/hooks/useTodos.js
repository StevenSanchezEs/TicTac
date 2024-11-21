import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const totalTodos = useMemo(() => {
    return todos.length;
  }, [todos]);

  const searchedTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchValue.toLowerCase())
  );

  const onCompleted = (id) => {
    setTodos(todos.map(todo =>
      todo.text === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const onDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Estado para controlar la carga
  const [loading, setLoading] = useState(true);

  // Simulamos la carga de datos con setTimeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // Esperamos 3 segundos para simular la carga

    // Limpiar el timeout al desmontar el componente
    return () => clearTimeout(timeout);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if(isOpen){
      document.body.style.overflow = "hidden";
    }
    else{
      document.body.style.overflow = "auto";
    }
  }, [isOpen])

  const addTask = (text, isCompleted) => {
    const newItem = {id: uuidv4(), text: text, completed: isCompleted};
    setTodos([...todos, newItem]);
  }

  return {
    setTodos,
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
  };
}