import '@testing-library/jest-dom'
import { render, screen, act } from '@testing-library/react'

import AuthButton from '@/components/header-auth'
import ProtectedPage from '@/app/protected/page'
import AccountPage from '@/app/protected/account/page'
import GamePage from '@/app/protected/game/page'
import MatchmakingPage from '@/app/protected/matchmaking/page'
import SettingsPage from '@/app/protected/settings/page'

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

describe('AuthButton', () => {
    it('Back button redirects to /protected', async () => {
        await act(() => render(<AuthButton pathname='' />))
        const backButton = screen.findByTestId("backButton")
        console.log(screen)
        expect(backButton).toBeInTheDocument()
    })
})