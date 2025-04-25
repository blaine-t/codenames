// __tests__/JoinCodeForm.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { JoinCodeForm } from '../components/game/joinCode'

describe('JoinCodeForm', () => {
  let onJoinMock, alertMock

  beforeEach(() => {
    onJoinMock = jest.fn()
    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('only accepts up to 4 numeric digits', () => {
    render(<JoinCodeForm onJoin={onJoinMock} />)
    const input = screen.getByTestId('code-input')

    fireEvent.change(input, { target: { value: '12ab' } })
    expect(input.value).toBe('')

    fireEvent.change(input, { target: { value: '12345' } })
    expect(input.value).toBe('')
  })

  it('alerts if code is not exactly 4 digits', () => {
    render(<JoinCodeForm onJoin={onJoinMock} />)
    const input = screen.getByTestId('code-input')
    const button = screen.getByTestId('join-button')

    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.click(button)

    expect(alertMock).toHaveBeenCalledWith(
      'Please enter a 4-digit code before joining.'
    )
    expect(onJoinMock).not.toHaveBeenCalled()
  })

  it('calls onJoin with the code when exactly 4 digits', () => {
    render(<JoinCodeForm onJoin={onJoinMock} />)
    const input = screen.getByTestId('code-input')
    const button = screen.getByTestId('join-button')

    fireEvent.change(input, { target: { value: '5678' } })
    fireEvent.click(button)

    expect(onJoinMock).toHaveBeenCalledWith('5678')
    expect(alertMock).not.toHaveBeenCalled()
  })
})
