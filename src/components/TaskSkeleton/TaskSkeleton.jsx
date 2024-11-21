import styles from './TaskSkeleton.module.css';

export function TaskSkeleton(){
    return(
        <div className={styles.skeletonItem}>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
        </div>
    );
}