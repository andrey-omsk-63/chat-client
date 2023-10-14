import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const ChatErrorMessage = (props: { sErr: string; setOpen: any }) => {
  const [openSet, setOpenSet] = React.useState(true);

  const styleSetInf = {
    outline: 'none',
    position: 'absolute',
    // marginTop: '15vh',
    // marginLeft: '24vh',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 380,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderColor: 'red',
    borderRadius: 1,
    boxShadow: 24,
    p: 1.5,
  };

  const styleModalEnd = {
    position: 'absolute',
    top: '0%',
    left: 'auto',
    right: '-0%',
    height: '21px',
    maxWidth: '2%',
    minWidth: '2%',
    color: 'red',
  };

  const handleClose = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  return (
    <Modal open={openSet} onClose={handleClose} hideBackdrop={false}>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleClose}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'red' }}>
          {props.sErr}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ChatErrorMessage;
