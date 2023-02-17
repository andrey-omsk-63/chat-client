// import React from "react";
// import ReactDOM from "react-dom";

// import { legacy_createStore as createStore } from "redux";
// //import { configureStore } from "redux";
// import reportWebVitals from "./reportWebVitals";

// import { rootReducer } from "./redux/rootReducer";
// import { Provider } from "react-redux";
// //import { store } from "./store";

// import "./index.css";
// import App from './components/App';

// const store = createStore(rootReducer);

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById("root")
// );

// reportWebVitals();

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';

import './styles/main.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <App />
  </Router>,
);
