import { useContext, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../../providers/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaTimes, FaStar, FaCheck } from "react-icons/fa";

const IMAGE_HOSTING_API = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`;

const DIVISIONS = [
  "Dhaka",
  "Chattagram",
  "Rajshahi",
  "Rangpur",
  "Barisal",
  "Khulna",
  "Mymensingh",
  "Sylhet",
];

const HEIGHTS = [
  `4'6"`,
  `4'8"`,
  `4'10"`,
  `5'0"`,
  `5'1"`,
  `5'2"`,
  `5'3"`,
  `5'4"`,
  `5'5"`,
  `5'6"`,
  `5'7"`,
  `5'8"`,
  `5'9"`,
  `5'10"`,
  `5'11"`,
  `6'0"`,
  `6'1"`,
  `6'2"`,
];

const WEIGHTS = [
  "40 kg",
  "45 kg",
  "50 kg",
  "55 kg",
  "60 kg",
  "65 kg",
  "70 kg",
  "75 kg",
  "80 kg",
  "85 kg",
  "90 kg",
];

const OCCUPATIONS = [
  "Student",
  "Job",
  "House wife",
  "Business",
  "Doctor",
  "Engineer",
  "Teacher",
  "Other",
];

const RACES = ["Fair", "Wheatish", "Dark"];
const MAX_IMAGES = 6;

const inputCls =
  "w-full rounded-lg border border-[#d8c3a6] bg-[#faf7f2] px-4 py-2.5 text-sm text-[#18100a] outline-none transition focus:border-[#d4833a] focus:bg-[#fffcf6] focus:ring-4 focus:ring-[#d4833a]/10";

const selectCls =
  "w-full rounded-lg border border-[#d8c3a6] bg-[#faf7f2] px-4 py-2.5 text-sm text-[#18100a] outline-none transition focus:border-[#d4833a] focus:bg-[#fffcf6] focus:ring-4 focus:ring-[#d4833a]/10";

const readOnlyCls =
  "w-full rounded-lg border border-[#eadcc8] bg-[#f5f0e8] px-4 py-2.5 text-sm text-[#b8a080] outline-none cursor-not-allowed";

const Field = ({ label, required, hint, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.13em] text-[#7a6248]">
      {label}
      {required && <span className="text-[#c07030]">*</span>}
    </label>

    {children}

    {hint && !error && <p className="text-xs text-[#baa890]">{hint}</p>}
    {error && <p className="text-xs text-[#b05030]">{error.message}</p>}
  </div>
);

const SectionHead = ({ num, title, desc }) => (
  <div className="mb-6 flex items-start gap-4">
    <span className="min-w-8 text-3xl font-bold leading-none text-[#d4833a]/20">
      {num}
    </span>

    <div>
      <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c07030]">
        {title}
      </h2>
      {desc && <p className="text-sm text-[#9a8270]">{desc}</p>}
    </div>
  </div>
);

