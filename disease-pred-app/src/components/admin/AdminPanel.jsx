import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../shared/navbar';

const AdminPanel = () => {
    const [disease, setDisease] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [doctors, setDoctors] = useState([{
        name: '',
        address: '',
        email: '',
        phone1: '',
        phone2: '',
        website: ''
    }]);
    const [existingDoctors, setExistingDoctors] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditingDisease, setIsEditingDisease] = useState(false);
    const [editingDisease, setEditingDisease] = useState(null);

    useEffect(() => {
        // Fetch existing doctors when component mounts
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/doctors/all');
            setExistingDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const addDoctorField = () => {
        setDoctors([...doctors, {
            name: '',
            address: '',
            email: '',
            phone1: '',
            phone2: '',
            website: ''
        }]);
    };

    const removeDoctorField = (index) => {
        const newDoctors = doctors.filter((_, i) => i !== index);
        setDoctors(newDoctors);
    };

    const handleDoctorChange = (index, field, value) => {
        const newDoctors = [...doctors];
        newDoctors[index][field] = value;
        setDoctors(newDoctors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/doctors/add', {
                disease,
                specialization,
                symptoms: symptoms.split(',').map(s => s.trim()),
                doctors
            });

            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Doctors added successfully',
                    icon: 'success',
                    confirmButtonColor: '#08E8DE'
                });
                
                // Reset form
                setDisease('');
                setSpecialization('');
                setSymptoms('');
                setDoctors([{ name: '', address: '', email: '', phone1: '', phone2: '', website: '' }]);
                
                // Refresh doctors list
                fetchDoctors();
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Something went wrong',
                icon: 'error',
                confirmButtonColor: '#FF7676'
            });
        }
    };

    const handleEdit = (entry, doctor, docIndex) => {
        setIsEditing(true);
        setEditingDoctor({
            id: entry._id,
            docIndex: docIndex,
            ...doctor
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/api/doctors/update/${editingDoctor.id}/${editingDoctor.docIndex}`, {
                doctor: {
                    name: editingDoctor.name,
                    email: editingDoctor.email,
                    address: editingDoctor.address,
                    phone1: editingDoctor.phone1,
                    phone2: editingDoctor.phone2,
                    website: editingDoctor.website
                }
            });

            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Doctor information updated successfully',
                    icon: 'success',
                    confirmButtonColor: '#08E8DE'
                });
                setIsEditing(false);
                setEditingDoctor(null);
                fetchDoctors(); // Refresh the list
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update doctor information',
                icon: 'error',
                confirmButtonColor: '#FF7676'
            });
        }
    };

    const handleEditDisease = (entry) => {
        setIsEditingDisease(true);
        setEditingDisease({
            id: entry._id,
            disease: entry.disease,
            specialization: entry.specialization,
            symptoms: entry.symptoms.join(', ')
        });
    };

    const handleUpdateDisease = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/api/doctors/disease/${editingDisease.id}`, {
                disease: editingDisease.disease,
                specialization: editingDisease.specialization,
                symptoms: editingDisease.symptoms.split(',').map(s => s.trim())
            });

            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Disease information updated successfully',
                    icon: 'success',
                    confirmButtonColor: '#08E8DE'
                });
                setIsEditingDisease(false);
                setEditingDisease(null);
                fetchDoctors();
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update disease information',
                icon: 'error',
                confirmButtonColor: '#FF7676'
            });
        }
    };

    const handleRemoveDisease = async (diseaseId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF7676',
                cancelButtonColor: '#3A5A75',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:3000/api/doctors/disease/${diseaseId}`);
                fetchDoctors();
                Swal.fire('Deleted!', 'Disease has been removed.', 'success');
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to remove disease.', 'error');
        }
    };

    const handleRemoveDoctor = async (diseaseId, doctorIndex) => {
        try {
            const result = await Swal.fire({
                title: 'Remove Doctor?',
                text: "This action cannot be undone",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF7676',
                cancelButtonColor: '#3A5A75',
                confirmButtonText: 'Yes, remove'
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:3000/api/doctors/${diseaseId}/doctor/${doctorIndex}`);
                fetchDoctors();
                Swal.fire('Removed!', 'Doctor has been removed.', 'success');
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to remove doctor.', 'error');
        }
    };

    // Filter doctors based on search term
    const filteredDoctors = existingDoctors.filter(entry => 
        (entry.disease?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (entry.specialization?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        entry.doctors.some(doc => 
            (doc.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (doc.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        )
    );

    return (
        <>
        <Navbar />
        <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-[#F0F7F7] via-[#E6FAFA] to-[#08E8DE]">
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold text-[#404040] mb-6">Admin Panel - Add Doctors</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#404040] mb-2">Disease</label>
                            <input
                                type="text"
                                value={disease}
                                onChange={(e) => setDisease(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#404040] mb-2">Specialization</label>
                            <input
                                type="text"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#404040] mb-2">Symptoms (comma-separated)</label>
                        <input
                            type="text"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none"
                            required
                        />
                    </div>

                    {doctors.map((doctor, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-[#404040]">Doctor {index + 1}</h3>
                                {doctors.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDoctorField(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {Object.keys(doctor).map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm font-medium text-[#404040] mb-2">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            type="text"
                                            value={doctor[field]}
                                            onChange={(e) => handleDoctorChange(index, field, e.target.value)}
                                            className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none"
                                            required={field === 'name' || field === 'email'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addDoctorField}
                        className="w-full p-3 bg-[#08E8DE] text-white rounded-lg hover:bg-[#0CAAAB] transition-colors"
                    >
                        Add Another Doctor
                    </button>

                    <button
                        type="submit"
                        className="w-full p-3 bg-[#FF7676] text-white rounded-lg hover:bg-[#E65C5C] transition-colors"
                    >
                        Submit
                    </button>
                </form>

                {/* Display existing doctors */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-[#404040]">Existing Doctors</h2>
                        <input
                            type="text"
                            placeholder="Search diseases, doctors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border rounded-lg w-64 focus:border-[#5BC7C8] focus:outline-none"
                        />
                    </div>
                    <div className="space-y-4">
                        {filteredDoctors.map((entry, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-[#0CAAAB]">{entry.disease}</h3>
                                        <p className="text-sm text-[#404040]">Specialization: {entry.specialization}</p>
                                        <p className="text-sm text-[#404040]">Symptoms: {entry.symptoms.join(', ')}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditDisease(entry)}
                                            className="text-[#08E8DE] hover:text-[#0CAAAB] px-3 py-1 border border-[#08E8DE] rounded-lg"
                                        >
                                            Edit Disease
                                        </button>
                                        <button
                                            onClick={() => handleRemoveDisease(entry._id)}
                                            className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-500 rounded-lg"
                                        >
                                            Remove Disease
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {entry.doctors.map((doc, docIndex) => (
                                        <div key={docIndex} className="p-3 bg-gray-50 rounded relative">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{doc.name}</p>
                                                    <p className="text-sm">{doc.email}</p>
                                                    <p className="text-sm">{doc.address}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(entry, doc, docIndex)}
                                                        className="text-[#08E8DE] hover:text-[#0CAAAB]"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveDoctor(entry._id, docIndex)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isEditing && editingDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#404040]">Edit Doctor Information</h3>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingDoctor(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(editingDoctor)
                                .filter(key => !['id', 'docIndex'].includes(key))
                                .map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-[#404040] mb-2">
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDoctor[field]}
                                        onChange={(e) => setEditingDoctor({
                                            ...editingDoctor,
                                            [field]: e.target.value
                                        })}
                                        className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingDoctor(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-[#08E8DE] text-white rounded-lg hover:bg-[#0CAAAB]"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditingDisease && editingDisease && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#404040]">Edit Disease Information</h3>
                            <button
                                onClick={() => {
                                    setIsEditingDisease(false);
                                    setEditingDisease(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#404040] mb-2">Disease</label>
                                <input
                                    type="text"
                                    value={editingDisease.disease}
                                    onChange={(e) => setEditingDisease({
                                        ...editingDisease,
                                        disease: e.target.value
                                    })}
                                    className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#404040] mb-2">Specialization</label>
                                <input
                                    type="text"
                                    value={editingDisease.specialization}
                                    onChange={(e) => setEditingDisease({
                                        ...editingDisease,
                                        specialization: e.target.value
                                    })}
                                    className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#404040] mb-2">Symptoms (comma-separated)</label>
                                <input
                                    type="text"
                                    value={editingDisease.symptoms}
                                    onChange={(e) => setEditingDisease({
                                        ...editingDisease,
                                        symptoms: e.target.value
                                    })}
                                    className="w-full p-3 border rounded-lg focus:border-[#5BC7C8] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => {
                                    setIsEditingDisease(false);
                                    setEditingDisease(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateDisease}
                                className="px-4 py-2 bg-[#08E8DE] text-white rounded-lg hover:bg-[#0CAAAB]"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default AdminPanel;