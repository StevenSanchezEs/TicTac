import styles from './TodoList.module.css'
export function TodoList(props){
    return (
        <ul className={styles.TodoList}>
            {props.children}
        </ul>
    );
}