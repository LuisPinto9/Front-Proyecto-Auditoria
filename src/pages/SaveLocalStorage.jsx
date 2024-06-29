export const SaveLocalStorage = (key, item) => {
  console.log(item);
  //lementos en localStorage
  let elementos = JSON.parse(localStorage.getItem(key));
  //comprobar si es un array
  if (Array.isArray(elementos)) {
    elementos.push(item);
  } else {
    elementos = [item];
  }
  localStorage.setItem(key, JSON.stringify(elementos));
 
  return item;
}; 