"use client";

import { useQuery } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { X, Loader2, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { clsx } from "clsx";
import GalleryUpload from "@/components/gallery-upload";
import { Category, Project } from "@/lib/types";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Project | null;
}

const projectSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  // Changed to mixed to allow File object or string URL
  img: Yup.mixed()
    .required("Image is required")
    .test("fileSize", "File too large (max 10MB)", (value) => {
      if (typeof value === "string") return true; // It's a URL
      return value instanceof File && value.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (typeof value === "string") return true;
      return value instanceof File && value.type.startsWith("image/");
    }),

  category: Yup.array()
    .of(Yup.string())
    .min(1, "At least one category is required"),
  tags: Yup.array().of(Yup.string()).min(1, "At least one tag is required"),
  liveUrl: Yup.string().url("Invalid URL").nullable(),
  githubUrl: Yup.string().url("Invalid URL").nullable(),
  gradient: Yup.string().required("Gradient class is required"),
});

const gradients = [
  { name: "Graphite", class: "bg-[#1a1a1a]" },
  { name: "Charcoal", class: "bg-[#242424]" },
  { name: "Slate", class: "bg-[#2f2f2f]" },
  { name: "Ash", class: "bg-[#3a3a3a]" },
  { name: "Ink", class: "bg-[#0e0e0e]" },
];

