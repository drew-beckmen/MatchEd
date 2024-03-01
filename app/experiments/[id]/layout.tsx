"use client";

import Navbar from "@/components/Navbar";
import Breadcrumb from "@/components/Breadcrumb"

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar>
        <div className="my-4 flex justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
        </div>
        <main>{children}</main>
      </Navbar>
    </div>
  );
}
