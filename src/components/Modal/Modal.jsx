import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

export function Modal({ children, setIsOpen }){
    const modalRoot = document.getElementById('modal-root');

    const handleModalClick = (e) => {
        // Verificar si el clic es en el fondo del modal (y no en el contenido)
        if (e.target === e.currentTarget) {
          setIsOpen(false);  // Cierra el modal si se hace clic en el fondo
        }
      };

    return ReactDOM.createPortal(
        <div className={styles.modal} onClick={handleModalClick}>
            {children}
        </div>,
        modalRoot
    );
}