'use client'

import React, { useState, useEffect } from 'react'
import {
  createStudent,
  getAllStudents,
  deleteStudent,
  updateStudent
} from './actions'

export default function Home () {
  const [students, setStudents] = useState([])
  const [showTable, setShowTable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)

  const fetchAllStudentData = async () => {
    const data = await getAllStudents()
    setStudents(data)
  }

  const handleToggleDisplay = async () => {
    setShowTable(prev => !prev)
  }

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setLoading(true)
      const result = await deleteStudent(id)
      if (result.success) {
        const updatedData = await getAllStudents()
        setStudents(updatedData)
      } else {
        alert(result.message)
      }
      setLoading(false)
    }
  }

  const handleEdit = student => {
    setEditingStudent({
      ...student,
      date_of_birth: new Date(student.date_of_birth).toISOString().split('T')[0]
    })
    setShowTable(false)
  }

  const handleUpdate = async formData => {
    setLoading(true)
    const result = await updateStudent(formData)
    if (result.success) {
      const updatedData = await getAllStudents()
      setStudents(updatedData)
      setEditingStudent(null)
      setShowTable(true)
    } else {
      alert(result.message)
    }
    setLoading(false)
  }

  const handleCancelEdit = () => {
    setEditingStudent(null)
    setShowTable(true)
  }

  useEffect(() => {
    if(showTable) {
      fetchAllStudentData()
    }
  }, [showTable])
  

  const StudentForm = ({ onSubmit, initialData = null }) => (
    <div>
      {initialData && <input type='hidden' name='id' value={initialData.id} />}
      <div className='form-group'>
        <p id='note'></p>
        <label htmlFor='first-name'>First Name</label>
        <input
          type='text'
          id='first-name'
          name='firstname'
          required
          defaultValue={initialData?.first_name}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='last-name'>Last Name</label>
        <input
          type='text'
          id='last-name'
          name='lastname'
          required
          defaultValue={initialData?.last_name}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='dob'>Date of Birth</label>
        <input
          type='date'
          id='dob'
          name='dob'
          required
          defaultValue={initialData?.date_of_birth}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='address'>Address</label>
        <input
          type='text'
          id='address'
          name='address'
          defaultValue={initialData?.address}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='level'>Level</label>
        <input
          type='text'
          id='level'
          name='level'
          required
          defaultValue={initialData?.level}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='state'>State</label>
        <input
          type='text'
          id='state'
          name='state'
          required
          defaultValue={initialData?.state}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='country'>Country</label>
        <select
          id='country'
          name='country'
          required
          defaultValue={initialData?.country || ''}
        >
          <option value=''>Select Country</option>
          <option value='Nigeria'>Nigeria</option>
          <option value='United States'>United States</option>
          <option value='Canada'>Canada</option>
          <option value='United Kingdom'>United Kingdom</option>
        </select>
      </div>

      <div className='form-group'>
        <button onClick={onSubmit} disabled={loading}>
          {loading ? 'Processing...' : initialData ? 'Update' : 'Submit'}
        </button>
        {initialData && (
          <button
            type='button'
            onClick={handleCancelEdit}
            className='cancel-btn'
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div className='container'>
        <h1>Register Student Record</h1>
        <button className='show-toggle-button' onClick={handleToggleDisplay}>
          Show {showTable ? 'Form' : 'Table'}
        </button>

        {showTable ? (
          <div className='table-container'>
            <h2>Registered Students</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Date of Birth</th>
                  <th>Address</th>
                  <th>Level</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .sort((a, b) => a?.id - b?.id)
                  .map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.first_name}</td>
                      <td>{student.last_name}</td>
                      <td>
                        {new Date(student.date_of_birth).toLocaleDateString()}
                      </td>
                      <td>{student.address}</td>
                      <td>{student.level}</td>
                      <td>{student.state}</td>
                      <td>{student.country}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(student)}
                          className='edit-btn'
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className='delete-btn'
                          disabled={loading}
                        >
                          {loading ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <StudentForm
            onSubmit={editingStudent ? handleUpdate : createStudent}
            initialData={editingStudent}
          />
        )}
      </div>
    </div>
  )
}
