import styles from './TodoList.module.css'
export function TodoList(props){
    return (
        <section className={styles.lane}>
            <header className={styles.laneHeader}>
                <div className={styles.laneTitle}>
                    <span className={styles.laneDot} style={{ backgroundColor: props.lane.color }}></span>
                    <h2>{props.lane.name}</h2>
                    <span className={styles.count}>{props.count}</span>
                </div>
            </header>
            <ul className={styles.TodoList}>
                {props.children || <li className={styles.emptyState}>No hay tareas aquí</li>}
            </ul>
        </section>
    );
}
