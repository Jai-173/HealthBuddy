import { useState } from "react";

const Consultation = () => {
  const [formData, setFormData] = useState({ name: "", age: "", issue: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your consultation request has been submitted.");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-bold mb-4">Consult a Doctor</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <textarea name="issue" placeholder="Describe your issue" value={formData.issue} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Submit</button>
      </form>
    </div>
  );
};

export default Consultation;