import { useState } from 'react';
import styles from './ProjectManager.module.css';

export function ProjectManager({ projects, todos, addProject, renameProject, deleteProject }) {
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectName, setProjectName] = useState('');

  const createProject = (event) => {
    event.preventDefault();
    if (addProject(newProjectName)) setNewProjectName('');
  };

  const startEditing = (project) => {
    setEditingProjectId(project.id);
    setProjectName(project.name);
  };

  const saveProject = (event, projectId) => {
    event.preventDefault();
    if (renameProject(projectId, projectName)) setEditingProjectId(null);
  };

  const removeProject = (project) => {
    const taskCount = todos.filter(todo => todo.projectId === project.id).length;
    const message = taskCount > 0
      ? `Las ${taskCount} tareas de "${project.name}" quedarán sin proyecto. ¿Eliminarlo?`
      : `¿Eliminar el proyecto "${project.name}"?`;
    if (window.confirm(message)) deleteProject(project.id);
  };

  return (
    <section className={styles.manager} aria-labelledby="project-manager-title">
      <p className={styles.eyebrow}>RESPONSABILIDADES</p>
      <h1 id="project-manager-title">Gestionar proyectos</h1>
      <p className={styles.help}>Crea proyectos para agrupar tareas y facilitar la delegación. Las tareas pueden asignarse o cambiarse de proyecto desde su formulario de edición.</p>

      <form className={styles.createForm} onSubmit={createProject}>
        <label htmlFor="new-project-name">Nuevo proyecto</label>
        <div>
          <input
            id="new-project-name"
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.target.value)}
            placeholder="Ej. Rediseño web"
          />
          <button type="submit">Crear</button>
        </div>
      </form>

      <ul className={styles.projectList}>
        {projects.length === 0 && <li className={styles.emptyState}>Todavía no hay proyectos.</li>}
        {projects.map(project => {
          const taskCount = todos.filter(todo => todo.projectId === project.id).length;

          return (
            <li key={project.id} className={styles.projectRow}>
              <span className={styles.projectIcon}><i className="bi bi-folder2-open"></i></span>
              {editingProjectId === project.id ? (
                <form className={styles.renameForm} onSubmit={(event) => saveProject(event, project.id)}>
                  <input autoFocus value={projectName} onChange={(event) => setProjectName(event.target.value)} aria-label="Nombre del proyecto" />
                  <button className={styles.save} type="submit">Guardar</button>
                </form>
              ) : (
                <>
                  <span className={styles.projectName}>{project.name}</span>
                  <span className={styles.count}>{taskCount} tareas</span>
                </>
              )}
              {editingProjectId !== project.id && (
                <div className={styles.actions}>
                  <button type="button" onClick={() => startEditing(project)} aria-label={`Renombrar ${project.name}`}><i className="bi bi-pencil"></i></button>
                  <button type="button" className={styles.remove} onClick={() => removeProject(project)} aria-label={`Eliminar ${project.name}`}><i className="bi bi-trash3"></i></button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
