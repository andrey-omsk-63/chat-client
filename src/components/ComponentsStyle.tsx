//=== Main ===============================================
export const styleMainBox02 = {
  width: "100%",
  height: "96vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};

export const styleMainBox03 = {
  border: 0,
  fontSize: 38,
  height: "48px",
  textAlign: "center",
  color: "#C0C0C0",
};

export const styleMainBox04 = {
  border: 0,
  display: "flex",
  width: 350,
  flexDirection: "column",
  rowGap: "12px",
  marginTop: "20px",
};

export const styleMainBox05 = {
  minWidth: "320px",
  height: "48px",
  borderRadius: 2,
  overflow: "hidden",
};

export const styleMainBox06 = {
  fontSize: 16,
  minWidth: "320px",
  height: "48px",
  width: 350,
  borderRadius: 2,
  overflow: "hidden",
  backgroundColor: "#E9F5D8",
  color: "black",
  textTransform: "unset !important",
};
//=== Chat ===============================================
export const styleChat01 = {
  //border: 3,
  width: "100%",
  height: "99.75vh",
  display: "flex",
  alignItems: "left",
  flexDirection: "column",
};

export const styleChat02 = {
  border: 0,
  fontSize: 14,
  width: "100%",
  height: "7vh",
  color: "blue",
  //background: '#D3D3D3',
  //background: '#E5E5E5',
  //background: '#CCDCEC', // серо-голубой
  background: "#F1F5FB", // светло серый
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 20px",
  borderTopLeftRadius: 4,
};

export const styleChat021 = {
  border: 0,
  fontSize: 12.9,
  width: "100%",
  height: "7vh",
  color: "blue",
};

export const styleChat022 = {
  textAlign: "center",
  padding: "3vh 0 0 0",
};

export const styleChat03 = {
  lineHeight: "48px",
  textAlign: "center",
  color: "blue",
};

export const styleChat04 = {
  fontSize: 11,
  background: "#FF99CC",
  border: 1,
  borderColor: "#FF77BB",
  borderRadius: 2,
  color: "#fff",
  padding: "4px",
  cursor: "pointer",
  boxShadow: 5,
  textTransform: "unset !important",
};

export const styleChat041 = {
  fontSize: 12.5,
  //background: '#B3CBE3', // голубой
  bgcolor: "#E6F5D6", // светло салатовый
  marginTop: -0.5,
  color: "blue",
  padding: "6px",
  border: 1,
  borderColor: "#d4d4d4", // серый
  borderRadius: 2,
  boxShadow: 5,
  textTransform: "unset !important",
};

export const styleChat05 = {
  fontSize: 11,
  flexGrow: 1,
  width: "100%",
  //background: '#E5E5E5',
  background: "linear-gradient(125deg, #DCE0AB 30%,#97BB92 52%, #D2D8B7 85%)",
  paddingLeft: "12px",
  paddingRight: "12px",
  height: "86vh",
};

export const styleChat16 = {
  color: "blue",
  width: "100%",
  display: "flex",
  alignItems: "center",
  //background: '#D3D3D3',
  //background: '#E5E5E5',
  //background: '#CCDCEC', // серо-голубой
  background: "#F1F5FB", // светло серый
  justifyContent: "space-between",
  height: "7vh",
  padding: "0 0 0 10px",
  borderBottomLeftRadius: 4,
};

export const styleChat06 = {
  width: "40px",
  position: "relative",
};

export const styleChat061 = {
  fontSize: 21,
  padding: "0 2vh 0 0",
};

export const styleChat07 = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "100%",
};

export const styleChat08 = {
  fontSize: 12,
  textAlign: "center",
  padding: "0.5vh 0 0 0",
};

export const styleChat081 = {
  fontSize: 14,
  textAlign: "left",
  padding: "0.6vh 0 0 0",
  color: "blue",
};

export const styleChatInp01 = {
  flexGrow: 1,
  height: "100%",
};

export const styleChatInp02 = {
  fontSize: 14,
  height: "100%",
  width: 370,
  fontWeight: 370,
  marginTop: "2vh",
  color: "blue",
};

export const styleChatInp03 = {
  textAlign: "center",
  marginTop: 0.5,
};

export const styleChatInp04 = {
  cursor: "pointer",
  color: "black",
};

export const styleChatBut01 = {
  minWidth: 16,
  maxWidth: 16,
  minHeight: 14,
  maxHeight: 14,
  marginTop: -0.5,
  boxShadow: 5,
};

export const styleChatBut02 = {
  fontSize: 16,
  minWidth: 70,
  maxWidth: 70,
  marginTop: -0.5,
  textTransform: "unset !important",
  //background: '#B3CBE3', // голубой
  bgcolor: "#E6F5D6", // светло салатовый
  border: 1,
  borderColor: "#d4d4d4", // серый
  borderRadius: 2,
  boxShadow: 5,
};

export const styleChatBut021 = {
  fontSize: 16,
  minWidth: 70,
  maxWidth: 70,
  marginTop: -0.5,
  textTransform: "unset !important",
  bgcolor: "#BAE186", // салатовый
  border: 1,
  borderColor: "#93D145", // тёмно салатовый
  borderRadius: 2,
  boxShadow: 5,
};

export const styleBackdrop = {
  color: "#fff",
  marginLeft: window.innerWidth - 698 + "px",
  zIndex: (theme: any) => theme.zIndex.drawer + 1,
};
//=== Messages ===========================================
export const styleMess01 = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: "3px",
};

export const styleUserUser = {
  fontSize: "11.5px",
  color: "black",
  paddingLeft: "9px",
};

export const styleMeUser = {
  fontSize: "11.5px",
  color: "black",
  paddingRight: "9px",
  textAlign: "right",
};

export const styleMePict = {
  padding: "3px 3px 3px 6px",
  marginLeft: "auto",
  marginRight: 0.4,
  //width: '77%',
  height: "100%",
};

export const styleUserPict = {
  padding: "0px 0px 3px 3px",
  height: "100%",
};

export const styleModalEnd = {
  position: "absolute",
  top: "0%",
  left: "auto",
  right: "-2px",
  height: "21px",
  maxWidth: "2%",
  minWidth: "2%",
  color: "black",
};

export const styleDelete = {
  fontSize: 7,
  height: "21px",
  maxWidth: "2%",
  minWidth: "2%",
};
//========================================================
