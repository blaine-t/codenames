import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import CodenamesPage from '../app/protected/matchmaking/page'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import '@testing-library/jest-dom'

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}))

const mockRouterPush = jest.fn()

// A single, unified from-mock that returns the right methods for each table
const mockSupabase = {
  auth: {
    getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'auth123' } }, error: null })),
  },
  from: jest.fn((table: string) => {
    if (table === 'Team') {
      // handle supabase.from("Team").select(...).ilike(...)
      return {
        select: () => ({
          ilike: (_col: string, _val: string) => Promise.resolve({ data: [{ id: 1, name: 'red' }], error: null }),
        }),
      }
    }

    // for both "User" and "Player", which both call .select().eq() and then either .single() or .limit().single()
    return {
      select: () => ({
        eq: () => ({
          // .single() for fetching the current user’s username or id
          single: () =>
            Promise.resolve({
              data:
                table === 'User'
                  ? { id: 42, username: 'TestUser' }
                  : [
                      {
                        /* other players */
                      },
                    ],
              error: null,
            }),
          // .limit(...).single() for the Player upsert fetch
          limit: (_n: number) => ({
            single: () =>
              Promise.resolve({
                data: { id: 42, username: 'TestUser' },
                error: null,
              }),
          }),
        }),
      }),
      upsert: () => Promise.resolve({ error: null }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }
  }),
}

beforeEach(() => {
  ;(useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush })
  ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
  jest.clearAllMocks()
})

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

  it('selects and deselects a player button', () => {
    render(<CodenamesPage />)
    const button = screen.getAllByRole('button', { name: /Spymaster/i })[0]
    fireEvent.click(button)
    expect(button).toHaveClass('selected')
  })

  it('selects and deselects a player button', () => {
    render(<CodenamesPage />)
    const button = screen.getAllByRole('button', { name: /Spymaster/i })[0]
    fireEvent.click(button)
    fireEvent.click(button)
    expect(button).not.toHaveClass('selected')
  })

  it('applies correct red color style when red is selected', () => {
    render(<CodenamesPage />)
    // Red Team Spymaster is at index 0
    const redSpymaster = screen.getAllByRole('button', {
      name: /Spymaster/i,
    })[0]
    fireEvent.click(redSpymaster)
    expect(redSpymaster).toHaveStyle('background-color: red')
  })

  it('applies correct blue team color style when blue is selected', () => {
    render(<CodenamesPage />)
    // Blue Team Operative is the *second* Field Operative button, i.e. index 1
    const blueOperative = screen.getAllByRole('button', {
      name: /Field Operative/i,
    })[1]
    fireEvent.click(blueOperative)
    expect(blueOperative).toHaveStyle('background-color: blue')
  })

  it('does not navigate on Start if no player selected', () => {
    render(<CodenamesPage />)
    fireEvent.click(screen.getByText('Start'))
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('shows username label when player is selected', async () => {
    render(<CodenamesPage />)
    const button = screen.getAllByRole('button', {
      name: /Field Operative/i,
    })[0]
    fireEvent.click(button)

    // Wait for the username to show up
    expect(await screen.findByText('TestUser')).toBeInTheDocument()
  })

  it('shows default player labels before selection', () => {
    render(<CodenamesPage />)
    expect(screen.getByText('Player 1')).toBeInTheDocument()
    expect(screen.getByText('Player 2')).toBeInTheDocument()
    expect(screen.getByText('Player 3')).toBeInTheDocument()
    expect(screen.getByText('Player 4')).toBeInTheDocument()
  })
})
