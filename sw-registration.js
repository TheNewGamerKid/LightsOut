if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registration = await navigator.serviceWorker.register('/sw.js');

    registration.addEventListener('updatefound', () => {
      registration.installing.addEventListener('statechange', (event) => {
        const update = document.querySelector('#update');

        if (event.target.state === 'installed') {
          if (registration.active) {
            update.style.display = 'block';
            update.onclick = () => {
              console.log(registration);
              registration.waiting.postMessage({
                type: 'UPDATE',
              });
            };
          }
        }

        if (event.target.state === 'activated') {
          update.style.display = 'none';
          update.onclick = null;
        }

        console.log(event);
      });
    });
  });
}
