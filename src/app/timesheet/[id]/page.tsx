'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { EmployeeSchema, Employee, LaborCode, LaborCodeSchema, TimeSheet, TimeSheetFormData, TimeSheetSchema } from '@/types';
import { z } from 'zod';
import { TimeSheetTable } from "./table"

export default function TimeManagement({ params }: any) {
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]);
  const [laborcodes, setLaborCodes] = useState<LaborCode[]>([]);
  const [employeeinfo, setEmployeeInfo] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTimeSheet, setEditingTimeSheet] = useState<TimeSheet | null>(null);
  const [formData, setFormData] = useState<TimeSheetFormData>({
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
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TimeSheetFormData, string>>>({});

  const fetchEmployeeInfo = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/employees/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch employee info');
      const data = await response.json();
      console.log(data)
      setEmployeeInfo(data); // Ensure `data` is an array of { id, location }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch locations',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchEmployeeInfo();
  }, []);

  const fetchLaborCodes = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/laborcodes/`);
      if (!response.ok) throw new Error('Failed to fetch employee info');
      const data = await response.json();
      setLaborCodes(data); // Ensure `data` is an array of { id, location }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch locations',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchLaborCodes();
  }, []);

  // Fetch TimeSheets
  const fetchTimeSheets = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/timesheet/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch timesheets');
      const data = await response.json();
      const validatedData = z.array(TimeSheetSchema).parse(data);
      setTimeSheets(validatedData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch timesheet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeSheets();
  }, []);

  // Validate form
  const validateForm = (data: TimeSheetFormData): boolean => {
    try {
      const numericData = {
        ...data,
        employee_id: Number(data.employee_id),
        job_number: Number(data.job_number),
        job_code: Number(data.job_code),
        hours: Number(data.hours),
        minutes: Number(data.minutes),
        pay_rate: Number(data.pay_rate),
      };
      TimeSheetSchema.parse(numericData);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (formErrors[name as keyof TimeSheetFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEdit = useCallback((timesheet: TimeSheet): void => {
    setEditingTimeSheet(timesheet);
    setFormData({
      ...timesheet,
    });
    setIsModalOpen(true);
  }, []);

  // Handle add new job
  const handleAddNew = (): void => {
    setEditingTimeSheet(null);
    setFormData({
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
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = (): void => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingTimeSheet(null);
    setFormData({
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
    });
    setFormErrors({});
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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

    const finalSubmissionData = {
      ...formData,
      employee_id: Number(employeeinfo[0].id),
      job_number: Number(formData.job_number),
      job_code: Number(formData.job_code),
      hours: Number(formData.hours),
      minutes: Number(formData.minutes),
      pay_rate: Number(employeeinfo[0].pay_rate),
      added_date: formattedDate,
    };
    console.log(finalSubmissionData);


    if (!validateForm(finalSubmissionData)) {
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      const url = editingTimeSheet ? `/api/timesheet/${editingTimeSheet.id}` : '/api/timesheet/';

      const method = editingTimeSheet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSubmissionData),
      });

      if (!response.ok) throw new Error('Failed to save job');

      await fetchTimeSheets();
      handleModalClose();

      toast({
        title: 'Success',
        description: `Job ${editingTimeSheet ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
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

      await fetchTimeSheets();
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
    <>
      <div className="max-w-screen-2xl mx-auto py-4 space-y-6">
      {employeeinfo.length > 0 ? (
        <div className="justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold">
            TimeSheet for {employeeinfo[0].first_name} {employeeinfo[0].last_name}
          </h1>
          <h3 className="text-md md:text-lg">
            Location: {employeeinfo[0].location}
          </h3>
        </div>
      ) : (
        <div className="text-center">
          <p>Loading employee information...</p>
        </div>
      )}

        <div className="overflow-x-auto">
          <TimeSheetTable
            data={timeSheets}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
            isLoading={isLoading}
          />
        </div>
      </div>

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
                  { name: 'date_worked', label: 'Date Worked', type: 'text' },
                  { name: 'job_number', label: 'Job Number', type: 'number' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof TimeSheetFormData]}
                      onChange={handleInputChange}
                      required
                      disabled={isSaving}
                      className={formErrors[field.name as keyof TimeSheetFormData] ? 'border-red-500' : ''}
                    />
                    {formErrors[field.name as keyof TimeSheetFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors[field.name as keyof TimeSheetFormData]}
                      </p>
                    )}
                  </div>
                ))}
                {/* LaborCode Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Labor Code <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="job_code"
                    value={formData.job_code || ''} // Safely handle nullable values
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                    className="block w-full border rounded-md px-3 py-2"
                  >
                    <option value="" disabled>
                      Select a Labor Code
                    </option>
                    {laborcodes.map((lc) => (
                      <option key={lc.id} value={lc.id}>
                        {lc.id} - {lc.description}
                      </option>
                    ))}
                  </select>
                </div>
                {[
                  { name: 'begin_time', label: 'Begin Time', type: 'text' },
                  { name: 'end_time', label: 'End Time', type: 'text' },
                  { name: 'hours', label: 'Hours', type: 'number' },
                  { name: 'minutes', label: 'Minutes', type: 'number' },
                  { name: 'added_by', label: 'Added By', type: 'text' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof TimeSheetFormData]}
                      onChange={handleInputChange}
                      required
                      disabled={isSaving}
                      className={formErrors[field.name as keyof TimeSheetFormData] ? 'border-red-500' : ''}
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
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-neutral-900 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : editingTimeSheet ? 'Update' : 'Save'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
