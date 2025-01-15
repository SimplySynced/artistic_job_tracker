'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Employee, LaborCode, TimeSheet, TimeSheetFormData, TimeSheetSchema } from '@/types';
import { z } from 'zod';
import { TimeSheetTable } from './table';
import { useParams } from 'next/navigation';
import { LaborCodeFormData } from '../../../types';

const defaultFormData: TimeSheetFormData = {
  employee_id: 0,
  date_worked: '',
  job_number: 0,
  job_code: 0,
  begin_time: '',
  end_time: '',
  hours: 0,
  minutes: 0,
  pay_rate: 0,
  added_by: '',
  added_date: '',
};

export default function TimeManagement() {
  const { id } = useParams(); // Get employee ID from the route params
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]);
  const [laborCodes, setLaborCodes] = useState<LaborCode[]>([]);
  const [employeeInfo, setEmployeeInfo] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<TimeSheetFormData>(defaultFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TimeSheetFormData, string>>>({});
  const [editingTimeSheet, setEditingTimeSheet] = useState<TimeSheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    if (id) {
      // Fetch employee info first
      const fetchAllData = async () => {
        try {
          await fetchData(`/api/employees/${id}`, setEmployeeInfo);
          await fetchData(`/api/laborcodes`, setLaborCodes);
          await fetchData(`/api/timesheet/${id}`, setTimeSheets, z.array(TimeSheetSchema));
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllData();
    }
  }, [id, fetchData]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!employeeInfo) {
    return <div className="text-center">Employee information not found.</div>;
  }

  const calculateTimeDifference = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startDate = new Date();
    const endDate = new Date();

    startDate.setHours(startHour, startMinute);
    endDate.setHours(endHour, endMinute);

    const diffMs = endDate.getTime() - startDate.getTime();

    if (diffMs < 0) {
      throw new Error('End time must be later than start time');
    }

    const diffMinutes = Math.floor(diffMs / 60000); // Convert milliseconds to minutes
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return { hours, minutes };
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setFormErrors({});
    setEditingTimeSheet(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Convert value to number for numeric fields
    const newValue = type === 'number' ? (value === '' ? 0 : Number(value)) : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (formErrors[name as keyof TimeSheetFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEdit = (timesheet: TimeSheet) => {
    setEditingTimeSheet(timesheet);
    setFormData(timesheet);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    if (!isSaving) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentDate = new Date().toISOString();
    const formatDate = (isoDate: string | number | Date) => {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Example usage
    const formattedDate = formatDate(currentDate);

    const finalData = {
      ...formData,
      employee_id: employeeInfo?.id || 0,
      pay_rate: employeeInfo?.pay_rate || 0,
      job_number: Number(formData.job_number),
      job_code: Number(formData.job_code),
      hours: Number(formData.hours),
      minutes: Number(formData.minutes),
      added_date: formattedDate,
    };

    try {
      // Calculate hours and minutes from begin_time and end_time
      const { hours, minutes } = calculateTimeDifference(formData.begin_time, formData.end_time);
      const laborDescription = laborCodes.find((item) => item.id === Number(formData.job_code));
      const jcd = laborDescription?.description

      // Update the formData with calculated hours and minutes
      const updatedFormData = {
        ...formData,
        hours,
        minutes,
        begin_time: formData.begin_time + ':00',
        end_time: formData.end_time + ':00',
        employee_id: employeeInfo?.data.id || 0,
        pay_rate: employeeInfo?.data.pay_rate || 0,
        job_number: Number(formData.job_number),
        job_code: Number(formData.job_code),
        job_code_description: jcd,
        added_date: new Date().toISOString().split('T')[0], // Set current date
      };

      // Validate the updated formData
      TimeSheetSchema.parse(updatedFormData);

      setIsSaving(true);

      const url = editingTimeSheet
        ? `/api/timesheet/${editingTimeSheet.id}`
        : '/api/timesheet/';
      const method = editingTimeSheet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) throw new Error('Failed to save timesheet.');

      toast({
        title: 'Success',
        description: `Timesheet ${editingTimeSheet ? 'updated' : 'added'} successfully.`,
      });

      fetchData(`/api/timesheet/${id}`, setTimeSheets, z.array(TimeSheetSchema));
      handleModalClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormErrors(error.flatten().fieldErrors);
      } else if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };


  // Handle delete
  const handleDelete = async (timesheetId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/timesheet/${timesheetId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete job');

      await fetchData(`/api/timesheet/${id}`, setTimeSheets, z.array(TimeSheetSchema));
      toast({
        title: 'Success',
        description: 'Job deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto py-4 space-y-6">
      <div className="justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">
          Timesheet for {employeeInfo.data.first_name} {employeeInfo.data.last_name}
        </h1>
        <h3 className="text-md md:text-lg">Location: {employeeInfo.data.location}</h3>
      </div>

      <TimeSheetTable
        data={timeSheets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
        isLoading={isLoading}
      />

      {isModalOpen && (
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
              <span className="text-xl font-bold">{editingTimeSheet ? 'Edit TimeSheet' : 'Add TimeSheet'}</span>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'date_worked', label: 'Date Worked', type: 'date' },
                  { name: 'job_number', label: 'Job Number', type: 'number' },
                  { name: 'begin_time', label: 'Begin Time', type: 'time' },
                  { name: 'end_time', label: 'End Time', type: 'time' },
                  { name: 'added_by', label: 'Added By', type: 'text' }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium">{field.label}</label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof TimeSheetFormData]?.toString() || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors[field.name as keyof TimeSheetFormData] && (
                      <p className="text-red-500 text-sm">{formErrors[field.name]}</p>
                    )}
                  </div>
                ))}

                {/* Labor Code */}
                <div>
                  <label className="block text-sm font-medium">Labor Code</label>
                  <select
                    name="job_code"
                    value={formData.job_code || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a Labor Code</option>
                    {laborCodes.map((lc) => (
                      <option key={lc.id} value={lc.id}>
                        {lc.id} - {lc.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-neutral-900 text-white">
                    {isSaving ? 'Saving...' : editingTimeSheet ? 'Update' : 'Save'}
                  </Button>
                </div>
              </form>
            </div >
          </div >
        </Dialog>
      )
      }
    </div>
  );
}
