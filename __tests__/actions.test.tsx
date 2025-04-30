import {
  signUpAction,
  signInAction,
  forgotPasswordAction,
  resetPasswordAction,
  signOutAction,
  accountAction,
  backAction,
} from '@/app/actions'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { encodedRedirect } from '@/utils/utils'

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('@/utils/utils', () => ({
  encodedRedirect: jest.fn(),
}))

const mockSupabase = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
    signOut: jest.fn(),
  },
}

beforeEach(() => {
  ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)
  ;(headers as jest.Mock).mockReturnValue({
    get: jest.fn(() => 'http://localhost:3000'),
  })
  jest.clearAllMocks()
})

describe('Auth Actions', () => {
  it('signUpAction - missing email/password triggers encodedRedirect', async () => {
    const formData = new FormData()
    await signUpAction(formData)
    expect(encodedRedirect).toHaveBeenCalledWith('error', '/sign-up', 'Email and password are required')
  })

  it('signUpAction - successful signup triggers success encodedRedirect', async () => {
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('password', 'password123')
    mockSupabase.auth.signUp.mockResolvedValueOnce({ error: null })

    await signUpAction(formData)
    expect(encodedRedirect).toHaveBeenCalledWith(
      'success',
      '/sign-up',
      'Thanks for signing up! Please check your email for a verification link.'
    )
  })

  it('signInAction - successful login redirects', async () => {
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('password', 'password123')
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({ error: null })

    await signInAction(formData)
    expect(redirect).toHaveBeenCalledWith('/protected')
  })

  it('forgotPasswordAction - missing email triggers error', async () => {
    const formData = new FormData()
    await forgotPasswordAction(formData)
    expect(encodedRedirect).toHaveBeenCalledWith('error', '/forgot-password', 'Email is required')
  })

  it('forgotPasswordAction - successful reset triggers success', async () => {
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
      error: null,
    })

    await forgotPasswordAction(formData)
    expect(encodedRedirect).toHaveBeenCalledWith(
      'success',
      '/forgot-password',
      'Check your email for a link to reset your password.'
    )
  })

  it('signOutAction - signs out and redirects', async () => {
    await signOutAction()
    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/sign-in')
  })

  it('accountAction - redirects to account page', async () => {
    await accountAction()
    expect(redirect).toHaveBeenCalledWith('/protected/account')
  })

  it('backAction - redirects to protected', async () => {
    await backAction()
    expect(redirect).toHaveBeenCalledWith('/protected')
  })
})