export function AddProjectModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddProjectModalProps) {
  const [submissionError, setSubmissionError] = useState("");
  const [isGradientOpen, setIsGradientOpen] = useState(false);

  // Fetch Categories Dynamically
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      return data.data as Category[];
    },
    enabled: isOpen, // Only fetch when modal is open
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-border bg-card shadow-none"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 border border-border p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <X className="size-5" />
          </button>

          <div className="p-6 md:p-8">
            <h2 className="mb-2 font-serif text-3xl font-semibold text-foreground">
              {initialData ? "Edit Project" : "Add New Project"}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Showcase your latest work to the world.
            </p>

            <Formik
              initialValues={{
                title: initialData?.title || "",
                description: initialData?.description || "",
                img: initialData?.img || (null as File | string | null),
                category: initialData?.category || ([] as string[]),
                tags: initialData?.tags || [""],
                liveUrl: initialData?.liveUrl || "",
                githubUrl: initialData?.githubUrl || "",
                gradient: initialData?.gradient || gradients[0].class,
              }}
              validationSchema={projectSchema}
              enableReinitialize // Important to update initialValues when categories load
              onSubmit={async (values, { setSubmitting }) => {
                setSubmissionError("");
                try {
                  let imageUrl = values.img;

                  // Upload image if it's a File
                  if (values.img instanceof File) {
                    const formData = new FormData();
                    formData.append("file", values.img);

                    const uploadRes = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });

                    if (!uploadRes.ok) throw new Error("Image upload failed");

                    const uploadData = await uploadRes.json();
                    imageUrl = uploadData.url;
                  }

                  // Create project with the image URL
                  const projectData = {
                    ...values,
                    img: imageUrl,
                  };

                  const url = initialData ? "/api/projects" : "/api/projects";
                  const method = initialData ? "PUT" : "POST";
                  const body = initialData
                    ? { id: initialData.id, ...projectData }
                    : projectData;

                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                  });
                  const data = await res.json();

                  if (data.success) {
                    onSuccess();
                    onClose();
                  } else {
                    setSubmissionError(data.message || "Failed to add project");
                  }
                } catch (error) {
                  setSubmissionError(
                    error instanceof Error
                      ? error.message
                      : "Network error. Please try again.",
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Title & Category Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="editorial-label mb-1 block text-muted-foreground">
                        Project Title
                      </label>
                      <Field
                        name="title"
                        className="modal-input"
                        placeholder="e.g. AI Portfolio"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="mt-1 text-xs text-destructive"
                      />
                    </div>
                    <div>
                      <label className="editorial-label mb-1 block text-muted-foreground">
                        Category
                      </label>
                      <MultiSelect
                        options={categories.map((cat) => ({
                          value: cat.name,
                          label: cat.name,
                        }))}
                        selected={values.category}
                        onChange={(selected) =>
                          setFieldValue("category", selected)
                        }
                        placeholder="Select categories…"
                        isLoading={isLoadingCategories}
                      />
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="mt-1 text-xs text-destructive"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="editorial-label mb-1 block text-muted-foreground">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={3}
                      className="modal-input resize-none"
                      placeholder="Brief overview of the project..."
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="mt-1 text-xs text-destructive"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="editorial-label mb-1 block text-muted-foreground">
                      Project Image (Max 10MB)
                    </label>
                    <GalleryUpload
                      maxFiles={1}
                      maxSize={10 * 1024 * 1024} // 10MB
                      accept="image/*"
                      initialFiles={
                        initialData?.img
                          ? [
                              {
                                id: "existing-project-image",
                                file: new File([], "existing_image", {
                                  type: "image/jpeg",
                                }),
                                url: initialData.img, // Changed from preview to url
                                name: "Existing Image",
                                size: 1024 * 1024,
                                type: "image/jpeg",
                              } as any,
                            ]
                          : []
                      }
                      onFilesChange={(files) => {
                        if (files.length > 0) {
                          // GalleryUpload returns FileWithPreview[]
                          // We need the actual File object
                          const fileWithPreview = files[0];
                          if (fileWithPreview.file instanceof File) {
                            // Only update if the file is different to avoid infinite loops
                            if (values.img !== fileWithPreview.file) {
                              setFieldValue("img", fileWithPreview.file);
                            }
                          }
                        } else {
                          // Only update if it's not already null
                          if (values.img !== null) {
                            setFieldValue("img", null);
                          }
                        }
                      }}
                      className="w-full"
                    />
                    <ErrorMessage
                      name="img"
                      component="div"
                      className="mt-1 text-xs text-destructive"
                    />
                  </div>

                  {/* URLs Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="editorial-label mb-1 block text-muted-foreground">
                        Live Demo URL{" "}
                        <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <Field
                        name="liveUrl"
                        className="modal-input"
                        placeholder="https://..."
                      />
                      <ErrorMessage
                        name="liveUrl"
                        component="div"
                        className="mt-1 text-xs text-destructive"
                      />
                    </div>
                    <div>
                      <label className="editorial-label mb-1 block text-muted-foreground">
                        GitHub URL{" "}
                        <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <Field
                        name="githubUrl"
                        className="modal-input"
                        placeholder="https://github.com/..."
                      />
                      <ErrorMessage
                        name="githubUrl"
                        component="div"
                        className="mt-1 text-xs text-destructive"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="editorial-label mb-2 block text-muted-foreground">
                      Tech Stack Tags
                    </label>
                    <FieldArray name="tags">
                      {({ push, remove }) => (
                        <div className="flex flex-wrap gap-2">
                          {values.tags.map((_, index) => (
                            <div key={index} className="relative group">
                              <Field
                                name={`tags.${index}`}
                                className="w-24 border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                                placeholder="Tag"
                              />
                              {values.tags.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="absolute -right-1 -top-1 border border-destructive bg-background p-0.5 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <X className="size-3" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => push("")}
                            className="flex items-center gap-1 border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                          >
                            <Plus className="size-3" /> Add
                          </button>
                        </div>
                      )}
                    </FieldArray>
                    <ErrorMessage
                      name="tags"
                      component="div"
                      className="mt-1 text-xs text-destructive"
                    />
                  </div>

                  {/* Gradient Picker */}
                  <div className="relative">
                    <label className="editorial-label mb-2 block text-muted-foreground">
                      Card Tone Metadata
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsGradientOpen(!isGradientOpen)}
                      className="flex w-full items-center justify-between border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={clsx(
                            "size-6 border border-border bg-secondary",
                            values.gradient,
                          )}
                        />
                        <span className="text-sm text-foreground">
                          {gradients.find((g) => g.class === values.gradient)
                            ?.name || "Select Gradient"}
                        </span>
                      </div>
                      <ChevronDown
                        className={clsx(
                          "size-4 text-muted-foreground transition-transform",
                          isGradientOpen && "rotate-180",
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {isGradientOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 mt-2 w-full overflow-hidden border border-border bg-card shadow-none"
                        >
                          {gradients.map((grad) => (
                            <button
                              key={grad.name}
                              type="button"
                              onClick={() => {
                                setFieldValue("gradient", grad.class);
                                setIsGradientOpen(false);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary"
                            >
                              <div
                                className={clsx(
                                  "size-6 border border-border bg-secondary",
                                  grad.class,
                                )}
                              />
                              <span
                                className={clsx(
                                  "text-sm",
                                  values.gradient === grad.class
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {grad.name}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {submissionError && (
                    <div className="border border-destructive/50 bg-background p-3 text-sm text-destructive">
                      {submissionError}
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="editorial-button"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 data-icon="inline-start" className="animate-spin" />
                          Saving...
                        </>
                      ) : initialData ? (
                        "Update Project"
                      ) : (
                        "Add Project"
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
