"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Loader2, Save, Trash2, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GalleryUpload from "@/components/gallery-upload";

// Validation Schema
const heroSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  typewriterWords: Yup.array()
    .of(Yup.string().required("Word cannot be empty"))
    .min(1, "At least one word is required"),
  bannerUrl: Yup.mixed()
    .required("Banner Image is required")
    .test("fileSize", "File too large (max 10MB)", (value) => {
      if (typeof value === "string") return true;
      if (value instanceof File) return value.size <= 10 * 1024 * 1024;
      return false;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (typeof value === "string") return true;
      if (value instanceof File) return value.type.startsWith("image/");
      return false;
    }),
  resumeUrl: Yup.string().url("Must be a valid URL").nullable(),
  socialLinks: Yup.object({
    github: Yup.string().url("Must be a valid URL"),
    linkedin: Yup.string().url("Must be a valid URL"),
    instagram: Yup.string().url("Must be a valid URL"),
    email: Yup.string().email("Must be a valid email"),
  }),
});

interface HeroData {
  title: string;
  description: string;
  typewriterWords: string[];
  bannerUrl: string | File | null;
  resumeUrl: string | null;
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    email: string;
  };
}

export default function HeroEditor() {
  const queryClient = useQueryClient();

  // Fetch Hero Data
  const { data: heroData, isLoading } = useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const res = await fetch("/api/hero");
      const data = await res.json();
      return data.data as HeroData;
    },
  });

  // Update Hero Mutation
  const updateHeroMutation = useMutation({
    mutationFn: async (values: HeroData) => {
      // Handle File Uploads
      let bannerUrl = values.bannerUrl;
      let resumeUrl = values.resumeUrl;

      if (values.bannerUrl instanceof File) {
        const formData = new FormData();
        formData.append("file", values.bannerUrl);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Banner upload failed");
        const uploadData = await uploadRes.json();
        bannerUrl = uploadData.url;
      }

      // Resume is now just a string URL, no upload needed

      const payload = {
        ...values,
        bannerUrl,
        resumeUrl,
      };

      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
      toast.success("Hero section updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update hero section.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const initialValues: HeroData = heroData || {
    title: "",
    description: "",
    typewriterWords: ["Developer", "Designer", "Creator"],
    bannerUrl: "",
    resumeUrl: "",
    socialLinks: {
      github: "",
      linkedin: "",
      instagram: "",
      email: "",
    },
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Edit Hero Section
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={heroSchema}
        enableReinitialize
        onSubmit={(values) => {
          updateHeroMutation.mutate(values);
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Main Title
                  </label>
                  <Field
                    name="title"
                    className="modal-input"
                    placeholder="e.g. Creative FullStack Developer"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    className="modal-input resize-none"
                    placeholder="Short bio..."
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Banner Image
                  </label>
                  <GalleryUpload
                    maxFiles={1}
                    maxSize={10 * 1024 * 1024} // 10MB
                    accept="image/*"
                    initialFiles={[]}
                    onFilesChange={(files) => {
                      if (files.length > 0) {
                        const fileWithPreview = files[0];
                        if (fileWithPreview.file instanceof File) {
                          if (values.bannerUrl !== fileWithPreview.file) {
                            setFieldValue("bannerUrl", fileWithPreview.file);
                          }
                        }
                      } else {
                        if (values.bannerUrl !== null) {
                          //   setFieldValue("bannerUrl", ""); // Or null? The schema requires it. Let's keep existing logic or empty string if cleared.
                          // BE CAREFUL: If user clears it, we probably want to clear it.
                          // But initialFiles logic in GalleryUpload is a bit complex if not provided.
                          // For now, if user clears, we set it to null/empty.
                          setFieldValue("bannerUrl", null);
                        }
                      }
                    }}
                  />
                  {/* We might need to handle initial preview for existing URL. GalleryUpload doesn't seem to support showing existing URL as preview easily without FileMetadata. 
                       However, the user wants to upload image. 
                       If there is an existing URL, we should probably show it or let GalleryUpload handle it?
                       GalleryUpload takes `initialFiles`. We can construct one if it's a string.
                   */}
                  {typeof values.bannerUrl === "string" && values.bannerUrl && (
                    <div className="mt-2 text-xs text-gray-400">
                      Current Banner:{" "}
                      <a
                        href={values.bannerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View
                      </a>
                    </div>
                  )}

                  <div className="text-red-500 text-xs mt-1">
                    <ErrorMessage name="bannerUrl" />
                    {/* Explicitly handle object errors if necessary, but string conversion is safer */}
                    {typeof errors.bannerUrl === "string"
                      ? errors.bannerUrl
                      : null}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Resume URL (Drive/Dropbox/etc)
                  </label>
                  <Field
                    name="resumeUrl"
                    className="modal-input"
                    placeholder="https://example.com/resume.pdf"
                  />
                  <ErrorMessage
                    name="resumeUrl"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Typewriter Effect Words
                  </label>
                  <FieldArray name="typewriterWords">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.typewriterWords.map((_, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              name={`typewriterWords.${index}`}
                              className="modal-input flex-1"
                              placeholder="Word"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-1"
                        >
                          <Plus className="w-3 h-3" /> Add Word
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage
                    name="typewriterWords"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Social Links
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Field
                        name="socialLinks.github"
                        className="modal-input"
                        placeholder="GitHub URL"
                      />
                      <ErrorMessage
                        name="socialLinks.github"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        name="socialLinks.linkedin"
                        className="modal-input"
                        placeholder="LinkedIn URL"
                      />
                      <ErrorMessage
                        name="socialLinks.linkedin"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        name="socialLinks.instagram"
                        className="modal-input"
                        placeholder="Instagram URL"
                      />
                      <ErrorMessage
                        name="socialLinks.instagram"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        name="socialLinks.email"
                        className="modal-input"
                        placeholder="Email Address"
                      />
                      <ErrorMessage
                        name="socialLinks.email"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10">
              <Button
                type="submit"
                disabled={isSubmitting || updateHeroMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
              >
                {isSubmitting || updateHeroMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
