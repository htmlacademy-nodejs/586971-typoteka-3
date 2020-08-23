'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle,
  parseIsoDatetime
} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const AnnouncesRestrict = {
  MIN: 1,
  MAX: 5,
};
const MonthDifferenceRestrict = {
  MIN: 0,
  MAX: -2592000000,
};

const FILE_ANNOUNCES_PATH = `./data/announces.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;

const generateData = () => {
  const currentDate = new Date(Date.now() + getRandomInt(MonthDifferenceRestrict.MIN, MonthDifferenceRestrict.MAX));
  return parseIsoDatetime(currentDate.toISOString());
};

const generateCategories = (categories) => {
  const categoriesCount = getRandomInt(1, categories.length - 1);
  return shuffle(categories).slice(0, categoriesCount);
};

const generatePublication = (count, titles, categories, announces) => (
  Array(count).fill({}).map(()=>({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: generateData(),
    announce: shuffle(announces).slice(AnnouncesRestrict.MIN, AnnouncesRestrict.MAX).join(` `),
    fullText: shuffle(announces).slice(1, getRandomInt(1, announces.length - 1)).join(` `),
    category: generateCategories(categories),
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const announces = await readContent(FILE_ANNOUNCES_PATH);

    const [, count] = args;
    const countPublication = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublication(countPublication, titles, categories, announces));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
