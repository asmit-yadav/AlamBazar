import React, { useState } from "react";
import "../styles/AdminDashboard.css";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const MAX_IMAGES = 10;

const AdminDashboard = () => {
    const [step, setStep] = useState(1);

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

    // 🔐 Logout
    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/";
    };

    // ✏️ Change handler
    const updateField = (name, value) => {
        setVehicleData(prev => ({ ...prev, [name]: value }));
    };

    // 👉 Next Step validation
    const nextStep = () => {
        if (step === 1 && (!vehicleData.make || !vehicleData.model)) {
            return setError("Brand and Model are required");
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

    // 🚀 Submit
    const handleSubmit = async () => {
        console.log("FINAL DATA:", vehicleData);
        alert("Car listing submitted (connect backend next)");
    };

    return (
        <div className="ola-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>Four Wheel Alam</h2>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </aside>

            {/* Main */}
            <main className="content">
                {/* Stepper */}
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
                        <h3>🚗 Car Details</h3>
                        <input placeholder="Brand *"
                            value={vehicleData.make}
                            onChange={e => updateField("make", e.target.value)}
                        />
                        <input placeholder="Model *"
                            value={vehicleData.model}
                            onChange={e => updateField("model", e.target.value)}
                        />
                        <input placeholder="Variant"
                            onChange={e => updateField("variant", e.target.value)}
                        />
                        <input type="number" placeholder="Year"
                            onChange={e => updateField("year", e.target.value)}
                        />
                    </div>
                )}

                {/* STEP 2 */}
                {
                    step === 2 && (
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
                    )
                }

                {/* STEP 3 */}
                {
                    step === 3 && (
                        <div className="card">
                            <h3>💰 Pricing</h3>
                            <input type="number" placeholder="Expected Price ₹ *"
                                onChange={e => updateField("price", e.target.value)}
                            />
                            <input placeholder="Color"
                                onChange={e => updateField("color", e.target.value)}
                            />
                            <textarea placeholder="Short description"
                                rows="4"
                                onChange={e => updateField("description", e.target.value)}
                            />
                        </div>
                    )
                }

                {/* STEP 4 */}
                {
                    step === 4 && (
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
                    )
                }

                {/* Navigation */}
                <div className="nav">
                    {step > 1 && <button onClick={prevStep}>Back</button>}
                    {step < 4
                        ? <button className="primary" onClick={nextStep}>Next</button>
                        : <button className="primary" onClick={handleSubmit}>Post Ad</button>
                    }
                </div>
            </main >
        </div >
    );
};

export default AdminDashboard;
