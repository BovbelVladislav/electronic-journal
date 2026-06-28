import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Tabs, Tab } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const studentTabs = [
  { label: 'Главная', path: '/' },
  { label: 'Расписание', path: '/schedule' },
  { label: 'Оценки', path: '/journal' },
  { label: 'Лабораторные', path: '/labs' },
];

const teacherTabs = [
  { label: 'Главная', path: '/' },
  { label: 'Расписание', path: '/schedule' },
  { label: 'Журнал', path: '/journal' },
  { label: 'Лабораторные', path: '/labs' },
  { label: 'Проверка работ', path: '/check-labs' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = user?.role === 'STUDENT' ? studentTabs : teacherTabs;
  const current = tabs.findIndex(t => t.path === location.pathname);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>Электронный журнал</Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>{user?.name} ({user?.role === 'STUDENT' ? 'Студент' : 'Преподаватель'})</Typography>
          <Button color="inherit" onClick={() => { logout(); navigate('/login'); }}>Выход</Button>
        </Toolbar>
        <Tabs value={current === -1 ? 0 : current} onChange={(_, v) => navigate(tabs[v].path)} variant="scrollable" sx={{ bgcolor: 'primary.dark' }}>
          {tabs.map(t => <Tab key={t.path} label={t.label} />)}
        </Tabs>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
