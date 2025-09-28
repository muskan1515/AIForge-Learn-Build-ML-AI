// __tests__/Dashboard.integration.test.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../components/Dashboard';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// 1️⃣ Mock server for multiple endpoints
const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'Alice' }));
  }),
  rest.get('/api/posts', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, title: 'First Post' }]));
  }),
  rest.post('/api/posts', (req, res, ctx) => {
    return res(ctx.json({ id: 2, title: req.body.title }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Dashboard fetches user, shows posts, and adds a new post', async () => {
  render(<Dashboard />);

  // 2️⃣ Initial loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // 3️⃣ Wait for user and posts to appear
  await waitFor(() => expect(screen.getByText('Welcome, Alice')).toBeInTheDocument());
  expect(screen.getByText('First Post')).toBeInTheDocument();

  // 4️⃣ Simulate adding a new post
  const input = screen.getByPlaceholderText('New post');
  const button = screen.getByText('Add Post');

  await userEvent.type(input, 'Second Post');
  await userEvent.click(button);

  // 5️⃣ Wait for new post to appear in the list
  await waitFor(() => expect(screen.getByText('Second Post')).toBeInTheDocument());

  // 6️⃣ Ensure input is cleared
  expect(input.value).toBe('');
});
