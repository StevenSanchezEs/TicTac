import styles from './TodoForm.module.css';
import { useState } from 'react';

export function TodoForm(props){
    const [taskValue, setTaskValue] = useState('');
    const [dueAt, setDueAt] = useState('');
    const [laneId, setLaneId] = useState(
        props.lanes?.some(lane => lane.id === 'todo') ? 'todo' : props.lanes?.[0]?.id || 'todo'
    );

    const isLaneForm = props.mode === 'lane';
    const submitForm = (event) => {
        event.preventDefault();
        if (!taskValue.trim()) return;

        if (isLaneForm) {
            if (props.addLane(taskValue)) props.setIsOpen(false);
            return;
        }
        props.addTask(taskValue, dueAt || null, laneId);
        props.setIsOpen(false);
    };

    return (
        <form className={styles.todoForm} onSubmit={submitForm}>
            <button type="button" className={styles.closeModal} onClick={() => props.setIsOpen(false)} aria-label="Cerrar">×</button>
            <p className={styles.eyebrow}>{isLaneForm ? 'ORGANIZA TU FLUJO' : 'NUEVA TAREA'}</p>
            <h1>{isLaneForm ? 'Crea un carril' : 'Planifica una tarea'}</h1>
            <label htmlFor="task-name">{isLaneForm ? 'Nombre del carril' : '¿Qué necesitas hacer?'}</label>
            {isLaneForm ? (
                <input id="task-name" autoFocus value={taskValue} onChange={(event) => setTaskValue(event.target.value)} placeholder="Ej. En revisión" />
            ) : (
                <textarea id="task-name" autoFocus value={taskValue} placeholder="Ej. Exportar un reporte de ventas del ERP" onChange={(event) => setTaskValue(event.target.value)} />
            )}
            {!isLaneForm && <>
                <label htmlFor="due-date">Fecha y hora de vencimiento <span className={styles.optional}>(opcional)</span></label>
                <input id="due-date" type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} />
                <label htmlFor="lane">Carril inicial</label>
                <select id="lane" value={laneId} onChange={(event) => setLaneId(event.target.value)}>
                    {props.lanes.map(lane => <option key={lane.id} value={lane.id}>{lane.name}</option>)}
                </select>
            </>}
            <button className={styles.submitButton} type="submit">{isLaneForm ? 'Crear carril' : 'Crear tarea'}</button>
        </form>
    );
}
