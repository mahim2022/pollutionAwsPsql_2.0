// components/ReportList.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Chip } from '@mui/material';

export default function ReportList() {
  const [reports, setReports] = useState<any[]>([]);
  useEffect(()=>{ fetchReports(); }, []);
  async function fetchReports() {
    const res = await fetch('/api/reports');
    const data = await res.json();
    setReports(data);
  }

  return (
    <Grid container spacing={2}>
      {reports.map(r => (
        <Grid item xs={12} md={6} lg={4} key={r.report_id}>
          <Card>
            {r.photo_url ? <CardMedia component="img" height="200" image={r.photo_url} alt="photo" /> : null}
            <CardContent>
              <Chip label={r.pollution_type} size="small" />
              <Typography variant="h6" mt={1}>{r.location}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Severity: {r.pollution_level ?? 'N/A'} • Reported: {new Date(r.report_date).toLocaleString()}
              </Typography>
              <Typography variant="body2">{r.description}</Typography>
              <Typography variant="caption" display="block" mt={1}>By: {r.reported_by ?? 'Anonymous'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
