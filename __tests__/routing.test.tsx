import '@testing-library/jest-dom'
import { render, screen, act, fireEvent } from '@testing-library/react'

import ProtectedPage from '@/app/protected/page'
import AccountPage from '@/app/protected/account/page'
import SettingsPage from '@/app/protected/settings/page'

const mockedUseRouter = {
    push: jest.fn(),
};

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => mockedUseRouter),
    useSearchParams: jest.fn(() => new URLSearchParams('code=1234')),
}));

jest.mock('@/utils/supabase/useUserProfile', () => ({
    useUserProfile: jest.fn(() => ({
        profile: { id: 'user123', email: 'test@example.com', name: 'Test User' },
        isLoading: false,
        error: null,
    })),
}));

jest.mock('@/utils/supabase/client', () => ({
    createClient: jest.fn(() => ({
        auth: {
            getUser: jest.fn(() => ({
                data: { user: { id: 'user123', email: 'test@example.com' } },
                error: null,
            })),
        },
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn(() => ({
                eq: jest.fn(() => ({
                    status: "204",
                    statusText: "No Content"
                })),
                single: jest.fn(() => ({
                    data: { id: 'user123', email: 'test@example.com', name: 'Test User' },
                    error: null,
                })),
                then: jest.fn((callback) => callback({ data: { id: 'user123', email: 'test@example.com', name: 'Test User' }, error: null })),
            })),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn(() => ({
                single: jest.fn(() => ({
                    data: { id: 'user123', email: 'test@example.com', name: 'Test User' },
                    error: null,
                })),
                limit: jest.fn().mockReturnThis(),
            })),
            single: jest.fn(() => ({
                data: { id: 'user123', email: 'test@example.com', name: 'Test User' },
                error: null,
            })),
            upsert: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn(() => ({
                        data: { id: 'user123', email: 'test@example.com', name: 'Test User' },
                        error: null,
                    })),
                })),
            })),
            then: jest.fn((callback) => callback({ data: { id: 'user123', email: 'test@example.com', name: 'Test User' }, error: null })),
        })),
    })),
}));

describe('ProtectedPage', () => {
    it('Join button redirects to /protected/matchmaking?code=1234', async () => {
        await act(() => render(<ProtectedPage />))
        
        // Set the code so it is predictable when we press join
        const codeInput = await screen.findByTestId('code-input')
        fireEvent.change(codeInput, { target: { value: '1234' } })

        const joinButton = await screen.findByTestId('join-button')
        fireEvent.click(joinButton)
        
        // Since there is a query param we need to use regex
        expect(mockedUseRouter.push).toHaveBeenCalledWith('/protected/matchmaking?code=1234')
    })
    
    it('Host button redirects to /protected/matchmaking?code={4 digits}', async () => {
        await act(() => render(<ProtectedPage />))
        
        const hostButton = await screen.findByTestId('host-button')
        fireEvent.click(hostButton)
        
        // Since there is a query param we need to use regex
        expect(mockedUseRouter.push).toHaveBeenCalledWith(expect.stringMatching(/^\/protected\/matchmaking\?code=\d{4}$/))
    })
})

describe('AccountPage', () => {
    it('Settings button redirects to /protected/settings', async () => {
        await act(() => render(<AccountPage />))

        const settingsButton = await screen.findByTestId('settings-button')
        fireEvent.click(settingsButton)
        
        expect(mockedUseRouter.push).toHaveBeenCalledWith('/protected/settings')
    })
})

describe('SettingsPage', () => {
    it('Reset your Password button redirects to /protected/reset-password', async () => {
        await act(() => render(<SettingsPage />))
        
        const resetPasswordButton = await screen.findByTestId('reset-password-button')
        fireEvent.click(resetPasswordButton)
        
        expect(mockedUseRouter.push).toHaveBeenCalledWith('/protected/reset-password')
    })

    it('Save Changes button redirects to /protected/account', async () => {
        await act(() => render(<SettingsPage />))
        
        const saveButton = await screen.findByTestId('save-button')
        fireEvent.click(saveButton)
        
        // Add to give delay for test to work
        await screen.findByTestId('save-button')

        expect(mockedUseRouter.push).toHaveBeenCalledWith('/protected/account')
    })
})
