import { useEffect, useState, useRef } from 'react';
import {
  Paper, Typography, Box, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Card, CardContent, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import api, { Lab, Subject } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LabsPage() {
  const { user } = useAuth();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState({ subjectId: '', title: '', description: '', deadline: '' });
  const [uploadLab, setUploadLab] = useState<Lab | null>(null);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get('/labs').then(r => setLabs(r.data));

  useEffect(() => {
    load();
    if (user?.role !== 'STUDENT') api.get('/subjects').then(r => setSubjects(r.data));
  }, [user]);

  const createLab = async () => {
    await api.post('/labs', { ...form, subjectId: Number(form.subjectId), deadline: form.deadline || undefined });
    setForm({ subjectId: '', title: '', description: '', deadline: '' });
    setMsg('Лабораторная создана');
    load();
  };

  const submitWork = async () => {
    if (!uploadLab || !fileRef.current?.files?.length) return;
    const fd = new FormData();
    Array.from(fileRef.current.files).forEach(f => fd.append('files', f));
    await api.post(`/labs/${uploadLab.id}/submit`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setUploadLab(null);
    setMsg('Работа отправлена');
    load();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        {user?.role === 'STUDENT' ? 'Лабораторные работы' : 'Управление лабораторными'}
      </Typography>
      {msg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMsg('')}>{msg}</Alert>}

      {user?.role !== 'STUDENT' && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Создать лабораторную</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Предмет</InputLabel>
              <Select value={form.subjectId} label="Предмет" onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                {subjects.map(s => <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Название" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <TextField label="Описание" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <TextField label="Дедлайн" type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
            <Button variant="contained" onClick={createLab}>Создать</Button>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {labs.map(lab => (
          <Card key={lab.id}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{lab.title}</Typography>
                <Typography color="text.secondary">{lab.subject?.title} · {lab.description}</Typography>
                {lab.deadline && <Typography variant="caption">Дедлайн: {new Date(lab.deadline).toLocaleString('ru')}</Typography>}
              </Box>
              {user?.role === 'STUDENT' && (
                <Button variant="outlined" onClick={() => setUploadLab(lab)}>Сдать работу</Button>
              )}
            </CardContent>
          </Card>
        ))}
        {labs.length === 0 && <Typography color="text.secondary">Нет лабораторных работ</Typography>}
      </Box>

      <Dialog open={!!uploadLab} onClose={() => setUploadLab(null)}>
        <DialogTitle>Сдать: {uploadLab?.title}</DialogTitle>
        <DialogContent>
          <input type="file" ref={fileRef} multiple />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadLab(null)}>Отмена</Button>
          <Button variant="contained" onClick={submitWork}>Отправить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
