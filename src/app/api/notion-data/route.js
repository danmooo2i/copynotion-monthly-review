import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    console.log('Date range:', { firstDay, lastDay });
    console.log('Using Database ID:', process.env.NOTION_DATABASE_ID);

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Date',
            date: {
              on_or_after: firstDay.toISOString(),
              on_or_before: lastDay.toISOString(),
            },
          },
        ],
      },
    });

    console.log('Notion API Response:', response);
    return NextResponse.json(response.results);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}