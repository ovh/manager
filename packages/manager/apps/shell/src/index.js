import './index.scss';
import './App.jsx';
import initSso from './sso';
import initRouter from './router';

initSso();
initRouter(document.querySelector('.manager-shell iframe'));
