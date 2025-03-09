import axios, { AxiosResponse } from "axios";
import { Appointment } from "../models/Appointment";

const API_BASE_URL: string = "http://localhost:5800/api/appointments/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiRequest = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data: object | null = null
): Promise<any> => {
  try {
    const config = { method, url: endpoint };
    if (data) {
      (config as any).data = data;
    }

    const response: AxiosResponse = await api(config);
    console.log("response", response);

    return response.status == 200 ? response.data : [];
  } catch (error: any) {
    console.error("API Request Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getNext14DaysAppointments = async (
  isJsonResponse: boolean = true
): Promise<any> => {
  return await apiRequest("/getNext14Days", "GET", null);
};

export const createAppointment = async (
  appointmentData: Appointment,
  isJsonResponse: boolean = true
): Promise<any> => {
  return await apiRequest("/create", "POST", appointmentData);
};

export const updateAppointment = async (
  appointmentId: string,
  appointmentData: Partial<Appointment>,
  isJsonResponse: boolean = true
): Promise<any> => {
  return await apiRequest(`/update/${appointmentId}`, "PUT", appointmentData);
};

export const deleteAppointment = async (
  appointmentId: string,
  isJsonResponse: boolean = true
): Promise<any> => {
  return await apiRequest(`/delete/${appointmentId}`, "DELETE", null);
};
