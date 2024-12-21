'use server';

import { neon } from "@neondatabase/serverless";

export async function createStudent(formData) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const schema = `
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        date_of_birth DATE NOT NULL,
        address TEXT NULL,
        level VARCHAR(50) NOT NULL,
        state VARCHAR(50) NOT NULL,
        country VARCHAR(50) NOT NULL
      )
    `;
    
    await sql(schema);
    
    const firstname = formData.get('firstname');
    const lastname = formData.get('lastname');
    const dob = formData.get('dob');
    const address = formData.get('address');
    const level = formData.get('level');
    const state = formData.get('state');
    const country = formData.get('country');
    
    await sql`
      INSERT INTO students (
        first_name, last_name, date_of_birth, address, level, state, country
      ) VALUES (
        ${firstname}, ${lastname}, ${dob}, ${address}, ${level}, ${state}, ${country}
      )
    `;
    
    return { success: true, message: 'Student registered successfully!' };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Failed to register student.' };
  }
}

export async function getAllStudents() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const students = await sql`SELECT * FROM students ORDER BY id DESC`;
    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function deleteStudent(id) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`DELETE FROM students WHERE id = ${id}`;
    return { success: true, message: 'Student deleted successfully!' };
  } catch (error) {
    console.error('Error deleting student:', error);
    return { success: false, message: 'Failed to delete student.' };
  }
}

export async function updateStudent(formData) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const id = formData.get('id');
    const firstname = formData.get('firstname');
    const lastname = formData.get('lastname');
    const dob = formData.get('dob');
    const address = formData.get('address');
    const level = formData.get('level');
    const state = formData.get('state');
    const country = formData.get('country');
    
    await sql`
      UPDATE students 
      SET 
        first_name = ${firstname},
        last_name = ${lastname},
        date_of_birth = ${dob},
        address = ${address},
        level = ${level},
        state = ${state},
        country = ${country}
      WHERE id = ${id}
    `;
    
    return { success: true, message: 'Student updated successfully!' };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Failed to update student.' };
  }
}