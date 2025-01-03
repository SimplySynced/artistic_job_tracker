'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Job, LaborCode, LumberCost, LumberCostFormData, LumberCostSchema, WoodReplacement } from '@/types';
import { z } from 'zod';
import { JobTable } from './table';
import { useParams } from 'next/navigation';

const defaultFormData: LumberCostFormData = {
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
};

export default function TimeManagement() {
  const { id } = useParams(); // Get employee ID from the route params
  const [lumbercosts, setLumberCost] = useState<LumberCost[]>([]);
  const [editingLumberCost, setEditingLumberCost] = useState<LumberCost | null>(null);
  const [woods, setWoodTypes] = useState<WoodReplacement[]>([]);
  const [jobinfo, setJobInfo] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<LumberCostFormData>(defaultFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LumberCostFormData, string>>>({});
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
          await fetchData(`/api/jobs/${id}`, setJobInfo);
          await fetchData(`/api/wood-replacement`, setWoodTypes);
          await fetchData(`/api/job/${id}`, setLumberCost);
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

  if (!jobinfo) {
    return <div className="text-center">Job information not found.</div>;
  }

  const resetForm = () => {
    setFormData(defaultFormData);
    setFormErrors({});
    setEditingLumberCost(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Convert value to number for numeric fields
    const newValue = type === 'number' ? Number(value) || 0 : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (formErrors[name as keyof LumberCostFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEdit = (lumbercost: LumberCost) => {
    setEditingLumberCost(lumbercost);
    setFormData(lumbercost);
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

    const wri = formData.wood_replace_id
    const response = await fetch(`/api/wood-replacement/${wri}`)
    if (!response.ok) {
      const replaceData = await response.json();
      console.log(replaceData.error || "Something went wrong. Please try again.");
      return;
    }
    const replaceData = await response.json();

    // Example usage
    const formattedDate = formatDate(currentDate);
    const thickness = replaceData[0].thickness;
    const itbf = ((formData.width || 0) * (thickness || 0) * (formData.length || 0) * (1 + replaceData[0].waste_factor)) / 144
    const fpp = Math.round(itbf);
    const totalboardfoot = itbf * formData.quantity;
    const total_cost = formData.quantity * fpp * replaceData[0].replacement;

    const finalData = {
      ...formData,
      job_number: Number(id),
      wood_id: Number(replaceData[0].wood_id),
      wood_type: replaceData[0].wood_type,
      wood_replace_id: Number(formData.wood_replace_id),
      quantity: Number(formData.quantity),
      thickness: Number(thickness),
      length: Number(formData.length),
      width: Number(formData.width),
      cost_over: Number(0),
      total_cost: Number(total_cost),
      ft_per_piece: Number(fpp),
      price: Number(0),
      tbf: Number(totalboardfoot),
      entered_by: 'TEST',
      entered_date: formattedDate,
      updated_by: 'TEST',
      updated_date: formattedDate
    };
    //console.log(finalData)
    try {
      LumberCostSchema.parse(finalData);
      setIsSaving(true);

      const url = editingLumberCost
        ? `/api/job/${editingLumberCost.id}`
        : '/api/job/';
      const method = editingLumberCost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      //console.log(response)

      if (!response.ok) throw new Error('Failed to save lumber cost.');

      toast({
        title: 'Success',
        description: `Lumber Cost ${editingLumberCost ? 'updated' : 'added'} successfully.`,
      });

      fetchData(`/api/job/${id}`, setLumberCost, z.array(LumberCostSchema));
      handleModalClose();
    } catch (error) {
      //console.log(error)
      if (error instanceof z.ZodError) {
        setFormErrors(error.flatten().fieldErrors);
      } else {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An error occurred.',
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

      //await fetchTimeSheets();
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
        Lumber Cost Sheet for Job #{id}
        </h1>
        <h3 className="text-md md:text-lg">Job Name: {jobinfo[0].job_customer}</h3>
      </div>

      <JobTable
        data={lumbercosts}
        onEdit={handleEdit}
        onDelete={() => { }}
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
              <span className="text-xl font-bold">{editingLumberCost ? 'Edit TimeSheet' : 'Add TimeSheet'}</span>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'date', label: 'Date ', type: 'date' },
                  { name: 'quantity', label: 'Quantity', type: 'number' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium">{field.label}</label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof LumberCostFormData] || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors[field.name as keyof LumberCostFormData] && (
                      <p className="text-red-500 text-sm">{formErrors[field.name as keyof LumberCostFormData]}</p>
                    )}
                  </div>
                ))}

                {/* Wood Cost Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Wood Type & Thickness <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="wood_replace_id"
                    value={formData.wood_replace_id || ''} // Safely handle nullable values
                    onChange={handleInputChange}
                    required
                    className="block w-full border rounded-md px-3 py-2"
                  >
                    <option value="" disabled>
                      Select Lumber
                    </option>
                    {woods.map((wr) => (
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
                      value={formData[field.name as keyof LumberCostFormData] || ''}
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

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-neutral-900 text-white">
                    {isSaving ? 'Saving...' : editingLumberCost ? 'Update' : 'Save'}
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
