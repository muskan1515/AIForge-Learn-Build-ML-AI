// __tests__/Profile.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { Profile } from '../components/Profile';
import * as userService from '../services/userService'; // import service to mock

jest.mock('../services/userService'); // mock the service

test('renders user info after fetch', async () => {
  // Mock data returned by service
  userService.getUserInfo.mockResolvedValue({
    name: 'John Doe',
    email: 'john@example.com',
  });

  render(<Profile />);

  // Initially shows loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for user data to appear
  await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
  expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
});
