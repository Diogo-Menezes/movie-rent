const app = require('../index');

module.exports = () => {
  const port = process.env.PORT || 3333;

  const server = app.listen(port, () => {
    winston.info(`Server started in port: ${port}  🚀`);
  });
};
