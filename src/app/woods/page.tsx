'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Wood, WoodFormData, WoodSchema } from '@/types';
import { z } from 'zod';
import { WoodTable } from "./table"

export default function WoodManagement() {
  const { toast } = useToast();
  const [woods, setWoods] = useState<Wood[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWood, setEditingWood] = useState<Wood | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<WoodFormData>({
    wood_type: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof WoodFormData, string>>>({});

  const fetchWoods = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/woods');
      if (!response.ok) throw new Error('Failed to fetch woods');
      const data = await response.json();
      const validatedData = z.array(WoodSchema).parse(data);
      setWoods(validatedData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch woods",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWoods();
  }, []);

  // Validate form data using WoodSchema
  const validateForm = (data: WoodFormData): boolean => {
    try {
      const stringData = {
        ...data,
        wood_type: data.wood_type,
      };
      WoodSchema.parse(stringData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof WoodFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof WoodFormData] = err.message;
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

    if (formErrors[name as keyof WoodFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleEdit = useCallback((wood: Wood): void => {
    setEditingWood(wood);
    setFormData({
      ...wood,
      wood_type: wood.wood_type.toString(),
    });
    setIsModalOpen(true);
  }, []);

  const handleAddNew = (): void => {
    setEditingWood(null);
    setFormData({
      wood_type: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    if (isSaving) return; // Prevent closing while saving
    setIsModalOpen(false);
    setEditingWood(null);
    setFormData({
      wood_type: '',
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
      const submissionData = {
        ...formData,
        wood_type: formData.wood_type,
      };

      const url = editingWood
        ? `/api/woods/${editingWood.id}`
        : '/api/woods';

      const method = editingWood ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to save wood');

      await fetchWoods();
      handleModalClose();

      toast({
        title: "Success",
        description: `Wood type ${editingWood ? 'updated' : 'added'} successfully`,
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

  const handleDelete = async (woodId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this wood type?')) return;

    try {
      const response = await fetch(`/api/woods/${woodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete wood');

      await fetchWoods();
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

  return (
    <>
      <div className="max-w-screen-2xl mx-auto py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold">Wood Types</h1>
        </div>

        <div className="overflow-x-auto">
          <WoodTable
            data={woods}
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
                {editingWood ? 'Edit Wood Type' : 'Add Wood Type'}
              </span>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'wood_type', label: 'Wood Type', type: 'text' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.name && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof WoodFormData]}
                      onChange={handleInputChange}
                      required
                      disabled={isSaving}
                      className={formErrors[field.name as keyof WoodFormData] ? 'border-red-500' : ''}
                    />
                    {formErrors[field.name as keyof WoodFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors[field.name as keyof WoodFormData]}
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
                    {isSaving ? 'Saving...' : editingWood ? 'Update' : 'Save'}
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
