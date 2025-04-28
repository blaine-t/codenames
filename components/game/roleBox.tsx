import styles from './RoleBox.module.css';

interface RoleBoxProps {
  role: string;
}

export default function RoleBox({ role }: RoleBoxProps) {
  
  // Cursed I know
  const isRed = role.split('(')[1] === 'red)'
  const colorClassName = isRed ? styles.red : styles.blue

  return (
    <div className={[styles.box, colorClassName].join(" ")}>
        <h1>ROLE: {role.toUpperCase()}</h1>
    </div>
  );
}
