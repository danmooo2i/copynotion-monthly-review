// src/app/api/notion-data/route.js
import { Client } from "@notionhq/client";

// Notion API 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Notion 데이터베이스 ID 가져오기
const databaseId = process.env.NOTION_DATABASE_ID;

export async function GET(req, res) {
  try {
    // 환경변수 출력 (Vercel에서 올바르게 로드되었는지 확인용)
    console.log("NOTION_API_KEY:", process.env.NOTION_API_KEY ? "Loaded" : "Missing");
    console.log("NOTION_DATABASE_ID:", process.env.NOTION_DATABASE_ID);

    // 데이터베이스 쿼리 요청
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    // API 응답 데이터 확인
    console.log("Notion API Response:", JSON.stringify(response, null, 2));

    // 데이터 파싱 및 숫자 필드 처리
    const results = response.results.map((item) => {
      const properties = item.properties;
      return {
        id: item.id,
        name: properties.Name?.title?.[0]?.text?.content || "Untitled",
        numberField: properties.Number?.number ?? null, // 숫자 필드
      };
    });

    // 결과 반환
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("Error fetching Notion data:", error);

    // 에러 응답
    return new Response(
      JSON.stringify({ error: "Failed to fetch Notion data", details: error.message }),
      { status: 500 }
    );
  }
}
