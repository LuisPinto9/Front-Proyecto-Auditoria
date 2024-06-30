import CryptoJS from "crypto-js";

const encrypt = (text) => {
  const key = CryptoJS.enc.Utf8.parse(import.meta.env.SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(import.meta.env.SECRET_IV);
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv }).toString();
  return encrypted;
};

const decrypt = (text) => {
  const key = CryptoJS.enc.Utf8.parse(import.meta.env.SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(import.meta.env.SECRET_IV);
  const decrypted = CryptoJS.AES.decrypt(text, key, { iv }).toString(CryptoJS.enc.Utf8);
  return decrypted;
};

export { encrypt, decrypt };
