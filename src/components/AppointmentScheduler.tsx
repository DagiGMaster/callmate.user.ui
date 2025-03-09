// import React, { useState, useRef, useEffect } from "react";
// import { Dialog, DialogContent, DialogTitle } from "@mui/material";
// import { getNext14DaysAppointments } from "../api/appointmentsApi";
// import appointmentsStore from "../stores/appointmentStore";
// import TimeTab from "./TimeTab";
// import { Appointment } from "../models/Appointment";
// import "../css/AppointmentScheduler.css";

// interface Day {
//   label: string;
//   id: string;
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
//   console.log("hour", hour);

//   const minutes = (i * 15) % 60;
//   console.log("minutes", minutes);
//   return `${hour}:${minutes === 0 ? "00" : minutes}`;
// });

// const AppointmentScheduler: React.FC = () => {
//   const [selectedDay, setSelectedDay] = useState<string | null>(null);
//   const [availableSlots, setAvailableSlots] = useState<string[]>([]);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);
//   const [openDialog, setOpenDialog] = useState<boolean>(false);
//   const timeSlotsRef = useRef<HTMLDivElement>(null);

//   const handleDayClick = (dayId: string): void => {
//     setSelectedDay(dayId);
//     setAvailableSlots(
//       appointmentsStore.appointmentAvailability_15Minutes[dayId] || []
//     );
//     if (timeSlotsRef.current) {
//       timeSlotsRef.current.scrollTop = 0;
//     }
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

//   const getAppointmentsNext14Days = async () => {
//     console.log("getAppointmentsNext14Days - START!!");
//     try {
//       const appointmentsRes: Appointment[] = await getNext14DaysAppointments(
//         true
//       );

//       appointmentsStore.setAppointmentsNext14Days(appointmentsRes);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       console.log("getAppointmentsNext14Days - END!!");
//     }
//   };
//   useEffect(() => {
//     getAppointmentsNext14Days();
//   }, []);

//   return (
//     <div
//       className="appointment-container"
//       style={{ maxHeight: "60vh", overflowY: "auto" }}
//     >
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
//         <div
//           className="time-slots"
//           ref={timeSlotsRef}
//           style={{ maxHeight: "40vh", overflowY: "auto" }}
//         >
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
//         <DialogTitle
//           style={{ direction: "rtl", textAlign: "center", fontSize: "1.75rem" }}
//         >
//           אישור לקביעת תור
//         </DialogTitle>
//         <DialogContent style={{ direction: "rtl" }}>
//           <p>האם אתה בטוח שאתה מעוניין לקבוע תור ל:</p>
//           <p style={{ fontSize: "1.5rem", textAlign: "center" }}>
//             {selectedTime}
//           </p>
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

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { getNext14DaysAppointments } from "../api/appointmentsApi";
import appointmentsStore from "../stores/appointmentStore";
import TimeTab from "./TimeTab";
import { Appointment } from "../models/Appointment";
import "../css/AppointmentScheduler.css";

interface Day {
  label: string;
  id: string;
  index: number; // Added index for mapping
}

const days: Day[] = [
  { label: "א", id: "A", index: 1 },
  { label: "ב", id: "B", index: 2 },
  { label: "ג", id: "C", index: 3 },
  { label: "ד", id: "D", index: 4 },
  { label: "ה", id: "E", index: 5 },
  { label: "ו", id: "F", index: 6 },
];

const AppointmentScheduler: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  const handleDayClick = (dayIndex: number): void => {
    setSelectedDay(dayIndex);
    setAvailableSlots(
      appointmentsStore.appointmentAvailability_15Minutes[dayIndex] || []
    );
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

  const getAppointmentsNext14Days = async () => {
    console.log("Fetching next 14 days' appointments...");
    try {
      const appointmentsRes: Appointment[] = await getNext14DaysAppointments(
        true
      );
      appointmentsStore.setAppointmentsNext14Days(appointmentsRes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAppointmentsNext14Days();
  }, []);

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
            className={`day-tab ${selectedDay === day.index ? "active" : ""}`}
            onClick={() => handleDayClick(day.index)}
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
      {selectedDay !== null && (
        <div
          className="time-slots-grid"
          ref={timeSlotsRef}
          style={{ maxHeight: "40vh", overflowY: "auto" }}
        >
          {appointmentsStore.clockFunc_15Minutes.map((time) => (
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
              <TimeTab time={time} isActive={availableSlots.includes(time)} />
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
        <DialogTitle
          style={{ direction: "rtl", textAlign: "center", fontSize: "1.75rem" }}
        >
          אישור לקביעת תור
        </DialogTitle>
        <DialogContent style={{ direction: "rtl" }}>
          <p>האם אתה בטוח שאתה מעוניין לקבוע תור ל:</p>
          <p style={{ fontSize: "1.5rem", textAlign: "center" }}>
            {selectedTime}
          </p>
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
