'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Employee, EmployeeFormData, EmployeeSchema } from '@/types';
import { z } from 'zod';
import { EmployeeTable } from "./table";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  // Fetch employees with loading state
  const fetchEmployees = async (): Promise<void> => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Validate form data using EmployeeSchema
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

    // Clear error when field is edited
    if (formErrors[name as keyof EmployeeFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleEdit = useCallback((employee: Employee): void => {
    setEditingEmployee(employee);
    setFormData({
      ...employee,
      pay_rate: employee.pay_rate.toString(),
    });
    setIsModalOpen(true);
  }, []);

  const handleAddNew = (): void => {
    setEditingEmployee(null);
    setFormData({
      first_name: '',
      last_name: '',
      nick_name: '',
      location: '',
      pay_rate: '',
      added_by: '',
      updated_by: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    if (isSaving) return; // Prevent closing while saving
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({
      first_name: '',
      last_name: '',
      nick_name: '',
      location: '',
      pay_rate: '',
      added_by: '',
      updated_by: ''
    });
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
      setIsSaving(true);
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

      const response = await fetch(url, {
        method: editingEmployee ? 'PUT' : 'POST',
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
    } finally {
      setIsSaving(false);
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

  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">Employees</h1>
      </div>

      <div className="overflow-x-auto p-1">
        <EmployeeTable
          data={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
          isLoading={isLoading}
        />
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
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
                      {field.name !== 'nick_name' && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      step={field.step}
                      value={formData[field.name as keyof EmployeeFormData]}
                      onChange={handleInputChange}
                      required={field.name !== 'nick_name'}
                      disabled={isSaving}
                      className={formErrors[field.name as keyof EmployeeFormData] ? 'border-red-500' : ''}
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
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-neutral-900 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : editingEmployee ? 'Update' : 'Save'}
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
