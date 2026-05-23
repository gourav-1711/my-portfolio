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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-3xl font-semibold text-foreground">
          Categories
        </h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="editorial-button"
        >
          <Plus data-icon="inline-start" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((cat) => (
            <div
              key={cat.id}
              className="group flex items-center justify-between border border-border bg-card p-5 transition-colors hover:bg-secondary"
            >
              <span className="font-medium text-foreground">{cat.name}</span>
              <button
                onClick={() => deleteCategoryMutation.mutate(cat.id)}
                disabled={deletingId === cat.id}
                className="text-muted-foreground opacity-0 transition-colors hover:text-destructive disabled:cursor-not-allowed disabled:opacity-100 group-hover:opacity-100"
              >
                {deletingId === cat.id ? (
                  <Loader2 className="size-4 animate-spin text-destructive" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </button>
            </div>
          ))}
          {categories?.length === 0 && (
            <p className="col-span-full py-4 text-center text-muted-foreground">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm border border-border bg-card p-6 shadow-none"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
              <h3 className="mb-6 font-serif text-2xl font-semibold text-foreground">
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
                      <label className="editorial-label mb-1 block text-muted-foreground">
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
                        className="editorial-button flex w-full items-center justify-center"
                      >
                        {isSubmitting || addCategoryMutation.isPending ? (
                          <>
                            <Loader2 data-icon="inline-start" className="animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus data-icon="inline-start" />
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
