'use client'
import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Employee, EmployeeFormData, EmployeeSchema } from '@/types';
import { z } from 'zod';
import { LuPaperclip, LuPencilLine, LuTrash2 } from "react-icons/lu";

import { EmployeeTable } from "./table"

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    nick_name: '',
    location: '',
    pay_rate: '',
    added_by: '',
    updated_by: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  const initialFormData: EmployeeFormData = {
    first_name: '',
    last_name: '',
    nick_name: '',
    location: '',
    pay_rate: '',
    added_by: '',
    updated_by: ''
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (): Promise<void> => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      const validatedData = z.array(EmployeeSchema).parse(data);
      setEmployees(validatedData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch employees",
        variant: "destructive",
      });
    }
  };

  const validateForm = (data: EmployeeFormData): boolean => {
    try {
      const numericData = {
        ...data,
        pay_rate: parseFloat(data.pay_rate),
      };

      EmployeeSchema.parse(numericData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof EmployeeFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof EmployeeFormData] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name as keyof EmployeeFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleEdit = (employee: Employee): void => {
    setEditingEmployee(employee);
    setFormData({
      ...employee,
      pay_rate: employee.pay_rate.toString(),
    });
    setIsModalOpen(true);
  };

  const handleAddNew = (): void => {
    setEditingEmployee(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm(formData)) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    try {
      const currentUser = 'system'; // Replace with actual user authentication
      const submissionData = {
        ...formData,
        pay_rate: parseFloat(formData.pay_rate),
        updated_by: currentUser,
        added_by: editingEmployee ? formData.added_by : currentUser,
      };

      const url = editingEmployee
        ? `/api/employees/${editingEmployee.id}`
        : '/api/employees';

      const method = editingEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to save employee');

      await fetchEmployees();
      handleModalClose();

      toast({
        title: "Success",
        description: `Employee ${editingEmployee ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (employeeId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      await fetchEmployees();
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // New function to render employee card for mobile view
  const EmployeeCard = ({ employee }: { employee: Employee }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{employee.first_name} {employee.last_name}</h3>
            <p className="text-sm text-gray-500">{employee.nick_name}</p>
          </div>
          <div className="flex space-x-2">
          <Button
              variant="outline"
              onClick={() => handleEdit(employee)}
              className="bg-sky-500 text-white text-xs px-3 py-1"
            >
              <LuPaperclip />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleEdit(employee)}
              className="bg-sky-500 text-white text-xs px-3 py-1"
            >
              <LuPencilLine />
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(employee.id!)}
              className="bg-red-500 text-white text-xs px-3 py-1"
            >
              <LuTrash2 />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <h3 className="text-gray-500 font-medium">Location</h3>
            <p className='text-sm'>{employee.location}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Pay Rate</h3>
            <p className='text-sm'>{formatCurrency(employee.pay_rate)}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Added By</h3>
            <p className='text-sm'>{employee.added_by}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">Employees</h1>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <EmployeeTable
          data={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4">
              <h2 className="text-lg md:text-xl font-bold mt-0">
                {editingEmployee ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'first_name', label: 'First Name', type: 'text' },
                  { name: 'last_name', label: 'Last Name', type: 'text' },
                  { name: 'nick_name', label: 'Nick Name', type: 'text' },
                  { name: 'location', label: 'Location', type: 'text' },
                  { name: 'pay_rate', label: 'Pay Rate', type: 'number', step: '0.01' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.name && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      step={field.step}
                      value={formData[field.name as keyof EmployeeFormData]}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${formErrors[field.name as keyof EmployeeFormData] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[field.name as keyof EmployeeFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors[field.name as keyof EmployeeFormData]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleModalClose}
                    className="w-full md:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-neutral-900 text-white w-full md:w-auto"
                  >
                    {editingEmployee ? 'Update' : 'Save'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
