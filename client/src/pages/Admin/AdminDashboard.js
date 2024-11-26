import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_BASE } from "../../components/Constants";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from the API
  useEffect(() => {
    setLoading(true)
    try{
        const response = axios.get(`${API_BASE}/getAllUsers`, {withCredentials:true})
        console.log(response.data)
        setUsers(response.data)

    }catch(error){
        console.error("Error fetching users:", error.message);
    }finally{
        setLoading(false);
    }
     
  }, []);

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`${process.env.API_BASE}/deleteUser/${userId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setUsers(users.filter((user) => user.id !== userId)); // Update UI after deletion
            alert("User deleted successfully");
          } else {
            alert("Failed to delete user");
          }
        })
        .catch((error) => console.error("Error deleting user:", error));
    }
  };

  if (loading) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">List of Users</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Verified</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.firstName+" "+user.lastName}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.verified ? "Yes" : "No"}</td>
                <td className="py-2 px-4 border-b">{user.number || "N/A"}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
