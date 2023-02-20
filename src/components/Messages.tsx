import React from 'react';

import Box from '@mui/material/Box';

import styles from '../styles/Messages.module.css';

import { styleMess01 } from './ComponentsStyle';

const Messages = (props: any) => {
  const Ender = () => {
    if (props.divRef) props.divRef.current.scrollTop = props.divRef.current.scrollHeight;
  };
  return (
    // <div className={styles.messages}>
    <Box sx={styleMess01}>
      {props.messages.map((param: any, i: number) => {
        const itsMe = param.user.name.trim().toLowerCase() === props.name.trim().toLowerCase();
        const className = itsMe ? styles.me : styles.user;

        return (
          <div key={i} className={`${styles.message} ${className}`}>
            <>
              <span className={styles.user}>{param.user.name}</span>

              <div className={styles.text}>{param.message}</div>
              {/* {Ender()} */}
            </>
          </div>
        );
      })}
    </Box>
    // </div>
  );
};

export default Messages;
