import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [disease, setDisease] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [doctors, setDoctors] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/doctors");
      setData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleAddDoctorEntry = async () => {
    try {
      await axios.post("http://localhost:3000/api/doctors", {
        disease,
        specialization,
        symptoms: symptoms.split(",").map((s) => s.trim()),
        doctors: doctors.split(",").map((d) => d.trim()),
      });
      alert("Doctor entry added.");
      fetchDoctorData(); // Refresh table
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add doctor entry.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/doctors/${id}`);
      alert("Deleted.");
      fetchDoctorData(); // Refresh table
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6 text-white bg-[#121212] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#FF7676]">Admin Dashboard: Manage Doctors</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#1E1E1E] p-4 rounded-lg">
        <input
          className="p-2 bg-[#2A2A2A] border border-[#4ECDC4] rounded"
          placeholder="Disease"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
        />
        <input
          className="p-2 bg-[#2A2A2A] border border-[#4ECDC4] rounded"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
        <input
          className="p-2 bg-[#2A2A2A] border border-[#4ECDC4] rounded"
          placeholder="Symptoms (comma separated)"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <input
          className="p-2 bg-[#2A2A2A] border border-[#4ECDC4] rounded"
          placeholder="Doctors (comma separated)"
          value={doctors}
          onChange={(e) => setDoctors(e.target.value)}
        />
        <button
          onClick={handleAddDoctorEntry}
          className="col-span-1 md:col-span-2 bg-[#FF7676] hover:bg-[#E65C5C] text-white p-3 rounded"
        >
          Add Doctor Entry
        </button>
      </div>

      {/* Data Table */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Doctor Database</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-left border border-[#2A2A2A]">
          <thead className="bg-[#1E1E1E]">
            <tr>
              <th className="p-2 border-b border-[#2A2A2A]">Disease</th>
              <th className="p-2 border-b border-[#2A2A2A]">Specialization</th>
              <th className="p-2 border-b border-[#2A2A2A]">Symptoms</th>
              <th className="p-2 border-b border-[#2A2A2A]">Doctors</th>
              <th className="p-2 border-b border-[#2A2A2A]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry._id} className="hover:bg-[#2A2A2A]">
                <td className="p-2">{entry.disease}</td>
                <td className="p-2">{entry.specialization}</td>
                <td className="p-2">{entry.symptoms.join(", ")}</td>
                <td className="p-2">{entry.doctors.join(", ")}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
