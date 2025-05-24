// SolarCalculator.tsx
import React, { useState } from 'react';

interface FormData {
    installation: string;
    residents: string;
    roofArea: string;
    currentBill: string;
    roofType: string;
    name: string;
    email: string;
    phone: string;
}

interface Option {
    value: string;
    label: string;
    icon: string;
}

interface Step {
    title: string;
    key: keyof FormData;
    options: Option[];
}

interface SavingsResult {
    annualSavings: number;
    systemSize: number;
    annualProduction: number;
    co2Reduction: number;
}

const SolarCalculator: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<FormData>({
        installation: '',
        residents: '',
        roofArea: '',
        currentBill: '',
        roofType: '',
        name: '',
        email: '',
        phone: ''
    });

    const steps: Step[] = [
        {
            title: "Wo möchten Sie Ihre Solaranlage installieren?",
            key: "installation",
            options: [
                { value: "einfamilienhaus", label: "Einfamilienhaus", icon: "🏠" },
                { value: "mehrfamilienhaus", label: "Mehrfamilienhaus", icon: "🏢" },
                { value: "gewerbe", label: "Gewerbegebäude", icon: "🏭" },
                { value: "andere", label: "Andere", icon: "🏘️" }
            ]
        },
        {
            title: "Wie viele Personen leben in Ihrem Haushalt?",
            key: "residents",
            options: [
                { value: "1-2", label: "1-2 Personen", icon: "👥" },
                { value: "3-4", label: "3-4 Personen", icon: "👨‍👩‍👧‍👦" },
                { value: "5+", label: "5+ Personen", icon: "👨‍👩‍👧‍👦👶" }
            ]
        },
        {
            title: "Wie groß ist Ihre verfügbare Dachfläche?",
            key: "roofArea",
            options: [
                { value: "klein", label: "Bis 30 m²", icon: "📐" },
                { value: "mittel", label: "30-60 m²", icon: "📏" },
                { value: "gross", label: "60-100 m²", icon: "📊" },
                { value: "sehr-gross", label: "Über 100 m²", icon: "🏟️" }
            ]
        },
        {
            title: "Wie hoch ist Ihre monatliche Stromrechnung?",
            key: "currentBill",
            options: [
                { value: "niedrig", label: "Bis 100€", icon: "💡" },
                { value: "mittel", label: "100-200€", icon: "⚡" },
                { value: "hoch", label: "200-350€", icon: "🔥" },
                { value: "sehr-hoch", label: "Über 350€", icon: "💸" }
            ]
        },
        {
            title: "Welchen Dachtyp haben Sie?",
            key: "roofType",
            options: [
                { value: "satteldach", label: "Satteldach", icon: "🏠" },
                { value: "flachdach", label: "Flachdach", icon: "⬜" },
                { value: "pultdach", label: "Pultdach", icon: "📐" },
                { value: "andere", label: "Andere", icon: "🏘️" }
            ]
        }
    ];

    const calculateSavings = (): SavingsResult => {
        let baseProduction = 0;
        switch (formData.roofArea) {
            case 'klein': baseProduction = 5; break;
            case 'mittel': baseProduction = 10; break;
            case 'gross': baseProduction = 15; break;
            case 'sehr-gross': baseProduction = 25; break;
        }

        let residentsFactor = 1;
        switch (formData.residents) {
            case '1-2': residentsFactor = 0.8; break;
            case '3-4': residentsFactor = 1.0; break;
            case '5+': residentsFactor = 1.2; break;
        }

        let billFactor = 1;
        switch (formData.currentBill) {
            case 'niedrig': billFactor = 0.8; break;
            case 'mittel': billFactor = 1.0; break;
            case 'hoch': billFactor = 1.3; break;
            case 'sehr-hoch': billFactor = 1.6; break;
        }

        const annualProduction = baseProduction * 1000 * residentsFactor;
        const selfConsumption = 0.3;
        const feedInTariff = 0.08;
        const electricityPrice = 0.32;

        const savingsFromSelfConsumption = annualProduction * selfConsumption * electricityPrice * billFactor;
        const incomeFromFeedIn = annualProduction * (1 - selfConsumption) * feedInTariff;
        const totalAnnualSavings = savingsFromSelfConsumption + incomeFromFeedIn;

        return {
            annualSavings: Math.round(totalAnnualSavings),
            systemSize: baseProduction,
            annualProduction: Math.round(annualProduction),
            co2Reduction: Math.round(annualProduction * 0.4)
        };
    };

    const handleOptionSelect = (value: string): void => {
        setFormData(prev => ({
            ...prev,
            [steps[currentStep].key]: value
        }));
        setTimeout(() => {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                setCurrentStep(currentStep + 1);
            }
        }, 200);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (): void => {
        if (!formData.name || !formData.email) {
            alert('Bitte füllen Sie Name und E-Mail aus.');
            return;
        }
        console.log('Lead generiert:', formData);
        alert('Vielen Dank! Wir melden uns bald bei Ihnen.');
    };

    const goBack = (): void => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const restart = (): void => {
        setCurrentStep(0);
        setFormData({
            installation: '', residents: '', roofArea: '', currentBill: '',
            roofType: '', name: '', email: '', phone: ''
        });
    };

    if (currentStep === steps.length) {
        const savings = calculateSavings();
        return (
            <div className="w-full p-16 bg-white">
                <h2 className="text-2xl font-bold text-center mb-4">Ihr Solarpotential</h2>
                <p className="text-center text-gray-500 mb-6">Basierend auf Ihren Angaben</p>

                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                        <div className="text-3xl font-bold text-teal-600">{savings.annualSavings}€</div>
                        <div className="text-sm text-gray-600">Ersparnis jährlich</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-teal-600">{savings.co2Reduction} kg</div>
                        <div className="text-sm text-gray-600">CO₂ Einsparung</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                        <div className="text-xl font-semibold">{savings.systemSize} kWp</div>
                        <div className="text-sm">Anlagengröße</div>
                    </div>
                    <div>
                        <div className="text-xl font-semibold">{savings.annualProduction} kWh</div>
                        <div className="text-sm">Jahresproduktion</div>
                    </div>
                </div>

                <input type="text" name="name" placeholder="Ihr Name" value={formData.name} onChange={handleInputChange} className="w-full p-3 border rounded mb-3" />
                <input type="email" name="email" placeholder="Ihre E-Mail" value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded mb-3" />
                <input type="tel" name="phone" placeholder="Ihre Telefonnummer" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border rounded mb-4" />
                <button onClick={handleSubmit} className="w-full bg-teal-500 text-white py-3 rounded mb-2">Kostenloses Angebot anfordern</button>
                <button onClick={restart} className="w-full text-teal-600 py-2 border border-teal-600 rounded">Neu berechnen</button>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#e6f8f6] p-16">

            <div>

                <h2 className="text-xl font-semibold text-center mb-6">{steps[currentStep].title}</h2>

                <div className="flex flex-wrap justify-center gap-4">
                    {steps[currentStep].options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleOptionSelect(option.value)}
                            className={`p-4 w-40 border-2 rounded-xl flex flex-col items-center justify-center hover:border-teal-500 hover:bg-white transition text-center ${formData[steps[currentStep].key] === option.value
                                ? 'border-teal-500 bg-white'
                                : 'border-gray-200'
                                }`}
                        >
                            <div className="text-3xl mb-2">{option.icon}</div>
                            <div className="text-sm font-medium text-gray-800">{option.label}</div>
                        </button>
                    ))}
                </div>
            </div>


            <div className="mt-8">
                <div className="text-center text-sm text-gray-700 mb-2">Schritt {currentStep + 1} von {steps.length}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / (steps.length + 1)) * 100}%` }}
                    ></div>
                </div>
            </div>

            {currentStep > 0 && (
                <div className="mt-6 text-center">
                    <button onClick={goBack} className="text-sm text-teal-600 underline">Zurück</button>
                </div>
            )}
        </div>
    );
};

export default SolarCalculator;
