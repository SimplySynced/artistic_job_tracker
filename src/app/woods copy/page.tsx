'use client'
import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Wood, WoodFormData, WoodSchema } from '@/types';
import { z } from 'zod';
import { LuPencilLine, LuTrash2 } from "react-icons/lu";

import { WoodTable } from "./table"

export default function WoodManagement() {
  const [woods, setWoods] = useState<Wood[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWood, setEditingWood] = useState<Wood | null>(null);
  const [formData, setFormData] = useState<WoodFormData>({
    wood_type: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof WoodFormData, string>>>({});

  const initialFormData: WoodFormData = {
    wood_type: '',
  };

  useEffect(() => {
    fetchWoods();
  }, []);

  const fetchWoods = async (): Promise<void> => {
    try {
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
    }
  };

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

  const handleEdit = (wood: Wood): void => {
    setEditingWood(wood);
    setFormData({
      ...wood,
      wood_type: wood.wood_type.toString(),
    });
    setIsModalOpen(true);
  };

  const handleAddNew = (): void => {
    setEditingWood(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setEditingWood(null);
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
        wood_type: parseFloat(formData.wood_type),
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

  // New function to render employee card for mobile view
  const WoodCard = ({ wood }: { wood: Wood }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{wood.wood_type} </h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleEdit(wood)}
              className="bg-sky-500 text-white text-xs px-3 py-1"
            >
              <LuPencilLine />
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(wood.id!)}
              className="bg-red-500 text-white text-xs px-3 py-1"
            >
              <LuTrash2 />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <h3 className="text-gray-500 font-medium">Wood Type</h3>
            <p className='text-sm'>{wood.wood_type}</p>
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
        <WoodTable
          data={woods}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {woods.map((wood) => (
          <WoodCard key={wood.id} wood={wood} />
        ))}
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4">
              <h2 className="text-lg md:text-xl font-bold mt-0">
                {editingWood ? 'Edit Wood Type' : 'Add Wood Type'}
              </h2>
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
                      className={`w-full ${formErrors[field.name as keyof WoodFormData] ? 'border-red-500' : ''}`}
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
                    className="w-full md:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-neutral-900 text-white w-full md:w-auto"
                  >
                    {editingWood ? 'Update' : 'Save'}
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
