import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from './shared/navbar';
import Footer from './shared/footer';
import symptomsData from "./symptoms";

const symptomsList = Object.keys(symptomsData);

const formatSymptom = (symptom) => {
    return symptom
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const Predictor = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: "", age: "", gender: "", symptoms: [] });
    const [search, setSearch] = useState("");
    const [prediction, setPrediction] = useState(null);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step === 1 && (!formData.name || !formData.age || !formData.gender)) return;
        if (step === 2 && formData.symptoms.length === 0) return;
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (symptom) => {
        setFormData((prev) => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter((s) => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", { symptoms: formData.symptoms });
            setPrediction(response.data.disease);
            setStep(4);
        } catch (error) {
            console.error("Error predicting disease:", error);
        }
    };

    return (
        <>
            <Navbar />
            <section className="h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7F7] via-[#E6FAFA] to-[#08E8DE] p-6">
                <div className="p-8 max-w-2xl mx-auto bg-white shadow-xl rounded-2xl w-full flex flex-col gap-6">
                    <div className="flex justify-between text-sm text-[#404040]">
                        {["Personal Info", "Select Symptoms", "Review", "Result"].map((label, index) => (
                            <div
                                key={index}
                                className={`flex-1 text-center py-2 border-b-4 transition-all duration-300 ${step === index + 1 ? "border-[#08E8DE] font-bold text-[#0CAAAB]" : "border-[#F0F7F7]"
                                    }`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none" />
                            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none" />
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-lg cursor-pointer focus:border-[#5BC7C8] focus:outline-none">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <input type="text" placeholder="Search symptoms..." value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none" />
                            <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border p-3 rounded-lg bg-[#F0F7F7]">
                                {symptomsList.filter(symptom => symptom.includes(search)).map((symptom) => (
                                    <label key={symptom} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.symptoms.includes(symptom)} onChange={() => handleCheckboxChange(symptom)} className="accent-[#0CAAAB]" />
                                        {formatSymptom(symptom)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-3 text-[#404040] bg-[#F0F7F7] p-4 rounded-lg">
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Age:</strong> {formData.age}</p>
                            <p><strong>Gender:</strong> {formData.gender}</p>
                            <p><strong>Symptoms:</strong> {formData.symptoms.map(formatSymptom).join(", ")}</p>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="p-4 bg-[#E6FAFA] border border-[#5BC7C8] text-[#0CAAAB] rounded-lg">
                            <strong>Predicted Disease:</strong> {prediction}
                            <p className="mt-2 text-sm text-[#3A5A75]">This is not a professional medical diagnosis. Please consult a qualified doctor for expert advice.</p>
                            <button onClick={() => navigate("/consultation")} className="mt-3 px-5 py-2 bg-[#FF7676] text-white rounded-lg hover:bg-[#ff6262] transition-colors">Consult Doctor</button>
                        </div>
                    )}

                    <div className="mt-6 flex justify-between">
                        {step > 1 && <button onClick={handleBack} className="px-5 py-2 bg-[#3A5A75] text-white rounded-lg hover:bg-[#2a4a65] transition-colors">Back</button>}
                        {step < 3 && <button onClick={handleNext} className={`px-5 py-2 rounded-lg ${step === 1 && (!formData.name || !formData.age || !formData.gender) ? "bg-gray-300 cursor-not-allowed" : step === 2 && formData.symptoms.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#08E8DE] hover:bg-[#0CAAAB] text-white cursor-pointer transition-colors"}`}>Next</button>}
                        {step === 3 && <button onClick={handleSubmit} className="px-5 py-2 bg-[#08E8DE] hover:bg-[#0CAAAB] text-white rounded-lg transition-colors">Submit</button>}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Predictor;
