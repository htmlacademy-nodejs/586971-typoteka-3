'use strict';

const express = require(`express`);
const {Router} = require(`express`);
const fs = require(`fs`).promises;
const {HttpCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const postsRouter = Router();
postsRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    if (!mocks || mocks.length === 0) {
      res.json([]);
    } else {
      res.json(mocks);
    }
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

const app = express();
app.use(express.json());
app.use(`/posts`, postsRouter);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [, customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err)=> {
        if (err) {
          return console.error(`Ошибка при создании сервера`, err);
        }
        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
  }
};
