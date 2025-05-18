
"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"
import { createUser } from "@/lib/actions/patient.actions"
import { UserFormValidation } from "@/lib/validation"

import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phone-input',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'date-picker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}
 
const PatientForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true)

    try {

      const userData = { name, email, phone }
      const newUser = await createUser(userData)

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`)
      }
    } catch (error) {
        console.log(error)
    }

    setIsLoading(false)
  }

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">

        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment</p>
        </section>

        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        
        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField 
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-2456"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>

  )
}

export default PatientForm
