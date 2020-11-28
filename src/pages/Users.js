import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Alert, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import Pagination from "react-pagination-bootstrap";
import BaseTable from "../components/BaseTable";
import BaseModal from "../components/BaseModal";
import UserEditForm from "../components/UserEditForm";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [count, setCount] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [dbPopulateProgress, setDbPopulateProgress] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [csvData, setCsvData] = useState([]);

  const baseUrl = process.env.REACT_APP_SERVER_URL;

  const fetchUsers = async (pageNumber = 1) => {
    const response = await axios.get(
      `${baseUrl}/users?page=${pageNumber}`
    );
    const { rows, count } = response.data;
    setUsers(rows);
    setCount(count);
  };

  const fetchCsvData = async() => {
    const response = await axios.get(`${baseUrl}/download/csv`);
    setCsvData(response.data);
  }

  useEffect(() => {
    fetchUsers();
    fetchCsvData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = async (pageNumber) => {
    setActivePage(pageNumber);
    fetchUsers(pageNumber);
  };

  const showEditModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const populateDatabase = async () => {
    setIsloading(true);
    try {
      const response = await axios.get(`${baseUrl}/users/populate`);
      const { message } = response.data;
      setDbPopulateProgress(message);
      setIsloading(false);
      fetchUsers();
    } catch (error) {
      if (error.response) {
        setIsloading(false);
        setError(error.response.data.message);
      }
    }
  };
  return (
    <div>
      {users.length < 1 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            height: "80vh",
          }}
        >
          <h4>The database is not populated with data.</h4>
          <p>Click the button below to populate the database with data.</p>
          <Button
            variant="secondary"
            style={{ width: "20rem" }}
            className="mt-4"
            onClick={populateDatabase}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="mr-2"
              />
            ) : null}
            {isLoading ? "Populating Data" : "Populate Data"}
          </Button>
          <div>
            {isLoading ? (
              <p className="mt-4">
                Populating database. Please be patient. This will take some time
              </p>
            ) : null}
            {dbPopulateProgress ? (
              <p className="mt-4">{dbPopulateProgress}</p>
            ) : null}
            {error ? <Alert variant="danger">{error}</Alert> : null}
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-12">
            <CSVLink
              data={csvData}
              filename={"users.csv"}
              className="btn btn-secondary btn-sm mt-4"
            >
              Download as CSV
            </CSVLink>
          </div>
          <div className="col-md-12 mt-4">
            <BaseTable users={users} showEditUserModal={showEditModal} />
            <BaseModal
              show={showModal}
              onHide={() => setShowModal(false)}
              heading="Edit User"
            >
              <UserEditForm
                user={selectedUser}
                refreshUsers={fetchUsers}
                refreshCsvData={fetchCsvData}
                closeModal={() => setShowModal(false)}
              />
            </BaseModal>
          </div>
          <div className="col-md-12 mt-2">
            <Pagination
              activePage={activePage}
              totalItemsCount={count}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
