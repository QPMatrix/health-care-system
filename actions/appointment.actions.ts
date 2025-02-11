"use server";
import { databases } from "@/lib/appwrite.config";
import { formatDateTime, parseStringify } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { sendSMSNotification } from "./sms.actions";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    console.log("Creating a new appointment");
    const newAppointment = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    const smsMessage = `Greetings from CarePulse,

${
  type === "schedule"
    ? `Your appointment is confirmed for ${
        formatDateTime(appointment.schedule!).dateTime
      } with Dr. ${appointment.primaryPhysician}.`
    : `Unfortunately, your appointment scheduled for ${
        formatDateTime(appointment.schedule!).dateTime
      } has been cancelled.
        Reason: ${appointment.cancellationReason}.`
}

Thank you,
CarePulse Team`;
    console.log(userId);
    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };
    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (err: any) {
    console.log(err);
  }
};