const ImageUploader = ({ existingImages = [], onChange }) => {
  const [previews, setPreviews] = useState(
    existingImages.map((url) => ({ url, file: null, isExisting: true }))
  );
  const [dragging, setDragging] = useState(false);
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const mapped = existingImages.map((url) => ({
      url,
      file: null,
      isExisting: true,
    }));
    setPreviews(mapped);
    setPrimaryIdx(0);
  }, [existingImages]);

  const addFiles = (files) => {
    if (!files?.length) return;

    const remaining = MAX_IMAGES - previews.length;
    const toAdd = Array.from(files).slice(0, remaining);

    const newPreviews = toAdd.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    const updated = [...previews, ...newPreviews];
    setPreviews(updated);
    onChange(updated, primaryIdx);
  };

  const removeImage = (idx) => {
    const updated = previews.filter((_, i) => i !== idx);
    const newPrimary =
      primaryIdx >= updated.length ? Math.max(0, updated.length - 1) : primaryIdx;

    setPrimaryIdx(newPrimary);
    setPreviews(updated);
    onChange(updated, newPrimary);
  };

  const setPrimary = (idx) => {
    setPrimaryIdx(idx);
    onChange(previews, idx);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-3">
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((p, i) => (
            <div
              key={`${p.url}-${i}`}
              className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                i === primaryIdx
                  ? "border-[#d4833a] shadow-[0_0_0_2px_rgba(212,131,58,0.2)]"
                  : "border-[#d8c3a6] hover:scale-[1.02] hover:border-[#d4833a]/50"
              }`}
              onClick={() => setPrimary(i)}
              title={i === primaryIdx ? "Primary photo" : "Click to set as primary"}
            >
              <img
                src={p.url}
                alt={`photo-${i}`}
                className="h-full w-full object-cover"
              />

              {i === primaryIdx && (
                <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded bg-[#d4833a] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#fffcf6]">
                  <FaStar size={8} />
                  Primary
                </span>
              )}

              <button
                type="button"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                aria-label="Remove image"
              >
                <FaTimes size={10} />
              </button>

              <span
                className={`absolute left-1.5 top-1.5 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                  p.isExisting
                    ? "bg-black/60 text-white/80"
                    : "bg-emerald-700/80 text-emerald-100"
                }`}
              >
                {p.isExisting ? "Saved" : "New"}
              </span>
            </div>
          ))}

          {previews.length < MAX_IMAGES && (
            <button
              type="button"
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#d8c3a6] bg-[#faf7f2] text-[#b8a080] transition hover:border-[#d4833a] hover:bg-[#fffcf6] hover:text-[#c07030]"
              onClick={() => inputRef.current?.click()}
            >
              <FaCloudUploadAlt size={18} />
              <span className="text-xs">Add</span>
            </button>
          )}
        </div>
      )}

      {previews.length === 0 && (
        <div
          className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragging
              ? "border-[#d4833a] bg-[#fffcf6]"
              : "border-[#d8c3a6] bg-[#faf7f2] hover:border-[#d4833a] hover:bg-[#fffcf6]"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4833a]/20 bg-[#d4833a]/10 text-[#d4833a]">
            <FaCloudUploadAlt size={24} />
          </div>

          <p className="mb-1 text-sm font-medium text-[#18100a]">
            Drop photos here or <span className="text-[#c07030] underline">browse files</span>
          </p>

          <p className="text-xs text-[#b8a080]">
            Up to {MAX_IMAGES} photos · JPG, PNG, WEBP · First photo becomes your
            profile picture
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {previews.length > 0 && (
        <p className="text-xs text-[#b8a080]">
          {previews.length}/{MAX_IMAGES} photos · Click a photo to set it as primary ·{" "}
          <button
            type="button"
            className="text-[#c07030] underline"
            onClick={() => inputRef.current?.click()}
          >
            Add more
          </button>
        </p>
      )}
    </div>
  );
};

const EditBiodata = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [imageData, setImageData] = useState({ previews: [], primaryIdx: 0 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: existingBiodata, isLoading: isFetching } = useQuery({
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

  useEffect(() => {
    if (existingBiodata) {
      const fields = [
        "biodataType",
        "name",
        "dob",
        "height",
        "weight",
        "occupation",
        "race",
        "fatherName",
        "motherName",
        "permanentDivision",
        "presentDivision",
        "expectedPartnerAge",
        "expectedPartnerHeight",
        "expectedPartnerWeight",
        "mobileNumber",
      ];

      fields.forEach((f) => setValue(f, existingBiodata[f] || ""));

      const existing = existingBiodata.profileImages?.length
        ? existingBiodata.profileImages
        : existingBiodata.profileImage
        ? [existingBiodata.profileImage]
        : [];

      setImageData({
        previews: existing.map((url) => ({ url, file: null, isExisting: true })),
        primaryIdx: 0,
      });
    } else {
      setValue("name", user?.displayName || "");
    }
  }, [existingBiodata, user, setValue]);

  const dob = watch("dob");

  useEffect(() => {
    if (!dob) return;

    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    if (age > 0) setValue("age", age);
  }, [dob, setValue]);

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axiosPublic.post(IMAGE_HOSTING_API, formData, {
      headers: { "content-type": "multipart/form-data" },
    });

    if (!res.data.success) throw new Error("Image upload failed");
    return res.data.data.url;
  };

  const onSubmit = async (data) => {
    try {
      const { previews, primaryIdx } = imageData;

      if (previews.length === 0) {
        return Swal.fire({
          icon: "warning",
          title: "No photos added",
          text: "Please upload at least one profile photo.",
          background: "#fffcf6",
          color: "#18100a",
        });
      }

      const uploadedUrls = await Promise.all(
        previews.map(async (p) => {
          if (p.isExisting) return p.url;
          return await uploadToImgBB(p.file);
        })
      );

      const reordered = [
        uploadedUrls[primaryIdx],
        ...uploadedUrls.filter((_, i) => i !== primaryIdx),
      ];

      const payload = {
        biodataType: data.biodataType,
        name: data.name,
        profileImage: reordered[0],
        profileImages: reordered,
        dob: data.dob,
        age: parseInt(data.age),
        height: data.height,
        weight: data.weight,
        occupation: data.occupation,
        race: data.race,
        fatherName: data.fatherName,
        motherName: data.motherName,
        permanentDivision: data.permanentDivision,
        presentDivision: data.presentDivision,
        expectedPartnerAge: data.expectedPartnerAge,
        expectedPartnerHeight: data.expectedPartnerHeight,
        expectedPartnerWeight: data.expectedPartnerWeight,
        mobileNumber: data.mobileNumber,
        email: user.email,
      };

      if (existingBiodata) {
        await axiosSecure.put(`/biodatas/${user.email}`, payload);
      } else {
        await axiosSecure.post("/biodatas", payload);
      }

      Swal.fire({
        icon: "success",
        title: existingBiodata ? "Biodata Updated!" : "Biodata Created!",
        timer: 1600,
        showConfirmButton: false,
        background: "#fffcf6",
        color: "#18100a",
        iconColor: "#d4833a",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to save biodata",
        text: error.response?.data?.message || error.message,
        background: "#fffcf6",
        color: "#18100a",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-sm font-light text-[#9a8270]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8c3a6] border-t-[#d4833a]" />
        <p>Loading your biodata…</p>
      </div>
    );
  }

  const isEdit = !!existingBiodata;

  return (
    <>
      <Helmet>
        <title>{isEdit ? "Edit Biodata" : "Create Biodata"} — BandhanBD</title>
      </Helmet>

      <div className="mx-auto max-w-[680px]">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#c07030]">
            <span className="h-px w-[18px] bg-current opacity-50" />
            {isEdit ? "Update Profile" : "New Profile"}
          </div>

          <h1 className="mb-1 text-3xl font-bold tracking-tight text-[#18100a]">
            {isEdit ? "Edit Your Biodata" : "Create Your Biodata"}
          </h1>

          <p className="text-sm text-[#9a8270]">
            {isEdit
              ? "Keep your profile accurate to find the best matches."
              : "Fill in your details to create your matrimonial profile."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-hidden rounded-2xl border border-[#e4d3bc] bg-[#fffcf6] shadow-[0_2px_20px_rgba(180,140,80,0.07)]"
        >
          <div className="border-b border-[#e9dccb] p-6 sm:p-8">
            <SectionHead
              num="01"
              title="Profile Photos"
              desc={`Upload up to ${MAX_IMAGES} photos · Click any photo to set it as primary`}
            />

            <ImageUploader
              existingImages={
                existingBiodata?.profileImages?.length
                  ? existingBiodata.profileImages
                  : existingBiodata?.profileImage
                  ? [existingBiodata.profileImage]
                  : []
              }
              onChange={(previews, primaryIdx) =>
                setImageData({ previews, primaryIdx })
              }
            />
          </div>

          <div className="border-b border-[#e9dccb] p-6 sm:p-8">
            <SectionHead
              num="02"
              title="Basic Information"
              desc="Your personal details and physical attributes"
            />

            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Biodata Type" required error={errors.biodataType}>
                  <select
                    className={selectCls}
                    {...register("biodataType", {
                      required: "Biodata type is required",
                    })}
                  >
                    <option value="">Select type</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </Field>

                <Field label="Full Name" required error={errors.name}>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className={inputCls}
                    {...register("name", { required: "Name is required" })}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Date of Birth" required error={errors.dob}>
                  <input
                    type="date"
                    className={inputCls}
                    {...register("dob", {
                      required: "Date of birth is required",
                    })}
                  />
                </Field>

                <Field label="Age" hint="Auto-calculated from date of birth">
                  <input
                    type="number"
                    readOnly
                    placeholder="Auto"
                    className={readOnlyCls}
                    {...register("age")}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Height">
                  <select className={selectCls} {...register("height")}>
                    <option value="">Select</option>
                    {HEIGHTS.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Weight">
                  <select className={selectCls} {...register("weight")}>
                    <option value="">Select</option>
                    {WEIGHTS.map((w) => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Complexion">
                  <select className={selectCls} {...register("race")}>
                    <option value="">Select</option>
                    {RACES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Occupation">
                <select className={selectCls} {...register("occupation")}>
                  <option value="">Select occupation</option>
                  {OCCUPATIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className="border-b border-[#e9dccb] p-6 sm:p-8">
            <SectionHead
              num="03"
              title="Family Information"
              desc="Details about your parents and location"
            />

            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Father's Name">
                  <input
                    type="text"
                    placeholder="Father's full name"
                    className={inputCls}
                    {...register("fatherName")}
                  />
                </Field>

                <Field label="Mother's Name">
                  <input
                    type="text"
                    placeholder="Mother's full name"
                    className={inputCls}
                    {...register("motherName")}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Permanent Division">
                  <select className={selectCls} {...register("permanentDivision")}>
                    <option value="">Select division</option>
                    {DIVISIONS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Present Division">
                  <select className={selectCls} {...register("presentDivision")}>
                    <option value="">Select division</option>
                    {DIVISIONS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          <div className="border-b border-[#e9dccb] p-6 sm:p-8">
            <SectionHead
              num="04"
              title="Partner Preferences"
              desc="What you're looking for in a life partner"
            />

            <div className="flex flex-col gap-4">
              <Field label="Expected Partner Age">
                <input
                  type="number"
                  placeholder="e.g. 28"
                  className={inputCls}
                  {...register("expectedPartnerAge")}
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Expected Height">
                  <select className={selectCls} {...register("expectedPartnerHeight")}>
                    <option value="">Select height</option>
                    {HEIGHTS.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Expected Weight">
                  <select className={selectCls} {...register("expectedPartnerWeight")}>
                    <option value="">Select weight</option>
                    {WEIGHTS.map((w) => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <SectionHead
              num="05"
              title="Contact Information"
              desc="These details are only revealed after a paid request"
            />

            <div className="flex flex-col gap-4">
              <Field label="Mobile Number">
                <input
                  type="tel"
                  placeholder="e.g. 01700000000"
                  className={inputCls}
                  {...register("mobileNumber")}
                />
              </Field>

              <Field
                label="Email Address"
                hint="Linked to your account — cannot be changed here"
              >
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className={readOnlyCls}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#e9dccb] bg-[#faf7f2] p-6 sm:flex-row sm:items-center sm:gap-4 sm:px-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#18100a] px-4 py-3 text-sm font-medium uppercase tracking-[0.1em] text-[#fffcf6] transition hover:-translate-y-0.5 hover:bg-[#d4833a] hover:shadow-[0_6px_20px_rgba(212,131,58,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:flex-1"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving…
                </>
              ) : (
                <>
                  <FaCheck size={12} />
                  {isEdit ? "Update Biodata" : "Create Biodata"}
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#b8a080] sm:max-w-[220px] sm:text-left">
              Your contact info is only visible to users with approved requests.
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBiodata;