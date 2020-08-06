'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle,
  parseIsoDatetime
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
const AnnouncesRestrict = {
  MIN: 1,
  MAX: 5,
};
const MonthDifferenceRestrict = {
  MIN: 0,
  MAX: -2592000000,
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
  const currentDate = new Date(Date.now() + getRandomInt(MonthDifferenceRestrict.MIN, MonthDifferenceRestrict.MAX));
  return parseIsoDatetime(currentDate.toISOString());
};

const generateCategories = () => {
  const categoriesCount = getRandomInt(1, CATEGORIES.length-1);
  return shuffle(CATEGORIES).slice(0, categoriesCount);
};

const generatePublication = (count) => (
  Array(count).fill({}).map(()=>({
    title: TITLES[getRandomInt(0, TITLES.length-1)],
    createdDate: generateData(),
    announce: shuffle(ANNOUNCES).slice(AnnouncesRestrict.MIN, AnnouncesRestrict.MAX).join(` `),
    fullText: shuffle(ANNOUNCES).slice(1, getRandomInt(1, ANNOUNCES.length -1)).join(` `),
    category: generateCategories(),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [,count] = args;
    const countPublication = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublication(countPublication));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      return process.exit(ExitCode.success);
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      return process.exit(ExitCode.ERROR);
    }
  }
};
