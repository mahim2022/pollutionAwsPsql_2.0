import { NextResponse } from 'next/server';
import pool from '../../../lib/db';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, location } = body;

    const query = `
      INSERT INTO water_reports (title, description, location, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [title, description, location];

    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, report: result.rows[0] });
  } catch (error: any) {
    console.error('Error inserting report:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET /api/reports
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM water_reports ORDER BY created_at DESC;');
    return NextResponse.json({ success: true, reports: result.rows });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
