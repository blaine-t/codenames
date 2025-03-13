import styles from './RoleBox.module.css';

interface RoleBoxProps {
  role: string;
}

export default function RoleBox({ role }: RoleBoxProps) {
  
  return (
    <div className={styles.box}>
        <h1>ROLE: {role.toUpperCase()}</h1>
    </div>
  );
}
