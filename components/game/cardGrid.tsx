import styles from './CardGrid.module.css';
import Card from "./card";

interface CardGridProps {
    handleClick: any;
}

export default function CardGrid({ handleClick }: CardGridProps) {
    return (
        <div className={styles.cardGrid}>
            <Card handleClick={handleClick} id={0} word="Alpha" role='Red' />
            <Card handleClick={handleClick} id={1} word="Beta" role='Blue' />
            <Card handleClick={handleClick} id={2} word="Charlie" role='Assassin' />
            <Card handleClick={handleClick} id={3} word="Delta" role='Bystander' />
            <Card handleClick={handleClick} id={4} word="Echo" />
            <Card handleClick={handleClick} id={5} word="Foxtrot" role='Blue' />
            <Card handleClick={handleClick} id={6} word="Golf" role='Red' />
            <Card handleClick={handleClick} id={7} word="Hotel" />
            <Card handleClick={handleClick} id={8} word="India" />
            <Card handleClick={handleClick} id={9} word="Juliett" />
            <Card handleClick={handleClick} id={10} word="Kilo" />
            <Card handleClick={handleClick} id={11} word="Lima" />
            <Card handleClick={handleClick} id={12} word="Mike" />
            <Card handleClick={handleClick} id={13} word="November" />
            <Card handleClick={handleClick} id={14} word="Oscar" />
            <Card handleClick={handleClick} id={15} word="Papa" />
            <Card handleClick={handleClick} id={16} word="Quebec" />
            <Card handleClick={handleClick} id={17} word="Romeo" />
            <Card handleClick={handleClick} id={18} word="Sierra" />
            <Card handleClick={handleClick} id={19} word="Tango" />
            <Card handleClick={handleClick} id={20} word="Uniform" />
            <Card handleClick={handleClick} id={21} word="Victor" />
            <Card handleClick={handleClick} id={22} word="Whiskey" />
            <Card handleClick={handleClick} id={23} word="Xray" />
            <Card handleClick={handleClick} id={24} word="Yankee" />
        </div>
    );
}
