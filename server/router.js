import Router from 'koa-router'

const router = new Router()

router.get('/api/favorites', async (ctx) => {
  ctx.type = 'application/json'

  ctx.body = JSON.stringify({
    test: 'foobarbaz',
  })
})

export default router
