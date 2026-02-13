import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../src/redux/store';
import { loginAsync, clearError } from '../../../src/redux/slices/authSlice';
import type { Route } from "./+types/login";

// Validation schema
const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Quantum Commerce" },
    { name: "description", content: "Login to your account" },
  ];
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    }
  }, [user, navigate, searchParams]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginAsync(data));
    if (loginAsync.fulfilled.match(result)) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                  InputLabelProps={{ shrink: !!field.value }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                  InputLabelProps={{ shrink: !!field.value }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <MuiLink href="/register" underline="hover">
                Register here
              </MuiLink>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
