import styles from './TodoCounter.module.css';

export function TodoCounter({ total = 0, completed = 0}){
    return (
      <p className={styles.todoCounter}>
        {completed} de {total} tareas completadas
      </p>
    );
}
