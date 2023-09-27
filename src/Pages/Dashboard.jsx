import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    salary: "",
  });
  const [isAddFormOpen, setIsAddFormOpen] = useState(true);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleFetchEmployee(currentPage);
  }, [currentPage]);

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ADD EMPLOYEE
  const handleAddEmployee = async () => {
    try {
      setIsLoading(true);

      const res = await axios.post(
        "https://mock05-backend-production.up.railway.app/employees",
        formData
      );

      if (res.status === 201) {
        alert("Employee Added Successfully");
        setEmployees([...employees, res.data]); // Update the employees list
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          department: "",
          salary: "",
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Failed to add Employee: ${error.message}`);
    }
  };

  // FETCH EMPLOYEE
  const handleFetchEmployee = async (page) => {
    try {
      setIsLoading(true);

      const res = await axios.get(
        `https://mock05-backend-production.up.railway.app/employees/pagination?page=${page}`
      );

      setEmployees(res.data.employees);
      setTotalPages(res.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch employees", error);
    }
  };

  // PAGE CHANGE
  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  // DELETE EMPLOYEE
  const handleDeleteEmployee = async (employeeId) => {
    try {
      setIsLoading(true);

      const res = await axios.delete(
        `https://mock05-backend-production.up.railway.app/employees/${employeeId}`
      );

      if (res.status === 200) {
        const updatedEmployees = employees.filter(
          (employee) => employee._id !== employeeId
        );
        setEmployees(updatedEmployees);
        alert(res.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(`Failed to delete employee with ID ${employeeId}`, error);
    }
  };

  // EDIT/UPDATE EMPLOYEE
  const openEditForm = (employee) => {
    setIsEditFormOpen(true);
    setIsAddFormOpen(false);
    setEditEmployeeData(employee);
  };
  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setIsAddFormOpen(true);
    setEditEmployeeData({});
  };
  const handleUpdateEmployee = async () => {
    try {
      const updatedEmployeeData = {
        firstname: editEmployeeData.firstname,
        lastname: editEmployeeData.lastname,
        email: editEmployeeData.email,
        department: editEmployeeData.department,
        salary: editEmployeeData.salary,
      };

      const res = await axios.patch(
        `https://mock05-backend-production.up.railway.app/employees/${editEmployeeData._id}`,
        updatedEmployeeData
      );

      if (res.status === 200) {
        const updatedEmployee = res.data.updatedEmployee;

        const updatedEmployees = employees.map((employee) =>
          employee._id === updatedEmployee._id ? updatedEmployee : employee
        );

        setEmployees(updatedEmployees);
        closeEditForm();
        alert(res.data.message);
      }
    } catch (error) {
      console.log(`Failed to update employee`, error);
    }
  };

  // FILTER BY DEPARTMENTS
  const handleFilterChange = async (e) => {
    const selectedDepartment = e.target.value;
    setFilter(selectedDepartment);
    setCurrentPage(1);

    try {
      let url = "https://mock05-backend-production.up.railway.app/employees";

      if (selectedDepartment !== "") {
        url = `${url}/filter/${selectedDepartment}`;
      }

      const res = await axios.get(url);

      if (res.status === 200) {
        setEmployees(res.data);
        setTotalPages(res.data.totalPages);
      } else {
        console.error("Failed to filter employees by department");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // SORT BY SALARY
  const handleSortChange = async (e) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
    setCurrentPage(1);

    try {
      const url = `https://mock05-backend-production.up.railway.app/employees/sort/${selectedSort}`;
      const res = await axios.get(url);

      if (res.status === 200) {
        setEmployees(res.data);
        setTotalPages(res.data.totalPages);
      } else {
        console.error("Failed to sort employees");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // SEARCH
  const handleSearch = async (query) => {
    try {
      if (query.trim() === "") {
        await handleFetchEmployee(currentPage);
      } else {
        const url = `https://mock05-backend-production.up.railway.app/employees/search/${query}`;
        const res = await axios.get(url);

        if (res.status === 200) {
          setSearchResults(res.data);
        } else {
          console.error("Failed to search employees");
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div id="dashboard-container">
      <h1>Employee Dashboard</h1>
      {/* Add Employee Form */}
      {isAddFormOpen && (
        <div id="add-employee-form">
          <h2>Add Employee</h2>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          >
            <option value="">Department</option>
            <option value="Tech">Tech</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            placeholder="Salary"
            required
          />
          <button onClick={handleAddEmployee} disabled={isLoading}>
            {isLoading ? "Adding..." : "ADD"}
          </button>
        </div>
      )}
      {/* Edit Form */}
      {isEditFormOpen && (
        <div id="edit-form">
          <h2>Edit Employee</h2>
          <input
            type="text"
            name="firstname"
            value={editEmployeeData.firstname}
            onChange={(e) =>
              setEditEmployeeData({
                ...editEmployeeData,
                firstname: e.target.value,
              })
            }
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastname"
            value={editEmployeeData.lastname}
            onChange={(e) =>
              setEditEmployeeData({
                ...editEmployeeData,
                lastname: e.target.value,
              })
            }
            placeholder="Last Name"
            required
          />
          <input
            type="email"
            name="email"
            value={editEmployeeData.email}
            onChange={(e) =>
              setEditEmployeeData({
                ...editEmployeeData,
                email: e.target.value,
              })
            }
            placeholder="Email"
            required
          />
          <select
            name="department"
            value={editEmployeeData.department}
            onChange={(e) =>
              setEditEmployeeData({
                ...editEmployeeData,
                department: e.target.value,
              })
            }
          >
            <option value="Tech">Tech</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
          <input
            type="text"
            name="salary"
            value={editEmployeeData.salary}
            onChange={(e) =>
              setEditEmployeeData({
                ...editEmployeeData,
                salary: e.target.value,
              })
            }
            placeholder="Salary"
            required
          />
          <button onClick={handleUpdateEmployee}>Update</button>
          <button onClick={closeEditForm}>Cancel</button>
        </div>
      )}
      {/* Search and Filter and Sort */}
      <div id="filter-container">
        <div id="search-container">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>

        <div>
          <select value={filter} onChange={handleFilterChange}>
            <option value="">Filter By Departments</option>
            <option value="Tech">Tech</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div>
          <select value={sort} onChange={handleSortChange}>
            <option value="">Sort by Salary</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div id="employee-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {(searchResults.length > 0 ? searchResults : employees).map(
              (employee) => (
                <tr key={employee._id}>
                  <td>{`${employee.firstname} ${employee.lastname}`}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.salary}</td>
                  <td>
                    <button
                      id="delete-button"
                      onClick={() => handleDeleteEmployee(employee._id)}
                    >
                      Delete
                    </button>
                  </td>

                  <td>
                    <button
                      id="edit-button"
                      onClick={() => openEditForm(employee)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
