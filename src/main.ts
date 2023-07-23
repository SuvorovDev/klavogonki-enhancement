import injectCustomRender from './source/injectCustomRender';
import observeGameStart from './source/observeGameStart';
import './styles/main.css';

observeGameStart(injectCustomRender);
