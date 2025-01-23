'use client';
import Login from "@/components/Login";
import UserProfile from "@/components/UserProfile";
import UpdateUser from "@/components/UpdateUser";

const Page = () => {
  return (
    <div>
      <h1>Test Page</h1>
      <Login />
      <hr />
      <UserProfile />
      <hr />
      <UpdateUser />
    </div>
  );
}

export default Page;