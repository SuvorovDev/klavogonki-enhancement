import { input } from '@static/defaultEl';
import injectCustomRender from '@game/injectCustomRender';
import observeGameStart from '@game/observeGameStart';
import '@/styles/main.css';

observeGameStart(injectCustomRender);

document.getElementById('param_keyboard')?.addEventListener('click', () => {
    input?.focus();
});
