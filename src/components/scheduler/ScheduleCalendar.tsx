
import React from 'react';

export function ScheduleCalendar() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const scheduledDays = [3, 7, 12, 15, 18, 22, 25, 28]; // Mock scheduled days

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === currentDate.getDate();
      const hasSchedule = scheduledDays.includes(day);
      
      days.push(
        <div
          key={day}
          className={`p-2 text-center cursor-pointer rounded-lg transition-colors ${
            isToday
              ? 'bg-blue-600 text-white'
              : hasSchedule
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'hover:bg-gray-100'
          }`}
        >
          {day}
          {hasSchedule && !isToday && (
            <div className="w-1 h-1 bg-green-600 rounded-full mx-auto mt-1" />
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      
      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-600 rounded" />
          <span>Scheduled</span>
        </div>
      </div>
    </div>
  );
}
