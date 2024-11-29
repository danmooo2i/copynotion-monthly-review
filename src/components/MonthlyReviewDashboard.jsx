'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Smile, Meh, Frown } from 'lucide-react';

const MonthlyReviewDashboard = () => {
  const [monthlyData, setMonthlyData] = useState({
    goals: {
      약먹기: 0,
      운동: 0,
      일본어: 0,
      드로잉: 0,
      일기: 0,
    },
    moods: { "좋음 😊": 0, "보통 😐": 0, "나쁨 😔": 0 },
    totalDays: 30,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/notion-data');
        const data = await response.json();
        
        const goals = {
          약먹기: 0,
          운동: 0,
          일본어: 0,
          드로잉: 0,
          일기: 0,
        };
        const moodCounts = { "좋음 😊": 0, "보통 😐": 0, "나쁨 😔": 0 };
        
        data.forEach(item => {
          goals.약먹기 += item.약먹기 ? 1 : 0;
          goals.운동 += item.운동 ? 1 : 0;
          goals.일본어 += item.일본어 ? 1 : 0;
          goals.드로잉 += item.드로잉 ? 1 : 0;
          goals.일기 += item.일기 ? 1 : 0;
          if (item.mood && moodCounts[item.mood] !== undefined) {
            moodCounts[item.mood] += 1;
          }
        });
        
        setMonthlyData({ goals, moods: moodCounts, totalDays: 30 });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const calculatePercentage = (achieved, total) => {
    return Math.round((achieved / total) * 100);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>월간 목표 달성도</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(monthlyData.goals).map(([name, achieved]) => {
              const percentage = calculatePercentage(achieved, monthlyData.totalDays);
              return (
                <div key={name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{name}</span>
                    <span className="text-sm font-medium">
                      {percentage}%
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={`h-2 ${
                      percentage >= 80 ? 'bg-green-500' :
                      percentage >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  />
                  <div className="text-sm text-gray-500">
                    {achieved}/{monthlyData.totalDays}일 달성
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>오늘의 기분</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around items-center">
            <div className="text-center">
              <Smile className="w-12 h-12 text-green-500 mx-auto" />
              <div className="mt-2">
                <div className="text-xl font-bold">{monthlyData.moods["좋음 😊"]}</div>
                <div className="text-sm text-gray-500">좋음 😊</div>
              </div>
            </div>
            <div className="text-center">
              <Meh className="w-12 h-12 text-yellow-500 mx-auto" />
              <div className="mt-2">
                <div className="text-xl font-bold">{monthlyData.moods["보통 😐"]}</div>
                <div className="text-sm text-gray-500">보통 😐</div>
              </div>
            </div>
            <div className="text-center">
              <Frown className="w-12 h-12 text-red-500 mx-auto" />
              <div className="mt-2">
                <div className="text-xl font-bold">{monthlyData.moods["나쁨 😔"]}</div>
                <div className="text-sm text-gray-500">나쁨 😔</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyReviewDashboard;
