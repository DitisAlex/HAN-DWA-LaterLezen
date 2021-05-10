import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css';
import './App.css'
import './theme_dark.css'
import './theme_typewriter.css'
import './theme_bluegrey.css'
import './theme_darkblue.css'

ReactDOM.render( <BrowserRouter ><App /></BrowserRouter>, document.getElementById('root') );
    