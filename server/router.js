import Router from 'koa-router'

const router = new Router()
const favorites = new Set()

router.get('/api/favorites', async ctx => {
  ctx.type = 'application/json'
  ctx.body = JSON.stringify({
    favorites: [...favorites]
  })
})

router.put('/api/favorites/:uid', async ctx => {
  favorites.add(ctx.params.uid)

  ctx.type = 'application/json'
  ctx.body = JSON.stringify({
    favorites: [...favorites]
  })
})

router.delete('/api/favorites/:uid', async ctx => {
  favorites.delete(ctx.params.uid)

  ctx.type = 'application/json'
  ctx.body = JSON.stringify({
    favorites: [...favorites]
  })
})

router.delete('/api/favorites', async ctx => {
  favorites.clear()

  ctx.type = 'application/json'
  ctx.body = JSON.stringify({
    favorites: [...favorites]
  })
})

export default router
