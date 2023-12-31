import React, { useEffect, useState } from "react";
import { fetchAllUsers } from "../../fetching";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const result = await fetchAllUsers();
      setUsers(result);
      console.log(result);
    };

    getUsers();
  }, []);
  return (
    <>
      <h1>All Users</h1>
      {users.map((user) => {
        return <div key={user.user_id}>{user.username}</div>;
      })}
    </>
  );
};

export default AllUsers;
