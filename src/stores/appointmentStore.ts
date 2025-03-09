import { makeAutoObservable, toJS } from "mobx";
import { Appointment } from "../models/Appointment";

interface Availability {
  [key: number]: string[];
}

class AppointmentsStore {
  appointments: Appointment[] = [];
  appointmentTime: string = "";
  clockFunc_15Minutes: string[] = [
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
  ];

  appointmentAvailability_15Minutes: Availability = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };

  constructor() {
    makeAutoObservable(this);
  }

  setAppointmentsNext14Days(appointments: Appointment[]) {
    if (appointments.length === 0) {
      Object.keys(this.appointmentAvailability_15Minutes).forEach((key) => {
        this.appointmentAvailability_15Minutes[Number(key)] = [
          ...this.clockFunc_15Minutes,
        ];
      });
    } else {
      const occupiedTimes: { [key: string]: Set<string> } = {};

      appointments.forEach((item) => {
        const appointmentDate = new Date(item.appointmentDate);
        const dayIndex = appointmentDate.getDay(); // Get the weekday index (0-6)
        const time = appointmentDate.toTimeString().slice(0, 5); // Extract HH:mm format

        if (!occupiedTimes[dayIndex]) {
          occupiedTimes[dayIndex] = new Set();
        }

        occupiedTimes[dayIndex].add(time);
      });

      Object.keys(this.appointmentAvailability_15Minutes).forEach((key) => {
        const dayIndex = Number(key);
        this.appointmentAvailability_15Minutes[dayIndex] =
          this.clockFunc_15Minutes.filter(
            (time) => !occupiedTimes[dayIndex]?.has(time)
          );
      });
    }

    console.log(
      "this.appointmentAvailability_15Minutes",
      toJS(this.appointmentAvailability_15Minutes)
    );

    this.appointments = appointments;
  }
}

const appointmentsStore = new AppointmentsStore();
export default appointmentsStore;
