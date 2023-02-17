// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './components/App';
// import {Provider} from "react-redux";
// import {store} from "./store";

// ReactDOM.render(
// 	<Provider store={store}>
// 		<App />
// 	</Provider>,
// 	document.getElementById('root')
// );

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';

import './styles/main.css';

const container: any = document.getElementById('root');
const root: any = createRoot(container);

root.render(
  <Router>
    <App />
  </Router>,
);
