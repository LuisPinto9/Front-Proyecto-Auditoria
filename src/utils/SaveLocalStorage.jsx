export const SaveLocalStorage = (key, item) => {
  localStorage.removeItem(key);
  let elementos = JSON.parse(localStorage.getItem(key));

  if (!Array.isArray(elementos)) {
    elementos = [];
  }

  elementos.push(item);
  localStorage.setItem(key, JSON.stringify(elementos));

  return item;
};
