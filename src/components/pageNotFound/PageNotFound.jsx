import styles from './PageNotFound.module.scss';
import reactLogo from './404.png';
import { useEffect } from 'react';

export default function PageNotFound({ label, hookes }) {
  useEffect(() => {
    console.log('started');
  });

  return (
    <div className={`${styles.root} container`}>
      <img src={reactLogo} className="logo" alt="Vite logo" />
      <span>{label}</span>
      <div>
        <a href="/">{hookes}</a>
      </div>
    </div>
  );
}
