import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 환경 변수 확인
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      throw new Error('Missing required environment variables');
    }

    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    // 간단한 쿼리로 테스트
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    // 응답 데이터 구조 확인을 위한 로그
    console.log('Notion Response:', JSON.stringify(response, null, 2));

    return NextResponse.json(response.results);

  } catch (error) {
    // 자세한 에러 정보 반환
    console.error('Detailed error:', error);
    return NextResponse.json({
      error: error.message,
      code: error.code,
      status: error.status,
      details: error
    }, { status: 500 });
  }
}