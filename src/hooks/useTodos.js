import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_LANES = [
  { id: 'todo', name: 'Por hacer', color: '#64748b' },
  { id: 'in-progress', name: 'En proceso', color: '#f59e0b' },
  { id: 'done', name: 'Terminado', color: '#22c55e' },
];

const DONE_LANE_STORAGE_KEY = 'todo-done-lane-id';
const PROJECT_STORAGE_KEY = 'todo-projects';
const BASE_LANE = DEFAULT_LANES[0];
const BASE_LANE_ID = BASE_LANE.id;

const EMPTY_FILTERS = {
  text: '',
  laneId: 'all',
  projectId: 'all',
  createdFrom: '',
  createdTo: '',
  dueFrom: '',
  dueTo: '',
};

const getFallbackDoneLaneId = (lanes) => {
  return lanes.find(lane => lane.id === 'done')?.id || lanes[lanes.length - 1]?.id || 'done';
};

const getValidDoneLaneId = (lanes, doneLaneId) => {
  return lanes.some(lane => lane.id === doneLaneId) ? doneLaneId : getFallbackDoneLaneId(lanes);
};

const getSavedLanes = () => {
  const savedLanes = localStorage.getItem('todo-lanes');
  const parsedLanes = savedLanes ? JSON.parse(savedLanes) : DEFAULT_LANES;
  const normalizedLanes = parsedLanes.map(lane =>
    lane.id === BASE_LANE_ID ? { ...lane, name: BASE_LANE.name, color: BASE_LANE.color } : lane
  );

  return normalizedLanes.some(lane => lane.id === BASE_LANE_ID)
    ? normalizedLanes
    : [BASE_LANE, ...normalizedLanes];
};

const getSavedProjects = () => {
  const savedProjects = localStorage.getItem(PROJECT_STORAGE_KEY);
  return savedProjects ? JSON.parse(savedProjects) : [];
};

const migrateStoredTodos = (storedTodos) => {
  const now = new Date().toISOString();
  const savedLanes = getSavedLanes();
  const savedDoneLaneId = localStorage.getItem(DONE_LANE_STORAGE_KEY);
  const validDoneLaneId = getValidDoneLaneId(savedLanes, savedDoneLaneId);
  const defaultLaneId = savedLanes.find(lane => lane.id === BASE_LANE_ID)?.id || BASE_LANE_ID;
  const savedLaneIds = savedLanes.map(lane => lane.id);

  return storedTodos.map(todo => {
    const completed = Boolean(todo.completed);
    const validLaneId = savedLaneIds.includes(todo.laneId)
      ? todo.laneId
      : (completed ? validDoneLaneId : defaultLaneId);

    return {
      ...todo,
      id: todo.id || uuidv4(),
      createdAt: todo.createdAt || now,
      dueAt: todo.dueAt || null,
      projectId: todo.projectId || null,
      laneId: validLaneId,
      completed,
    };
  });
};

