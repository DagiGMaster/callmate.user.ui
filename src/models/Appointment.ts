export interface Appointment {
  clientName: string;
  phoneNumber: string;
  appointmentDate: Date;
  service: string;
  isDeleted: boolean;
  isPayed: boolean;
}
