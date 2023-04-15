import React from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { MesssgeLength, Splitter } from './ChatServiceFunctions';

import { styleMess01, styleMeUser } from './ComponentsStyle';
import { styleMePict, styleUserPict } from './ComponentsStyle';
import { styleModalEnd, styleDelete } from './ComponentsStyle';

let resStr: any = [];
let picture: any = null;
let imageWidth = 0;
let imageHeight = 0;
let overFlow = 'auto';
//let ch = 0;

const Messages = (props: {
  messages: any;
  name: string;
  basket: any;
  PICT: any;
  funcDel: Function;
}) => {
  //console.log('1Пришло:', props.messages, props.PICT);
  let FuncDel = props.funcDel;
  // const Ch = () => {
  //   ch++;
  //   //console.log('Ch:', ch);
  // };

  const [openSetMode, setOpenSetMode] = React.useState(false);

  const handleCloseSetEnd = () => {
    setOpenSetMode(false);
  };

  const handleClickPict = React.useCallback(
    (idx: number) => {
      let tim = props.messages[idx].date;
      for (let i = 0; i < props.PICT.length; i++)
        if (props.PICT[i].time === tim) picture = props.PICT[i].message;

      let image = new Image();
      image.src = picture;
      setTimeout(() => {
        console.log('!!!', idx, image.width, image.height);
        imageWidth = window.screen.width - 169;
        //let proporsia = image.width / imageWidth;
        if (image.width < imageWidth) imageWidth = image.width;
        imageHeight = window.screen.height - 177;
        overFlow = 'auto';
        if (image.height < imageHeight) {
          imageHeight = image.height;
          overFlow = 'hidden';
        }
        setOpenSetMode(true);
      }, 200);
    },
    [props.messages, props.PICT],
  );

  const styleSetSelect = {
    outline: 'none',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: imageWidth + 20,
    height: imageHeight + 2,
    bgcolor: 'background.paper',
    p: 0.3,
  };

  const styleModalOverflow = {
    overflowY: overFlow, //hidden auto
    width: imageWidth,
    height: imageHeight - 2,
  };

  const StrMessages = React.useCallback(() => {
    resStr = [];
    for (let i = 0; i < props.messages.length; i++) {
      let itsme = false;
      let pict = false;
      if (props.messages[i].user.name.trim().toLowerCase() === props.name.trim().toLowerCase())
        itsme = true;
      let coler = 'black';
      if (!itsme && props.messages[i].user.name === 'ChatAdmin') coler = 'blue';
      let dlina = MesssgeLength(props.messages[i].message, 13.5) + 14;
      let mass: string[] = [props.messages[i].message];
      if (props.messages[i].message.length > 50) {
        if (props.messages[i].message.slice(0, 11) === 'data:image/') {
          pict = true;
          //Ch();
        } else {
          mass = Splitter(props.messages[i].message, 69);
          dlina = 0;
          for (let j = 0; j < mass.length; j++) {
            let dl = MesssgeLength(mass[j], 13.5) + 10;
            if (dl > dlina) dlina = dl;
          }
        }
      }

      const styleUserUser = {
        fontSize: '11.5px',
        color: coler,
        paddingLeft: '9px',
      };

      let dat =
        new Date(props.messages[i].date).toLocaleDateString() !== new Date().toLocaleDateString()
          ? new Date(props.messages[i].date).toLocaleDateString()
          : '';
      let tim = new Date(props.messages[i].date).toLocaleTimeString().slice(0, -3);

      const MassMessages = () => {
        let resSt: any = [];
        for (let j = 0; j < mass.length; j++) {
          let mb = 1;
          let mt = 0.3;
          let bs = 2;
          let ht = 27;
          let btlr = 9;
          let btrr = 9;
          let bblr = 9;
          let bbrr = 9;
          if (mass.length > 1 && j < mass.length - 1) mb = 0;
          if (j === 0 && mass.length > 1) {
            bs = 0;
          } else {
            btlr = 0;
            btrr = 0;
          }
          if (j > 0 && j < mass.length - 1) {
            mt = 0;
            bs = 0;
          }
          if (j === mass.length - 1 && mass.length > 1) {
            mt = 0;
            ht = 27;
          } else {
            bblr = 0;
            bbrr = 0;
            if (mass.length > 1) ht = 21;
          }
          if (mass.length === 1) {
            bblr = 9;
            bbrr = 9;
            btlr = 9;
            btrr = 9;
          }

          if (!itsme) btlr = 0;
          if (itsme) btrr = 0;

          const styleMeText = {
            width: dlina,
            border: 2,
            height: ht,
            fontSize: '13.5px',
            background: '#93E5EE', //зелёный
            borderColor: '#93E5EE',
            color: 'black',
            marginTop: mt,
            padding: '3px 0px 0 6px',
            marginLeft: 'auto',
            marginRight: 0.4,
            marginBottom: mb,
            boxShadow: bs,
            borderTopLeftRadius: btlr,
            borderTopRightRadius: btrr,
            borderBottomLeftRadius: bblr,
            borderBottomRightRadius: bbrr,
          };

          const styleUserText = {
            width: dlina,
            border: 2,
            height: ht,
            fontSize: '13.5px',
            background: '#fafac3', // жёлтый
            borderColor: '#fafac3',
            color: coler,
            marginTop: mt,
            padding: '2px 0px 0 6px',
            marginBottom: mb,
            boxShadow: bs,
            borderTopLeftRadius: btlr,
            borderTopRightRadius: btrr,
            borderBottomLeftRadius: bblr,
            borderBottomRightRadius: bbrr,
          };

          //console.log('2Пришло:', props.messages[i].message);

          resSt.push(
            <Grid key={j} item xs={12} sx={{ border: 0 }}>
              {!pict && <Box sx={!itsme ? styleUserText : styleMeText}>{mass[j]}</Box>}
              {pict && (
                <Box sx={!itsme ? styleUserPict : styleMePict}>
                  <img
                    src={props.messages[i].message}
                    style={{ float: itsme ? 'right' : 'left' }}
                    alt="PICT"
                    width="77%"
                    onClick={() => handleClickPict(i)}
                  />
                </Box>
              )}
            </Grid>,
          );
        }
        return resSt;
      };

      const handleDel = (num: number) => {
        FuncDel(props.messages[num].date);
      };

      resStr.push(
        <Grid key={i} item container xs={12}>
          <Grid item xs={12} sx={!itsme ? styleUserUser : styleMeUser}>
            <b>{props.messages[i].user.name}</b>&nbsp;&nbsp;
            <em>
              {dat}&nbsp;{tim}&nbsp;&nbsp;
            </em>
            {itsme && (
              <Button sx={styleDelete} onClick={() => handleDel(i)}>
                ❌
              </Button>
            )}
          </Grid>
          {MassMessages()}
        </Grid>,
      );
    }
    return resStr;
  }, [props.messages, props.name, handleClickPict]);

  React.useMemo(() => {
    console.log('MeMo');
    //console.log('2Пришло:', props.messages, props.PICT);
    StrMessages();
  }, [StrMessages]);

  return (
    <>
      <Box sx={styleMess01}>{resStr}</Box>
      <Modal open={openSetMode} onClose={handleCloseSetEnd}>
        <Box sx={styleSetSelect}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
            <b>&#10006;</b>
          </Button>
          <Box sx={styleModalOverflow}>
            <img src={picture} alt="PICT" />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Messages;

//https://russianblogs.com/article/3283799248/
// let eleFile = document.querySelector("#file");

// // Некоторые элементы и объекты, необходимые для сжатия изображений
// let reader = new FileReader();
// let img = new Image();

// // выбранный файловый объект
// let file: any = null;

// // Холст, необходимый для увеличения изображения
// let canvas = document.createElement("canvas");
// let context = canvas.getContext("2d");

// // После загрузки изображения адреса base64
// img.onload = function () {
//   // Исходный размер изображения
//   let originWidth = img.width;
//   let originHeight = img.height;
//   // Максимальный предел размера
//   var maxWidth = 400,
//     maxHeight = 400;
//   // целевой размер
//   var targetWidth = originWidth,
//     targetHeight = originHeight;
//   // Размер изображения превышает предел 400x400
//   if (originWidth > maxWidth || originHeight > maxHeight) {
//     if (originWidth / originHeight > maxWidth / maxHeight) {
//       // шире, ограничиваем размер по ширине
//       targetWidth = maxWidth;
//       targetHeight = Math.round(maxWidth * (originHeight / originWidth));
//     } else {
//       targetHeight = maxHeight;
//       targetWidth = Math.round(maxHeight * (originWidth / originHeight));
//     }
//   }

//   // Масштаб изображения на холсте
//   canvas.width = targetWidth;
//   canvas.height = targetHeight;
//   // Очищаем холст
//   context && context.clearRect(0, 0, targetWidth, targetHeight);
//   // Сжатие изображения
//   context && context.drawImage(img, 0, 0, targetWidth, targetHeight);
//   // конвертируем холст в большой двоичный объект и загружаем
//   canvas.toBlob(function (blob) {
//     // Загрузка изображения ajax
//     var xhr = new XMLHttpRequest();
//     // Файл загружен успешно
//     xhr.onreadystatechange = function () {
//       if (xhr.status == 200) {
//         // xhr.responseText - возвращаемые данные
//       }
//     };
//     // Начинаем загрузку
//     xhr.open("POST", "upload.php", true);
//     xhr.send(blob);
//   }, file.type || "image/png");
// };

// // Файл base64, чтобы узнать исходный размер картинки
// reader.onload = function (e: any) {
//   img.src = e.target.result;
// };
// eleFile && eleFile.addEventListener("change", function (event: any) {
//   file = event.target.files[0];
//   // Выбранный файл представляет собой картинку
//   if (file.type.indexOf("image") == 0) {
//     reader.readAsDataURL(file);
//   }
// });
//===========================================================
// react js сжатие графического файла
//https://www-abstractapi-com.translate.goog/guides/how-to-compress-an-image-in-react?_x_tr_sl=auto&_x_tr_tl=ru&_x_tr_hl=ru
//npm install --save browser-image-compression
//import imageCompression from 'browser-image-compression';
// React compress image component

// async function handleImageUpload(event: any) {
//   const imageFile = event.target.files[0];

//   const options = {
//     maxSizeMB: 1,
//     maxWidthOrHeight: 1920,
//   };
//   try {
//     const compressedFile = await imageCompression(imageFile, options);
//     console.log(compressedFile.size / 1024 / 1024);
//   } catch (error) {
//     console.log(error);
//   }
// }
