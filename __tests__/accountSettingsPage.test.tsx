import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import AccountPage from '@/app/protected/account/page'
import SettingsPage from '@/app/protected/settings/page'
import { act } from '@testing-library/react'

//mock next/router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

//mock user profile
jest.mock('@/utils/supabase/useUserProfile', () => ({
  useUserProfile: jest.fn(() => ({
    profile: {
      username: 'test-user',
      image: '/samplePFP.png',
      wins: 3,
      losses: 4,
      elo: 1200,
    },
    loading: false,
    error: null,
  })),
}))

//mock supabase
jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn(() =>
        Promise.resolve({
          data: { user: { id: 'mock-user-id' } },
          error: null,
        })
      ),
    },
    from: () => ({
      update: () => ({
        eq: () =>
          Promise.resolve({
            error: null,
          }),
      }),
    }),
  }),
}))

// Setup before each test
beforeEach(() => {
  mockPush.mockClear()
  window.alert = jest.fn()
})

describe('AccountPage', () => {
  it('renders profile info and navigates to settings on click', () => {
    render(<AccountPage />)

    expect(screen.getByText('test-user')).toBeInTheDocument()
    expect(screen.getByText('Wins: 3')).toBeInTheDocument()
    expect(screen.getByText('Losses: 4')).toBeInTheDocument()
    expect(screen.getByText('ELO: 1200')).toBeInTheDocument()

    const settingsButton = screen.getByTestId('settings-button')
    fireEvent.click(settingsButton)
    expect(mockPush).toHaveBeenCalledWith('/protected/settings')
  })

  it('renders a list of 3 friends', () => {
    render(<AccountPage />)
    const friends = screen.getAllByText(/👤 Friend/)
    expect(friends).toHaveLength(3)
  })
})

describe('SettingsPage', () => {
  it('renders heading and inputs visually', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Username:')).toBeInTheDocument()
    expect(screen.getByText('Profile Picture:')).toBeInTheDocument()
  })

  it('updates the username input', () => {
    render(<SettingsPage />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'updated-user' } })
    expect(input.value).toBe('updated-user')
  })

  it('navigates to reset-password on reset password button click', () => {
    render(<SettingsPage />)
    const resetButton = screen.getByTestId('reset-password-button')
    fireEvent.click(resetButton)
    expect(mockPush).toHaveBeenCalledWith('/protected/reset-password')
  })

  it('navigates to account page on save', async () => {
    render(<SettingsPage />)
    const saveButton = screen.getByTestId('save-button')
  
    await act(async () => {
      fireEvent.click(saveButton)
    })
  
    expect(mockPush).toHaveBeenLastCalledWith('/protected/account')
  })
})
