import React from "react";
import { Table, Button } from "react-bootstrap";

const BaseTable = ({ users, showEditUserModal }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.gender}</td>
            <td>{user.status}</td>
            <td>
              <Button
                variant="secondary"
                onClick={() => showEditUserModal(user)}
              >
                Edit User
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BaseTable;
