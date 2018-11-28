import { EventEmitter } from 'events'
import * as mage from 'mage'
import * as util from 'util'

const register = util.promisify(mage.auth.register)
const login = util.promisify(mage.auth.login)

/**
 * Minimal date a login response must return to mage-admin
 */
export interface ILoginResponse {
  userId: string
  email: string
}

/**
 *
 */
export class AbstractAdminModule extends EventEmitter {
  public setup(_state: mage.core.IState, callback: (error?: Error) => void) {
    mage.on('runState', (runState: string) => {
      if (runState !== 'running') {
        return
      }

      const { commandCenter }  = (mage.core as any).app.get('game')

      commandCenter.setupUserCommand('admin', 'register', {
        acl: ['*'],
        execute: async (state: mage.core.IState, email: string, password: string) => {
          return this.register(state, email, password)
        }
      })
      commandCenter.setupUserCommand('admin', 'login', {
        acl: ['*'],
        execute: async (state: mage.core.IState, email: string, password: string) => this.login(state, email, password)
      })
      commandCenter.setupUserCommand('admin', 'logout', {
        acl: ['admin'],
        execute: async (state: mage.core.IState) => this.logout(state)
      })
    })

    callback()
  }
  public async register(state: mage.core.IState, email: string, password: string) {
    return register(state, email, password, {
      acl: ['admin']
    })
  }

  public async login(state: mage.core.IState, email: string, password: string): Promise<ILoginResponse> {
    const { actorId: userId } = await login(state, email, password)

    return { userId, email }
  }

  public logout(state: mage.core.IState) {
    return state.unregisterSession()
  }
}
