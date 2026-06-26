import styles from './TodoForm.module.css';
import { useState } from 'react';

export function TodoForm(props){
    const [taskValue, setTaskValue] = useState('');
    const [dueAt, setDueAt] = useState('');
    const [laneId, setLaneId] = useState(
        props.lanes?.some(lane => lane.id === 'todo') ? 'todo' : props.lanes?.[0]?.id || 'todo'
    );
    const [projectId, setProjectId] = useState('none');

    const isLaneForm = props.mode === 'lane';
    const isProjectForm = props.mode === 'project';
    const submitForm = (event) => {
        event.preventDefault();
        if (!taskValue.trim()) return;

        if (isLaneForm) {
            if (props.addLane(taskValue)) props.setIsOpen(false);
            return;
        }
        if (isProjectForm) {
            if (props.addProject(taskValue)) props.setIsOpen(false);
            return;
        }
        props.addTask(taskValue, dueAt || null, laneId, projectId === 'none' ? null : projectId);
        props.setIsOpen(false);
    };

    const formTitle = isLaneForm ? 'Crea un carril' : isProjectForm ? 'Crea un proyecto' : 'Planifica una tarea';
    const formEyebrow = isLaneForm ? 'ORGANIZA TU FLUJO' : isProjectForm ? 'DELEGA POR PROYECTO' : 'NUEVA TAREA';
    const nameLabel = isLaneForm ? 'Nombre del carril' : isProjectForm ? 'Nombre del proyecto' : '¿Qué necesitas hacer?';

    return (
        <form className={styles.todoForm} onSubmit={submitForm}>
            <button type="button" className={styles.closeModal} onClick={() => props.setIsOpen(false)} aria-label="Cerrar">×</button>
            <p className={styles.eyebrow}>{formEyebrow}</p>
            <h1>{formTitle}</h1>
            <label htmlFor="task-name">{nameLabel}</label>
            {isLaneForm || isProjectForm ? (
                <input id="task-name" autoFocus value={taskValue} onChange={(event) => setTaskValue(event.target.value)} placeholder={isProjectForm ? 'Ej. Rediseño web' : 'Ej. En revisión'} />
            ) : (
                <textarea id="task-name" autoFocus value={taskValue} placeholder="Ej. Exportar un reporte de ventas del ERP" onChange={(event) => setTaskValue(event.target.value)} />
            )}
            {!isLaneForm && !isProjectForm && <>
                <label htmlFor="due-date">Fecha y hora de vencimiento <span className={styles.optional}>(opcional)</span></label>
                <input id="due-date" type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} />
                <label htmlFor="project">Proyecto</label>
                <select id="project" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                    <option value="none">Sin proyecto</option>
                    {props.projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
                <label htmlFor="lane">Carril inicial</label>
                <select id="lane" value={laneId} onChange={(event) => setLaneId(event.target.value)}>
                    {props.lanes.map(lane => <option key={lane.id} value={lane.id}>{lane.name}</option>)}
                </select>
            </>}
            <button className={styles.submitButton} type="submit">{isLaneForm ? 'Crear carril' : isProjectForm ? 'Crear proyecto' : 'Crear tarea'}</button>
        </form>
    );
}