const isDateInRange = (dateValue, fromValue, toValue) => {
  if (!fromValue && !toValue) return true;
  if (!dateValue) return false;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  if (fromValue) {
    const from = new Date(`${fromValue}T00:00:00`);
    if (date < from) return false;
  }

  if (toValue) {
    const to = new Date(`${toValue}T23:59:59`);
    if (date > to) return false;
  }

  return true;
};

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];
    return migrateStoredTodos(parsedTodos);
  });
  
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [projects, setProjects] = useState(() => getSavedProjects());
  const [lanes, setLanes] = useState(() => {
    return getSavedLanes();
  });

  const [doneLaneId, setDoneLaneIdState] = useState(() => {
    const initialLanes = getSavedLanes();
    const savedDoneLaneId = localStorage.getItem(DONE_LANE_STORAGE_KEY);
    return getValidDoneLaneId(initialLanes, savedDoneLaneId);
  });

  const effectiveDoneLaneId = useMemo(() => {
    return getValidDoneLaneId(lanes, doneLaneId);
  }, [lanes, doneLaneId]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('todo-lanes', JSON.stringify(lanes));
  }, [lanes]);

  useEffect(() => {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (doneLaneId !== effectiveDoneLaneId) setDoneLaneIdState(effectiveDoneLaneId);
  }, [doneLaneId, effectiveDoneLaneId]);

  useEffect(() => {
    localStorage.setItem(DONE_LANE_STORAGE_KEY, effectiveDoneLaneId);
  }, [effectiveDoneLaneId]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const totalTodos = useMemo(() => {
    return todos.length;
  }, [todos]);

  const searchedTodos = useMemo(() => todos.filter(todo => {
    const textMatches = todo.text.toLowerCase().includes(filters.text.toLowerCase());
    const laneMatches = filters.laneId === 'all' || (todo.laneId || BASE_LANE_ID) === filters.laneId;
    const projectMatches = filters.projectId === 'all'
      || (filters.projectId === 'none' ? !todo.projectId : todo.projectId === filters.projectId);
    const createdMatches = isDateInRange(todo.createdAt, filters.createdFrom, filters.createdTo);
    const dueMatches = isDateInRange(todo.dueAt, filters.dueFrom, filters.dueTo);

    return textMatches && laneMatches && projectMatches && createdMatches && dueMatches;
  }), [todos, filters]);

  const onCompleted = (id) => {
    const pendingLaneId = lanes.find(lane => lane.id !== effectiveDoneLaneId)?.id;
    setTodos(currentTodos => currentTodos.map(todo => {
      if (todo.id !== id) return todo;

      const isDone = todo.completed || (todo.laneId || 'todo') === effectiveDoneLaneId;
      if (isDone && pendingLaneId) return { ...todo, laneId: pendingLaneId, completed: false };

      return { ...todo, laneId: effectiveDoneLaneId, completed: true };
    }));
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

  const addTask = (text, dueAt, laneId, projectId) => {
    const selectedLaneId = laneId || BASE_LANE_ID;
    const newItem = {
      id: uuidv4(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      dueAt,
      projectId: projectId || null,
      laneId: selectedLaneId,
      completed: selectedLaneId === effectiveDoneLaneId,
    };
    setTodos(currentTodos => [...currentTodos, newItem]);
  };

  const moveTask = (id, laneId) => {
    setTodos(currentTodos => currentTodos.map(todo =>
      todo.id === id ? { ...todo, laneId, completed: laneId === effectiveDoneLaneId } : todo
    ));
  };

  const updateTask = (id, text, dueAt, projectId) => {
    const trimmedText = text.trim();
    if (!trimmedText) return false;

    setTodos(currentTodos => currentTodos.map(todo =>
      todo.id === id ? { ...todo, text: trimmedText, dueAt: dueAt || null, projectId: projectId || null } : todo
    ));
    return true;
  };

  const setDoneLane = (laneId) => {
    if (!lanes.some(lane => lane.id === laneId)) return false;
    setDoneLaneIdState(laneId);
    setTodos(currentTodos => currentTodos.map(todo => ({
      ...todo,
      completed: (todo.laneId || 'todo') === laneId,
    })));
    return true;
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

  const addProject = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    setProjects(currentProjects => [...currentProjects, {
      id: uuidv4(),
      name: trimmedName,
      createdAt: new Date().toISOString(),
    }]);
    return true;
  };

  const renameProject = (id, name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    setProjects(currentProjects => currentProjects.map(project =>
      project.id === id ? { ...project, name: trimmedName } : project
    ));
    return true;
  };

  const deleteProject = (id) => {
    setTodos(currentTodos => currentTodos.map(todo =>
      todo.projectId === id ? { ...todo, projectId: null } : todo
    ));
    setProjects(currentProjects => currentProjects.filter(project => project.id !== id));
    return true;
  };

  const renameLane = (id, name) => {
    if (id === BASE_LANE_ID) return false;
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
    if (id === BASE_LANE_ID) return false;
    const replacementLane = lanes.find(lane => lane.id === BASE_LANE_ID) || lanes.find(lane => lane.id !== id);
    if (!replacementLane) return false;
    const nextDoneLaneId = id === effectiveDoneLaneId ? replacementLane.id : effectiveDoneLaneId;
    if (id === effectiveDoneLaneId) setDoneLaneIdState(nextDoneLaneId);
    setTodos(currentTodos => currentTodos.map(todo =>
      (todo.laneId || 'todo') === id
        ? { ...todo, laneId: replacementLane.id, completed: replacementLane.id === nextDoneLaneId }
        : todo
    ));
    setLanes(currentLanes => currentLanes.filter(lane => lane.id !== id));
    return true;
  };

  return {
    todos,
    setTodos,
    filters,
    setFilters,
    completedTodos,
    totalTodos,
    searchedTodos,
    lanes,
    projects,
    doneLaneId: effectiveDoneLaneId,
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
    addLane,
    renameLane,
    moveLane,
    reorderLane,
    deleteLane,
    setDoneLane,
  };
}
