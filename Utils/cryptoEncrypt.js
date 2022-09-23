import cryptoJS from "crypto-js";

const secret_key = process.env.CRYPTO_SECRET_KEY;
export const encryptPassword = (password) => {
  return cryptoJS.AES.encrypt(password, secret_key).toString();
};

export const decryptPassword = (encryptedPassword) => {
  const decrypted = cryptoJS.AES.decrypt(encryptedPassword, secret_key);
  const decryptedPassword = decrypted.toString(cryptoJS.enc.Utf8);
  return decryptedPassword;
};
