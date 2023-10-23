import React, { useEffect, useState } from 'react';
import { API_BASE } from './Constants';
import { User } from './User';
import axios from 'axios';
import {useParams } from 'react-router';

export const DashBoard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const { email } = useParams();

  async function fetchData() {
    const user = await axios.get(`${API_BASE}/getOne/${email}`);
    const role = user.data.user.role;

    if (role === 'Admin') {
      const getUsers = await axios.get(`${API_BASE}/getAllUsers`);
      setAllUsers(getUsers.data.allUsers);
    } else {
      const data = new Array(user.data.user);
      setAllUsers(data);
    }
  }

  async function deleteHandler({ _id }) {
    await axios.post(`${API_BASE}/deleteUser`, {
      _id: _id,
    });
    // You may want to update the user list after deletion
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="text-2xl font-semibold mb-4">Registered Users</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allUsers.map((user, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded shadow-md"
          >
            <User {...user} />
            <button
              onClick={() => deleteHandler(user)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
