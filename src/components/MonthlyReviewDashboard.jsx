'use client';

import React, { useEffect, useState } from 'react';
import Card from './ui/card';
import { Smile, Meh, Frown } from 'lucide-react';

const MonthlyReviewDashboard = () => {
  const [monthlyData, setMonthlyData] = useState({
    goals: {
      일기: 0,
      약먹기: 0,
      운동: 0,
      일본어: 0,
      드로잉: 0,
    },
    moods: {
      "좋음 😊": 0,
      "보통 😐": 0,
      "나쁨 😔": 0,
    },
    totalDays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/notion-data');
        const data = await response.json();
        
        console.log('Raw Notion Data:', data);

        const processedData = {
          goals: {
            일기: 0,
            약먹기: 0,
            운동: 0,
            일본어: 0,
            드로잉: 0,
          },
          moods: {
            "좋음 😊": 0,
            "보통 😐": 0,
            "나쁨 😔": 0,
          },
          totalDays: 0
        };

        if (Array.isArray(data)) {
          processedData.totalDays = data.length;
          console.log('Total Days:', processedData.totalDays);

          data.forEach(page => {
            console.log('Page Properties:', page.properties);
            
            if (page.properties) {
              // 체크박스 값 처리
              Object.keys(processedData.goals).forEach(goal => {
                const isChecked = page.properties[goal]?.checkbox;
                console.log(`${goal} checked:`, isChecked);
                if (isChecked === true) {
                  processedData.goals[goal]++;
                }
              });
              
              // 기분 값 처리
              const mood = page.properties['오늘의 기분']?.select?.name;
              console.log('Mood:', mood);
              if (mood && processedData.moods.hasOwnProperty(mood)) {
                processedData.moods[mood]++;
              }
            }
          });
        }

        console.log('Processed Data:', processedData);
        setMonthlyData(processedData);
      } catch (error) {
        console.error('Error fetching Notion data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-8">데이터를 불러오는 중...</div>;
  }

  const calculatePercentage = (achieved, total) => {
    if (total === 0) return 0;
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
                    <span className={getProgressColor(percentage)}>
                      {percentage}%
                    </span>
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