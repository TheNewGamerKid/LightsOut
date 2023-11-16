import { getCookie, setCookie } from './utils.js';

if ('serviceWorker' in navigator) {
  const channel = new BroadcastChannel('lights-out-sw');

  window.toggleDev = () => {
    const isDev = getCookie('isDev');

    setCookie('isDev', !isDev, 400);

    channel.postMessage({
      type: 'SET_DEV_STATE',
      payload: isDev,
    });
  };

  channel.onmessage = (event) => {
    switch (event.data.type) {
      case 'UPDATED':
        window.location.reload();
    }
  };

  window.addEventListener('load', async () => {
    const registration = await navigator.serviceWorker.register('../sw.js');

    channel.postMessage({
      payload: getCookie('isDev'),
      type: 'SET_DEV_STATE',
    });

    registration.addEventListener('updatefound', () => {
      registration.installing.addEventListener('statechange', (event) => {
        const update = document.querySelector('#update');

        if (event.target.state === 'installed') {
          if (registration.active) {
            update.style.display = 'block';
            update.onclick = () => {
              channel.postMessage({
                type: 'UPDATE',
              });
            };
          }
        }

        if (event.target.state === 'activated') {
          update.style.display = 'none';
          update.onclick = null;
        }
      });
    });
  });
}
