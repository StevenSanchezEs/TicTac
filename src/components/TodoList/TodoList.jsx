import { useEffect, useState } from 'react';
import styles from './TodoList.module.css'
export function TodoList(props){
    const [isDropTarget, setIsDropTarget] = useState(false);

    useEffect(() => {
        if (!props.isDragging) setIsDropTarget(false);
    }, [props.isDragging]);

    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        if (props.isDragging) setIsDropTarget(true);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDropTarget(false);
        props.onDropTask();
    };

    return (
        <section
            className={`${styles.lane} ${isDropTarget ? styles.dropTarget : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={() => props.isDragging && setIsDropTarget(true)}
            onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsDropTarget(false);
            }}
            onDrop={handleDrop}
        >
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
