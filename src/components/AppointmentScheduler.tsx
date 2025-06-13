import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { observer } from "mobx-react-lite";
import { getNext14DaysAppointments, createAppointment } from "../api/appointmentsApi";
import appointmentsStore from "../stores/appointmentStore";
import TimeTab from "./TimeTab";
import HaircutSelector from "./HaircutSelector";
import { Appointment } from "../models/Appointment";
import "../css/AppointmentScheduler.css";

interface Day {
  label: string;
  dateString: string; // YYYY-MM-DD format
  displayDate: string; // For display purposes
  dayName: string; // Day name in Hebrew
}

const AppointmentScheduler: React.FC = observer(() => {
  const [selectedDateString, setSelectedDateString] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedHaircut, setSelectedHaircut] = useState<string>("");
  const [openHaircutDialog, setOpenHaircutDialog] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Save appointment details for success dialog
  const [bookedAppointment, setBookedAppointment] = useState<{
    dateString: string;
    time: string;
    formattedDate: string;
    haircut: string;
  } | null>(null);
  
  const [days, setDays] = useState<Day[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const timeSlotsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Generate next 14 working days (Sunday-Friday, skip Saturday)
  const generateWorkingDays = (): Day[] => {
    const workingDays: Day[] = [];
    const today = new Date();
    let currentDate = new Date(today);
    let daysAdded = 0;

    // Hebrew day names mapping (0=Sunday, 1=Monday, etc.)
    const hebrewDayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

    // Generate 14 working days (Sunday-Friday, skip Saturday)
    while (daysAdded < 14) {
      const dayOfWeek = currentDate.getDay();
      
      // Skip Saturday only (Saturday = 6)
      if (dayOfWeek !== 6) {
        // Fix timezone issue in date string generation
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        const displayDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
        
        // Simple Hebrew letter based on position in week
        let label = "";
        switch(dayOfWeek) {
          case 0: label = "א"; break; // Sunday
          case 1: label = "ב"; break; // Monday  
          case 2: label = "ג"; break; // Tuesday
          case 3: label = "ד"; break; // Wednesday
          case 4: label = "ה"; break; // Thursday
          case 5: label = "ו"; break; // Friday
        }
        
        console.log(`Generated day ${daysAdded + 1}:`, {
          label,
          displayDate,
          dayName: hebrewDayNames[dayOfWeek],
          dateString,
          actualDate: currentDate.toDateString()
        });
        
        workingDays.push({
          label,
          dateString,
          displayDate,
          dayName: hebrewDayNames[dayOfWeek]
        });
        
        daysAdded++;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Safety check to avoid infinite loop
      if (currentDate.getTime() - today.getTime() > 30 * 24 * 60 * 60 * 1000) break; // 30 days max
    }

    return workingDays;
  };

  const handleDayClick = (dateString: string): void => {
    console.log("Day clicked - dateString:", dateString);
    setSelectedDateString(dateString);
    appointmentsStore.setSelectedDate(dateString);
    
    // Get available slots for the selected date
    const slots = appointmentsStore.getAvailableSlotsForSelectedDate();
    setAvailableSlots(slots);
    
    if (timeSlotsRef.current) {
      timeSlotsRef.current.scrollTop = 0;
    }
  };

  const handleTimeClick = (time: string): void => {
    setSelectedTime(time);
    appointmentsStore.setAppointmentTime(time);
    setOpenHaircutDialog(true); // Open haircut selector first
  };

  const handleHaircutSelected = (haircut: string): void => {
    setSelectedHaircut(haircut);
    setOpenHaircutDialog(false);
    setOpenDialog(true); // Now open confirmation dialog
  };

  const handleHaircutDialogClose = (): void => {
    setOpenHaircutDialog(false);
    setSelectedTime(null); // Reset time selection
    appointmentsStore.setAppointmentTime("");
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentDayIndex < days.length - 3) {
      goToNext(); // This will jump +3 days
    }
    if (isRightSwipe && currentDayIndex > 0) {
      goToPrevious(); // This will jump -3 days
    }
  };

  // Carousel navigation functions
  const goToPrevious = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 3);
    }
  };

  const goToNext = () => {
    if (currentDayIndex < days.length - 3) { // Can navigate until we show the last 3 days
      setCurrentDayIndex(currentDayIndex + 3);
    }
  };

  // Get visible days (3 at a time, handle edge cases for last page)
  const getVisibleDays = () => {
    const startIndex = currentDayIndex;
    const endIndex = Math.min(currentDayIndex + 3, days.length);
    const visibleDays = days.slice(startIndex, endIndex);
    
    console.log("getVisibleDays:", {
      currentDayIndex,
      startIndex,
      endIndex,
      totalDays: days.length,
      visibleDaysCount: visibleDays.length,
      visibleDays: visibleDays.map(d => ({ label: d.label, displayDate: d.displayDate, dateString: d.dateString }))
    });
    
    return visibleDays;
  };

  const confirmAppointment = async (): Promise<void> => {
    console.log(`Booking appointment for ${selectedDateString} at ${selectedTime}`);
    console.log("Selected date display check:", selectedDateString);

    if (!selectedDateString || !selectedTime) {
      console.error("Missing date or time selection");
      setErrorMessage("חסרים פרטי התור. אנא בחר תאריך ושעה.");
      setOpenErrorDialog(true);
      return;
    }

    // Save appointment details BEFORE making API call and resetting state
    const dateParts = selectedDateString.split('-');
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    
    const appointmentDetails = {
      dateString: selectedDateString,
      time: selectedTime,
      formattedDate: formattedDate,
      haircut: selectedHaircut
    };
    
    setBookedAppointment(appointmentDetails);

    try {
      // Create full appointment date
      const fullAppointmentDate = appointmentsStore.getFullAppointmentDate();
      
      if (!fullAppointmentDate) {
        console.error("Could not create appointment date");
        setErrorMessage("שגיאה ביצירת תאריך התור. אנא נסה שוב.");
        setOpenErrorDialog(true);
        return;
      }

      console.log("Final appointment date being sent:", fullAppointmentDate);

      const newAppointment: Appointment = {
        clientName: "david",
        phoneNumber: "0534544153",
        appointmentDate: fullAppointmentDate,
        service: selectedHaircut || "hair cut", // Use selected haircut
        isDeleted: false,
        isPayed: false
      };

      console.log("Creating appointment:", newAppointment);
      
      const response = await createAppointment(newAppointment);
      console.log("Appointment created:", response);
      
      // Close confirmation dialog
      setOpenDialog(false);
      
      // Reset selection BEFORE showing success dialog
      appointmentsStore.resetSelection();
      setSelectedDateString(null);
      setSelectedTime(null);
      setSelectedHaircut("");
      setAvailableSlots([]);
      
      // Show success dialog (will use bookedAppointment state)
      setOpenSuccessDialog(true);
      
      // Refresh appointments after booking
      await getAppointmentsNext14Days();
      
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      
      // Close confirmation dialog
      setOpenDialog(false);
      
      // Show error dialog with specific message
      let errorMsg = "שגיאה ביצירת התור. אנא נסה שוב.";
      
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.message) {
        errorMsg = `שגיאה: ${error.message}`;
      }
      
      setErrorMessage(errorMsg);
      setOpenErrorDialog(true);
    }
  };

  const handleSuccessDialogClose = () => {
    setOpenSuccessDialog(false);
    setBookedAppointment(null); // Clear saved appointment details
  };

  const handleErrorDialogClose = () => {
    setOpenErrorDialog(false);
    setErrorMessage("");
    setBookedAppointment(null); // Clear saved appointment details
  };

  const getAppointmentsNext14Days = async () => {
    console.log("Fetching next 14 days' appointments...");
    try {
      const appointmentsRes: Appointment[] = await getNext14DaysAppointments(true);
      console.log("appointmentsRes", appointmentsRes);
      appointmentsStore.setAppointmentsNext14Days(appointmentsRes);
    } catch (err) {
      console.log("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    // Generate working days
    const workingDays = generateWorkingDays();
    console.log("Generated working days:", workingDays.length, workingDays);
    setDays(workingDays);
    
    // Fetch appointments
    getAppointmentsNext14Days();
  }, []);

  return (
    <div
      className="appointment-container"
      style={{ maxHeight: "60vh", overflowY: "auto" }}
    >
      {/* Day Carousel */}
      <div className="day-carousel-container">
        {/* Left Arrow */}
        <button 
          className="carousel-arrow carousel-arrow-left"
          onClick={goToPrevious}
          disabled={currentDayIndex === 0}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}
        >
          ‹
        </button>

        {/* Days Tabs Container */}
        <div 
          className="days-tabs-carousel"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            padding: '20px 60px', // Space for arrows
            position: 'relative',
            touchAction: 'pan-y', // Allow vertical scroll but handle horizontal
            userSelect: 'none' // Prevent text selection during swipe
          }}
        >
          {getVisibleDays().map((day) => {
            return (
              <button
                key={day.dateString}
                className={`day-tab ${selectedDateString === day.dateString ? "active" : ""}`}
                onClick={() => {
                  console.log("Clicking day:", day.label, day.displayDate, day.dayName, "dateString:", day.dateString);
                  handleDayClick(day.dateString);
                }}
                style={{
                  minWidth: '100px',
                  padding: '15px 10px',
                  borderRadius: '12px',
                  border: selectedDateString === day.dateString ? '3px solid #333' : '2px solid #ddd',
                  background: selectedDateString === day.dateString ? '#333' : 'white',
                  color: selectedDateString === day.dateString ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: "1.2em", fontWeight: 'bold' }}>{day.label}</div>
                <div style={{ fontSize: "0.8em", marginTop: "4px" }}>
                  {day.displayDate}
                </div>
                <div style={{ fontSize: "0.7em", marginTop: "2px" }}>
                  {day.dayName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button 
          className="carousel-arrow carousel-arrow-right"
          onClick={goToNext}
          disabled={currentDayIndex >= days.length - 3}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}
        >
          ›
        </button>

        {/* Touch-Friendly Navigation */}
        <div 
          className="carousel-navigation"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '15px',
            flexWrap: 'wrap'
          }}
        >
          {/* Large Touch-Friendly Navigation Buttons */}
          <button
            onClick={goToPrevious}
            disabled={currentDayIndex === 0}
            style={{
              minWidth: '100px',
              height: '50px',
              borderRadius: '25px',
              border: 'none',
              background: currentDayIndex === 0 ? '#e0e0e0' : 'black',
              color: currentDayIndex === 0 ? '#999' : 'white',
              cursor: currentDayIndex === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              touchAction: 'manipulation',
              transition: 'all 0.3s ease'
            }}
          >
            → קודם
          </button>

          {/* Current Page Indicator */}
          <div
            style={{
              minWidth: '80px',
              height: '50px',
              borderRadius: '25px',
              border: '2px solid #333',
              background: 'white',
              color: '#333',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <div>{Math.floor(currentDayIndex / 3) + 1}/{Math.ceil(days.length / 3)}</div>
            <div style={{ fontSize: '10px' }}>עמוד</div>
          </div>

          <button
            onClick={goToNext}
            disabled={currentDayIndex >= days.length - 3}
            style={{
              minWidth: '100px',
              height: '50px',
              borderRadius: '25px',
              border: 'none',
              background: currentDayIndex >= days.length - 3 ? '#e0e0e0' : 'black',
              color: currentDayIndex >= days.length - 3 ? '#999' : 'white',
              cursor: currentDayIndex >= days.length - 3 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              touchAction: 'manipulation',
              transition: 'all 0.3s ease'
            }}
          >
            הבא ←
          </button>
        </div>

        {/* Alternative: Week Navigation */}
        <div 
          style={{
            textAlign: 'center',
            marginTop: '10px',
            fontSize: '14px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '12px' }}>החלק או לחץ לניווט</span>
        </div>
      </div>

      {/* Default Message */}
      {!selectedDateString && (
        <div className="default-message">
          <p>אנא בחר יום לקביעת תור באחד מן הימים למעלה</p>
        </div>
      )}

      {/* Time Slots */}
      {selectedDateString && (
        <div
          className="time-slots-grid"
          ref={timeSlotsRef}
          style={{ 
            maxHeight: "40vh", 
            overflowY: "auto",
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            padding: '20px',
            marginTop: '20px'
          }}
        >
          {selectedDateString && (
            // Get the appropriate time slots for the selected date
            (() => {
              const selectedDate = new Date(selectedDateString);
              const isFriday = selectedDate.getDay() === 5;
              const timeSlotsToShow = isFriday ? appointmentsStore.fridayTimeSlots : appointmentsStore.timeSlots;
              
              return timeSlotsToShow.map((time) => (
                <button
                  key={time}
                  className={`time-slot ${
                    availableSlots.includes(time) ? "available" : "unavailable"
                  }`}
                  onClick={() =>
                    availableSlots.includes(time) && handleTimeClick(time)
                  }
                  disabled={!availableSlots.includes(time)}
                  style={{
                    padding: '15px',
                    borderRadius: '8px',
                    border: 'none',
                    background: availableSlots.includes(time) ? '#4CAF50' : '#e0e0e0',
                    color: availableSlots.includes(time) ? 'white' : '#999',
                    cursor: availableSlots.includes(time) ? 'pointer' : 'not-allowed',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <TimeTab time={time} isActive={availableSlots.includes(time)} />
                </button>
              ));
            })()
          )}
        </div>
      )}

      {/* Haircut Selection Dialog */}
      <HaircutSelector
        open={openHaircutDialog}
        onClose={handleHaircutDialogClose}
        onContinue={handleHaircutSelected}
        selectedTime={selectedTime}
      />

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
          <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
            {selectedDateString && (
              <>תאריך: {(() => {
                // Debug the date formatting
                console.log("Dialog - selectedDateString:", selectedDateString);
                const dateParts = selectedDateString.split('-');
                const day = dateParts[2];
                const month = dateParts[1];
                const year = dateParts[0];
                const formattedDate = `${day}.${month}.${year}`;
                console.log("Dialog - formatted date:", formattedDate);
                return formattedDate;
              })()}</>
            )}
          </p>
          <p style={{ fontSize: "1.5rem", textAlign: "center" }}>
            שעה: {selectedTime}
          </p>
          {selectedHaircut && (
            <p style={{ fontSize: "1.2rem", textAlign: "center", color: "#4CAF50" }}>
              תסרוקת: {selectedHaircut}
            </p>
          )}
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

      {/* Success Dialog */}
      <Dialog
        style={{ fontFamily: "Arial" }}
        open={openSuccessDialog}
        onClose={handleSuccessDialogClose}
      >
        <DialogTitle
          style={{ 
            direction: "rtl", 
            textAlign: "center", 
            fontSize: "1.75rem",
            color: "#4CAF50",
            borderBottom: "2px solid #4CAF50",
            paddingBottom: "15px"
          }}
        >
          ✅ התור נקבע בהצלחה!
        </DialogTitle>
        <DialogContent style={{ direction: "rtl", padding: "30px 24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "3rem", 
              color: "#4CAF50", 
              marginBottom: "20px" 
            }}>
              🎉
            </div>
            <p style={{ 
              fontSize: "1.3rem", 
              marginBottom: "20px",
              fontWeight: "bold",
              color: "#2E7D32"
            }}>
              תודה רבה!
            </p>
            <p style={{ fontSize: "1.1rem", marginBottom: "15px" }}>
              התור שלך נקבע בהצלחה עבור:
            </p>
            <div style={{ 
              background: "#E8F5E8", 
              padding: "15px", 
              borderRadius: "8px",
              margin: "15px 0"
            }}>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                📅 תאריך: {bookedAppointment?.formattedDate || "לא זמין"}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                🕐 שעה: {bookedAppointment?.time || "לא זמין"}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                ✂️ תסרוקת: {bookedAppointment?.haircut || "לא זמין"}
              </p>
            </div>
            <p style={{ 
              fontSize: "1rem", 
              color: "#666",
              marginTop: "20px"
            }}>
              נשלח אליך אישור בהודעת טקסט
            </p>
          </div>
          <div style={{ 
            textAlign: "center", 
            marginTop: "30px" 
          }}>
            <button 
              onClick={handleSuccessDialogClose}
              style={{
                background: "#4CAF50",
                color: "white",
                border: "none",
                padding: "12px 30px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: "120px"
              }}
            >
              סגור
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        style={{ fontFamily: "Arial" }}
        open={openErrorDialog}
        onClose={handleErrorDialogClose}
      >
        <DialogTitle
          style={{ 
            direction: "rtl", 
            textAlign: "center", 
            fontSize: "1.75rem",
            color: "#f44336",
            borderBottom: "2px solid #f44336",
            paddingBottom: "15px"
          }}
        >
          ❌ שגיאה בקביעת התור
        </DialogTitle>
        <DialogContent style={{ direction: "rtl", padding: "30px 24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "3rem", 
              color: "#f44336", 
              marginBottom: "20px" 
            }}>
              😞
            </div>
            <p style={{ 
              fontSize: "1.3rem", 
              marginBottom: "20px",
              fontWeight: "bold",
              color: "#c62828"
            }}>
              מצטערים!
            </p>
            <div style={{ 
              background: "#FFEBEE", 
              padding: "15px", 
              borderRadius: "8px",
              margin: "15px 0",
              border: "1px solid #FFCDD2"
            }}>
              <p style={{ 
                fontSize: "1.1rem", 
                color: "#d32f2f",
                margin: "0"
              }}>
                {errorMessage}
              </p>
            </div>
            <p style={{ 
              fontSize: "1rem", 
              color: "#666",
              marginTop: "20px"
            }}>
              אנא נסה שוב או פנה אלינו לקבלת עזרה
            </p>
          </div>
          <div style={{ 
            textAlign: "center", 
            marginTop: "30px",
            display: "flex",
            gap: "15px",
            justifyContent: "center"
          }}>
            <button 
              onClick={handleErrorDialogClose}
              style={{
                background: "#f44336",
                color: "white",
                border: "none",
                padding: "12px 30px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: "120px"
              }}
            >
              סגור
            </button>
            <button 
              onClick={() => {
                handleErrorDialogClose();
                // Optionally reopen the confirmation dialog to try again
                // setOpenDialog(true);
              }}
              style={{
                background: "#2196F3",
                color: "white",
                border: "none",
                padding: "12px 30px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: "120px"
              }}
            >
              נסה שוב
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default AppointmentScheduler;