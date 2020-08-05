'use strict';

/**
 * Функция для получения случайных значений из диапазона
 * @return {number} - случайное число
 * @param {number} min - "от"
 * @param {number} max - "до"
 * */
module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Функция для перетасовки массива алгоритмом тасования Фишера-Йетса
 * @return {array} - перетасованный массив
 * @param {array} someArray - исходный массив
 * */
module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

/**
 * Функция для проверки даты на корректность
 * @return {boolean} - результат проверки
 * @param {string} date - проверяемая дата
 * */
module.exports.validateDate = (date) => {
  const arrD = date.split(`.`);
  arrD[1] -= 1;
  const d = new Date(arrD[2], arrD[1], arrD[0]);
  return (d.getFullYear() === arrD[2]) && (d.getMonth() === arrD[1]) && (d.getDate() === arrD[0]);
};

/**
 * Функция для парсинга строки даты в формате из ISO в yyyy.mm.dd
 * @return {string} - дата в формате yyyy.mm.dd
 * @param {string} dtstr - дата в формате ISO
 * */
module.exports.parseIsoDatetime = (dtstr) => {
    const dt = dtstr.split(`T`);
    return dt[0].split(`-`).join(`.`);
};
