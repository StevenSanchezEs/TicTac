import styles from './TodoCounter.module.css';

export function TodoCounter({ total = 0, completed = 0}){
    return (
      <h1 className={styles.todoCounter}>
        Has completado <span>{completed}</span> de <span>{total}</span> tareas.
      </h1>
    );
}