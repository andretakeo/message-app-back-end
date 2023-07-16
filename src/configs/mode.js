import chalk from "chalk";

const modeLog = (mode) => {
  switch (mode) {
    case "development":
      return chalk.yellowBright(mode);
    case "production":
      return chalk.greenBright(mode);
    default:
      return chalk.yellow(mode);
  }
};

export { modeLog };
