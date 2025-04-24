import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CodenamesPage from "../app/protected/matchmaking/page";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import '@testing-library/jest-dom'

// Mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams("code=1234")),
}));

jest.mock("@/utils/supabase/client", () => ({
  createClient: jest.fn(),
}));

// Setup dummy Supabase behavior
const mockRouterPush = jest.fn();

const mockSupabase = {
  auth: {
    getUser: jest.fn(() => Promise.resolve({ data: { user: { id: "auth123" } } })),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
  })),
};

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  (createClient as jest.Mock).mockReturnValue(mockSupabase);
  jest.clearAllMocks();
});

describe('Page', () => {
    it('contains a game code', () => {
      render(<CodenamesPage />)
  
      const codeVar = screen.getByText("Game code:")
  
      expect(codeVar).toBeInTheDocument()
    })
  })

test("selects and deselects a player button", () => {
  render(<CodenamesPage />);

  const button = screen.getAllByRole("button", { name: /Spymaster/i })[0];
  fireEvent.click(button);
  expect(button.className).toContain("selected");

  fireEvent.click(button);
  expect(button.className).not.toContain("selected");
});