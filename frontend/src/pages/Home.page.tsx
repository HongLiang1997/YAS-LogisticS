import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  ColorSchemeScript
} from '@mantine/core';
import { useState } from 'react';
import classes from '../components/css/AuthenticationTitle.module.css';
import {API_URL} from "@/consts";
import Cookies from 'js-cookie'
import { notifications } from '@mantine/notifications';

/**
 * Redirects to admin panel after a set delay.
 */
function redirectToAdminPanel(delayMillisecond = 2000) {
  setTimeout(() => {
    window.location.href = '/adminpanel';
  }, delayMillisecond);
}

export function HomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const loginURL = `${API_URL}/api/account/login`;
      const response = await fetch(loginURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      const isSuccess = data.success;
      if (isSuccess) {
        // Save session token into cookie,
        const token = data.token;
        Cookies.set('token', token, { secure: true, expires: 7 });
        // Notify then redirect...
        notifications.show({
          title: "Login Success",
          message: "Redirecting you to the admin panel...",
          color: "green"
        })
        redirectToAdminPanel();
      } else {
        // Failure
        setError("Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container size={420} my={40}>
      <ColorSchemeScript defaultColorScheme="auto" />
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Username"
          placeholder="you"
          required
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        {error && <Text color="red" size="sm" mt="sm">{error}</Text>}
        <Button fullWidth mt="xl" onClick={handleLogin}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
