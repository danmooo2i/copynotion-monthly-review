'use client';

import React, { useEffect, useState } from 'react';
import Card from './ui/card';
import { Smile, Meh, Frown } from 'lucide-react';

const MonthlyReviewDashboard = () => {
  const [monthlyData, setMonthlyData] = useState({
    goals: {},
    moods: { "좋음 😊": 0, "보통 😐": 0, "나쁨 😔": 0 },
    totalDays: 30,
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/notion-data');
      const data = await response.json();

      // 목표 달성도 매핑
      const calculateGoals = (notionData) => {
        return notionData.reduce((acc, item) => {
          acc[item.name] = item.numberField; // name과 numberField로 목표값 매핑
          return acc;
        }, {});
      };

      // 무드 트래커 매핑
      const calculateMoods = (notionData) => {
        const moodCounts = { "좋음 😊": 0, "보통 😐": 0, "나쁨 😔": 0 };
        notionData.forEach((item) => {
          if (item.mood && moodCounts[item.mood] !== undefined) {
            moodCounts[item.mood] += 1;
          }
        });
        return moodCounts;
      };

      // 상태 업데이트
      setMonthlyData({
        goals: calculateGoals(data),
        moods: calculateMoods(data),
        totalDays: 30,
      });
    }

    fetchData();
  }, []);

  const calculatePercentage = (achieved, total) => {
    return Math.round((achieved / total) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <Card.Header>
          <Card.Title>월간 목표 달성도</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {Object.entries(monthlyData.goals).map(([name, achieved]) => {
              const percentage = calculatePercentage(achieved, monthlyData.totalDays);
              return (
                <div key={name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{name}</span>
                    <span className={getProgressColor(percentage)}>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage >= 80
                          ? 'bg-green-500'
                          : percentage >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {achieved}/{monthlyData.totalDays}일 달성
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>오늘의 기분</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center space-y-2">
              <Smile className="w-12 h-12 text-green-500" />
              <span className="text-2xl font-bold">{monthlyData.moods["좋음 😊"]}</span>
              <span className="text-sm text-gray-500">좋음 😊</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Meh className="w-12 h-12 text-yellow-500" />
              <span className="text-2xl font-bold">{monthlyData.moods["보통 😐"]}</span>
              <span className="text-sm text-gray-500">보통 😐</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Frown className="w-12 h-12 text-red-500" />
              <span className="text-2xl font-bold">{monthlyData.moods["나쁨 😔"]}</span>
              <span className="text-sm text-gray-500">나쁨 😔</span>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default MonthlyReviewDashboard;
