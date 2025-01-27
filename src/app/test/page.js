'use client';
import Login from "@/components/Login";
import Link from "next/link";

const Page = () => {
  return (
    <div>
      <h1>Test Page</h1>
      <Login />
      <hr />
      <Link href={'/events/1/'}>Event 1</Link>
    </div>
  );
}

export default Page;