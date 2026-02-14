"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import GalleryUpload from "@/components/gallery-upload";
import { Loader2, Sparkles, X } from "lucide-react";
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
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {initialData ? "Edit Skill" : "Add Skill"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
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
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
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
                    <option key={cat} value={cat} className="bg-neutral-900">
                      {cat}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.category}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
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
                  <p className="mt-1 text-xs text-red-400">
                    {String(formik.errors.img)}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
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
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              {/* Proficiency */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Proficiency ({formik.values.proficiency}%)
                </label>
                <input
                  type="range"
                  name="proficiency"
                  min={0}
                  max={100}
                  value={formik.values.proficiency}
                  onChange={formik.handleChange}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                {formik.touched.proficiency && formik.errors.proficiency && (
                  <p className="mt-1 text-xs text-red-400">
                    {String(formik.errors.proficiency)}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
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
