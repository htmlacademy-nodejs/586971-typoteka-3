'use strict';
const fs = require(`fs`);
const {
  getRandomInt,
  shuffle,
  validateDate
} = require(`../../utils`);
const { ExitCode } = require(`../../constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];
const ANNOUNCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];
const announcesRestrict = {
  MIN: 1,
  MAX: 5,
};
const monthDifferenceRestrict = {
  MIN: 0,
  MAX: 2,
};
const dayRestrict = {
  MIN: 1,
  MAX: 31
};
const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const generateData = () => {
  const maxIteration = 10;
  let iteration = 0;
  while (true) {
    iteration++;

    const currentDate = new Date();

    const year = currentDate.getFullYear();

    const currentMonth = currentDate.getMonth() + 1;
    const month = currentMonth - getRandomInt(monthDifferenceRestrict.MIN, monthDifferenceRestrict.MAX);

    const currentDay = currentDate.getDate();
    const maxDay = currentMonth === month ? currentDay : dayRestrict.MAX;
    const day = getRandomInt(dayRestrict.MIN, maxDay);

    if (iteration === maxIteration) {
      return `${currentDay}.${currentMonth}.${year}`;
    } else if(validateDate(`${day}.${month}.${year}`)) {
      return `${day}.${month}.${year}`;
    }
  }
};

const generateCategories = () => {
  const categoriesCount = getRandomInt(1, CATEGORIES.length-1);
  const used = [];
  let category;

  return Array(categoriesCount)
    .fill('')
    .map(() => {
      while (true) {
        category = CATEGORIES[getRandomInt(0, CATEGORIES.length-1)];
        if (!used.includes(category)) {
          used.push(category);
          break;
        }
      }
      return category;
    });
};

const generatePublication = (count) => (
  Array(count).fill({}).map(()=>({
    title: TITLES[getRandomInt(0, TITLES.length-1)],
    createdDate: generateData(),
    announce: shuffle(ANNOUNCES).slice(announcesRestrict.MIN, announcesRestrict.MAX).join(` `),
    fullText: shuffle(ANNOUNCES).slice(1, getRandomInt(1, ANNOUNCES.length -1)).join(` `),
    category: generateCategories(),
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [,count] = args;
    const countPublication = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublication(countPublication));
    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.error(`Can't write data to file...`);
        return process.exit(ExitCode.ERROR);
      }
      console.info(`Operation success. File created.`);
      return process.exit(ExitCode.success);
    });
  }
};
