import { input } from '../static/defaultEl';
import injectCustomRender from './source/injectCustomRender';
import observeGameStart from './source/observeGameStart';
import './styles/main.css';

observeGameStart(injectCustomRender);

document.getElementById('param_keyboard')?.addEventListener('click', () => {
    input?.focus();
});
