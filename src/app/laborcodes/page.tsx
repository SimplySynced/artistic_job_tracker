'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LaborCode, LaborCodeFormData, LaborCodeSchema } from '@/types';
import { z } from 'zod';
import { LaborCodeTable } from "./table"

export default function LaborCodesManagement() {
  const { toast } = useToast();
  const [laborcodes, setLaborCodes] = useState<LaborCode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLaborCode, setEditingLaborCode] = useState<LaborCode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<LaborCodeFormData>({
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LaborCodeFormData, string>>>({});

  // Fetch labor codes with loading state
  const fetchLaborCodes = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/laborcodes');
      if (!response.ok) throw new Error('Failed to fetch labor codes');
      const data = await response.json();
      const validatedData = z.array(LaborCodeSchema).parse(data);
      setLaborCodes(validatedData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch labor codes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaborCodes();
  }, []);

  // Validate form data using LaborCodeSchema
  const validateForm = (data: LaborCodeFormData): boolean => {
    try {
      const stringData = {
        ...data,
      };

      LaborCodeSchema.parse(stringData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof LaborCodeFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof LaborCodeFormData] = err.message;
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

    if (formErrors[name as keyof LaborCodeFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleEdit = useCallback((job_labor_code: LaborCode): void => {
    setEditingLaborCode(job_labor_code);
    setFormData({
      ...job_labor_code,
    });
    setIsModalOpen(true);
  }, []);

  const handleAddNew = (): void => {
    setEditingLaborCode(null);
    setFormData({
      description: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    if (isSaving) return; // Prevent closing while saving
    setIsModalOpen(false);
    setEditingLaborCode(null);
    setFormData({
      description: '',
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
        ...formData
      };

      const url = editingLaborCode
        ? `/api/laborcodes/${editingLaborCode.id}`
        : '/api/laborcodes';

      const method = editingLaborCode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to save wood');

      await fetchLaborCodes();
      handleModalClose();

      toast({
        title: "Success",
        description: `Lab Code ${editingLaborCode ? 'updated' : 'added'} successfully`,
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

  const handleDelete = async (laborcodedId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this wood type?')) return;

    try {
      const response = await fetch(`/api/laborcodes/${laborcodedId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete labor code');

      await fetchLaborCodes();
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
          <h1 className="text-xl md:text-3xl font-bold">Labor Codes</h1>
        </div>

        <div className="overflow-x-auto">
          <LaborCodeTable
            data={laborcodes}
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
                {editingLaborCode ? 'Edit Labor Codes' : 'Add Labor Codes'}
              </span>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'description', label: 'Description', type: 'text' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.name && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof LaborCodeFormData]}
                      onChange={handleInputChange}
                      required
                      className={formErrors[field.name as keyof LaborCodeFormData] ? 'border-red-500' : ''}
                    />
                    {formErrors[field.name as keyof LaborCodeFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors[field.name as keyof LaborCodeFormData]}
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
                    {isSaving ? 'Saving...' : editingLaborCode ? 'Update' : 'Save'}
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
