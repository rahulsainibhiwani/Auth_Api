// import cryptoJS from "crypto-js";
// import colors from "colors";
// const secret = "rahulsaini7284";
// const password = "saini7284";
// const encrypted = cryptoJS.AES.encrypt(password, secret);
// console.log(encrypted.toString());
// const encrypt = "U2FsdGVkX1/9X3/jEliWiTeTREOrEBhao3ZxarGHY5I=";
// const decrypt = cryptoJS.AES.decrypt(encrypt, secret);
// const pass = decrypt.toString(cryptoJS.enc.Utf8);
// if (pass === "saini728") {
//   console.log("Verified".green.bold);
// } else {
//   console.log("Wrong Password".red.bold);
// }

import aes256 from "aes256";
const key = aes256.encrypt("rahulsaini7284@gmail.com", "saini728asdsd");
console.log(key);
