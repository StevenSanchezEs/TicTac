import { useState } from 'react';
import styles from './LaneManager.module.css';

export function LaneManager({ lanes, todos, setIsOpen, addLane, renameLane, moveLane, deleteLane, doneLaneId, setDoneLane, embedded = false }) {
  const [editingLaneId, setEditingLaneId] = useState(null);
  const [name, setName] = useState('');
  const [newLaneName, setNewLaneName] = useState('');
  const baseLaneId = 'todo';

  const startEditing = (lane) => {
    if (lane.id === baseLaneId) return;
    setEditingLaneId(lane.id);
    setName(lane.name);
  };

  const saveName = (event, laneId) => {
    event.preventDefault();
    if (renameLane(laneId, name)) setEditingLaneId(null);
  };

  const removeLane = (lane) => {
    if (lane.id === baseLaneId) return;
    const hasTasks = todos.some(todo => (todo.laneId || 'todo') === lane.id);
    const message = hasTasks
      ? `Las tareas de “${lane.name}” pasarán al siguiente carril. ¿Eliminarlo?`
      : `¿Eliminar el carril “${lane.name}”?`;
    if (window.confirm(message)) deleteLane(lane.id);
  };

  const createLane = (event) => {
    event.preventDefault();
    if (!addLane) return;
    if (addLane(newLaneName)) setNewLaneName('');
  };

  return (
    <section className={`${styles.manager} ${embedded ? styles.embedded : ''}`} aria-labelledby="lane-manager-title">
      {setIsOpen && !embedded && <button type="button" className={styles.close} onClick={() => setIsOpen(false)} aria-label="Cerrar">×</button>}
      <p className={styles.eyebrow}>CONFIGURACIÓN DEL TABLERO</p>
      <h1 id="lane-manager-title">Gestionar carriles</h1>
      <p className={styles.help}>Usa las flechas para definir el orden y marca qué carril representa las tareas terminadas. “Por hacer” es el carril base y no se puede renombrar ni eliminar.</p>

      {addLane && (
        <form className={styles.createForm} onSubmit={createLane}>
          <label htmlFor="new-lane-name">Nuevo carril</label>
          <div>
            <input
              id="new-lane-name"
              value={newLaneName}
              onChange={(event) => setNewLaneName(event.target.value)}
              placeholder="Ej. En revisión"
            />
            <button type="submit">Crear</button>
          </div>
        </form>
      )}

      <ul className={styles.laneList}>
        {lanes.map((lane, index) => {
          const isBaseLane = lane.id === baseLaneId;

          return (
            <li key={lane.id} className={`${styles.laneRow} ${isBaseLane ? styles.baseLaneRow : ''}`}>
              <span className={styles.dot} style={{ backgroundColor: lane.color }}></span>
              {editingLaneId === lane.id ? (
                <form className={styles.renameForm} onSubmit={(event) => saveName(event, lane.id)}>
                  <input autoFocus value={name} onChange={(event) => setName(event.target.value)} aria-label="Nombre del carril" />
                  <button className={styles.save} type="submit">Guardar</button>
                </form>
              ) : (
                <span className={styles.laneName}>{lane.name}</span>
              )}
              {isBaseLane && <span className={styles.baseBadge}>Base</span>}
              <button
                type="button"
                className={`${styles.doneSelector} ${doneLaneId === lane.id ? styles.doneSelectorActive : ''}`}
                onClick={() => setDoneLane(lane.id)}
                aria-pressed={doneLaneId === lane.id}
              >
                {doneLaneId === lane.id ? 'Carril done' : 'Usar como done'}
              </button>
              {editingLaneId !== lane.id && <div className={styles.actions}>
                <button type="button" onClick={() => moveLane(lane.id, -1)} disabled={index === 0} aria-label={`Mover ${lane.name} a la izquierda`}><i className="bi bi-arrow-left"></i></button>
                <button type="button" onClick={() => moveLane(lane.id, 1)} disabled={index === lanes.length - 1} aria-label={`Mover ${lane.name} a la derecha`}><i className="bi bi-arrow-right"></i></button>
                <button type="button" onClick={() => startEditing(lane)} disabled={isBaseLane} aria-label={`Renombrar ${lane.name}`}><i className="bi bi-pencil"></i></button>
                <button type="button" className={styles.remove} onClick={() => removeLane(lane)} disabled={isBaseLane} aria-label={`Eliminar ${lane.name}`}><i className="bi bi-trash3"></i></button>
              </div>}
            </li>
          );
        })}
      </ul>
      <p className={styles.notice}>Si eliminas un carril, sus tareas pasan a “Por hacer” para que ninguna quede sin ubicación.</p>
    </section>
  );
}
