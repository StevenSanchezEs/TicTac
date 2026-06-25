import { useEffect, useState } from 'react';
import styles from './TodoList.module.css'
export function TodoList(props){
    const [isDropTarget, setIsDropTarget] = useState(false);

    useEffect(() => {
        if (!props.isDraggingTask && !props.isDraggingLane) setIsDropTarget(false);
    }, [props.isDraggingTask, props.isDraggingLane]);

    const isDraggingTask = (event) => event.dataTransfer.types.includes('application/x-tictac-task');
    const isDraggingLane = (event) => event.dataTransfer.types.includes('application/x-tictac-lane');

    const handleDragOver = (event) => {
        if (!isDraggingTask(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        if (props.isDraggingTask) setIsDropTarget(true);
    };

    const handleDrop = (event) => {
        if (!isDraggingTask(event)) return;
        event.preventDefault();
        setIsDropTarget(false);
        props.onDropTask();
    };

    const handleLaneDragOver = (event) => {
        if (!isDraggingLane(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        if (props.isDraggingLane) setIsDropTarget(true);
    };

    const handleLaneDrop = (event) => {
        if (!isDraggingLane(event)) return;
        event.preventDefault();
        event.stopPropagation();
        setIsDropTarget(false);
        props.onDropLane();
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
            <header
                className={styles.laneHeader}
                draggable
                onDragStart={(event) => {
                    event.stopPropagation();
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('application/x-tictac-lane', props.lane.id);
                    props.onLaneDragStart();
                }}
                onDragEnd={props.onLaneDragEnd}
                onDragOver={handleLaneDragOver}
                onDragEnter={() => props.isDraggingLane && setIsDropTarget(true)}
                onDragLeave={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setIsDropTarget(false);
                }}
                onDrop={handleLaneDrop}
                aria-label={`Arrastra ${props.lane.name} para reordenar los carriles`}
            >
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
