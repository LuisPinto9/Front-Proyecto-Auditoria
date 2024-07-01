import CryptoJS from "crypto-js";

const encrypt = (text) => {
  const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_IV);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const ivHex = CryptoJS.enc.Hex.stringify(iv);
  const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

  return ivHex + ":" + encryptedHex;
};

const decrypt = (text) => {
  const textParts = text.split(":");
  const ivHex = textParts.shift();
  const encryptedText = textParts.join(":"); 

  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY);

  try {
    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(encryptedText),
      },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error("Error al descifrar:", error);
    return '';
  }
};

export { encrypt, decrypt };
