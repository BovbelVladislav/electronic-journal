import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Chip } from '@mui/material';
import api, { Grade, Submission, Lesson } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const from = new Date().toISOString();
    const to = new Date(Date.now() + 7 * 86400000).toISOString();
    api.get('/lessons/schedule', { params: { from, to } }).then(r => setLessons(r.data.slice(0, 5)));

    if (user?.role === 'STUDENT') {
      api.get('/grades/my').then(r => setGrades(r.data.slice(0, 5)));
      api.get('/labs/my/submissions').then(r => setSubmissions(r.data.slice(0, 5)));
    } else {
      api.get('/subjects').then(r => setGrades(r.data.slice(0, 3).map((s: { title: string; code: string }) => ({ value: 0, type: 'SUBJECT', subject: s } as Grade))));
    }
  }, [user]);

  const avg = grades.length ? (grades.reduce((a, g) => a + g.value, 0) / grades.filter(g => g.value).length).toFixed(1) : '—';

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Добро пожаловать, {user?.name}!</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {user?.role === 'STUDENT' && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">Средний балл</Typography>
              <Typography variant="h3" color="primary">{avg}</Typography>
            </Paper>
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">Ближайших занятий</Typography>
            <Typography variant="h3" color="primary">{lessons.length}</Typography>
          </Paper>
        </Grid>
        {user?.role === 'STUDENT' && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">Сдано работ</Typography>
              <Typography variant="h3" color="primary">{submissions.length}</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Typography variant="h6" gutterBottom>Ближайшее расписание</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        {lessons.length === 0 ? <Typography color="text.secondary">Нет занятий на этой неделе</Typography> :
          lessons.map(l => (
            <Box key={l.id} sx={{ py: 1, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{l.subject?.title}</Typography>
                <Typography variant="body2" color="text.secondary">{new Date(l.date).toLocaleDateString('ru')} {new Date(l.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</Typography>
              </Box>
              <Chip label={l.type} size="small" />
            </Box>
          ))}
      </Paper>

      {user?.role === 'STUDENT' && (
        <>
          <Typography variant="h6" gutterBottom>Последние оценки</Typography>
          <Paper sx={{ p: 2 }}>
            {grades.filter(g => g.value).length === 0 ? <Typography color="text.secondary">Нет оценок</Typography> :
              grades.filter(g => g.value).map(g => (
                <Box key={g.id} sx={{ py: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>{g.subject?.title}</Typography>
                  <Chip label={`${g.value} (${g.type})`} color="primary" size="small" />
                </Box>
              ))}
          </Paper>
        </>
      )}
    </Box>
  );
}
