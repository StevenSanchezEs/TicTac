import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_LANES = [
  { id: 'todo', name: 'Por hacer', color: '#64748b' },
  { id: 'in-progress', name: 'En proceso', color: '#f59e0b' },
  { id: 'done', name: 'Terminado', color: '#22c55e' },
];

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [searchValue, setSearchValue] = useState('');
  const [lanes, setLanes] = useState(() => {
    const savedLanes = localStorage.getItem('todo-lanes');
    return savedLanes ? JSON.parse(savedLanes) : DEFAULT_LANES;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('todo-lanes', JSON.stringify(lanes));
  }, [lanes]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const totalTodos = useMemo(() => {
    return todos.length;
  }, [todos]);

  const searchedTodos = useMemo(() => todos.filter(todo =>
    todo.text.toLowerCase().includes(searchValue.toLowerCase())
  ), [todos, searchValue]);

  const onCompleted = (id) => {
    setTodos(currentTodos => currentTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const onDelete = (id) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
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

  const addTask = (text, dueAt, laneId) => {
    const newItem = {
      id: uuidv4(),
      text: text.trim(),
      dueAt,
      laneId: laneId || lanes[0]?.id || 'todo',
      completed: false,
    };
    setTodos(currentTodos => [...currentTodos, newItem]);
  };

  const moveTask = (id, laneId) => {
    setTodos(currentTodos => currentTodos.map(todo =>
      todo.id === id ? { ...todo, laneId } : todo
    ));
  };

  const addLane = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    setLanes(currentLanes => [...currentLanes, {
      id: uuidv4(),
      name: trimmedName,
      color: '#8b5cf6',
    }]);
    return true;
  };

  const renameLane = (id, name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    setLanes(currentLanes => currentLanes.map(lane =>
      lane.id === id ? { ...lane, name: trimmedName } : lane
    ));
    return true;
  };

  const moveLane = (id, direction) => {
    setLanes(currentLanes => {
      const currentIndex = currentLanes.findIndex(lane => lane.id === id);
      const targetIndex = currentIndex + direction;
      if (currentIndex === -1 || targetIndex < 0 || targetIndex >= currentLanes.length) return currentLanes;

      const orderedLanes = [...currentLanes];
      [orderedLanes[currentIndex], orderedLanes[targetIndex]] = [orderedLanes[targetIndex], orderedLanes[currentIndex]];
      return orderedLanes;
    });
  };

  const reorderLane = (sourceId, targetId) => {
    if (!sourceId || sourceId === targetId) return;

    setLanes(currentLanes => {
      const sourceIndex = currentLanes.findIndex(lane => lane.id === sourceId);
      const targetIndex = currentLanes.findIndex(lane => lane.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return currentLanes;

      const orderedLanes = [...currentLanes];
      const [sourceLane] = orderedLanes.splice(sourceIndex, 1);
      // Al mover hacia la derecha, el índice original del destino ya apunta
      // a la posición posterior a ese carril después de extraer el origen.
      // Al mover hacia la izquierda, apunta a la posición previa al destino.
      orderedLanes.splice(targetIndex, 0, sourceLane);
      return orderedLanes;
    });
  };

  const deleteLane = (id) => {
    if (lanes.length <= 1) return false;
    const replacementLane = lanes.find(lane => lane.id !== id);
    setTodos(currentTodos => currentTodos.map(todo =>
      (todo.laneId || 'todo') === id ? { ...todo, laneId: replacementLane.id } : todo
    ));
    setLanes(currentLanes => currentLanes.filter(lane => lane.id !== id));
    return true;
  };

  return {
    todos,
    setTodos,
    searchValue,
    setSearchValue,
    completedTodos,
    totalTodos,
    searchedTodos,
    lanes,
    onCompleted,
    onDelete,
    loading,
    setIsOpen,
    isOpen,
    addTask,
    moveTask,
    addLane,
    renameLane,
    moveLane,
    reorderLane,
    deleteLane,
  };
}
