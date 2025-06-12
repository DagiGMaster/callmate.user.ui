import { makeAutoObservable, toJS } from "mobx";
import { Appointment } from "../models/Appointment";

interface Availability {
  [dateString: string]: string[];
}

interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD format
  dayOfWeek: number;
  isToday: boolean;
  isWeekend: boolean;
  availableSlots: string[];
  occupiedSlots: string[];
}

interface BusinessHours {
  startHour: number;
  endHour: number;
  intervalMinutes: number;
  excludedTimes: string[];
}

// Business configuration
const businessConfig = {
  default: {
    startHour: 10,
    endHour: 20,
    intervalMinutes: 15,
    excludedTimes: [] as string[],
  },
  friday: {
    startHour: 9,
    endHour: 13,
    intervalMinutes: 15,
    excludedTimes: [] as string[],
  }
};

// Generate time slots function
const generateTimeSlots = (startHour: number, endHour: number, intervalMinutes: number): string[] => {
  const slots: string[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === endHour && minute > 0) break;
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  
  return slots;
};

// Create store object with explicit typing
const appointmentsStore = {
  // State
  appointments: [] as Appointment[],
  appointmentTime: "" as string,
  selectedDate: "" as string,
  appointmentAvailability: {} as Availability,
  calendarDays: [] as CalendarDay[],
  
  // Generated time slots
  timeSlots: generateTimeSlots(
    businessConfig.default.startHour,
    businessConfig.default.endHour,
    businessConfig.default.intervalMinutes
  ) as string[],
  
  fridayTimeSlots: generateTimeSlots(
    businessConfig.friday.startHour,
    businessConfig.friday.endHour,
    businessConfig.friday.intervalMinutes
  ) as string[],

  // Helper methods
  formatDateToString(date: Date): string {
    return date.toISOString().split('T')[0];
  },

  formatTimeFromDate(date: Date): string {
    return date.toTimeString().slice(0, 5);
  },

  getTimeSlotsForDate(dateString: string): string[] {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    
    // Friday = 5
    if (dayOfWeek === 5) {
      return this.fridayTimeSlots;
    }
    
    return this.timeSlots;
  },

  getOccupiedSlotsForDate(dateString: string): string[] {
    return this.appointments
      .filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return this.formatDateToString(appointmentDate) === dateString;
      })
      .map((appointment: Appointment) => this.formatTimeFromDate(new Date(appointment.appointmentDate)));
  },

  generateCalendarDays(daysAhead: number = 14): CalendarDay[] {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < daysAhead; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = this.formatDateToString(date);
      const dayOfWeek = date.getDay();
      
      // Only Saturday is weekend in Israeli work week
      const isWeekend = dayOfWeek === 6;
      
      const calendarDay: CalendarDay = {
        date,
        dateString,
        dayOfWeek,
        isToday: i === 0,
        isWeekend,
        availableSlots: this.appointmentAvailability[dateString] || [],
        occupiedSlots: this.getOccupiedSlotsForDate(dateString),
      };
      
      days.push(calendarDay);
    }
    
    this.calendarDays = days;
    return days;
  },

  // Actions
  setAppointmentsNext14Days(appointments: Appointment[]): void {
    this.appointments = appointments;
    
    // Reset availability
    this.appointmentAvailability = {};
    
    // Generate calendar days
    const calendarDays = this.generateCalendarDays(14);
    
    // Calculate availability for each day
    calendarDays.forEach((day: CalendarDay) => {
      if (!day.isWeekend) { // Skip Saturday only
        const occupiedSlots = this.getOccupiedSlotsForDate(day.dateString);
        const dayTimeSlots = this.getTimeSlotsForDate(day.dateString);
        const availableSlots = dayTimeSlots.filter(
          (time: string) => !occupiedSlots.includes(time)
        );
        
        this.appointmentAvailability[day.dateString] = availableSlots;
        
        // Update the calendar day object
        day.availableSlots = availableSlots;
        day.occupiedSlots = occupiedSlots;
      }
    });

    console.log("Appointment Availability:", toJS(this.appointmentAvailability));
    console.log("Calendar Days:", toJS(this.calendarDays));
  },

  setSelectedDate(dateString: string): void {
    this.selectedDate = dateString;
  },

  setAppointmentTime(time: string): void {
    this.appointmentTime = time;
  },

  getAvailableSlotsForSelectedDate(): string[] {
    return this.appointmentAvailability[this.selectedDate] || [];
  },

  isSlotAvailable(dateString: string, time: string): boolean {
    const availableSlots = this.appointmentAvailability[dateString] || [];
    return availableSlots.includes(time);
  },

  getCalendarDay(dateString: string): CalendarDay | undefined {
    return this.calendarDays.find((day: CalendarDay) => day.dateString === dateString);
  },

  getFullAppointmentDate(): Date | null {
    if (!this.selectedDate || !this.appointmentTime) return null;
    
    const [hours, minutes] = this.appointmentTime.split(':').map(Number);
    
    // Create date from the date string properly to avoid timezone issues
    const dateParts = this.selectedDate.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed in JavaScript
    const day = parseInt(dateParts[2], 10);
    
    // Create the appointment date using local timezone
    const appointmentDate = new Date(year, month, day, hours, minutes, 0, 0);
    
    console.log("Selected date string:", this.selectedDate);
    console.log("Selected time:", this.appointmentTime);
    console.log("Created appointment date:", appointmentDate);
    console.log("Date parts - Year:", year, "Month:", month + 1, "Day:", day);
    
    return appointmentDate;
  },

  resetSelection(): void {
    this.selectedDate = "";
    this.appointmentTime = "";
  }
};

// Make it observable
makeAutoObservable(appointmentsStore);

export default appointmentsStore;