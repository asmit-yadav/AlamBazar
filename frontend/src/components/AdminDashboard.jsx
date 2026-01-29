import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const MAX_IMAGES = 10;

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("inventory"); // 'inventory' or 'add'
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [inventory, setInventory] = useState([]);
    const [editingId, setEditingId] = useState(null); // ID of car being edited

    const [vehicleData, setVehicleData] = useState({
        make: "",
        model: "",
        variant: "",
        year: "",
        fuelType: "",
        transmission: "",
        kms: "",
        owners: "",
        color: "",
        price: "",
        description: "",
        images: []
    });

    const [error, setError] = useState("");

    // 🔄 Fetch Inventory
    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:5000/api/cars?limit=100');
            const data = await res.json();
            if (data.success) {
                setInventory(data.data.cars);
            }
        } catch (err) {
            console.error("Failed to load inventory", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'inventory') {
            fetchInventory();
        }
    }, [activeTab]);

    // 🔐 Logout
    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/";
    };

    // ✏️ Change handler
    const updateField = (name, value) => {
        setVehicleData(prev => ({ ...prev, [name]: value }));
    };

    // 🗑️ Delete Car
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;

        try {
            setLoading(true);
            const token = await auth.currentUser.getIdToken();
            const res = await fetch(`http://localhost:5000/api/cars/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setInventory(prev => prev.filter(car => car.id !== id));
                alert("Car deleted successfully");
            } else {
                alert("Failed to delete car");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting car");
        } finally {
            setLoading(false);
        }
    };

    // 📝 Edit Car
    const handleEdit = (car) => {
        setEditingId(car.id);
        setVehicleData({
            make: car.brand,
            model: car.model,
            variant: car.variant || "",
            year: car.year,
            fuelType: car.fuelType || car.fuel,
            transmission: car.transmission,
            kms: car.mileage,
            owners: car.owners || "",
            color: car.color || "",
            price: car.price,
            description: car.description || "",
            images: car.images ? car.images.map(url => ({ file: null, preview: url })) : []
        });
        setStep(1);
        setActiveTab("add");
    };

    const resetForm = () => {
        setEditingId(null);
        setVehicleData({
            make: "", model: "", variant: "", year: "",
            fuelType: "", transmission: "", kms: "", owners: "",
            color: "", price: "", description: "", images: []
        });
        setStep(1);
    };

    // 👉 Next Step validation
    const nextStep = () => {
        if (step === 1 && (!vehicleData.make || !vehicleData.model || !vehicleData.year)) {
            return setError("Brand, Model, and Year are required");
        }
        if (step === 2 && (!vehicleData.fuelType || !vehicleData.transmission)) {
            return setError("Fuel Type and Transmission are required");
        }
        if (step === 3 && !vehicleData.price) {
            return setError("Price is required");
        }
        setError("");
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    // 📷 Image Upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (vehicleData.images.length + files.length > MAX_IMAGES) {
            return setError(`Maximum ${MAX_IMAGES} images allowed`);
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setVehicleData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const removeImage = (index) => {
        setVehicleData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // 🚀 Submit (Create or Update)
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            const token = await auth.currentUser.getIdToken();
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Upload NEW Images (if any)
            let finalImageUrls = [];

            // Keep existing URLs (where file is null)
            const existingUrls = vehicleData.images
                .filter(img => !img.file)
                .map(img => img.preview);

            // Upload new files
            const filesToUpload = vehicleData.images
                .map(img => img.file)
                .filter(Boolean);

            if (filesToUpload.length > 0) {
                const formData = new FormData();
                filesToUpload.forEach(file => formData.append('images', file));

                const uploadRes = await fetch('http://localhost:5000/api/upload/images', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Image upload failed');

                const newUrls = uploadData.data.images.map(img => img.url);
                finalImageUrls = [...existingUrls, ...newUrls];
            } else {
                finalImageUrls = existingUrls;
            }

            // 2. Post/Put Car Data
            const carPayload = {
                brand: vehicleData.make,
                model: vehicleData.model,
                variant: vehicleData.variant,
                year: vehicleData.year,
                fuelType: vehicleData.fuelType,
                transmission: vehicleData.transmission,
                mileage: vehicleData.kms,
                owners: vehicleData.owners,
                color: vehicleData.color,
                price: vehicleData.price,
                description: vehicleData.description,
                images: finalImageUrls
            };

            const url = editingId
                ? `http://localhost:5000/api/cars/${editingId}`
                : 'http://localhost:5000/api/cars';

            const method = editingId ? 'PUT' : 'POST';

            const carRes = await fetch(url, {
                method: method,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(carPayload)
            });

            const carResult = await carRes.json();
            if (!carRes.ok) throw new Error(carResult.error?.message || 'Failed to save car');

            alert(`Listing ${editingId ? 'Updated' : 'Posted'} Successfully! 🎉`);
            setActiveTab("inventory");
            resetForm();

        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ola-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>Four Wheel Alam</h2>
                <nav className="sidebar-nav">
                    <button
                        className={activeTab === 'inventory' ? 'active' : ''}
                        onClick={() => setActiveTab('inventory')}
                    >
                        📋 Manage Inventory
                    </button>
                    <button
                        className={activeTab === 'add' ? 'active' : ''}
                        onClick={() => {
                            resetForm();
                            setActiveTab('add');
                        }}
                    >
                        ➕ Post New Ad
                    </button>
                    <button
                        onClick={() => navigate('/')}
                    >
                        🏠 Back to Website
                    </button>
                </nav>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </aside>

            {/* Main */}
            <main className="content">

                {activeTab === 'inventory' ? (
                    <div className="inventory-section">
                        <div className="section-header">
                            <h1>Current Inventory</h1>
                            <button className="primary-btn" onClick={() => {
                                resetForm();
                                setActiveTab('add');
                            }}>+ Add Car</button>
                        </div>

                        {loading && <div className="loading">Loading...</div>}

                        <div className="inventory-table-wrapper">
                            <table className="inventory-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Car Details</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map(car => (
                                        <tr key={car.id}>
                                            <td>
                                                <img
                                                    src={car.images && car.images[0] ? car.images[0] : 'https://via.placeholder.com/50'}
                                                    alt="car"
                                                    className="table-thumb"
                                                />
                                            </td>
                                            <td>
                                                <div className="car-info">
                                                    <strong>{car.year} {car.brand} {car.model}</strong>
                                                    <span>{car.variant} • {car.fuelType} • {car.transmission}</span>
                                                </div>
                                            </td>
                                            <td>₹{(car.price / 100000).toFixed(2)} Lakh</td>
                                            <td><span className="badge-active">Active</span></td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="edit-btn" onClick={() => handleEdit(car)}>✏️ Edit</button>
                                                    <button className="delete-btn" onClick={() => handleDelete(car.id)}>🗑️ Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {inventory.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                                No cars found in inventory.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* ADD / EDIT FORM CONTAINER */
                    <>
                        <div className="stepper">
                            {["Car", "Condition", "Price", "Photos"].map((label, i) => (
                                <div key={i} className={`step ${step >= i + 1 ? "active" : ""}`}>
                                    {label}
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="error-banner">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="card">
                                <h3>{editingId ? 'Edit' : 'Add'} Car Details</h3>
                                <input placeholder="Brand *"
                                    value={vehicleData.make}
                                    onChange={e => updateField("make", e.target.value)}
                                />
                                <input placeholder="Model *"
                                    value={vehicleData.model}
                                    onChange={e => updateField("model", e.target.value)}
                                />
                                <input placeholder="Variant"
                                    value={vehicleData.variant}
                                    onChange={e => updateField("variant", e.target.value)}
                                />
                                <input type="number" placeholder="Year"
                                    value={vehicleData.year}
                                    onChange={e => updateField("year", e.target.value)}
                                />
                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="card">
                                <h3>⚙️ Car Condition</h3>

                                <div className="chip-wrapper">
                                    <span className="chip-label">Fuel Type</span>
                                    <div className="chip-group">
                                        {["Petrol", "Diesel", "CNG", "Electric"].map(fuel => (
                                            <button
                                                key={fuel}
                                                className={vehicleData.fuelType === fuel ? "chip active" : "chip"}
                                                onClick={() => updateField("fuelType", fuel)}
                                            >
                                                {fuel}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="chip-wrapper">
                                    <span className="chip-label">Transmission</span>
                                    <div className="chip-group">
                                        {["Manual", "Automatic"].map(t => (
                                            <button
                                                key={t}
                                                className={vehicleData.transmission === t ? "chip active" : "chip"}
                                                onClick={() => updateField("transmission", t)}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="chip-wrapper">
                                    <span className="chip-label">Ownership</span>
                                    <div className="chip-group">
                                        {["1st Owner", "2nd Owner", "3rd Owner", "4th+"].map(o => (
                                            <button
                                                key={o}
                                                className={vehicleData.owners === o ? "chip active" : "chip"}
                                                onClick={() => updateField("owners", o)}
                                            >
                                                {o}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <input type="number" placeholder="KM Driven (e.g. 50000)"
                                    value={vehicleData.kms}
                                    onChange={e => updateField("kms", e.target.value)}
                                />
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="card">
                                <h3>💰 Pricing</h3>
                                <input type="number" placeholder="Expected Price ₹ *"
                                    value={vehicleData.price}
                                    onChange={e => updateField("price", e.target.value)}
                                />
                                <input placeholder="Color"
                                    value={vehicleData.color}
                                    onChange={e => updateField("color", e.target.value)}
                                />
                                <textarea placeholder="Short description"
                                    rows="4"
                                    value={vehicleData.description}
                                    onChange={e => updateField("description", e.target.value)}
                                />
                            </div>
                        )}

                        {/* STEP 4 */}
                        {step === 4 && (
                            <div className="card">
                                <h3>📷 Upload Photos</h3>

                                <div className="photo-upload-area" onClick={() => document.getElementById('hidden-file-input').click()}>
                                    <span className="upload-icon">☁️</span>
                                    <p>Click here to select images</p>
                                    <span style={{ fontSize: '0.9rem', color: '#999' }}>Upload up to {MAX_IMAGES} photos from your library</span>
                                    <input
                                        id="hidden-file-input"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                <div className="image-grid">
                                    {vehicleData.images.map((img, i) => (
                                        <div key={i} className="image-card">
                                            <img src={img.preview} alt="car" />
                                            <button onClick={() => removeImage(i)}>✖</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="nav">
                            {step > 1 && <button onClick={prevStep} disabled={loading}>Back</button>}
                            {step < 4
                                ? <button className="primary" onClick={nextStep}>Next</button>
                                : <button className="primary" onClick={handleSubmit} disabled={loading}>
                                    {loading ? (editingId ? 'Updating...' : 'Posting...') : (editingId ? 'Update Ad' : 'Post Ad')}
                                </button>
                            }
                        </div>
                    </>
                )}
            </main >
        </div >
    );
};

export default AdminDashboard;
