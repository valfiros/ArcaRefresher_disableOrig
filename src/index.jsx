import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

async function waitBody() {
  return new Promise((resolve) => {
    if (document.body) {
      resolve();
      return;
    }

    const obs = new MutationObserver(() => {
      if (document.body) {
        obs.disconnect();
        resolve();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  });
}

(async () => {
  await waitBody();
  const appContainer = document.createElement('div');
  document.body.append(appContainer);

  ReactDOM.render(<App />, appContainer);
})();
