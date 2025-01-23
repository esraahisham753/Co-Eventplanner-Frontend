'use client';
import Login from "@/components/Login";
import Link from "next/link";

const Page = () => {
  return (
    <div>
      <h1>Test Page</h1>
      <Login />
      <hr />
      <Link href={'/event-create/'}>Events</Link>
    </div>
  );
}

export default Page;