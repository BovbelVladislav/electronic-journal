import { useEffect, useState } from 'react';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Chip,
} from '@mui/material';
import api, { Lab } from '../api/client';

interface SubmissionRow {
  id: number;
  submittedAt: string;
  student?: { name: string };
  files?: { filename: string }[];
  grade?: { value: number; comment?: string };
  comments?: { text: string; author: { name: string } }[];
}

export default function CheckLabsPage() {
  const [labs, setLabs] = useState<(Lab & { submissions?: SubmissionRow[] })[]>([]);
  const [selected, setSelected] = useState<SubmissionRow | null>(null);
  const [grade, setGrade] = useState({ value: '', comment: '' });
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    const labsList: Lab[] = (await api.get('/labs')).data;
    const detailed = await Promise.all(labsList.map((l) => api.get(`/labs/${l.id}`).then((r) => r.data)));
    setLabs(detailed);
  };

  useEffect(() => { load(); }, []);

  const saveGrade = async () => {
    if (!selected) return;
    await api.patch(`/labs/submissions/${selected.id}/grade`, { value: Number(grade.value), comment: grade.comment });
    setMsg('Оценка сохранена');
    setSelected(null);
    load();
  };

  const addComment = async () => {
    if (!selected || !comment) return;
    await api.post(`/labs/submissions/${selected.id}/comments`, { text: comment });
    setComment('');
    setMsg('Комментарий добавлен');
    load();
  };

  const allSubmissions = labs.flatMap(l => (l.submissions || []).map(s => ({ ...s, labTitle: l.title })));

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Проверка лабораторных</Typography>
      {msg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMsg('')}>{msg}</Alert>}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Студент</TableCell>
              <TableCell>Лабораторная</TableCell>
              <TableCell>Файлы</TableCell>
              <TableCell>Оценка</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allSubmissions.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.student?.name || '—'}</TableCell>
                <TableCell>{(s as SubmissionRow & { labTitle?: string }).labTitle}</TableCell>
                <TableCell>{s.files?.map(f => f.filename).join(', ') || '—'}</TableCell>
                <TableCell>{s.grade ? <Chip label={s.grade.value} color="primary" size="small" /> : '—'}</TableCell>
                <TableCell>{new Date(s.submittedAt).toLocaleDateString('ru')}</TableCell>
                <TableCell><Button size="small" onClick={() => { setSelected(s); setGrade({ value: String(s.grade?.value || ''), comment: s.grade?.comment || '' }); }}>Проверить</Button></TableCell>
              </TableRow>
            ))}
            {allSubmissions.length === 0 && <TableRow><TableCell colSpan={6} align="center">Нет работ на проверку</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Проверка работы: {selected?.student?.name}</DialogTitle>
        <DialogContent>
          {selected?.comments?.map((c, i) => (
            <Typography key={i} variant="body2" sx={{ mb: 1 }}><strong>{c.author.name}:</strong> {c.text}</Typography>
          ))}
          <TextField fullWidth label="Оценка" type="number" value={grade.value} onChange={e => setGrade({ ...grade, value: e.target.value })} margin="normal" slotProps={{ htmlInput: { min: 1, max: 10 } }} />
          <TextField fullWidth label="Комментарий к оценке" value={grade.comment} onChange={e => setGrade({ ...grade, comment: e.target.value })} margin="normal" />
          <TextField fullWidth label="Новый комментарий" value={comment} onChange={e => setComment(e.target.value)} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Закрыть</Button>
          <Button onClick={addComment}>Комментарий</Button>
          <Button variant="contained" onClick={saveGrade}>Сохранить оценку</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
