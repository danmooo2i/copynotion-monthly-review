'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Smile, Meh, Frown } from 'lucide-react';

const MonthlyReviewDashboard = () => {
  // ... useState와 useEffect 코드는 동일 ...

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
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: percentage >= 80 ? '#22c55e' : 
                                       percentage >= 50 ? '#eab308' : 
                                       '#ef4444'
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {achieved}/{monthlyData.totalDays}일 달성
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 나머지 Card 컴포넌트 코드는 동일 */}
    </div>
  );
};

export default MonthlyReviewDashboard;
