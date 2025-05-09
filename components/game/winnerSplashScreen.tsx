import styles from './winnerSplashScreen.module.css'

interface WinnerSplashScreenProps {
    winningTeam: string | null;
}

const WinnerSplashScreen: React.FC<WinnerSplashScreenProps> = ({ winningTeam }) => {
    if (winningTeam === null) {
        return
    }

    let teamStyle = ''
    switch(winningTeam) {
        case 'red':
            teamStyle = styles.red
            break;
        case 'blue':
            teamStyle = styles.blue
            break;
    }

    return (
        <div className={styles.splashContainer}>
            <div className={styles.winnerContent}>
                <h1 className={styles.winnerTitle}>🎉 Game Over! 🎉</h1>
                <h2 className={[styles.winnerTeam, teamStyle].join(' ')}>{winningTeam.toUpperCase()} Wins!</h2>
                <a href='/protected' className={styles.backButton}>Back Home</a>
            </div>
        </div>
    );
};

export default WinnerSplashScreen;
