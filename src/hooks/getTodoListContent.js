export function getTodoListContent(searchedTodos, searchValue, onCompleted, onDelete, TodoItemComponent){
    if (searchedTodos.length === 0) {
        return searchValue.length === 0
          ? <p>No hay tareas. ¡Crea tu primera tarea para empezar!</p>
          : <p>No hay coincidencias para "{searchValue}"</p>;
      }
    
      return searchedTodos.map((todo) => (
        <TodoItemComponent
          key={todo.text}
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          onCompleted={() => onCompleted(todo.text)}
          onDelete={() => onDelete(todo.id)}
        />
      ));
}