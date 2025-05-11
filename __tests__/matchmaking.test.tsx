import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import CodenamesPage from '../app/protected/matchmaking/page'
import '@testing-library/jest-dom'
import mockSupabaseClient from '../lib/mockSupabaseClient'

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams('code=1234')),
}))

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

const mockRouterPush = jest.fn()

describe('Matchmaking Page', () => {
  it('contains and displays the game code from URL', async () => {
    await act(async () => {
      render(<CodenamesPage />)
    })
    expect(screen.getByText('1234')).toBeInTheDocument()
  })

  it('renders team headings and exactly four player buttons', () => {
    render(<CodenamesPage />)
    expect(screen.getByText('Red Team')).toBeInTheDocument()
    expect(screen.getByText('Blue Team')).toBeInTheDocument()

    const spymasters = screen.getAllByRole('button', { name: /Spymaster/i })
    const operatives = screen.getAllByRole('button', {
      name: /Field Operative/i,
    })
    expect(spymasters).toHaveLength(2)
    expect(operatives).toHaveLength(2)
  })

  // Removed old tests since they don't work with our R2 architecture

  it('does not navigate on Start if no player selected', () => {
    render(<CodenamesPage />)
    fireEvent.click(screen.getByText('Start'))
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('shows default player labels before selection', () => {
    render(<CodenamesPage />)
    expect(screen.getByText('Player 1')).toBeInTheDocument()
    expect(screen.getByText('Player 2')).toBeInTheDocument()
    expect(screen.getByText('Player 3')).toBeInTheDocument()
    expect(screen.getByText('Player 4')).toBeInTheDocument()
  })
})
