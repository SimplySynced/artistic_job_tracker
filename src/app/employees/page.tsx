'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Employee, EmployeeFormData, EmployeeSchema } from '@/types';
import { z } from 'zod';
import { EmployeeTable } from './table';

// Default form data for reset
const getDefaultFormData = (): EmployeeFormData => ({
  first_name: '',
  last_name: '',
  nick_name: '',
  location: '',
  pay_rate: '',
  added_by: '',
  updated_by: '',
  active: true,
});

export default function EmployeePage() {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<{ id: number; location: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>(getDefaultFormData());
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  const fetchData = useCallback(
    async (url: string, setter: (data: any) => void, schema?: z.ZodSchema<any>) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
        const data = await response.json();
        setter(schema ? schema.parse(data) : data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An error occurred.',
          variant: 'destructive',
        });
      }
    },
    []
  );

  useEffect(() => {
    setIsLoading(true);
    try {
      fetchData(`/api/employees`, setEmployees);
      fetchData(`/api/locations`, setLocations);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'active' ? value === 'true' : value, // Handle boolean for active status
    }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setFormData(getDefaultFormData());
    setIsModalOpen(true); // Open modal
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      ...employee,
      pay_rate: employee.pay_rate.toString(),
    });
    setIsModalOpen(true); // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close modal
    setFormErrors({});
    setFormData(getDefaultFormData()); // Reset form data
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const parsedData = { ...formData, pay_rate: parseFloat(formData.pay_rate) };
      EmployeeSchema.parse(parsedData);

      setIsSaving(true);
      const method = editingEmployee ? 'PUT' : 'POST';
      const url = editingEmployee ? `/api/employees/${editingEmployee.id}` : '/api/employees';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) throw new Error('Failed to save employee.');

      toast({
        title: 'Success',
        description: `Employee ${editingEmployee ? 'updated' : 'added'} successfully.`,
        variant: 'success'
      });

      fetchData(`/api/employees`, setEmployees);
      handleModalClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce(
          (acc, curr) => ({ ...acc, [curr.path[0]]: curr.message }),
          {}
        );
        setFormErrors(errors);
      } else {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Something went wrong.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto py-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">Employees</h1>
      </div>

      <EmployeeTable
        data={employees}
        onEdit={handleEdit}
        onDelete={async (id) => {
          if (confirm('Are you sure you want to delete this employee?')) {
            await fetch(`/api/employees/${id}`, { method: 'DELETE' });
            fetchData(`/api/employees`, setEmployees);;
          }
        }}
        onAddNew={handleAddNew}
        isLoading={isLoading}
      />

      {isModalOpen &&
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <div className="fixed z-40 inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div
            className="fixed z-50 inset-0 flex items-center justify-center px-4"
            onClick={handleModalClose}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4">
                {editingEmployee ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {['first_name', 'last_name', 'nick_name', 'pay_rate'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {field.replace('_', ' ')}
                    </label>
                    <Input
                      name={field}
                      type={field === 'pay_rate' ? 'number' : 'text'}
                      value={formData[field as keyof EmployeeFormData] || ''}
                      onChange={handleInputChange}
                      required={field !== 'nick_name'}
                    />
                    {formErrors[field as keyof EmployeeFormData] && (
                      <p className="text-red-500 text-sm mt-1">{formErrors[field as keyof EmployeeFormData]}</p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <select
                    name="location"
                    value={formData.location || ''} // Safely handle nullable values
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                    className="block w-full border rounded-md px-3 py-2"
                  >
                    <option value="" disabled>
                      Select a location
                    </option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.location}>
                        {loc.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="active"
                    value={formData.active.toString()}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-neutral-900 text-white" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      }
    </div >
  );
}
