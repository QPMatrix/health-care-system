import { getPatient } from "@/actions/patient.actions";
import { AppointmentForm } from "@/components/forms/appointment-form";
import Image from "next/image";
import React from "react";

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const year = new Date();
  const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />

          <p className="copyright mt-4 py-12">
            © {year.getFullYear().toString()} QPMatrix
          </p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default NewAppointment;
