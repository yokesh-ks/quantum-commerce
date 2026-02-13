import { useNavigate } from 'react-router';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../src/redux/store';
import { logout } from '../../src/redux/slices/authSlice';
import { requireAuth } from '../../src/utils/auth';
import type { Route } from "./+types/dashboard";

// Loader - protects this route
export async function loader({ request }: Route.LoaderArgs) {
  requireAuth(request);
  return null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Quantum Commerce" },
  ];
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>

          {user && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {user.name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> {user.role}
              </Typography>
            </Box>
          )}

          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ mt: 3 }}
          >
            Logout
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
