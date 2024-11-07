'use client'
import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { TimeSheet, TimeSheetFormData, TimeSheetSchema } from '@/types';
import { z } from 'zod';
import { LuPencilLine, LuTrash2 } from "react-icons/lu";

import { TimeSheetTable } from "./table"

export default function TimeManagement({ params }:any) {
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimeSheet, setEditingTimeSheet] = useState<TimeSheet | null>(null);
  const [formData, setFormData] = useState<TimeSheetFormData>({
    employee_id: '',
    date_worked: '',
    job_number: '',
    job_code: '',
    job_hours: '',
    job_minutes: '',
    pay_rate: '',
    total_pay: '',
    added_by: '',
    added_date: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TimeSheetFormData, string>>>({});

  const initialFormData: TimeSheetFormData = {
    employee_id: '',
    date_worked: '',
    job_number: '',
    job_code: '',
    job_hours: '',
    job_minutes: '',
    pay_rate: '',
    total_pay: '',
    added_by: '',
    added_date: '',
  };

  useEffect(() => {
    fetchTimeSheets();
  }, []);

  const id = params;

  const fetchTimeSheets = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/timesheets/${id}`);
      if (!response.ok) throw new Error('Failed to fetch timesheets');
      const data = await response.json();
      const validatedData = z.array(TimeSheetSchema).parse(data);
      setTimeSheets(validatedData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch woods",
        variant: "destructive",
      });
    }
  };

  const validateForm = (data: TimeSheetFormData): boolean => {
    try {
      const stringData = {
        ...data,
      };

      TimeSheetSchema.parse(stringData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof TimeSheetFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof TimeSheetFormData] = err.message;
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

    if (formErrors[name as keyof TimeSheetFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleEdit = (timesheet: TimeSheet): void => {
    setEditingTimeSheet(timesheet);
    setFormData({
      ...timesheet,
      employee_id: timesheet.employee_id.toString(),
      job_number: timesheet.job_number.toString(),
      job_code: timesheet.job_code.toString(),
      job_hours: timesheet.job_hours.toString(),
      job_minutes: timesheet.job_minutes.toString(),
      pay_rate: timesheet.pay_rate.toString(),
      total_pay: timesheet.total_pay.toString(),
    });
    setIsModalOpen(true);
  };

  const handleAddNew = (): void => {
    setEditingTimeSheet(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setEditingTimeSheet(null);
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
      };

      const url = editingTimeSheet
        ? `/api/timesheets/${editingTimeSheet.id}`
        : '/api/timesheets';

      const method = editingTimeSheet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to save wood');

      await fetchTimeSheets();
      handleModalClose();

      toast({
        title: "Success",
        description: `Wood type ${editingTimeSheet ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (timesheetId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this wood type?')) return;

    try {
      const response = await fetch(`/api/timesheets/${timesheetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete wood');

      await fetchTimeSheets();
      toast({
        title: "Success",
        description: "Wood type deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  // New function to render employee card for mobile view
  const TimeSheetCard = ({ timesheet }: { timesheet: TimeSheet }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{timesheet.date_worked} </h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleEdit(timesheet)}
              className="bg-sky-500 text-white text-xs px-3 py-1"
            >
              <LuPencilLine />
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(timesheet.id!)}
              className="bg-red-500 text-white text-xs px-3 py-1"
            >
              <LuTrash2 />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <h3 className="text-gray-500 font-medium">W</h3>
            <p className='text-sm'>{timesheet.total_pay}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">Wood Types</h1>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <TimeSheetTable
          data={timeSheets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {timeSheets.map((timeSheet) => (
          <TimeSheetCard key={timeSheet.id} timesheet={timeSheet} />
        ))}
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4">
              <h2 className="text-lg md:text-xl font-bold mt-0">
                {editingTimeSheet ? 'Edit Time Sheet' : 'Add Time Sheet'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'employee_id', label: 'Employee ID', type: 'number' },
                  { name: 'date_worked', label: 'Date Worked', type: 'text' },
                  { name: 'job_number', label: 'Job Number', type: 'number' },
                  { name: 'job_code', label: 'Code', type: 'number' },
                  { name: 'job_hours', label: 'Hours', type: 'number' },
                  { name: 'job_mins', label: 'Mins', type: 'number' },
                  { name: 'pay_rate', label: 'Pay Rate', type: 'number' },
                  { name: 'total_pay', label: 'Total Pay', type: 'number' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.name && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof TimeSheetFormData]}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${formErrors[field.name as keyof TimeSheetFormData] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[field.name as keyof TimeSheetFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors[field.name as keyof TimeSheetFormData]}
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
                    {editingTimeSheet ? 'Update' : 'Save'}
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
