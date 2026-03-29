import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { FaStar, FaHeart, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { AuthContext } from "../../../providers/AuthProvider";
import Swal from "sweetalert2";

const IMAGE_HOSTING_API = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`;

const inputCls =
  "w-full rounded-lg border border-[#d8c3a6] bg-[#faf7f2] px-4 py-2.5 text-sm text-[#18100a] outline-none transition focus:border-[#d4833a] focus:bg-[#fffcf6] focus:ring-4 focus:ring-[#d4833a]/10";

const textareaCls =
  "w-full min-h-[110px] resize-y rounded-lg border border-[#d8c3a6] bg-[#faf7f2] px-4 py-3 text-sm leading-7 text-[#18100a] outline-none transition placeholder:text-[#c8b49a] focus:border-[#d4833a] focus:bg-[#fffcf6] focus:ring-4 focus:ring-[#d4833a]/10";

const GotMarriedForm = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [form, setForm] = useState({
    selfBiodataId: "",
    partnerBiodataId: "",
    successStory: "",
    marriageDate: "",
    reviewStar: 0,
  });

  const [coupleImageUrl, setCoupleImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);

  const { data: myBiodata, isLoading: bioLoading } = useQuery({
    queryKey: ["my-biodata", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/biodatas/mine");
        return res.data;
      } catch {
        return null;
      }
    },
  });

  const { data: contactRequests = [], isLoading: reqLoading } = useQuery({
    queryKey: ["my-contact-requests"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/contact-requests/mine");
      return res.data;
    },
  });

  const approvedPartners = contactRequests.filter((r) => r.status === "approved");

  useEffect(() => {
    if (myBiodata?.biodataId) {
      setForm((prev) => ({ ...prev, selfBiodataId: myBiodata.biodataId }));
    }
  }, [myBiodata]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePartnerSelect = (partner) => {
    setForm((prev) => ({ ...prev, partnerBiodataId: partner.biodataId }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axiosPublic.post(IMAGE_HOSTING_API, formData, {
        headers: { "content-type": "multipart/form-data" },
      });

      if (res.data.success) {
        setCoupleImageUrl(res.data.data.url);
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Image upload failed",
        background: "#fffcf6",
        color: "#18100a",
      });
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setCoupleImageUrl("");
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.selfBiodataId ||
      !form.partnerBiodataId ||
      !form.successStory ||
      !form.marriageDate ||
      !form.reviewStar
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Please fill in all required fields.",
        background: "#fffcf6",
        color: "#18100a",
      });
    }

    setSubmitting(true);

    try {
      await axiosSecure.post("/success-stories", {
        ...form,
        coupleImage: coupleImageUrl,
      });

      Swal.fire({
        icon: "success",
        title: "Story Submitted!",
        text: "Thank you for sharing your happy story with the BandhanBD community.",
        background: "#fffcf6",
        color: "#18100a",
        iconColor: "#d4833a",
        timer: 2500,
        showConfirmButton: false,
      });

      setForm({
        selfBiodataId: myBiodata?.biodataId || "",
        partnerBiodataId: "",
        successStory: "",
        marriageDate: "",
        reviewStar: 0,
      });
      setCoupleImageUrl("");
      setImagePreview("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || "Please try again.",
        background: "#fffcf6",
        color: "#18100a",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPartner = approvedPartners.find(
    (p) => p.biodataId === parseInt(form.partnerBiodataId)
  );

  return (
    <>
      <Helmet>
        <title>Got Married — BandhanBD</title>
      </Helmet>

      <div className="mx-auto max-w-[620px]">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#c07030]">
            <span className="h-px w-[18px] bg-current opacity-50" />
            Got Married
          </div>

          <h1 className="mb-1 text-3xl font-bold tracking-tight text-[#18100a]">
            Share Your Story
          </h1>

          <p className="text-sm text-[#9a8270]">
            Found your life partner through BandhanBD? Inspire others by sharing your journey.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e4d3bc] bg-[#fffcf6] shadow-[0_2px_20px_rgba(180,140,80,0.07)]">
          <div className="border-b border-[#e9dccb] p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c07030]">
              <span className="h-px w-4 bg-current opacity-50" />
              Your Biodata
            </div>

            {bioLoading ? (
              <div className="rounded-xl border border-dashed border-[#d8c3a6] px-5 py-4 text-center text-sm font-light text-[#9a8270]">
                Loading your profile…
              </div>
            ) : myBiodata ? (
              <div className="flex flex-col gap-4 rounded-xl border border-[#d8c3a6] bg-[#f5ede0] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#9a8270]">
                    Auto-detected profile
                  </span>
                  <span className="text-sm font-semibold text-[#18100a]">
                    {myBiodata.name}
                  </span>
                  <span className="text-xs text-[#9a8270]">
                    {myBiodata.occupation} · {myBiodata.permanentDivision}
                  </span>
                </div>

                <div className="text-right text-[#d4833a]">
                  <div className="text-3xl font-bold leading-none">
                    #{myBiodata.biodataId}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#9a8270]">
                    Biodata ID
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#d8c3a6] px-5 py-4 text-center text-sm font-light text-[#9a8270]">
                You don't have a biodata yet.{" "}
                <a
                  href="/dashboard/edit-biodata"
                  className="font-medium text-[#c07030] hover:underline"
                >
                  Create one first →
                </a>
              </div>
            )}
          </div>

          <div className="border-b border-[#e9dccb] p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c07030]">
              <span className="h-px w-4 bg-current opacity-50" />
              Your Partner
            </div>

            {reqLoading ? (
              <div className="rounded-xl border border-dashed border-[#d8c3a6] px-5 py-4 text-center text-sm font-light text-[#9a8270]">
                Loading your matches…
              </div>
            ) : approvedPartners.length > 0 ? (
              <>
                <p className="mb-3 text-xs font-light text-[#9a8270]">
                  Select from your approved contact requests:
                </p>

                <div className="flex flex-col gap-2">
                  {approvedPartners.map((partner) => {
                    const isSelected =
                      parseInt(form.partnerBiodataId) === partner.biodataId;

                    return (
                      <div
                        key={partner._id}
                        onClick={() => handlePartnerSelect(partner)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                          isSelected
                            ? "border-[#d4833a] bg-[#fffcf6] shadow-[0_0_0_2px_rgba(212,131,58,0.12)]"
                            : "border-[#e4d3bc] bg-[#faf7f2] hover:border-[#d4833a]/40 hover:bg-[#fffcf6]"
                        }`}
                      >
                        {partner.profileImage ? (
                          <img
                            src={partner.profileImage}
                            alt={partner.biodataName}
                            className="h-10 w-10 rounded-full border border-[#d8c3a6] object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4833a]/20 bg-[#d4833a]/10 text-base font-bold text-[#d4833a]">
                            {partner.biodataName?.[0] || "?"}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#18100a]">
                            {partner.biodataName || `Biodata #${partner.biodataId}`}
                          </p>
                          <p className="text-xs font-light text-[#9a8270]">
                            Biodata #{partner.biodataId} · Approved request
                          </p>
                        </div>

                        {isSelected ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d4833a] text-white">
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path
                                d="M1 4L4 7L9 1"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-[#d4833a]">
                            #{partner.biodataId}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#b8a080]">
                  Partner not listed?
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, partnerBiodataId: "" }))
                    }
                    className="text-[#c07030] underline"
                  >
                    Enter ID manually
                  </button>
                </div>

                {!selectedPartner && (
                  <div className="mt-3">
                    <input
                      type="number"
                      name="partnerBiodataId"
                      value={form.partnerBiodataId}
                      onChange={handleChange}
                      placeholder="Enter partner's Biodata ID"
                      className={inputCls}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="rounded-xl border border-dashed border-[#d8c3a6] px-5 py-4 text-center text-sm font-light leading-7 text-[#9a8270]">
                  No approved contact requests found.
                  <br />
                  <span className="text-xs">
                    Please enter your partner's Biodata ID manually below.
                  </span>
                </div>

                <div className="mt-3">
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.13em] text-[#7a6248]">
                    Partner's Biodata ID <span className="text-[#c07030]">*</span>
                  </label>
                  <input
                    type="number"
                    name="partnerBiodataId"
                    value={form.partnerBiodataId}
                    onChange={handleChange}
                    placeholder="e.g. 24"
                    className={inputCls}
                  />
                </div>
              </>
            )}
          </div>

          <div className="border-b border-[#e9dccb] p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c07030]">
              <span className="h-px w-4 bg-current opacity-50" />
              Wedding Details
            </div>

            <div className="mb-5 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-[0.13em] text-[#7a6248]">
                  Marriage Date <span className="text-[#c07030]">*</span>
                </label>
                <input
                  type="date"
                  name="marriageDate"
                  value={form.marriageDate}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-[0.13em] text-[#7a6248]">
                  Rating <span className="text-[#c07030]">*</span>
                </label>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-0.5 transition hover:scale-110"
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setForm((p) => ({ ...p, reviewStar: star }))}
                    >
                      <FaStar
                        size={24}
                        color={
                          (hoverStar || form.reviewStar) >= star
                            ? "#d4833a"
                            : "rgba(196,168,128,0.3)"
                        }
                      />
                    </button>
                  ))}

                  <span className="ml-1 text-sm font-light text-[#9a8270]">
                    {form.reviewStar > 0 ? `${form.reviewStar}/5` : "Rate us"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium uppercase tracking-[0.13em] text-[#7a6248]">
                Couple Photo{" "}
                <span className="normal-case tracking-normal text-[#b8a080] font-light">
                  (optional)
                </span>
              </label>

              {imagePreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative inline-block overflow-hidden rounded-lg border-2 border-[#d4833a]/30">
                    <img
                      src={imagePreview}
                      alt="Couple preview"
                      className="h-[120px] w-[120px] object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white"
                      onClick={removeImage}
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>

                  {uploading && (
                    <p className="text-xs text-[#c07030]">Uploading…</p>
                  )}

                  {!uploading && coupleImageUrl && (
                    <span className="text-xs font-medium text-green-700">
                      ✓ Uploaded
                    </span>
                  )}
                </div>
              ) : (
                <div className="relative rounded-lg border border-dashed border-[#d8c3a6] bg-[#faf7f2] p-6 text-center transition hover:border-[#d4833a]/50 hover:bg-[#fffcf6]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />

                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#d4833a]/20 bg-[#d4833a]/10 text-[#d4833a]">
                    <FaCloudUploadAlt size={18} />
                  </div>

                  <p className="text-sm font-medium text-[#18100a]">
                    Drop photo or <span className="text-[#c07030] underline">browse</span>
                  </p>
                  <p className="text-xs text-[#b8a080]">JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-[#e9dccb] p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c07030]">
              <span className="h-px w-4 bg-current opacity-50" />
              Your Story
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium uppercase tracking-[0.13em] text-[#7a6248]">
                Write your story <span className="text-[#c07030]">*</span>
              </label>

              <textarea
                name="successStory"
                value={form.successStory}
                onChange={handleChange}
                rows={6}
                required
                placeholder="How did you first connect? What made you certain? Share the journey that led to your happily ever after…"
                className={textareaCls}
              />
            </div>
          </div>

          <div className="bg-[#faf7f2] p-5 sm:p-8">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || uploading || !myBiodata}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#18100a] px-4 py-3 text-sm font-medium uppercase tracking-[0.1em] text-[#fffcf6] transition hover:-translate-y-0.5 hover:bg-[#d4833a] hover:shadow-[0_6px_20px_rgba(212,131,58,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? (
                "Submitting…"
              ) : (
                <>
                  <FaHeart size={13} /> Submit Success Story
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GotMarriedForm;