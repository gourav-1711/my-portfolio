"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

// Validation Schema
const categorySchema = Yup.object({
  name: Yup.string().required("Category name is required"),
});

interface Category {
  id: string;
  name: string;
}

export default function CategoriesManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch Categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    staleTime: 1000 * 60 * 15,
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      return data.data as Category[];
    },
  });

  // Add Category Mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: { name: string }) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsModalOpen(false);
    },
  });

  // Delete Category Mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Categories</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((cat) => (
            <div
              key={cat.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center group hover:bg-white/10 transition-colors"
            >
              <span className="text-gray-200 font-medium">{cat.name}</span>
              <button
                onClick={() => deleteCategoryMutation.mutate(cat.id)}
                disabled={deletingId === cat.id}
                className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-100 disabled:cursor-not-allowed"
              >
                {deletingId === cat.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
          {categories?.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-4">
              No categories found. Add one to get started.
            </p>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-semibold text-white mb-6">
                Add New Category
              </h3>

              <Formik
                initialValues={{ name: "" }}
                validationSchema={categorySchema}
                onSubmit={(values, { resetForm }) => {
                  addCategoryMutation.mutate(values);
                  resetForm();
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Category Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="modal-input"
                        placeholder="e.g. Web Development"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting || addCategoryMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700 text-white w-full flex items-center justify-center"
                      >
                        {isSubmitting || addCategoryMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Category
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
