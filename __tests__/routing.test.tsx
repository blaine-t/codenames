import '@testing-library/jest-dom'
import { render, screen, act, fireEvent } from '@testing-library/react'

import ProtectedPage from '@/app/protected/page'
import AccountPage from '@/app/protected/account/page'
import SettingsPage from '@/app/protected/settings/page'
import AuthButton from '@/components/header-auth'
import { redirect } from 'next/navigation'
import mockSupabaseClient from '../lib/mockSupabaseClient'

const mockedUseRouter = {
  push: jest.fn(),
}

jest.mock('next/navigation', () => ({
  // Since this has push we need a seperate variable to check in tests
  useRouter: jest.fn(() => mockedUseRouter),
  // Since this is flat we can just import redirect and use it in our tests
  redirect: jest.fn(),
  // Hardcode the code to be 1234
  useSearchParams: jest.fn(() => new URLSearchParams('code=1234')),
}))

jest.mock('@/utils/supabase/useUserProfile', () => ({
  useUserProfile: jest.fn(() => ({
    profile: { id: 'user123', email: 'test@example.com', name: 'Test User' },
    isLoading: false,
    error: null,
  })),
}))

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

describe('ProtectedPage', () => {
  it('Join button redirects to /protected/matchmaking?code=1234', async () => {
    await act(() => render(<ProtectedPage />))

    // Set the code so it is predictable when we press join
    const codeInput = await screen.findByTestId('code-input')
    fireEvent.change(codeInput, { target: { value: '1234' } })

    // This is how you click a button
    const joinButton = await screen.findByTestId('join-button')
    await act(async () => fireEvent.click(joinButton))

    expect(mockedUseRouter.push).toHaveBeenCalledWith('/protected/matchmaking?code=1234')
  })

  it('Host button redirects to /protected/matchmaking?code={4 digits}', async () => {
    await act(() => render(<ProtectedPage />))

    const hostButton = await screen.findByTestId('host-button')
    await act(async () => fireEvent.click(hostButton))

    // Since there is a query param we need to use regex
    expect(mockedUseRouter.push).toHaveBeenCalledWith(expect.stringMatching(/^\/protected\/matchmaking\?code=\d{4}$/))
  })
})

describe('AccountPage', () => {
  it('Settings button redirects to /protected/settings', async () => {
    await act(() => render(<AccountPage />))

    const settingsButton = await screen.findByTestId('settings-button')
    await act(async () => fireEvent.click(settingsButton))

    expect(mockedUseRouter.push).toHaveBeenCalledWith('/protected/settings')
  })
})

describe('SettingsPage', () => {
  it('Reset your Password button redirects to /protected/reset-password', async () => {
    await act(() => render(<SettingsPage />))

    const resetPasswordButton = await screen.findByTestId('reset-password-button')
    await act(async () => fireEvent.click(resetPasswordButton))

    expect(mockedUseRouter.push).toHaveBeenCalledWith('/protected/reset-password')
  })

  it('Save Changes button redirects to /protected/account', async () => {
    await act(() => render(<SettingsPage />))

    const saveButton = await screen.findByTestId('save-button')
    await act(async () => fireEvent.click(saveButton))

    expect(mockedUseRouter.push).toHaveBeenCalledWith('/protected/account')
  })
})

// Header is a server side rendered component so
// things get a little different compared to the other tests
describe('Header', () => {
  it('Header Back button takes you to /protected', async () => {
    await act(async () => render(await AuthButton({ pathname: '' })))

    const backButton = await screen.findByTestId('back-button')
    await act(async () => fireEvent.click(backButton))

    expect(redirect).toHaveBeenCalledWith('/protected')
  })

  it('Header Account button takes you to /protected/account', async () => {
    await act(async () => render(await AuthButton({ pathname: '' })))

    const accountButton = await screen.findByTestId('account-button')
    await act(async () => fireEvent.click(accountButton))

    expect(redirect).toHaveBeenCalledWith('/protected/account')
  })

  it('Header Sign Out button takes you to /sign-in', async () => {
    await act(async () => render(await AuthButton({ pathname: '' })))

    const signOutButton = await screen.findByTestId('signout-button')
    await act(async () => fireEvent.click(signOutButton))

    expect(redirect).toHaveBeenCalledWith('/sign-in')
  })
})
