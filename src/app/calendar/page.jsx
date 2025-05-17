"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  // Current date state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Function to get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  // Function to get year
  const getYear = (date) => {
    return date.getFullYear();
  };
  
  // Function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Function to get day of week of first day of month (0-6, 0 is Sunday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Function to get previous month's dates that appear in current month view
  const getPreviousMonthDays = (year, month) => {
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const previousMonthDays = [];
    
    if (firstDayOfMonth > 0) {
      const daysInPreviousMonth = getDaysInMonth(year, month - 1);
      for (let i = 0; i < firstDayOfMonth; i++) {
        previousMonthDays.unshift(daysInPreviousMonth - i);
      }
    }
    
    return previousMonthDays;
  };
  
  // Function to get next month's dates that appear in current month view
  const getNextMonthDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const nextMonthDays = [];
    
    const totalCells = 42; // 6 rows x 7 columns
    const filledCells = firstDayOfMonth + daysInMonth;
    const remainingCells = totalCells - filledCells;
    
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push(i);
    }
    
    return nextMonthDays;
  };
  
  // Function to go to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Function to go to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Function to go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Get current month name and year
  const currentMonthName = getMonthName(currentDate);
  const currentYear = getYear(currentDate);
  const currentMonth = currentDate.getMonth();
  
  // Get days in current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  
  // Get previous month days
  const previousMonthDays = getPreviousMonthDays(currentYear, currentMonth);
  
  // Get next month days
  const nextMonthDays = getNextMonthDays(currentYear, currentMonth);
  
  // Sample events data
  const events = [
    {
      id: 1,
      title: "Team Meeting",
      date: new Date(2025, 1, 15),
      allDay: true,
    },
    {
      id: 2,
      title: "Project Deadline",
      date: new Date(2025, 1, 25),
      allDay: true,
    },
    {
      id: 3,
      title: "Client Call",
      date: new Date(2025, 1, 10),
      allDay: false,
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 4,
      title: "Presentation",
      date: new Date(2025, 1, 20),
      allDay: false,
      startTime: "14:00",
      endTime: "15:30",
    },
  ];
  
  // Function to check if a date has an event
  const hasEvent = (year, month, day) => {
    return events.some(event => 
      event.date.getFullYear() === year && 
      event.date.getMonth() === month && 
      event.date.getDate() === day
    );
  };
  
  // Function to get events for a specific date
  const getEventsForDate = (year, month, day) => {
    return events.filter(event => 
      event.date.getFullYear() === year && 
      event.date.getMonth() === month && 
      event.date.getDate() === day
    );
  };

  // Get today's date for highlighting
  const today = new Date();
  const isToday = (year, month, day) => 
    today.getDate() === day && 
    today.getMonth() === month && 
    today.getFullYear() === year;
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  // Handle date click
  const handleDateClick = (year, month, day) => {
    setSelectedDate(new Date(year, month, day));
    setSelectedEvents(getEventsForDate(year, month, day));
  };

  // View modes
  const [activeView, setActiveView] = useState("month");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">CALENDAR</h1>
          <p className="text-gray-400">Manage your events and schedule</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded text-sm ${activeView === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setActiveView('month')}
          >
            month
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${activeView === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setActiveView('week')}
          >
            week
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${activeView === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setActiveView('day')}
          >
            day
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${activeView === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setActiveView('list')}
          >
            list
          </button>
        </div>
      </div>

      {/* Calendar Interface */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Events List */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-white mb-4">Events</h2>
          
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="p-3 bg-dark-700 rounded-lg">
                <h3 className="text-white font-medium">{event.title}</h3>
                <p className="text-gray-400 text-sm">
                  {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                {!event.allDay && (
                  <p className="text-gray-400 text-sm">
                    {event.startTime} - {event.endTime}
                  </p>
                )}
                {event.allDay && (
                  <p className="text-gray-400 text-sm">All day</p>
                )}
              </div>
            ))}

            {/* Add Event Button */}
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
              + Add Event
            </button>
          </div>
        </div>
        
        {/* Calendar */}
        <div className="md:col-span-3 bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <button 
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-gray-700 text-gray-400"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-white">
                {currentMonthName} {currentYear}
              </h2>
              <button 
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-gray-700 text-gray-400"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <button 
              onClick={goToToday}
              className="px-4 py-1 bg-dark-700 hover:bg-dark-600 text-white rounded text-sm"
            >
              Today
            </button>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 py-2 font-medium">
                {day}
              </div>
            ))}
            
            {/* Previous Month Days */}
            {previousMonthDays.map((day, index) => (
              <div 
                key={`prev-${index}`} 
                className="h-20 p-1 bg-dark-700 rounded text-gray-500 text-center"
              >
                {day}
              </div>
            ))}
            
            {/* Current Month Days */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const hasCurrentDayEvent = hasEvent(currentYear, currentMonth, day);
              const isTodayHighlight = isToday(currentYear, currentMonth, day);
              const isSelected = selectedDate && 
                selectedDate.getFullYear() === currentYear && 
                selectedDate.getMonth() === currentMonth && 
                selectedDate.getDate() === day;
              
              return (
                <div 
                  key={`current-${day}`}
                  onClick={() => handleDateClick(currentYear, currentMonth, day)}
                  className={`h-20 p-1 rounded relative cursor-pointer
                    ${isTodayHighlight ? 'bg-indigo-900 bg-opacity-30' : 'bg-dark-700 hover:bg-dark-600'}
                    ${isSelected ? 'ring-2 ring-indigo-500' : ''}
                  `}
                >
                  <div className="flex justify-between">
                    <span className={`${isTodayHighlight ? 'bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-white'}`}>
                      {day}
                    </span>
                    {hasCurrentDayEvent && (
                      <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                    )}
                  </div>
                  
                  {/* Event markers */}
                  <div className="mt-1 space-y-1">
                    {getEventsForDate(currentYear, currentMonth, day).slice(0, 2).map((event, idx) => (
                      <div 
                        key={idx} 
                        className={`text-xs truncate px-1 py-0.5 rounded ${
                          event.allDay ? 'bg-teal-900 text-teal-200' : 'bg-indigo-900 text-indigo-200'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    
                    {getEventsForDate(currentYear, currentMonth, day).length > 2 && (
                      <div className="text-xs text-gray-400 truncate">
                        +{getEventsForDate(currentYear, currentMonth, day).length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Next Month Days */}
            {nextMonthDays.map((day, index) => (
              <div 
                key={`next-${index}`} 
                className="h-20 p-1 bg-dark-700 rounded text-gray-500 text-center"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Selected Date Events */}
          {selectedDate && (
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h3 className="text-white font-medium mb-2">
                Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              
              {selectedEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedEvents.map((event, idx) => (
                    <div key={idx} className="p-3 bg-dark-700 rounded-lg">
                      <h4 className="text-white font-medium">{event.title}</h4>
                      {!event.allDay ? (
                        <p className="text-gray-400 text-sm">{event.startTime} - {event.endTime}</p>
                      ) : (
                        <p className="text-gray-400 text-sm">All day</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No events scheduled for this day.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}