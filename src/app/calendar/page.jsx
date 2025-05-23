// "use client";
// import React, { useState } from "react";

// export default function CalendarPage() {
//   const [date, setDate] = useState(new Date());
//   const [selectedDay, setSelectedDay] = useState(null);

//   const month = date.getMonth();
//   const year = date.getFullYear();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const prevMonth = () => setDate(new Date(year, month - 1, 1));
//   const nextMonth = () => setDate(new Date(year, month + 1, 1));

//   return (
//     <div className="w-full min-h-screen bg-dark-800 p-4 md:p-10 flex flex-col">
//       <h1 className="text-2xl font-bold text-white mb-4">Calendar</h1>
//       <div className="flex items-center justify-between mb-4 max-w-2xl w-full mx-auto">
//         <button
//           onClick={prevMonth}
//           className="bg-dark-700 text-gray-300 px-3 py-1 rounded hover:bg-dark-600"
//         >
//           {"<"}
//         </button>
//         <span className="text-lg text-white font-semibold">
//           {date.toLocaleString("default", { month: "long" })} {year}
//         </span>
//         <button
//           onClick={nextMonth}
//           className="bg-dark-700 text-gray-300 px-3 py-1 rounded hover:bg-dark-600"
//         >
//           {">"}
//         </button>
//       </div>
//       <div className="grid grid-cols-7 gap-2 max-w-2xl w-full mx-auto">
//         {Array.from({ length: daysInMonth }).map((_, i) => {
//           const day = i + 1;
//           const isSelected = selectedDay === day;
//           return (
//             <div
//               key={day}
//               className={`flex flex-col items-center justify-center h-12 w-full rounded-lg cursor-pointer
//                 ${isSelected ? "bg-teal-600 text-white font-bold" : "bg-dark-700 text-gray-300"}
//                 hover:ring-2 hover:ring-teal-400 transition`}
//               onClick={() => setSelectedDay(day)}
//             >
//               {day}
//             </div>
//           );
//         })}
//       </div>
//       <p className="text-gray-400 text-xs mt-4 text-center">
//         Ziua selectată este evidențiată cu verde.
//       </p>
//       {selectedDay && (
//         <div className="mt-4 text-center text-white">
//           Ai selectat data: <span className="font-bold">{selectedDay} {date.toLocaleString("default", { month: "long" })} {year}</span>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInMonth = 31; // Lună generică

  return (
    <div className="w-full min-h-screen bg-dark-800 p-4 md:p-10 flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-4">Calendar</h1>
      <div className="flex items-center justify-between mb-4 max-w-2xl w-full mx-auto">
        <span className="text-lg text-white font-semibold">
          Aprilie 2025
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2 max-w-2xl w-full mx-auto">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = selectedDay === day;
          return (
            <div
              key={day}
              className={`flex flex-col items-center justify-center h-12 w-full rounded-lg cursor-pointer
                ${isSelected ? "bg-teal-600 text-white font-bold" : "bg-dark-700 text-gray-300"}
                hover:ring-2 hover:ring-teal-400 transition`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
      <p className="text-gray-400 text-xs mt-4 text-center">
        Ziua selectată este evidențiată cu verde.
      </p>
      {selectedDay && (
        <div className="mt-4 text-center text-white">
          Ai selectat ziua: <span className="font-bold">{selectedDay} Aprilie 2025</span>
        </div>
      )}
    </div>
  );
}