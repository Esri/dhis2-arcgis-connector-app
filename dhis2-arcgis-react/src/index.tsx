import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/App.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.render(<App />, rootElement);
}