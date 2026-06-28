import { useEffect, useState } from 'react';
import { Paper, Typography, Box, Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import api, { Lesson } from '../api/client';

const typeLabels: Record<string, string> = { LECTURE: 'Лекция', LAB: 'Лаб.', PRACTICE: 'Практика', TEST: 'Контрольная' };

export default function SchedulePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const from = new Date(Date.now() - 86400000).toISOString();
    const to = new Date(Date.now() + 14 * 86400000).toISOString();
    api.get('/lessons/schedule', { params: { from, to } }).then(r => setLessons(r.data));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Расписание</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Время</TableCell>
              <TableCell>Предмет</TableCell>
              <TableCell>Тип</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.map(l => (
              <TableRow key={l.id}>
                <TableCell>{new Date(l.date).toLocaleDateString('ru', { weekday: 'short', day: 'numeric', month: 'short' })}</TableCell>
                <TableCell>{new Date(l.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })} – {new Date(l.endTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell>{l.subject?.title} ({l.subject?.code})</TableCell>
                <TableCell><Chip label={typeLabels[l.type] || l.type} size="small" /></TableCell>
              </TableRow>
            ))}
            {lessons.length === 0 && <TableRow><TableCell colSpan={4} align="center">Нет занятий</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
