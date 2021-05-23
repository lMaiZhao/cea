import log from './utils/logger'
import login from './crawler/login'

export const sstore = require('@beetcb/sstore')
export * from './types/conf'
export * from './types/cookie'
export * from './types/helper'

import { SchoolConf, UserConfOpts } from './types/conf'

export async function handleCookie() {
  await Promise.all(
    sstore.get('users').map(async (i: UserConfOpts) => {
      const storeCookiePath = `cookie.${i.alias}`
      await handleLogin(i, storeCookiePath)
    })
  )
}

async function handleLogin(i: UserConfOpts, storeCookiePath: string) {
  let cookie = sstore.get(storeCookiePath)
  const name = i.alias
  // Check if the cookie is stored, if not, login in to eat them
  if (!cookie) {
    cookie = await login((sstore.get('schools') as SchoolConf)[i.school], i)
    if (cookie) {
      sstore.set(storeCookiePath, cookie)
      log.success({
        message: `已成功获取并缓存 COOKIE`,
        suffix: `@${name}`,
      })
    }
  } else {
    log.success({
      message: `尝试使用缓存中的 COOKIE`,
      suffix: `@${name}`,
    })
  }
}

// handleCookie()