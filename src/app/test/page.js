'use client';
import Login from "@/components/Login";
import Link from "next/link";

const Page = () => {
  return (
    <div>
      <h1>Test Page</h1>
      <Login />
      <hr />
      <Link href={'/teams/15/'}>Team 15</Link>
    </div>
  );
}

export default Page;