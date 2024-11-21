import styles from './TodoItem.module.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

export function TodoItem(props){
    return (
      <li className={styles.todoItem}>
        <span className={`bi bi-check-lg
        ${props.completed && styles.checkIconActive}`} 
        onClick={props.onCompleted}></span>
        <p className={`${styles.todoItemText} 
        ${props.completed && styles.todoItemTextComplete}`}>
          {props.text}
        </p>
        <span className={`${styles.deleteIcon} bi bi-trash3-fill`} 
        onClick={props.onDelete}>
        </span>
      </li>
    );
}