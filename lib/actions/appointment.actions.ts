
'use server'

import { ID, Query } from "node-appwrite";
import { DATABASE_ID, databases, APPOINTMENT_COLLECTION_ID, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { parse } from "path";
import { revalidatePath } from "next/cache";

// Create appointment
export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        // Create new appointment document
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )

        return parseStringify(newAppointment);
        
    } catch(error) {
        console.log(error)
    }
}

// Get appointment
export const getAppointment = async (appointmnetId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmnetId
        )

        return parseStringify(appointment);
        
    } catch(error) {
        console.log(error)
    }
}

// Get Recent Appointment list
export const getRecentAppointmentList = async () => {
    
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        )

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduledCount++
            } else if (appointment.status === 'pending') {
                acc.pendingCount++
            } else if (appointment.status === 'cancelled') {
                acc.cancelledCount++
            }
            return acc
        }, initialCounts)

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data);

    } catch (error) {
        console.log(error)
    }
}

// Update Appointment
export const updateAppointment = async ({ 
    appointmentId, 
    userId, 
    appointment, 
    type}: UpdateAppointmentParams) => {
        try {
            const updatedAppointment = await databases.updateDocument(
                DATABASE_ID!,
                APPOINTMENT_COLLECTION_ID!,
                appointmentId,
                appointment
            )

            if(!updatedAppointment) {
                throw new Error('Appointment not found')
            }

            // Send SMS notification
            const smsMessage = `
              Hi, it's CarePulse.${type === 'schedule' 
              ? ` Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr.${appointment.primaryPhysician}.`
              : ` We regret to inform you that your appointment has been cancelled. Reason: ${appointment.cancellationReason}`
              }
            `

            await sendSMSNotification(userId, smsMessage)

            revalidatePath('/admin')

            return parseStringify(updatedAppointment)

        } catch (error) {
            console.log(error)
        }
}

export const sendSMSNotification = async (userId : string, content: string) => {
    
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )

        return parseStringify(message)

    } catch(error) {
        console.log(error)
    }
}