import styles from './CreateTodoButton.module.css'

export function CreateTodoButton(props){
    return (
        <button className={styles.createTodoButton} onClick={props.onClick} aria-label="Crear nueva tarea">+</button>
    );
}
