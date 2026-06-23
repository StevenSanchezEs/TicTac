import styles from './TodoItem.module.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

export function TodoItem(props){
    const formattedDate = props.dueAt
      ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(props.dueAt))
      : 'Sin fecha programada';

    return (
      <li className={styles.todoItem}>
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
          <span className={styles.dueDate}><i className="bi bi-calendar3"></i>{formattedDate}</span>
          <label className={styles.statusLabel}>
            <span className="srOnly">Mover tarea a</span>
            <select value={props.laneId || 'todo'} onChange={(event) => props.onMove(event.target.value)}>
              {props.lanes.map(lane => <option key={lane.id} value={lane.id}>{lane.name}</option>)}
            </select>
          </label>
        </div>
      </li>
    );
}
