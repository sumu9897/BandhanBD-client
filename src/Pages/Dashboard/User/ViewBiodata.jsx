import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import {
  FaUser, FaMapMarkerAlt, FaBriefcase, FaPhone,
  FaEnvelope, FaCrown, FaCheckCircle, FaClock,
  FaEdit, FaExpand
} from "react-icons/fa";

const Field = ({ label, value }) =>
  value ? (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase text-gray-400">{label}</span>
      <span className="text-sm font-medium text-[#18100a]">{value}</span>
    </div>
  ) : null;

const Card = ({ title, icon: Icon, children }) => (
  <div className="bg-[#fffcf6] border rounded-xl shadow-sm">
    <div className="flex items-center gap-2 border-b p-4">
      <span className="p-2 rounded bg-orange-100 text-[#d4833a]">
        <Icon size={14} />
      </span>
      <h3 className="text-xs uppercase tracking-wider text-gray-600">
        {title}
      </h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const ViewBiodata = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: biodata, isLoading } = useQuery({
    queryKey: ["my-biodata", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/biodatas/mine");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  if (!biodata) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">No Biodata Found</h2>
        <Link
          to="/dashboard/edit-biodata"
          className="mt-4 inline-block bg-black text-white px-6 py-2 rounded"
        >
          Create Biodata
        </Link>
      </div>
    );
  }

  const allImages = biodata.profileImages?.length
    ? biodata.profileImages
    : biodata.profileImage
    ? [biodata.profileImage]
    : [];

  const primaryImage = allImages[0];

  return (
    <>
      <Helmet>
        <title>View Biodata</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs uppercase text-[#c07030]">My Profile</p>
            <h1 className="text-2xl font-bold">My Biodata</h1>
          </div>

          <Link
            to="/dashboard/edit-biodata"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-[#d4833a]"
          >
            <FaEdit /> Edit
          </Link>
        </div>

        {/* Hero */}
        <div className="bg-[#fffcf6] border rounded-xl p-6 mb-6 flex gap-6 items-center">
          <img
            src={primaryImage}
            className="w-24 h-24 rounded-lg object-cover"
          />

          <div>
            <h2 className="text-xl font-bold">{biodata.name}</h2>

            <div className="flex gap-2 flex-wrap mt-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-1">
                <FaUser /> {biodata.biodataType}
              </span>

              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-1">
                <FaMapMarkerAlt /> {biodata.permanentDivision}
              </span>

              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-1">
                <FaBriefcase /> {biodata.occupation}
              </span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4">

          <Card title="Personal" icon={FaUser}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Age" value={biodata.age} />
              <Field label="Height" value={biodata.height} />
              <Field label="Weight" value={biodata.weight} />
              <Field label="Complexion" value={biodata.race} />
            </div>
          </Card>

          <Card title="Family" icon={FaMapMarkerAlt}>
            <div className="flex flex-col gap-2">
              <Field label="Father" value={biodata.fatherName} />
              <Field label="Mother" value={biodata.motherName} />
            </div>
          </Card>

          <Card title="Partner Preferences" icon={FaCrown}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Age" value={biodata.expectedPartnerAge} />
              <Field label="Height" value={biodata.expectedPartnerHeight} />
            </div>
          </Card>

          <Card title="Contact" icon={FaEnvelope}>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <FaEnvelope /> {biodata.email}
              </div>
              <div className="flex gap-2 items-center">
                <FaPhone /> {biodata.mobileNumber}
              </div>
            </div>
          </Card>

        </div>

      </div>
    </>
  );
};

export default ViewBiodata;