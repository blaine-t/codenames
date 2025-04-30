"use client"

import styles from './TimeBox.module.css';
import { useEffect, useState } from 'react';

interface TimeBoxProps {
  seconds: number | null;
  reset: boolean;
  setReset: any;
}

export default function Card({ seconds, reset, setReset }: TimeBoxProps) {
  const [time, setTime] = useState(seconds || 60);

  if (reset) {
    setReset(false)
  }

  useEffect(() => {
    if (seconds == null) {
      return
    }
    setTime(seconds)
    console.log(reset)
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, reset]);
  
  const minutes = Math.floor(time / 60).toString();
  const displaySeconds = (time % 60).toString().padStart(2, '0');
  return (
    <div className={styles.box}>
        <h1>{minutes}:{displaySeconds}</h1>
    </div>
  );
}
