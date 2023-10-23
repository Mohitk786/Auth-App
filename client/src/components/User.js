import React from 'react';

export const User = ({ firstName, lastName, number, email, role, verified }) => {
  return (
    <div className="bg-white border rounded shadow-md p-4">
      <div className="text-lg font-semibold mb-2">
        Name: {firstName} {lastName}
      </div>
      <div className="text-gray-600">
        Mobile Number: {number}
      </div>
      <div className="text-gray-600">
        Email: {email}
      </div>
      <div className="text-gray-600">
        Account Type: {role}
      </div>
      <div className="text-gray-600">
        Verified: {verified ? 'True' : 'False'}
      </div>
    </div>
  );
};
