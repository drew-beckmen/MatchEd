"use client";

import Navbar from "@/components/Navbar";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar>
        <main>{children}</main>
      </Navbar>
    </div>
  );
}
