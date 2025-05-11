const testUser = {
  data: { id: 'user123', email: 'test@example.com', name: 'Test User' },
  error: null,
}

// There's got to be a better way to do this but for now this is the DRYest I can get it
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(() => ({
      data: { user: testUser.data },
      error: null,
    })),
    signOut: jest.fn().mockReturnThis(),
  },
  from: jest.fn(() => {
    return {
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => testUser),
          limit: jest.fn().mockReturnThis(),
          returns: jest.fn(() => ({
            single: jest.fn(() => testUser),
            limit: jest.fn().mockReturnThis(),
          })),
        })),
        single: jest.fn(() => testUser),
        then: jest.fn((callback) => callback(testUser)),
        ilike: jest.fn().mockReturnThis()
      })),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => testUser),
          limit: jest.fn().mockReturnThis(),
          returns: jest.fn(() => ({
            single: jest.fn(() => testUser),
            limit: jest.fn().mockReturnThis(),
          })),
        })),
        single: jest.fn(() => testUser),
        then: jest.fn((callback) => callback(testUser)),
      })),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn(() => ({
        single: jest.fn(() => testUser),
        limit: jest.fn().mockReturnThis(),
      })),
      single: jest.fn(() => testUser),
      upsert: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => testUser),
        })),
      })),
      then: jest.fn((callback) => callback(testUser)),
    }
  }),
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    unsubscribe: jest.fn().mockReturnThis(),
  })),
}

export default mockSupabaseClient
