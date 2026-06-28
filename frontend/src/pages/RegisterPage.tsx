import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, Link, MenuItem } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#e3f2fd' }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Регистрация</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="ФИО" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Пароль" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} margin="normal" required />
          <TextField fullWidth select label="Роль" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} margin="normal">
            <MenuItem value="STUDENT">Студент</MenuItem>
            <MenuItem value="TEACHER">Преподаватель</MenuItem>
          </TextField>
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Зарегистрироваться</Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Уже есть аккаунт? <Link component={RouterLink} to="/login">Войти</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
