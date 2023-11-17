if ('serviceWorker' in navigator && window.location.host !== '127.0.0.1:5500') {
  const channel = new BroadcastChannel('lights-out-sw');

  channel.onmessage = (event) => {
    switch (event.data.type) {
      case 'UPDATED':
        window.location.reload();
    }
  };

  window.addEventListener('load', async () => {
    const registration = await navigator.serviceWorker.register('../sw.js');

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
