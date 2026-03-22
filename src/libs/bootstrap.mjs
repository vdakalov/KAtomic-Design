import Application from '../index.mjs';

const application = window.application = new Application();
window.document.body.appendChild(application.canvas.element);
