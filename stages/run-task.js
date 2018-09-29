const valueChain = require('value-chain');

async function handleData(req, ctx) {
  const router = req.router;

  if (router && router.handle) {
    const data = await router.handle(ctx.apiData, ctx);

    valueChain.set(data);

    if (router.name) {
      ctx.apiData[router.name] = data;
    } else {
      ctx.apiData = data;
    }
  }
}

module.exports = async function runTask(ctx, next) {
  const seriesTask = req.apisTask.series;
  const parallelTask = req.apisTask.parallel;

  if (seriesTask) {
    await seriesTask.run();
  }

  if (parallelTask) {
    await parallelTask.run();
  }

  await handleData(req, ctx);

  next();
};
