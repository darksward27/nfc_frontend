import React, { useState, useEffect } from 'react';
import StudentAnalytics from './StudentAnalytics';

const getAttendanceStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'present':
            return 'bg-green-100 text-green-800';
        case 'absent':
            return 'bg-red-100 text-red-800';
        case 'late':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

function Students({ organizationId }) {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [departmentsLoading, setDepartmentsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentFormData, setStudentFormData] = useState({
        holderName: '',
        email: '',
        phone: '',
        type: 'student',
        departmentId: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active: true,
        studentInfo: {
            rollNumber: '',
            semester: 1,
            branch: '',
            section: '',
            batch: new Date().getFullYear().toString(),
            admissionYear: new Date().getFullYear(),
            guardianName: '',
            guardianPhone: '',
            bloodGroup: '',
            address: {
                street: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
            },
            academicDetails: {
                cgpa: 0,
                attendance: 0,
                subjects: []
            },
            nfcCard: {
                cardNumber: '',
                issueDate: new Date().toISOString().split('T')[0],
                lastReplaced: null,
                status: 'active'
            },
            attendance: {
                lastTapIn: null,
                lastTapOut: null,
                totalPresent: 0,
                totalAbsent: 0,
                totalLate: 0,
                status: 'absent',
                history: []
            },
            library: {
                membershipId: '',
                booksIssued: [],
                finesPending: 0
            },
            fees: {
                totalAmount: 0,
                paidAmount: 0,
                pendingAmount: 0,
                lastPaymentDate: null,
                payments: []
            }
        }
    });
    const [expandedStudent, setExpandedStudent] = useState(null);

    useEffect(() => {
        fetchDepartments();
    }, [organizationId]);

    useEffect(() => {
        if (selectedDept?._id) {
            fetchStudents();
        }
    }, [selectedDept]);

    const fetchDepartments = async () => {
        setDepartmentsLoading(true);
        try {
            const response = await fetch(`https://nfc-backend-8z7z.onrender.com/api/departments?organizationId=${organizationId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch departments');
            }
            const data = await response.json();
            setDepartments(data);
            setDepartmentsLoading(false);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setError('Failed to load departments');
            setDepartmentsLoading(false);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            if (!selectedDept?._id) {
                setStudents([]);
                return;
            }

            // First fetch cards
            const cardsResponse = await fetch(`https://nfc-backend-8z7z.onrender.com/api/cards?departmentId=${selectedDept._id}&type=student`);
            if (!cardsResponse.ok) {
                throw new Error('Failed to fetch student cards');
            }
            const cardsData = await cardsResponse.json();

            // Then fetch corresponding student details
            const studentsResponse = await fetch(`https://nfc-backend-8z7z.onrender.com/api/students?departmentId=${selectedDept._id}`);
            if (!studentsResponse.ok) {
                throw new Error('Failed to fetch student details');
            }
            const studentsData = await studentsResponse.json();

            // Merge card and student data
            const mergedData = cardsData.map(card => {
                const studentDetail = studentsData.find(
                    student => student.studentInfo?.rollNumber === card.id
                );
                
                return {
                    ...card,
                    studentInfo: studentDetail?.studentInfo || {
                        rollNumber: card.id,
                        semester: 1,
                        branch: selectedDept.name,
                        section: '',
                        batch: new Date().getFullYear().toString(),
                        admissionYear: new Date().getFullYear(),
                        guardianName: '',
                        guardianPhone: '',
                        bloodGroup: '',
                        address: {
                            street: '',
                            city: '',
                            state: '',
                            pincode: '',
                            country: 'India'
                        },
                        academicDetails: {
                            cgpa: 0,
                            attendance: 0,
                            subjects: []
                        }
                    }
                };
            });

            console.log('Merged student data:', mergedData); // Debug log
            setStudents(mergedData);
            setError(null);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Failed to load students. Please try again.');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditStudent = (student) => {
        console.log('Editing student:', student);

        setEditingStudent(student);
        setStudentFormData({
            holderName: student.holderName || '',
            email: student.email || '',
            phone: student.phone || '',
            type: 'student',
            departmentId: student.departmentId?._id || selectedDept?._id || '',
            validFrom: student.validFrom 
                ? new Date(student.validFrom).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
            validUntil: student.validUntil 
                ? new Date(student.validUntil).toISOString().split('T')[0]
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            active: Boolean(student.active),
            studentInfo: {
                rollNumber: student.studentInfo?.rollNumber || '',
                semester: student.studentInfo?.semester || 1,
                branch: student.studentInfo?.branch || selectedDept?.name || '',
                section: student.studentInfo?.section || '',
                batch: student.studentInfo?.batch || new Date().getFullYear().toString(),
                admissionYear: student.studentInfo?.admissionYear || new Date().getFullYear(),
                guardianName: student.studentInfo?.guardianName || '',
                guardianPhone: student.studentInfo?.guardianPhone || '',
                bloodGroup: student.studentInfo?.bloodGroup || '',
                address: student.studentInfo?.address || {},
                academicDetails: student.studentInfo?.academicDetails || {},
                nfcCard: {
                    cardNumber: student.studentInfo?.rollNumber || '',
                    issueDate: new Date().toISOString(),
                    lastReplaced: null,
                    active: Boolean(student.active)
                }
            }
        });
        setShowStudentModal(true);
    };

    const handleDeleteStudent = async (student) => {
        try {
            if (!window.confirm('Are you sure you want to delete this student?')) {
                return;
            }

            const identifier = student.studentInfo?.rollNumber || student.id;
            console.log('Attempting to delete student with identifier:', identifier);
            
            if (!identifier) {
                throw new Error('No valid identifier found for student');
            }

            const response = await fetch(`https://nfc-backend-8z7z.onrender.com/api/students/${identifier}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Delete response:', data);

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to delete student');
            }

            // Update local state only if delete was successful
            setStudents(prevStudents => 
                prevStudents.filter(s => 
                    (s.studentInfo?.rollNumber || s.id) !== identifier
                )
            );

            alert('Student deleted successfully');

        } catch (error) {
            console.error('Delete operation failed:', error);
            alert(`Failed to delete student: ${error.message}`);
        }
    };

    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...studentFormData,
                organizationId: organizationId,
                departmentId: selectedDept._id,
                validFrom: new Date().toISOString(),
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                active: true,
                type: 'student'
            };

            console.log('Submitting student data:', submitData);

            const url = editingStudent 
                ? `https://nfc-backend-8z7z.onrender.com/api/students/roll/${encodeURIComponent(editingStudent.studentInfo.rollNumber)}`
                : 'https://nfc-backend-8z7z.onrender.com/api/students';

            const response = await fetch(url, {
                method: editingStudent ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save student');
            }

            console.log('Server response:', data);

            // Refresh the students list
            await fetchStudents();
            
            // Close modal and reset form
            setShowStudentModal(false);
            resetFormData(selectedDept);
            setEditingStudent(null);

        } catch (error) {
            console.error('Error saving student:', error);
            alert(error.message || 'Failed to save student');
        }
    };

    const resetFormData = (selectedDept = null) => {
        setStudentFormData({
            holderName: '',
            email: '',
            phone: '',
            type: 'student',
            departmentId: selectedDept?._id || '',
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            active: true,
            studentInfo: {
                rollNumber: '',
                semester: 1,
                branch: selectedDept?.name || '',
                section: '',
                batch: new Date().getFullYear().toString(),
                admissionYear: new Date().getFullYear(),
                guardianName: '',
                guardianPhone: '',
                bloodGroup: '',
                address: {
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India'
                },
                academicDetails: {
                    cgpa: 0,
                    attendance: 0,
                    subjects: []
                },
                nfcCard: {
                    cardNumber: '',
                    issueDate: new Date().toISOString(),
                    lastReplaced: null,
                    status: 'active'
                }
            }
        });
    };

    const handleAddNewStudent = () => {
        setEditingStudent(null);
        resetFormData(selectedDept);
        setShowStudentModal(true);
    };

    // Add form validation before submission
    const validateForm = (formData) => {
        const required = [
            'holderName',
            'email',
            'phone',
            'studentInfo.rollNumber',
            'studentInfo.semester',
            'studentInfo.branch'
        ];

        const missing = required.filter(field => {
            const value = field.split('.').reduce((obj, key) => obj?.[key], formData);
            return !value;
        });

        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Invalid email format');
        }

        // Validate phone number (adjust regex according to your requirements)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            throw new Error('Invalid phone number format (should be 10 digits)');
        }

        return true;
    };

    // Update the form submission to include validation
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            validateForm(studentFormData);
            await handleStudentSubmit(e);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-lg font-semibold">Students</h2>
                        <p className="text-sm text-gray-500">Manage student records</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Department
                            </label>
                            <select
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={selectedDept?._id || ''}
                                onChange={(e) => {
                                    const dept = departments.find(d => d._id === e.target.value);
                                    setSelectedDept(dept);
                                }}
                                disabled={departmentsLoading}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedDept && (
                            <button
                                onClick={handleAddNewStudent}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                disabled={!selectedDept}
                            >
                                Add New Student
                            </button>
                        )}
                    </div>
                </div>

                {selectedDept && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">{selectedDept.name}</h3>
                                <p className="text-sm text-gray-500">{selectedDept.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                selectedDept.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {selectedDept.active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
                {departmentsLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : !selectedDept ? (
                    <div className="text-center py-12">
                        <i className="bi bi-diagram-3 text-4xl text-gray-400"></i>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No Department Selected</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Please select a department to view and manage students.
                        </p>
                    </div>
                ) : (
                    <>
                        <StudentAnalytics students={students} />
                        <div className="mt-6">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                    {students.map(student => (
                                        <div 
                                            key={student._id} 
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                        >
                                            {/* Basic Info Card */}
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">
                                                            {student.holderName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {student.studentInfo?.rollNumber}
                                                        </p>
                                                    </div>
                                                    <span 
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            student.active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {student.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>

                                                {/* Basic Details */}
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <p>
                                                        <i className="fas fa-graduation-cap mr-2"></i>
                                                        {student.studentInfo?.branch} - Sem {student.studentInfo?.semester}
                                                    </p>
                                                    <p>
                                                        <i className="fas fa-envelope mr-2"></i>
                                                        {student.email}
                                                    </p>
                                                    <p>
                                                        <i className="fas fa-phone mr-2"></i>
                                                        {student.phone}
                                                    </p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="mt-4 flex justify-between items-center">
                                                    <button
                                                        onClick={() => setExpandedStudent(
                                                            expandedStudent === student._id ? null : student._id
                                                        )}
                                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                    >
                                                        <i className={`fas fa-chevron-${expandedStudent === student._id ? 'up' : 'down'} mr-1`}></i>
                                                        {expandedStudent === student._id ? 'Show Less' : 'Show More'}
                                                    </button>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditStudent(student)}
                                                            className="p-1 text-blue-600 hover:text-blue-800"
                                                            title="Edit"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteStudent(student)}
                                                            className="p-1 text-red-600 hover:text-red-800"
                                                            title="Delete"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {expandedStudent === student._id && (
                                                <div className="bg-gray-50 p-4 border-t border-gray-200">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-700 mb-2">Academic Info</h4>
                                                            <div className="space-y-1 text-gray-600">
                                                                <p>Batch: {student.studentInfo?.batch}</p>
                                                                <p>Section: {student.studentInfo?.section}</p>
                                                                <p>Admission Year: {student.studentInfo?.admissionYear}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-700 mb-2">Guardian Details</h4>
                                                            <div className="space-y-1 text-gray-600">
                                                                <p>Name: {student.studentInfo?.guardianName || 'N/A'}</p>
                                                                <p>Phone: {student.studentInfo?.guardianPhone || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <h4 className="font-semibold text-gray-700 mb-2">Additional Info</h4>
                                                            <div className="space-y-1 text-gray-600">
                                                                <p>Blood Group: {student.studentInfo?.bloodGroup || 'N/A'}</p>
                                                                <p>Valid Until: {new Date(student.validUntil).toLocaleDateString()}</p>
                                                                <p>Department: {student.departmentId?.name || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {showStudentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingStudent ? 'Edit Student' : 'Add Student'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            value={studentFormData.holderName}
                                            onChange={(e) => setStudentFormData({ 
                                                ...studentFormData, 
                                                holderName: e.target.value 
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                                        <input
                                            type="text"
                                            value={studentFormData.studentInfo.rollNumber}
                                            onChange={(e) => setStudentFormData({
                                                ...studentFormData,
                                                studentInfo: {
                                                    ...studentFormData.studentInfo,
                                                    rollNumber: e.target.value
                                                }
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Academic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Semester</label>
                                        <select
                                            value={studentFormData.studentInfo.semester}
                                            onChange={(e) => setStudentFormData({
                                                ...studentFormData,
                                                studentInfo: {
                                                    ...studentFormData.studentInfo,
                                                    semester: parseInt(e.target.value)
                                                }
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            {[1,2,3,4,5,6,7,8].map(sem => (
                                                <option key={sem} value={sem}>Semester {sem}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Branch</label>
                                        <input
                                            type="text"
                                            value={studentFormData.studentInfo.branch}
                                            onChange={(e) => setStudentFormData({
                                                ...studentFormData,
                                                studentInfo: {
                                                    ...studentFormData.studentInfo,
                                                    branch: e.target.value
                                                }
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Section</label>
                                        <input
                                            type="text"
                                            value={studentFormData.studentInfo.section}
                                            onChange={(e) => setStudentFormData({
                                                ...studentFormData,
                                                studentInfo: {
                                                    ...studentFormData.studentInfo,
                                                    section: e.target.value
                                                }
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={studentFormData.email}
                                            onChange={(e) => setStudentFormData({
                                                ...studentFormData,
                                                email: e.target.value
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            value={studentFormData.phone}
                                            onChange={(e) => setStudentFormData({
                                                ...studentFormData,
                                                phone: e.target.value
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                            pattern="[0-9]{10}"
                                            title="Please enter a valid 10-digit phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Guardian Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Guardian Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                                        <input
                                            type="text"
                                            value={studentFormData.studentInfo.guardianName}
                                            onChange={(e) => setStudentFormData({
                                                ...studentFormData,
                                                studentInfo: {
                                                    ...studentFormData.studentInfo,
                                                    guardianName: e.target.value
                                                }
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Guardian Phone</label>
                                        <input
                                            type="tel"
                                            value={studentFormData.studentInfo.guardianPhone}
                                            onChange={(e) => setStudentFormData({
                                                ...studentFormData,
                                                studentInfo: {
                                                    ...studentFormData.studentInfo,
                                                    guardianPhone: e.target.value
                                                }
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* NFC Card Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">NFC Card Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">NFC Card Number</label>
                                        <input
                                            type="text"
                                            value={studentFormData.studentInfo.nfcCard.cardNumber}
                                            onChange={(e) => setStudentFormData({
                                                ...studentFormData,
                                                studentInfo: {
                                                    ...studentFormData.studentInfo,
                                                    nfcCard: {
                                                        ...studentFormData.studentInfo.nfcCard,
                                                        cardNumber: e.target.value
                                                    }
                                                }
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <div className="mt-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={studentFormData.active}
                                                    onChange={(e) => setStudentFormData({
                                                        ...studentFormData,
                                                        active: e.target.checked
                                                    })}
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Active</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowStudentModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    {editingStudent ? 'Save Changes' : 'Add Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Students; 