import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { useFormFields } from "../lib/hooksLib";

const baseUrl = process.env.REACT_APP_SERVER_URL;

const UserEditForm = ({ user, refreshUsers, closeModal, refreshCsvData }) => {
  const [fields, handleFieldChange] = useFormFields({
    name: user.name,
    email: user.email,
    gender: user.gender,
    status: user.status,
  });
  const [message, setMessage] = useState("");

  const saveChanges = async () => {
    const userData = {
      name: fields.name,
      email: fields.email,
      gender: fields.gender,
      status: fields.status,
    };
    try {
      if (
        user.name !== fields.name ||
        user.email !== fields.email ||
        user.status !== fields.status ||
        user.gender !== fields.gender
      ) {
        const response = await axios.patch(
          `${baseUrl}/users/${user.id}`,
          userData
        );
        const { message } = response.data;
        setMessage(message);
        refreshUsers();
        refreshCsvData();
        closeModal();
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={fields.name}
          name="name"
          onChange={handleFieldChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={fields.email}
          name="email"
          onChange={handleFieldChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Gender</Form.Label>
        <Form.Control
          as="select"
          name="gender"
          value={fields.gender}
          onChange={handleFieldChange}
        >
          <option>Male</option>
          <option>Female</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          name="status"
          value={fields.status}
          onChange={handleFieldChange}
        >
          <option>Active</option>
          <option>Inactive</option>
        </Form.Control>
      </Form.Group>
      {message ? <Alert variant="success">{message}</Alert> : null}
      <Button variant="secondary" onClick={saveChanges}>
        Save Changes
      </Button>
    </Form>
  );
};

export default UserEditForm;
