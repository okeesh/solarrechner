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

        // Dachfläche -> kWp Potential
        switch (formData.roofArea) {
            case 'klein': baseProduction = 5; break;
            case 'mittel': baseProduction = 10; break;
            case 'gross': baseProduction = 15; break;
            case 'sehr-gross': baseProduction = 25; break;
        }

        // Bewohner Faktor
        let residentsFactor = 1;
        switch (formData.residents) {
            case '1-2': residentsFactor = 0.8; break;
            case '3-4': residentsFactor = 1.0; break;
            case '5+': residentsFactor = 1.2; break;
        }

        // Stromrechnung Faktor für realistische Berechnung
        let billFactor = 1;
        switch (formData.currentBill) {
            case 'niedrig': billFactor = 0.8; break;
            case 'mittel': billFactor = 1.0; break;
            case 'hoch': billFactor = 1.3; break;
            case 'sehr-hoch': billFactor = 1.6; break;
        }

        const annualProduction = baseProduction * 1000 * residentsFactor; // kWh pro Jahr
        const selfConsumption = 0.3; // 30% Eigenverbrauch
        const feedInTariff = 0.08; // 8 Cent/kWh Einspeisevergütung
        const electricityPrice = 0.32; // 32 Cent/kWh

        const savingsFromSelfConsumption = annualProduction * selfConsumption * electricityPrice * billFactor;
        const incomeFromFeedIn = annualProduction * (1 - selfConsumption) * feedInTariff;
        const totalAnnualSavings = savingsFromSelfConsumption + incomeFromFeedIn;

        return {
            annualSavings: Math.round(totalAnnualSavings),
            systemSize: baseProduction,
            annualProduction: Math.round(annualProduction),
            co2Reduction: Math.round(annualProduction * 0.4) // 400g CO2 pro kWh
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
                setCurrentStep(currentStep + 1); // Zeige Ergebnis
            }
        }, 300);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (): void => {
        // Validierung
        if (!formData.name || !formData.email) {
            alert('Bitte füllen Sie Name und E-Mail aus.');
            return;
        }

        // Hier würden Sie die Daten an Ihr Backend senden
        console.log('Lead generiert:', formData);

        // Beispiel API Call:
        // fetch('/api/leads', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });

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
            installation: '',
            residents: '',
            roofArea: '',
            currentBill: '',
            roofType: '',
            name: '',
            email: '',
            phone: ''
        });
    };

    if (currentStep === steps.length) {
        const savings = calculateSavings();

        return (
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 to-teal-500 p-6 text-white text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Ihr Solarpotential</h2>
                    <p className="text-teal-100">Basierend auf Ihren Angaben</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-teal-600 mb-2">
                            {savings.annualSavings}€
                        </div>
                        <p className="text-gray-600">Jährliche Ersparnis</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-semibold text-gray-800">{savings.systemSize} kWp</div>
                            <div className="text-sm text-gray-600">Anlagengröße</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-semibold text-gray-800">{savings.annualProduction.toLocaleString()} kWh</div>
                            <div className="text-sm text-gray-600">Jahresertrag</div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-lg font-semibold text-green-800">{savings.co2Reduction} kg CO₂</div>
                        <div className="text-sm text-green-600">Jährliche CO₂-Einsparung</div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Kostenloses Angebot erhalten</h3>

                        <input
                            type="text"
                            name="name"
                            placeholder="Ihr Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Ihre E-Mail"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Ihre Telefonnummer"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                        >
                            Kostenloses Angebot anfordern
                        </button>
                    </div>

                    <button
                        onClick={restart}
                        className="w-full text-teal-600 py-2 px-4 rounded-lg border border-teal-600 hover:bg-teal-50 transition-colors"
                    >
                        Neu berechnen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-400 to-teal-500 p-4">
                <div className="flex items-center justify-between text-white">
                    {currentStep > 0 && (
                        <button onClick={goBack} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
                            ←
                        </button>
                    )}
                    <div className="flex-1 text-center">
                        <div className="text-sm opacity-90">Schritt {currentStep + 1} von {steps.length}</div>
                    </div>
                    <div className="w-9 h-9"></div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
                    <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px] bg-gradient-to-b from-teal-50 to-white">
                <h2 className="text-xl font-semibold text-gray-800 mb-8 text-center leading-tight">
                    {steps[currentStep].title}
                </h2>

                <div className="grid grid-cols-2 gap-3">
                    {steps[currentStep].options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleOptionSelect(option.value)}
                            className="aspect-square p-4 border-2 border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 flex flex-col items-center justify-center text-center group"
                        >
                            <span className="text-3xl mb-2">{option.icon}</span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700 leading-tight">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SolarCalculator;