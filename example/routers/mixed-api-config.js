module.exports = {
  '/mixed/api/config': {
    api: [
      '/api/article/detail',
      {
        api: '/api/user/info',
        name: 'userInfo',
        series: true,
        handle(data, ctx) {
          return data;
        }
      },
      {
        api: '/api/author/info',
        query(ctx) {
          return { id: ctx.query.articleId }
        },
        handle(data, ctx) {
          return data;
        }
      },
      (ctx) => {
        if (ctx.query.commentShow) {
          return '/api/comments'
        }

        return null;
      },
      (ctx) => {
        return {
          api: '/api/relation-articles',
          name: 'articles'
        }
      }
    ],
    query(ctx) {
      return {
        userId: ctx.query.id,
        articleId: ctx.query.aid
      }
    },
    handle(data, ctx) {
      const articleDetail = data.detail;
      const userInfo = data.userInfo;
      const author = data.info;
      const comments = data.comments || [];
      const relationArticles = data.articles;

      ctx.body = JSON.stringify({ articleDetail, userInfo, author, comments, relationArticles });
    }
  }
}