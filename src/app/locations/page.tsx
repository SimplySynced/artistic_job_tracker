'use client'
import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Location, LocationFormData, LocationSchema } from '@/types';
import { z } from 'zod';
import { LuPencilLine, LuTrash2 } from "react-icons/lu";

export default function LocationManagement() {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<LocationFormData>({
    location: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LocationFormData, string>>>({});

  const initialFormData: LocationFormData = {
    location: '',
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async (): Promise<void> => {
    try {
      const response = await fetch('/api/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      const validatedData = z.array(LocationSchema).parse(data);
      setLocations(validatedData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch locations",
        variant: "destructive",
      });
    }
  };

  const validateForm = (data: LocationFormData): boolean => {
    try {
      const stringData = {
        ...data,
        location: data.location,
      };

      LocationSchema.parse(stringData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof LocationFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof LocationFormData] = err.message;
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

    if (formErrors[name as keyof LocationFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleEdit = (locations: Location): void => {
    setEditingLocation(locations);
    setFormData({
      ...locations,
      location: locations.location.toString(),
    });
    setIsModalOpen(true);
  };

  const handleAddNew = (): void => {
    setEditingLocation(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setEditingLocation(null);
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
        location: formData.location,
      };

      const url = editingLocation
        ? `/api/locations/${editingLocation.id}`
        : '/api/locations';

      const method = editingLocation ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to save location');

      await fetchLocations();
      handleModalClose();

      toast({
        title: "Success",
        description: `Employee ${editingLocation ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (locationId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      await fetchLocations();
      toast({
        title: "Success",
        description: "Employee deleted successfully",
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
  const LocationCard = ({ location }: { location: Location }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{location.location}</h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleEdit(location)}
              className="bg-sky-500 text-white text-xs px-3 py-1"
            >
              <LuPencilLine />
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(location.id!)}
              className="bg-red-500 text-white text-xs px-3 py-1"
            >
              <LuTrash2 />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <h3 className="text-gray-500 font-medium">Location</h3>
            <p className='text-sm'>{location.location}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">Locations</h1>
        <Button onClick={handleAddNew} className="bg-neutral-900 text-white">
          Add Location
        </Button>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-neutral-900 text-white text-center font-semibold">Location</TableHead>
              <TableHead className="bg-neutral-900 text-white text-center font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id} className="hover:bg-neutral-100 bg-white">
                <TableCell className="font-medium text-center">
                  <div className="truncate">
                    {location.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(location)}
                      className="size-8 text-white bg-sky-500 hover:bg-sky-600"
                    >
                      <LuPencilLine />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(location.id!)}
                      className="size-8 text-white bg-red-500 hover:bg-red-600"
                    >
                      <LuTrash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <div className="fixed inset-0 bg-white/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4">
              <h2 className="text-lg md:text-xl font-bold mt-0">
                {editingLocation ? 'Edit Location' : 'Add Location'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'location', label: 'Location', type: 'text' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.name && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name as keyof LocationFormData]}
                      onChange={handleInputChange}
                      className={`w-full ${formErrors[field.name as keyof LocationFormData] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[field.name as keyof LocationFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors[field.name as keyof LocationFormData]}
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
                    {editingLocation ? 'Update' : 'Save'}
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
