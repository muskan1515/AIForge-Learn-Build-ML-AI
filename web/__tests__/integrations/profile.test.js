import { render, screen, waitFor } from '@testing-library/react';
import { Profile } from '../components/Profile';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// 1️⃣ Set up a mock server to intercept API calls
const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'Jane Doe', email: 'jane@example.com' }));
  })
);

// 2️⃣ Start and clean up the server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 3️⃣ Integration test
test('Profile shows user info from API', async () => {
  render(<Profile />);

  // Initially shows loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for async DOM update
  await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument());

  expect(screen.getByText('Email: jane@example.com')).toBeInTheDocument();
});

test('Profile shows error when API fails', async () => {
  server.use(
    rest.get('/api/user', (req, res, ctx) => res(ctx.status(500)))
  );

  render(<Profile />);

  await waitFor(() => expect(screen.getByText('No user found')).toBeInTheDocument());
});
