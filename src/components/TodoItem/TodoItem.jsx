import styles from './TodoItem.module.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

export function TodoItem(props){
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

    const dueDateClassName = props.dueAt
      ? styles.taskDate
      : `${styles.taskDate} ${styles.mutedDate}`;

    const createdDateClassName = props.createdAt
      ? styles.taskDate
      : `${styles.taskDate} ${styles.mutedDate}`;

    return (
      <li
        className={styles.todoItem}
        draggable
        onDragStart={(event) => {
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
          <button className={styles.deleteIcon} onClick={props.onDelete} aria-label="Eliminar tarea">
            <i className="bi bi-trash3"></i>
          </button>
        </div>
        <p className={`${styles.todoItemText} ${props.completed ? styles.todoItemTextComplete : ''}`}>{props.text}</p>
        <div className={styles.taskFooter}>
          <span className={createdDateClassName}><i className="bi bi-plus-circle"></i>Creada: {formattedCreatedAt}</span>
          <span className={dueDateClassName}><i className="bi bi-calendar3"></i>Vence: {formattedDueAt}</span>
        </div>
      </li>
    );
}
