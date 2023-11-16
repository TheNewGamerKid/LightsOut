export const getCookie = (name) => {
  const cookieName = `${name}=`;
  const decodedCookies = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookies.split(';');

  for (let cookie of cookieArray) {
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }

    if (cookie.indexOf(cookieName) === 0) {
      return JSON.parse(cookie.substring(cookieName.length, cookie.length));
    }
  }

  return false;
};

export const setCookie = (name, val, days) => {
  let date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = `expires=${date.toUTCString()}`;

  document.cookie = `${name}=${val};${expires};path=/`;
};
