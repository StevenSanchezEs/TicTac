import styles from './TodoForm.module.css';
import { useState } from 'react';

export function TodoForm(props){
    const [taskValue, setTaskValue] = useState('');

    return (
        <div className={styles.todoForm}>
            <span className={styles.closeModal} onClick={() => {props.setIsOpen(false)}}>x</span>
            <h1>Escribe una Tarea</h1>
            <textarea name="description-task" id="description-task" placeholder='Exportar un reporte de ventas del ERP...' onChange={(event) => {setTaskValue(event.target.value)}}></textarea>
            <button onClick={() => {props.addTask(taskValue, false); props.setIsOpen(false);}} >Guardar</button>
        </div>
    );
}