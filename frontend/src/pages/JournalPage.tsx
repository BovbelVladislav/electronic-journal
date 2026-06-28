import { useEffect, useState } from 'react';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Button, MenuItem, Select, FormControl, InputLabel, Alert,
} from '@mui/material';
import api, { Grade, Subject } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Student { id: number; name: string; email: string }

export default function JournalPage() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ studentId: '', subjectId: '', value: '', type: 'PRACTICAL', comment: '' });
  const [msg, setMsg] = useState('');

  const load = () => {
    if (user?.role === 'STUDENT') {
      api.get('/grades/my').then(r => setGrades(r.data));
    } else {
      api.get('/subjects').then(r => setSubjects(r.data));
      api.get('/users').then(r => setStudents(r.data));
    }
  };

  useEffect(load, [user]);

  const loadSubjectGrades = (subjectId: string) => {
    if (subjectId) api.get(`/grades/subject/${subjectId}`).then(r => setGrades(r.data));
  };

  const addGrade = async () => {
    try {
      await api.post('/grades', { ...form, studentId: Number(form.studentId), subjectId: Number(form.subjectId), value: Number(form.value) });
      setMsg('Оценка выставлена');
      setForm({ ...form, value: '', comment: '' });
      loadSubjectGrades(form.subjectId);
    } catch { setMsg('Ошибка'); }
  };

  if (user?.role === 'STUDENT') {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Мои оценки</Typography>
        <Paper>
          <Table>
            <TableHead><TableRow><TableCell>Предмет</TableCell><TableCell>Оценка</TableCell><TableCell>Тип</TableCell><TableCell>Дата</TableCell><TableCell>Комментарий</TableCell></TableRow></TableHead>
            <TableBody>
              {grades.map(g => (
                <TableRow key={g.id}>
                  <TableCell>{g.subject?.title}</TableCell>
                  <TableCell><strong>{g.value}</strong></TableCell>
                  <TableCell>{g.type}</TableCell>
                  <TableCell>{new Date(g.date).toLocaleDateString('ru')}</TableCell>
                  <TableCell>{g.comment || '—'}</TableCell>
                </TableRow>
              ))}
              {grades.length === 0 && <TableRow><TableCell colSpan={5} align="center">Нет оценок</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Журнал оценок</Typography>
      {msg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMsg('')}>{msg}</Alert>}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Выставить оценку</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Студент</InputLabel>
            <Select value={form.studentId} label="Студент" onChange={e => setForm({ ...form, studentId: e.target.value })}>
              {students.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Предмет</InputLabel>
            <Select value={form.subjectId} label="Предмет" onChange={e => { setForm({ ...form, subjectId: e.target.value }); loadSubjectGrades(e.target.value); }}>
              {subjects.map(s => <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Оценка" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} sx={{ width: 100 }} slotProps={{ htmlInput: { min: 1, max: 10 } }} />
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Тип</InputLabel>
            <Select value={form.type} label="Тип" onChange={e => setForm({ ...form, type: e.target.value })}>
              {['LAB', 'TEST', 'PRACTICAL', 'ORAL'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Комментарий" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
          <Button variant="contained" onClick={addGrade}>Сохранить</Button>
        </Box>
      </Paper>
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Студент</TableCell><TableCell>Оценка</TableCell><TableCell>Тип</TableCell><TableCell>Дата</TableCell></TableRow></TableHead>
          <TableBody>
            {grades.map(g => (
              <TableRow key={g.id}>
                <TableCell>{(g as Grade & { student?: { name: string } }).student?.name}</TableCell>
                <TableCell><strong>{g.value}</strong></TableCell>
                <TableCell>{g.type}</TableCell>
                <TableCell>{new Date(g.date).toLocaleDateString('ru')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
