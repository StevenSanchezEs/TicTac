import styles from  './TodoSearch.module.css'

export function TodoSearch(props){
    const updateFilter = (key, value) => {
        props.setFilters(currentFilters => ({
            ...currentFilters,
            [key]: value,
        }));
    };

    const clearFilters = () => {
        props.setFilters({
            text: '',
            laneId: 'all',
            projectId: 'all',
            createdFrom: '',
            createdTo: '',
            dueFrom: '',
            dueTo: '',
        });
    };

    const hasActiveFilters = Object.entries(props.filters).some(([key, value]) => {
        if (key === 'laneId' || key === 'projectId') return value !== 'all';
        return Boolean(value);
    });

    return (
        <div className={styles.todoContainer}>
            <div className={styles.inputGroup} >
                <span>
                    <i className="bi bi-search"></i>
                </span>
                <input
                    className={styles.TodoSearch}
                    placeholder="Buscar tarea..."
                    value={props.filters.text}
                    onChange={(event) => updateFilter('text', event.target.value)}
                />
            </div>
            <div className={styles.filtersGrid}>
                <label>
                    Carril
                    <select value={props.filters.laneId} onChange={(event) => updateFilter('laneId', event.target.value)}>
                        <option value="all">Todos</option>
                        {props.lanes.map(lane => <option key={lane.id} value={lane.id}>{lane.name}</option>)}
                    </select>
                </label>
                <label>
                    Proyecto
                    <select value={props.filters.projectId} onChange={(event) => updateFilter('projectId', event.target.value)}>
                        <option value="all">Todos</option>
                        <option value="none">Sin proyecto</option>
                        {props.projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                    </select>
                </label>
                <label>
                    Creada desde
                    <input type="date" value={props.filters.createdFrom} onChange={(event) => updateFilter('createdFrom', event.target.value)} />
                </label>
                <label>
                    Creada hasta
                    <input type="date" value={props.filters.createdTo} onChange={(event) => updateFilter('createdTo', event.target.value)} />
                </label>
                <label>
                    Vence desde
                    <input type="date" value={props.filters.dueFrom} onChange={(event) => updateFilter('dueFrom', event.target.value)} />
                </label>
                <label>
                    Vence hasta
                    <input type="date" value={props.filters.dueTo} onChange={(event) => updateFilter('dueTo', event.target.value)} />
                </label>
                <button type="button" className={styles.clearButton} onClick={clearFilters} disabled={!hasActiveFilters}>
                    Limpiar
                </button>
            </div>
        </div>
    );
}
