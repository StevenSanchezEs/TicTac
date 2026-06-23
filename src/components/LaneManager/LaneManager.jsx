import { useState } from 'react';
import styles from './LaneManager.module.css';

export function LaneManager({ lanes, todos, setIsOpen, renameLane, moveLane, deleteLane }) {
  const [editingLaneId, setEditingLaneId] = useState(null);
  const [name, setName] = useState('');

  const startEditing = (lane) => {
    setEditingLaneId(lane.id);
    setName(lane.name);
  };

  const saveName = (event, laneId) => {
    event.preventDefault();
    if (renameLane(laneId, name)) setEditingLaneId(null);
  };

  const removeLane = (lane) => {
    const hasTasks = todos.some(todo => (todo.laneId || 'todo') === lane.id);
    const message = hasTasks
      ? `Las tareas de “${lane.name}” pasarán al siguiente carril. ¿Eliminarlo?`
      : `¿Eliminar el carril “${lane.name}”?`;
    if (window.confirm(message)) deleteLane(lane.id);
  };

  return (
    <section className={styles.manager} aria-labelledby="lane-manager-title">
      <button type="button" className={styles.close} onClick={() => setIsOpen(false)} aria-label="Cerrar">×</button>
      <p className={styles.eyebrow}>CONFIGURACIÓN DEL TABLERO</p>
      <h1 id="lane-manager-title">Gestionar carriles</h1>
      <p className={styles.help}>Usa las flechas para definir el orden en que aparecen en tu tablero.</p>

      <ul className={styles.laneList}>
        {lanes.map((lane, index) => (
          <li key={lane.id} className={styles.laneRow}>
            <span className={styles.dot} style={{ backgroundColor: lane.color }}></span>
            {editingLaneId === lane.id ? (
              <form className={styles.renameForm} onSubmit={(event) => saveName(event, lane.id)}>
                <input autoFocus value={name} onChange={(event) => setName(event.target.value)} aria-label="Nombre del carril" />
                <button className={styles.save} type="submit">Guardar</button>
              </form>
            ) : (
              <span className={styles.laneName}>{lane.name}</span>
            )}
            {editingLaneId !== lane.id && <div className={styles.actions}>
              <button type="button" onClick={() => moveLane(lane.id, -1)} disabled={index === 0} aria-label={`Mover ${lane.name} a la izquierda`}><i className="bi bi-arrow-left"></i></button>
              <button type="button" onClick={() => moveLane(lane.id, 1)} disabled={index === lanes.length - 1} aria-label={`Mover ${lane.name} a la derecha`}><i className="bi bi-arrow-right"></i></button>
              <button type="button" onClick={() => startEditing(lane)} aria-label={`Renombrar ${lane.name}`}><i className="bi bi-pencil"></i></button>
              <button type="button" className={styles.remove} onClick={() => removeLane(lane)} disabled={lanes.length === 1} aria-label={`Eliminar ${lane.name}`}><i className="bi bi-trash3"></i></button>
            </div>}
          </li>
        ))}
      </ul>
      <p className={styles.notice}>El último carril se conserva para que ninguna tarea quede sin ubicación.</p>
    </section>
  );
}
