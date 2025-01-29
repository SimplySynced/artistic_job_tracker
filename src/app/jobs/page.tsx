'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Job, JobFormData, JobSchema } from '@/types';
import { US_STATES } from '@/lib/utils';
import { z } from 'zod';
import { JobTable } from './table';

export default function JobsManagement() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [locations, setLocations] = useState<{ id: number; location: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    job_number: 0,
    job_location: '',
    job_customer: '',
    job_address: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  // Fetch jobs
  const fetchJobs = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');

      const data = await response.json();

      // Preprocess data to split job_address into street, city, state, and zip
      const preprocessData = (data: any[]) =>
        data.map((job) => {
          const [street = '', city = '', stateZip = ''] = job.job_address?.split(', ') || [];
          const [state = '', zip = ''] = stateZip.split(' ');

          return {
            ...job,
            street,
            city,
            state,
            zip,
          };
        });

      const preprocessedData = preprocessData(data);

      // Validate the preprocessed data
      const validatedData = z.array(JobSchema).parse(preprocessedData);
      setJobs(validatedData);
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs or validate data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchLocations = async (): Promise<void> => {
    try {
      const response = await fetch('/api/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      setLocations(data); // Ensure `data` is an array of { id, location }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch locations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Validate form
  const validateForm = (data: JobFormData): boolean => {
    try {
      // Preprocess form data to match JobSchema
      const numericData = {
        job_number: Number(data.job_number),
        job_location: data.job_location,
        job_customer: data.job_customer,
        job_address: `${data.street || ''}, ${data.city || ''}, ${data.state || ''} ${data.zip || ''}`, // Combine address fields
      };

      // Validate using Zod schema
      JobSchema.parse(numericData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof JobFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as keyof JobFormData] = err.message;
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
    if (formErrors[name as keyof JobFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle edit job
  const handleEdit = (job: Job): void => {
    const [street = '', city = '', stateZip = ''] = (job.job_address || '').split(', ');
    const [state = '', zip = ''] = stateZip.split(' ');

    setEditingJob(job);
    setFormData({
      ...job,
      job_number: job.job_number,
      street,
      city,
      state,
      zip,
    });
    setIsModalOpen(true);
  };

  // Handle add new job
  const handleAddNew = (): void => {
    setEditingJob(null);
    setFormData({
      job_number: 0,
      job_location: '',
      job_customer: '',
      job_address: '',
      street: '',
      city: '',
      state: '',
      zip: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = (): void => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingJob(null);
    setFormData({
      job_number: 0,
      job_location: '',
      job_customer: '',
      job_address: '',
      street: '',
      city: '',
      state: '',
      zip: '',
    });
    setFormErrors({});
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Combine address fields into a single string
    const combinedAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;

    // Prepare submission data, omitting street, city, state, and zip
    const { street, city, state, zip, ...submissionData } = formData;

    const finalSubmissionData = {
      ...submissionData,
      job_address: combinedAddress,
      job_number: Number(formData.job_number),
    };

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
      const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSubmissionData),
      });

      if (!response.ok) throw new Error('Failed to save job');

      await fetchJobs();
      handleModalClose();

      toast({
        title: 'Success',
        description: `Job ${editingJob ? 'updated' : 'added'} successfully`,
        variant: 'success'
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
  const handleDelete = async (jobId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete job');

      await fetchJobs();
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
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold">Jobs</h1>
        </div>

        <div className="overflow-x-auto">
          <JobTable
            data={jobs}
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
            onClick={handleModalClose} // Close modal on clicking the backdrop
          >
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-4"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              <span className="text-xl font-bold">
                {editingJob ? 'Edit Job' : 'Add Job'}
              </span>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'job_code', label: 'Job Code', type: 'number' },
                  { name: 'job_number', label: 'Job Number', type: 'number' },
                  { name: 'job_location', label: 'Location', type: 'text' },
                  { name: 'job_customer', label: 'Customer', type: 'text' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof JobFormData]}
                      onChange={handleInputChange}
                      required
                      disabled={isSaving}
                      className={formErrors[field.name as keyof JobFormData] ? 'border-red-500' : ''}
                    />
                    {formErrors[field.name as keyof JobFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors[field.name as keyof JobFormData]}
                      </p>
                    )}
                  </div>
                ))}
                {/* Location Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="job_location"
                    value={formData.job_location}
                    onChange={handleInputChange} // No casting required
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

                {/* Address fields */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Street <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange(e)}
                    required
                    disabled={isSaving}
                    className="block w-full border rounded-md px-3 py-2"
                  >
                    <option value="" disabled>
                      Select a state
                    </option>
                    {US_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Zip <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="zip"
                    type="text"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                  />
                </div>

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
                    {isSaving ? 'Saving...' : editingJob ? 'Update' : 'Save'}
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
