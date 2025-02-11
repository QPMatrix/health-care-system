import { getRecentAppointmentList } from "@/actions/appointment.actions";
import { DataTable } from "@/components/table/data-table";
import StatCard from "@/components/custom/stat-card";
import { Columns } from "@/components/table/columns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Admin = async () => {
  const appointment = await getRecentAppointmentList();
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={32}
            alt="LOGO"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointment
          </p>
        </section>
        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointment.scheduledCount}
            label="Scheduled Appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointment.pendingCount}
            label="Pending Appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointment.cancelledCount}
            label="Cancelled Appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        <DataTable columns={Columns} data={appointment.documents} />
      </main>
    </div>
  );
};

export default Admin;
