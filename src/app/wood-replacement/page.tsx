'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Wood, WoodReplacement, WoodReplacementFormData, WoodReplacementSchema } from '@/types';
import { z } from 'zod';
import { WoodReplacementTable } from './table';
import { useParams } from 'next/navigation';

const defaultFormData: WoodReplacementFormData = {
  replace_cost_id: 0,
  wood_id: 0,
  wood_type: '',
  thickness: 0,
  waste_factor: 0,
  unit: '',
  replacement: 0,
  price: 0,
  updated_date: '',
};

export default function TimeManagement() {
  const { toast } = useToast();
  const { id } = useParams(); // Get employee ID from the route params
  const [WoodReplacement, setWoodReplacement] = useState<WoodReplacement[]>([]);
  const [editingWoodReplacement, setEditingWoodReplacement] = useState<WoodReplacement | null>(null);
  const [woods, setWoods] = useState<Wood[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<WoodReplacementFormData>(defaultFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof WoodReplacementFormData, string>>>({});
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
    const fetchAllData = async () => {
      try {
        await fetchData(`/api/woods`, setWoods);
        await fetchData(`/api/wood-replacement`, setWoodReplacement);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [fetchData]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  const resetForm = () => {
    setFormData(defaultFormData);
    setFormErrors({});
    setEditingWoodReplacement(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Convert value to number for numeric fields
    const newValue = type === 'number' ? (value === '' ? 0 : Number(value)) : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (formErrors[name as keyof WoodReplacementFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEdit = (woodreplacement: WoodReplacement) => {
    setEditingWoodReplacement(woodreplacement);
    setFormData(woodreplacement);
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
    const woodInfo = woods.find((item) => item.id ===  Number(formData.wood_id));
    console.log(woodInfo)
    //console.log(formData)

    try {
      // Update the formData with calculated hours and minutes
      const updatedFormData = {
        ...formData,
        wood_type: woodInfo?.wood_type,
        wood_id: woodInfo?.id,
        price: 0,
        updated_date: new Date().toISOString().split('T')[0], // Set current date,
      };

      // Validate the updated formData
      WoodReplacementSchema.parse(updatedFormData);

      setIsSaving(true);

      const url = editingWoodReplacement
        ? `/api/wood-replacement/${editingWoodReplacement.replace_cost_id}`
        : '/api/wood-replacement/';
      const method = editingWoodReplacement ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) throw new Error('Failed to save Wood Replacement.');

      toast({
        title: 'Success',
        description: `Wood Replacement ${editingWoodReplacement ? 'updated' : 'added'} successfully.`,
      });

      fetchData(`/api/wood-replacement/`, setWoodReplacement);
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
  const handleDelete = async (woodreplacementId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this wood replacement?')) return;

    try {
      const response = await fetch(`/api/wood-replacement/${woodreplacementId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete wood replacement');

      await fetchData(`/api/wood-replacement/`, setWoodReplacement);
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

      <WoodReplacementTable
        data={WoodReplacement}
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
              <span className="text-xl font-bold">{editingWoodReplacement ? 'Edit Wood Replacement' : 'Add Wood Replacement'}</span>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Wood ID*/}
                <div>
                  <label className="block text-sm font-medium">Wood Type</label>
                  <select
                    name="wood_id"
                    value={formData.wood_id || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a Wood Type</option>
                    {woods.map((wt) => (
                      <option key={wt.id} value={wt.id}>
                        {wt.wood_type}
                      </option>
                    ))}
                  </select>
                </div>

                {[
                  { name: 'replace_cost_id', label: 'Replace Cost ID', type: 'number' },
                  { name: 'thickness', label: 'Thickness (ft)', type: 'number' },
                  { name: 'waste_factor', label: 'Waste Factor', type: 'number' },
                  { name: 'unit', label: 'Unit', type: 'text' },
                  { name: 'replacement', label: 'Replacement', type: 'number' }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium">{field.label}</label>
                    <Input
                      name={field.name}
                      type={field.type}
                      step='.25'
                      value={formData[field.name as keyof WoodReplacementFormData]?.toString() || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors[field.name as keyof WoodReplacementFormData] && (
                      <p className="text-red-500 text-sm">{formErrors[field.name as keyof WoodReplacementFormData]}</p>
                    )}
                  </div>
                ))}

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-neutral-900 text-white">
                    {isSaving ? 'Saving...' : editingWoodReplacement ? 'Update' : 'Save'}
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
