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
        <Loader2 className="size-8 animate-spin text-foreground" />
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
    <div className="border border-border bg-card p-6 md:p-8">
      <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground">
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
                  <label className="editorial-label mb-1 block text-muted-foreground">
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
                    className="mt-1 text-xs text-destructive"
                  />
                </div>

                <div>
                  <label className="editorial-label mb-1 block text-muted-foreground">
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
                    className="mt-1 text-xs text-destructive"
                  />
                </div>

                <div>
                  <label className="editorial-label mb-1 block text-muted-foreground">
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
                    <div className="mt-2 text-xs text-muted-foreground">
                      Current Banner:{" "}
                      <a
                        href={values.bannerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground hover:underline"
                      >
                        View
                      </a>
                    </div>
                  )}

                  <div className="mt-1 text-xs text-destructive">
                    <ErrorMessage name="bannerUrl" />
                    {/* Explicitly handle object errors if necessary, but string conversion is safer */}
                    {typeof errors.bannerUrl === "string"
                      ? errors.bannerUrl
                      : null}
                  </div>
                </div>

                <div>
                  <label className="editorial-label mb-1 block text-muted-foreground">
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
                    className="mt-1 text-xs text-destructive"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="editorial-label mb-2 block text-muted-foreground">
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
                              className="border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                            className="editorial-label mt-1 flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="size-3" /> Add Word
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage
                    name="typewriterWords"
                    component="div"
                    className="mt-1 text-xs text-destructive"
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="editorial-label mb-3 text-muted-foreground">
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
                        className="mt-1 text-xs text-destructive"
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
                        className="mt-1 text-xs text-destructive"
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
                        className="mt-1 text-xs text-destructive"
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
                        className="mt-1 text-xs text-destructive"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-border pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || updateHeroMutation.isPending}
                className="editorial-button"
              >
                {isSubmitting || updateHeroMutation.isPending ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Save data-icon="inline-start" />
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
