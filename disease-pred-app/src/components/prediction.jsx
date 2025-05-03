import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import Navbar from './shared/navbar';
import Footer from './shared/footer';
import symptomsData from "./symptoms";
import Swal from 'sweetalert2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


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
    const [doctors, setDoctors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [feelingText, setFeelingText] = useState("");
    const [sentimentResult, setSentimentResult] = useState(null);
    const [sentimentLoading, setSentimentLoading] = useState(false);

    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // Check both Firebase auth and localStorage
        const checkAuth = async () => {
            if (!currentUser && !storedUser) {
                localStorage.removeItem("user"); // Clear any invalid data
                navigate('/login');
            }
        };

        checkAuth();
    }, [currentUser, storedUser, navigate]);

    const handleNext = () => {
        if (step === 1 && (!formData.name || !formData.age || !formData.gender)) return;
        if (step === 2 && formData.symptoms.length === 0) return;
        if (step === 3 && feelingText.trim() === "") return;
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
            setIsLoading(true);

            const response = await axios.post("http://127.0.0.1:5000/predict", {
                symptoms: formData.symptoms
            });
            const predictedDisease = response.data.disease;
            setPrediction(predictedDisease);

            const docRes = await axios.get(`http://localhost:3000/api/doctors/${predictedDisease}`);
            setDoctors(docRes.data);

            // 💡 Add this block to analyze mood
            if (feelingText.trim() !== "") {
                try {
                    const sentimentRes = await axios.post("http://127.0.0.1:5000/sentiment", { text: feelingText });
                    setSentimentResult(sentimentRes.data);
                } catch (err) {
                    console.error("Sentiment fetch failed:", err);
                    setSentimentResult(null);
                }
            }

            setStep(5); // ✅ FIX: navigate to Result step
        } catch (err) {
            console.error("Error:", err.message);
            alert("An error occurred while processing your request.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleSendEmail = async () => {
        if (!selectedDoctor || !selectedDoctor.email) {
            Swal.fire({
                title: 'Select a Doctor',
                text: 'Please select a doctor before sending the email.',
                icon: 'warning',
                confirmButtonColor: '#FFB347'
            });
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/api/doctors/send", {
                doctorEmail: selectedDoctor.email,
                userName: formData.name,
                userEmail: storedUser.email, // Add user's email
                disease: prediction,
                patientDetails: {
                    age: formData.age,
                    gender: formData.gender,
                    symptoms: formData.symptoms.map(formatSymptom).join(", "),
                    feeling: feelingText,
                    sentiment: sentimentResult?.sentiment
                }
            });

            Swal.fire({
                title: 'Email Sent!',
                text: 'The doctor has been notified successfully.',
                icon: 'success',
                confirmButtonColor: '#08E8DE'
            });

        } catch (err) {
            console.error("Failed to send email:", err.message);
            Swal.fire({
                title: 'Error',
                text: 'Failed to send email. Please try again.',
                icon: 'error',
                confirmButtonColor: '#FF7676'
            });
        }
    };




    return (
        <>
            <Navbar />
            <section className="min-h-screen pt-20 pb-10 flex items-center justify-center bg-gradient-to-br from-[#F0F7F7] via-[#E6FAFA] to-[#08E8DE] p-6">
                <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl w-full flex flex-col gap-6">
                    <div className="flex justify-between text-sm text-[#404040]">
                        {["Personal Info", "Select Symptoms", "How you Feel?", "Review", "Result", "Recommended Doctors"].map((label, index) => (
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
                        <div className="space-y-4">
                            <textarea
                                rows={5}
                                value={feelingText}
                                onChange={(e) => setFeelingText(e.target.value)}
                                placeholder="Tell us how you're feeling today..."
                                className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none"
                            />
                        </div>
                    )}


                    {step === 4 && (
                        <div className="space-y-3 text-[#404040] bg-[#F0F7F7] p-4 rounded-lg">
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Age:</strong> {formData.age}</p>
                            <p><strong>Gender:</strong> {formData.gender}</p>
                            <p><strong>Symptoms:</strong> {formData.symptoms.map(formatSymptom).join(", ")}</p>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="p-4 bg-[#E6FAFA] border border-[#5BC7C8] text-[#0CAAAB] rounded-lg">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <>
                                    <p><strong>Predicted Disease:</strong> {prediction}</p>

                                    {sentimentLoading ? (
                                        <p>Analyzing your mood...</p>
                                    ) : (
                                        <>
                                            <p><strong>Sentiment:</strong> {sentimentResult?.sentiment}</p>
                                            <p>{sentimentResult?.message}</p>
                                        </>
                                    )}

                                    <p className="mt-2 text-sm text-[#3A5A75]">
                                        This is not a professional medical diagnosis. Please consult a qualified doctor for expert advice.
                                    </p>
                                    {sentimentResult && (
                                        <div className="mt-6 w-64 mx-auto"> {/* Added width constraint and center alignment */}
                                            <h3 className="text-lg font-semibold mb-2 text-center">Your Mood Overview</h3>
                                            <Pie
                                                data={{
                                                    labels: ['Positive', 'Negative', 'Neutral'],
                                                    datasets: [
                                                        {
                                                            data: [
                                                                sentimentResult.positive_prob,
                                                                sentimentResult.negative_prob,
                                                                sentimentResult.neutral_prob
                                                            ],
                                                            backgroundColor: [
                                                                '#4CAF50',
                                                                '#F44336',
                                                                '#FFC107'
                                                            ],
                                                            borderWidth: 1
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: true, // This ensures the chart maintains its aspect ratio
                                                    plugins: {
                                                        legend: {
                                                            position: 'bottom',
                                                            labels: {
                                                                font: {
                                                                    size: 12 // Reduced font size for legend
                                                                }
                                                            }
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function (context) {
                                                                    return `${context.label}: ${(context.raw * 100).toFixed(1)}%`;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}

                                </>
                            )}
                        </div>
                    )}

                    {step === 6 && (
                        <div className="p-4 bg-white border border-[#5BC7C8] rounded-lg text-[#3A5A75]">
                            <h2 className="text-xl font-bold mb-4">Recommended Doctors</h2>

                            {doctors ? (
                                <>
                                    <p><strong>Specialization:</strong> {doctors.specialization}</p>
                                    <p className="mt-2"><strong>Available Doctors:</strong></p>
                                    <ul className="list-disc ml-5 mt-1 space-y-1">
                                        {doctors.doctors?.map((doc, index) => (
                                            <li key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="selectedDoctor"
                                                    value={doc.email}
                                                    onChange={() => setSelectedDoctor(doc)}
                                                    className="cursor-pointer accent-[#08E8DE]"
                                                />
                                                <p><strong>{doc.name}</strong> — {doc.address}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`mt-4 px-4 py-2 rounded-md text-white transition-colors ${selectedDoctor ? "bg-[#08E8DE] hover:bg-[#0CAAAB] cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
                                        onClick={handleSendEmail}
                                        disabled={!selectedDoctor}
                                    >
                                        Send Email to Selected Doctor
                                    </button>
                                </>
                            ) : (
                                <p className="text-gray-400">No doctors available for this disease.</p>
                            )}
                        </div>
                    )}



                    <div className="mt-6 flex justify-between">
                        {step > 1 && <button onClick={handleBack} className="px-5 py-2 bg-[#3A5A75] text-white rounded-lg hover:bg-[#2a4a65] transition-colors cursor-pointer">Back</button>}
                        {step < 4 && <button onClick={handleNext} className={`px-5 py-2 rounded-lg ${step === 1 && (!formData.name || !formData.age || !formData.gender) ? "bg-gray-300 cursor-not-allowed" : step === 2 && formData.symptoms.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#08E8DE] hover:bg-[#0CAAAB] text-white cursor-pointer transition-colors"}`}>Next</button>}
                        {step === 4 && <button onClick={handleSubmit} className="px-5 py-2 bg-[#08E8DE] hover:bg-[#0CAAAB] text-white cursor-pointer rounded-lg transition-colors">Submit</button>}
                        {step === 5 && <button
                            onClick={() => setStep(6)}
                            className="mt-4 px-4 py-2 bg-[#FF7676] cursor-pointer hover:bg-[#ff6262] text-white rounded-lg transition-colors"
                        >
                            View Recommended Doctors
                        </button>}
                        {step === 6 && (
                            <button
                                onClick={() => navigate('/')}
                                className="px-5 py-2 bg-[#FF7676] text-white rounded-lg hover:bg-[#ff6262] transition-colors cursor-pointer flex items-center gap-1"
                            >
                                Exit to Home
                            </button>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Predictor;
