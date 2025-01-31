// import React, { useState } from "react";
// import { Dialog, DialogContent, DialogTitle } from "@mui/material";
// import "../css/AppointmentScheduler.css";

// interface Day {
//   label: string;
//   id: string;
// }

// interface Availability {
//   [key: string]: string[];
// }

// const days: Day[] = [
//   { label: "א", id: "A" },
//   { label: "ב", id: "B" },
//   { label: "ג", id: "C" },
//   { label: "ד", id: "D" },
//   { label: "ה", id: "E" },
//   { label: "ו", id: "F" },
// ];

// const timeSlots: string[] = Array.from({ length: 37 }, (_, i) => {
//   const hour = Math.floor((10 * 60 + i * 15) / 60);
//   const minutes = (i * 15) % 60;
//   return `${hour}:${minutes === 0 ? "00" : minutes}`;
// });

// const mockAvailability: Availability = {
//   A: ["10:00", "10:15", "12:30", "14:45", "16:00"],
//   B: ["11:15", "13:45", "15:30"],
//   C: ["10:00", "12:15", "17:30"],
//   D: ["10:45", "11:30", "14:00", "18:15"],
//   E: ["13:00", "15:15", "19:30"],
//   F: ["12:00", "16:45", "20:00"],
// };
// const AppointmentScheduler: React.FC = () => {
//   const [selectedDay, setSelectedDay] = useState<string | null>(null);
//   const [availableSlots, setAvailableSlots] = useState<string[]>([]);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);
//   const [openDialog, setOpenDialog] = useState<boolean>(false);

//   const handleDayClick = (dayId: string): void => {
//     setSelectedDay(dayId);
//     setAvailableSlots(mockAvailability[dayId] || []);
//   };

//   const handleTimeClick = (time: string): void => {
//     setSelectedTime(time);
//     setOpenDialog(true);
//   };

//   const confirmAppointment = (): void => {
//     console.log(
//       `Booking appointment for day ${selectedDay} at ${selectedTime}`
//     );
//     setOpenDialog(false);
//   };

//   return (
//     <div className="appointment-container">
//       {/* Days Tabs */}
//       <div className="days-tabs">
//         {days.map((day) => (
//           <button
//             key={day.id}
//             className={`day-tab ${selectedDay === day.id ? "active" : ""}`}
//             onClick={() => handleDayClick(day.id)}
//           >
//             {day.label}
//           </button>
//         ))}
//       </div>

//       {/* Default Message */}
//       {!selectedDay && (
//         <div className="default-message">
//           <p>אנא בחר יום לקביעת תור באחד מן הימים למעלה</p>
//         </div>
//       )}

//       {/* Time Slots */}
//       {selectedDay && (
//         <div className="time-slots">
//           {timeSlots.map((time) => (
//             <button
//               key={time}
//               className={`time-slot ${
//                 availableSlots.includes(time) ? "available" : "unavailable"
//               }`}
//               onClick={() =>
//                 availableSlots.includes(time) && handleTimeClick(time)
//               }
//               disabled={!availableSlots.includes(time)}
//             >
//               {time}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Confirmation Dialog */}
//       <Dialog
//         style={{ fontFamily: "Arial" }}
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//       >
//         <DialogTitle style={{ direction: "rtl" }}>אישור לקביעת תור</DialogTitle>
//         <DialogContent style={{ direction: "rtl" }}>
//           <p>האם אתה בטוח שאתה מעוניין לקבוע תור ל - {selectedTime}?</p>
//           <div className="dialog-buttons">
//             <button className="confirm-button" onClick={confirmAppointment}>
//               כן
//             </button>
//             <button
//               className="cancel-button"
//               onClick={() => setOpenDialog(false)}
//             >
//               לא
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AppointmentScheduler;

import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import "../css/AppointmentScheduler.css";

interface Day {
  label: string;
  id: string;
}

interface Availability {
  [key: string]: string[];
}

const days: Day[] = [
  { label: "א", id: "A" },
  { label: "ב", id: "B" },
  { label: "ג", id: "C" },
  { label: "ד", id: "D" },
  { label: "ה", id: "E" },
  { label: "ו", id: "F" },
];

const timeSlots: string[] = Array.from({ length: 37 }, (_, i) => {
  const hour = Math.floor((10 * 60 + i * 15) / 60);
  const minutes = (i * 15) % 60;
  return `${hour}:${minutes === 0 ? "00" : minutes}`;
}).filter((time) => {
  const [hour, minute] = time.split(":").map(Number);
  return !(hour >= 13 && minute > 0 && days.find((day) => day.id === "F")); // Exclude times after 13:00 on Fridays
});

const mockAvailability: Availability = {
  A: ["10:00", "10:15", "12:30", "14:45", "16:00"],
  B: ["11:15", "13:45", "15:30"],
  C: ["10:00", "12:15", "17:30"],
  D: ["10:45", "11:30", "14:00", "18:15"],
  E: ["13:00", "15:15", "19:30"],
  F: ["12:00", "16:45", "20:00"],
};

const AppointmentScheduler: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  const handleDayClick = (dayId: string): void => {
    setSelectedDay(dayId);
    setAvailableSlots(mockAvailability[dayId] || []);
    if (timeSlotsRef.current) {
      timeSlotsRef.current.scrollTop = 0;
    }
  };

  const handleTimeClick = (time: string): void => {
    setSelectedTime(time);
    setOpenDialog(true);
  };

  const confirmAppointment = (): void => {
    console.log(
      `Booking appointment for day ${selectedDay} at ${selectedTime}`
    );
    setOpenDialog(false);
  };

  return (
    <div
      className="appointment-container"
      style={{ maxHeight: "60vh", overflowY: "auto" }}
    >
      {/* Days Tabs */}
      <div className="days-tabs">
        {days.map((day) => (
          <button
            key={day.id}
            className={`day-tab ${selectedDay === day.id ? "active" : ""}`}
            onClick={() => handleDayClick(day.id)}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Default Message */}
      {!selectedDay && (
        <div className="default-message">
          <p>אנא בחר יום לקביעת תור באחד מן הימים למעלה</p>
        </div>
      )}

      {/* Time Slots */}
      {selectedDay && (
        <div
          className="time-slots"
          ref={timeSlotsRef}
          style={{ maxHeight: "40vh", overflowY: "auto" }}
        >
          {timeSlots.map((time) => (
            <button
              key={time}
              className={`time-slot ${
                availableSlots.includes(time) ? "available" : "unavailable"
              }`}
              onClick={() =>
                availableSlots.includes(time) && handleTimeClick(time)
              }
              disabled={!availableSlots.includes(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        style={{ fontFamily: "Arial" }}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle style={{ direction: "rtl" }}>אישור לקביעת תור</DialogTitle>
        <DialogContent style={{ direction: "rtl" }}>
          <p>האם אתה בטוח שאתה מעוניין לקבוע תור ל - {selectedTime}?</p>
          <div className="dialog-buttons">
            <button className="confirm-button" onClick={confirmAppointment}>
              כן
            </button>
            <button
              className="cancel-button"
              onClick={() => setOpenDialog(false)}
            >
              לא
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentScheduler;
