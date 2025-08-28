// components/ReportForm.tsx
import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Typography, Slider } from '@mui/material';

const pollutionTypes = ['Chemical', 'Plastic', 'Oil', 'Heavy Metals', 'Biological', 'Other'];

export default function ReportForm({ onSuccess }: { onSuccess?: (data:any) => void }) {
  const [location, setLocation] = useState('');
  const [ptype, setPtype] = useState('');
  const [level, setLevel] = useState<number | number[]>(5);
  const [desc, setDesc] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !ptype) return alert('Location and pollutant type required');
    const payload = {
      location,
      pollution_type: ptype,
      pollution_level: typeof level === 'number' ? level : level[0],
      description: desc,
      reported_by: reportedBy,
      photo_url: photoUrl || null,
    };
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      alert('Error: ' + (err?.error || res.statusText));
      return;
    }
    const data = await res.json();
    if (onSuccess) onSuccess(data);
    // reset
    setLocation(''); setPtype(''); setLevel(5); setDesc(''); setReportedBy(''); setPhotoUrl('');
    alert('Report submitted');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h6">Submit Water Pollution Report</Typography>
      <TextField label="Location" value={location} onChange={(e)=>setLocation(e.target.value)} required />
      <TextField select label="Pollution Type" value={ptype} onChange={(e)=>setPtype(e.target.value)} required>
        {pollutionTypes.map((p)=> <MenuItem key={p} value={p}>{p}</MenuItem>)}
      </TextField>
      <div>
        <Typography gutterBottom>Severity (0 = clean, 10 = worst)</Typography>
        <Slider value={level} onChange={(_e, v)=>setLevel(v)} min={0} max={10} valueLabelDisplay="auto" />
      </div>
      <TextField label="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} multiline rows={3} />
      <TextField label="Reported by (name/email)" value={reportedBy} onChange={(e)=>setReportedBy(e.target.value)} />
      <TextField label="Photo URL (optional)" value={photoUrl} onChange={(e)=>setPhotoUrl(e.target.value)} helperText="If you have S3/hosted URL paste here. File upload flow can be added later." />
      <Button type="submit" variant="contained">Submit Report</Button>
    </Box>
  );
}
