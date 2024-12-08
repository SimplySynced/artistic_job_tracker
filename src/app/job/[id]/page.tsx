'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { LumberCostSchema, LumberCostFormData, LumberCost, WoodReplacement, Job } from '@/types';
import { z } from 'zod';
import { JobTable } from './table';

export default function JobManagement({ params }: any) {
  const [lumbercosts, setLumberCost] = useState<LumberCost[]>([]);
  const [editingLumberCost, setEditingLumberCost] = useState<LumberCost | null >(null);
  const [woodreplacement, setWoodTypes] = useState<WoodReplacement[]>([]);
  const [jobinfo, setJobInfo] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<LumberCostFormData>({
    date: '',
    job_number: 0,
    wood_id: 0,
    wood_type: '',
    wood_replace_id: 0,
    quantity: 0,
    description: '',
    thickness: 0,
    length: 0,
    width: 0,
    cost_over: 0,
    total_cost: 0,
    ft_per_piece: 0,
    price: 0,
    tbf: 0,
    entered_by: '',
    entered_date: '',
    updated_by: '',
    updated_date: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LumberCostFormData, string>>>({});

  const fetchLumberCost = async (): Promise<void> => {
    try {
      const { id } = await params
      setIsLoading(true)
      const response = await fetch(`/api/job/${id}`);
      if (!response.ok) throw new Error('Failed to fetch wood types');
      const data = await response.json();
      setLumberCost(data); // Ensure `data` is an array of { id, location }
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
    fetchLumberCost();
  }, []);

  const fetchWoodReplacements = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/wood-replacement/`);
      if (!response.ok) throw new Error('Failed to fetch wood types');
      const data = await response.json();
      console.log(data)
      setWoodTypes(data); // Ensure `data` is an array of { id, location }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch locations',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchWoodReplacements();
  }, []);

  const fetchJobInfo = async (): Promise<void> => {
    try {
      const { id } = await params
      const response = await fetch(`/api/jobs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job info');
      const data = await response.json();
      setJobInfo(data); // Ensure `data` is an array of { id, location }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch job info',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchJobInfo();
  }, []);

  // Validate form
  const validateForm = (data: LumberCostFormData): boolean => {
    try {
      const numericData = {
        ...data,
        job_number: Number(data.job_number),
        wood_id: Number(data.wood_id),
        wood_replace_id: Number(data.wood_replace_id),
        quantity: Number(data.quantity),
        thickness: Number(data.thickness),
        length: Number(data.length),
        width: Number(data.width),
        cost_over: Number(data.cost_over),
        total_cost: Number(data.total_cost),
        ft_per_piece: Number(data.ft_per_piece),
        price: Number(data.price),
        tbf: Number(data.tbf),
      };
      LumberCostSchema.parse(numericData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof LumberCostFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof LumberCostFormData] = err.message;
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
    if (formErrors[name as keyof LumberCostFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle edit lumber cost
  const handleEdit = (lumbercost: LumberCost): void => {

    setEditingLumberCost(lumbercost);
    setFormData({
      ...lumbercost,
    });
    setIsModalOpen(true);
  };

  // Handle add new job
  const handleAddNew = (): void => {
    setEditingLumberCost(null);
    setFormData({
      date: '',
      job_number: 0,
      wood_id: 0,
      wood_type: '',
      wood_replace_id: 0,
      quantity: 0,
      description: '',
      thickness: 0,
      length: 0,
      width: 0,
      cost_over: 0,
      total_cost: 0,
      ft_per_piece: 0,
      price: 0,
      tbf: 0,
      entered_by: '',
      entered_date: '',
      updated_by: '',
      updated_date: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = (): void => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingLumberCost(null);
    setFormData({
      date: '',
      job_number: 0,
      wood_id: 0,
      wood_type: '',
      wood_replace_id: 0,
      quantity: 0,
      description: '',
      thickness: 0,
      length: 0,
      width: 0,
      cost_over: 0,
      total_cost: 0,
      ft_per_piece: 0,
      price: 0,
      tbf: 0,
      entered_by: '',
      entered_date: '',
      updated_by: '',
      updated_date: ''
    });
    setFormErrors({});
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const { id } = await params

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
      job_number: Number(id),
      wood_id: Number(formData.wood_id),
      wood_replace_id: Number(formData.wood_replace_id),
      quantity: Number(formData.quantity),
      thickness: Number(formData.thickness),
      length: Number(formData.length),
      width: Number(formData.width),
      cost_over: Number(0),
      total_cost: Number(formData.total_cost),
      ft_per_piece: Number(formData.ft_per_piece),
      price: Number(formData.price),
      tbf: Number(formData.tbf),
      added_date: formattedDate,
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
      const url = editingLumberCost ? `/api/jobs/${editingLumberCost.id}` : '/api/jobs/';

      const method = editingLumberCost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSubmissionData),
      });

      if (!response.ok) throw new Error('Failed to save job');

      await fetchLumberCost();
      handleModalClose();

      toast({
        title: 'Success',
        description: `Job ${editingLumberCost ? 'updated' : 'added'} successfully`,
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
  const handleDelete = async (lumbercostId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/job/${lumbercostId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete lumber cost');

      await fetchLumberCost();
      toast({
        title: 'Success',
        description: 'Lumber cost deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };
  const [jobnum, setJobNum] = useState("");

  useEffect(() => {
    const id = async () => {
      const paramId = await params.id;
      setJobNum(paramId);
    };
  }, [params])

  return (
    <>
      <div className="max-w-screen-2xl mx-auto py-4 space-y-6">
      {jobinfo.length > 0 ? (
        <div className="justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold">
          Lumber Cost Sheet for Job #{jobnum}
          </h1>
          <h3 className="text-md md:text-lg">
          Job Name: {jobinfo[0].job_customer}
          </h3>
        </div>
      ) : (
        <div className="text-center">
          <p>Loading Job Information...</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <JobTable
          data={lumbercosts}
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
              <span className="text-xl font-bold">{editingLumberCost ? 'Edit Lumber Cost' : 'Add Lumber Cost'}</span>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'date', label: 'Date ', type: 'text' },
                  { name: 'quantity', label: 'Quantity', type: 'number' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof LumberCostFormData]  || ''}
                      onChange={handleInputChange}
                      required
                      disabled={isSaving}
                      className={formErrors[field.name as keyof LumberCostFormData] ? 'border-red-500' : ''}
                    />
                    {formErrors[field.name as keyof LumberCostFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors[field.name as keyof LumberCostFormData]}
                      </p>
                    )}
                  </div>
                ))}
                {/* Wood Cost Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Wood & Thickness <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="wood_id"
                    value={formData.wood_replace_id || ''} // Safely handle nullable values
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                    className="block w-full border rounded-md px-3 py-2"
                  >
                    <option value="" disabled>
                      Select Lumber
                    </option>
                    {woodreplacement.map((wr) => (
                      <option key={wr.replace_cost_id} value={wr.replace_cost_id}>
                        {wr.wood_type} - {wr.thickness}
                      </option>
                    ))}
                  </select>
                </div>
                {[
                  { name: 'width', label: 'Width', type: 'number' },
                  { name: 'length', label: 'Length', type: 'number' },
                  { name: 'description', label: 'Description', type: 'text' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof LumberCostFormData]  || ''}
                      onChange={handleInputChange}
                      required
                      disabled={isSaving}
                      className={formErrors[field.name as keyof LumberCostFormData] ? 'border-red-500' : ''}
                    />
                    {formErrors[field.name as keyof LumberCostFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors[field.name as keyof LumberCostFormData]}
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
                    {isSaving ? 'Saving...' : editingLumberCost ? 'Update' : 'Save'}
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
