import { useState } from 'react';
import styles from './TodoItem.module.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

export function TodoItem(props){
    const getDateInputValue = (date) => {
      if (!date) return '';
      return date.slice(0, 16);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [taskText, setTaskText] = useState(props.text);
    const [taskDueAt, setTaskDueAt] = useState(getDateInputValue(props.dueAt));
    const [taskProjectId, setTaskProjectId] = useState(props.projectId || 'none');

    const formatDate = (date) => new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));

    const formattedCreatedAt = props.createdAt
      ? formatDate(props.createdAt)
      : 'Sin registro de creación';

    const formattedDueAt = props.dueAt
      ? formatDate(props.dueAt)
      : 'Sin vencimiento';

    const projectName = props.projects.find(project => project.id === props.projectId)?.name || 'Sin proyecto';

    const dueDateClassName = props.dueAt
      ? styles.taskDate
      : `${styles.taskDate} ${styles.mutedDate}`;

    const createdDateClassName = props.createdAt
      ? styles.taskDate
      : `${styles.taskDate} ${styles.mutedDate}`;

    const startEditing = () => {
      setTaskText(props.text);
      setTaskDueAt(getDateInputValue(props.dueAt));
      setTaskProjectId(props.projectId || 'none');
      setIsEditing(true);
    };

    const cancelEditing = () => {
      setTaskText(props.text);
      setTaskDueAt(getDateInputValue(props.dueAt));
      setTaskProjectId(props.projectId || 'none');
      setIsEditing(false);
    };

    const saveTask = (event) => {
      event.preventDefault();
      if (props.onUpdate(taskText, taskDueAt || null, taskProjectId === 'none' ? null : taskProjectId)) setIsEditing(false);
    };

    const handleOpenDetails = (event) => {
      if (event.target.closest('button, input, textarea, label')) return;
      if (!isEditing) props.onOpenDetails();
    };

    return (
      <li
        className={styles.todoItem}
        draggable={!isEditing}
        onClick={handleOpenDetails}
        onDragStart={(event) => {
          if (isEditing) return;
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('application/x-tictac-task', props.id);
          props.onDragStart();
        }}
        onDragEnd={props.onDragEnd}
      >
        <div className={styles.taskTopline}>
          <button
            className={`${styles.completeButton} ${props.completed ? styles.checkIconActive : ''}`}
            onClick={props.onCompleted}
            aria-label={props.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          ><i className="bi bi-check-lg"></i></button>
          <div className={styles.itemActions}>
            <button className={styles.editIcon} onClick={startEditing} aria-label="Editar tarea">
              <i className="bi bi-pencil"></i>
            </button>
            <button className={styles.deleteIcon} onClick={props.onDelete} aria-label="Eliminar tarea">
              <i className="bi bi-trash3"></i>
            </button>
          </div>
        </div>
        {isEditing ? (
          <form className={styles.editForm} onSubmit={saveTask}>
            <label className={styles.editLabel} htmlFor={`task-text-${props.id}`}>Descripción</label>
            <textarea
              id={`task-text-${props.id}`}
              value={taskText}
              onChange={(event) => setTaskText(event.target.value)}
              rows="3"
              required
            />
            <label className={styles.editLabel} htmlFor={`task-due-${props.id}`}>Fecha y hora de vencimiento</label>
            <input
              id={`task-due-${props.id}`}
              type="datetime-local"
              value={taskDueAt}
              onChange={(event) => setTaskDueAt(event.target.value)}
            />
            <label className={styles.editLabel} htmlFor={`task-project-${props.id}`}>Proyecto</label>
            <select
              id={`task-project-${props.id}`}
              value={taskProjectId}
              onChange={(event) => setTaskProjectId(event.target.value)}
            >
              <option value="none">Sin proyecto</option>
              {props.projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
            <div className={styles.editActions}>
              <button type="button" className={styles.cancelEdit} onClick={cancelEditing}>Cancelar</button>
              <button type="submit" className={styles.saveEdit}>Guardar</button>
            </div>
          </form>
        ) : (
          <>
            <p className={`${styles.todoItemText} ${props.completed ? styles.todoItemTextComplete : ''}`}>{props.text}</p>
            <span className={styles.projectBadge}><i className="bi bi-folder2-open"></i>{projectName}</span>
            <div className={styles.taskFooter}>
              <span className={createdDateClassName}><i className="bi bi-plus-circle"></i>Creada: {formattedCreatedAt}</span>
              <span className={dueDateClassName}><i className="bi bi-calendar3"></i>Vence: {formattedDueAt}</span>
            </div>
          </>
        )}
      </li>
    );
}
