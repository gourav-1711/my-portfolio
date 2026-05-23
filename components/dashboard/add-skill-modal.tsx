"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import GalleryUpload from "@/components/gallery-upload";
import { Code2, Loader2, X } from "lucide-react";
import { useSkillStore } from "@/lib/store";
import { Skill } from "@/lib/types";

const skillSchema = Yup.object({
  name: Yup.string().required("Skill name is required"),
  img: Yup.mixed()
    .required("Image is required")
    .test("fileSize", "File too large (max 10MB)", (value: any) => {
      if (typeof value === "string") return true;
      if (value instanceof File) return value.size <= 10 * 1024 * 1024;
      return false;
    })
    .test("fileType", "Unsupported file format", (value: any) => {
      if (typeof value === "string") return true;
      if (value instanceof File) return value.type.startsWith("image/");
      return false;
    }),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  proficiency: Yup.number()
    .min(0, "Proficiency must be 0–100")
    .max(100, "Proficiency must be 0–100")
    .required("Proficiency is required"),
});

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Skill | null;
}

export function AddSkillModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddSkillModalProps) {
  const { categories } = useSkillStore();

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      img: (initialData?.img || null) as File | string | null,
      description: initialData?.description || "",
      category: initialData?.category || "Core Web",
      proficiency: initialData?.proficiency || 50,
    },
    enableReinitialize: true,
    validationSchema: skillSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
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

        const skillData = {
          ...values,
          img: imageUrl,
        };

        const url = initialData ? "/api/skills" : "/api/skills"; // Same endpoint, different method
        const method = initialData ? "PUT" : "POST";
        const body = initialData
          ? { id: initialData.id, ...skillData }
          : skillData;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();

        if (data.success) {
          resetForm();
          onSuccess();
          onClose();
        }
      } catch (error) {
        console.error("Failed to add skill:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/90 px-4 py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl border border-border bg-card p-6 shadow-none md:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center border border-border bg-background">
                  <Code2 className="size-5 text-foreground" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {initialData ? "Edit Skill" : "Add Skill"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="border border-border p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="editorial-label mb-1.5 block text-muted-foreground">
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. React, Python"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="modal-input"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="editorial-label mb-1.5 block text-muted-foreground">
                  Category
                </label>
                <select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="modal-input appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-background">
                      {cat}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="mt-1 text-xs text-destructive">
                    {formik.errors.category}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="editorial-label mb-1.5 block text-muted-foreground">
                  Icon / Image
                </label>
                <GalleryUpload
                  maxFiles={1}
                  accept="image/*"
                  initialFiles={
                    initialData?.img
                      ? [
                          {
                            name: "Existing Image",
                            size: 0,
                            type: "image/*",
                            url: initialData.img,
                            id: "existing-image",
                          },
                        ]
                      : []
                  }
                  onFilesChange={(files) => {
                    if (files.length > 0) {
                      const fileWithPreview = files[0];
                      if (fileWithPreview.file instanceof File) {
                        if (
                          fileWithPreview.file.size > 0 &&
                          formik.values.img !== fileWithPreview.file
                        ) {
                          formik.setFieldValue("img", fileWithPreview.file);
                        }
                      }
                    } else {
                      if (formik.values.img !== null) {
                        formik.setFieldValue("img", null);
                      }
                    }
                  }}
                />
                {formik.touched.img && formik.errors.img && (
                  <p className="mt-1 text-xs text-destructive">
                    {String(formik.errors.img)}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="editorial-label mb-1.5 block text-muted-foreground">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Brief description of the skill"
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="modal-input resize-none"
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="mt-1 text-xs text-destructive">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              {/* Proficiency */}
              <div>
                <label className="editorial-label mb-1.5 block text-muted-foreground">
                  Proficiency ({formik.values.proficiency}%)
                </label>
                <input
                  type="range"
                  name="proficiency"
                  min={0}
                  max={100}
                  value={formik.values.proficiency}
                  onChange={formik.handleChange}
                  className="h-2 w-full cursor-pointer appearance-none bg-secondary accent-white"
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                {formik.touched.proficiency && formik.errors.proficiency && (
                  <p className="mt-1 text-xs text-destructive">
                    {String(formik.errors.proficiency)}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="editorial-button mt-2 flex w-full items-center justify-center gap-2 border border-primary bg-primary py-3 text-primary-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Adding...
                  </>
                ) : initialData ? (
                  "Update Skill"
                ) : (
                  "Add Skill"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
