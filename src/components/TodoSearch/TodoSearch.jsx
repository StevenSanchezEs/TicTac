import styles from  './TodoSearch.module.css'

export function TodoSearch(props){
    return (
        <div className={styles.todoContainer}>
            <div className={styles.inputGroup} >
            <span>
                <i className="bi bi-search"></i>
            </span>
            <input className={styles.TodoSearch}
            placeholder="Buscar tarea..."
            value={props.searchValue}
            onChange={(event) =>
                {
                    props.setSearchValue(event.target.value);
                }}
            />
            </div>
        </div>
    );
}