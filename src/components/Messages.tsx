import React from 'react';

import styles from '../styles/Messages.module.css';

const Messages = (props: any) => {
  return (
    <div className={styles.messages}>
      {props.messages.map((param: any, i: number) => {
        const itsMe = param.user.name.trim().toLowerCase() === props.name.trim().toLowerCase();
        const className = itsMe ? styles.me : styles.user;

        return (
          <div key={i} className={`${styles.message} ${className}`}>
            <span className={styles.user}>{param.user.name}</span>

            <div className={styles.text}>{param.message}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
