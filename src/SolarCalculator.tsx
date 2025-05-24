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
    const [currentStep, setCurrentStep] = useState<number>(-1);
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
                { value: "1-2", label: "1-2", icon: "👥" },
                { value: "3-4", label: "3", icon: "👨‍👩‍👧‍👦" },
                { value: "5+", label: "4", icon: "👨‍👩‍👧‍👦" },
                { value: "mehr", label: "5+", icon: "👨‍👩‍👧‍👦👶" }
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
            case 'mehr': residentsFactor = 1.2; break;
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

    if (currentStep === -1) {
        return (
            <div className="w-full flex items-center justify-center">
                <div className="max-w-md w-full text-center rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        Solarrechner
                    </h2>
                    <p className="text-gray-700 mb-8 leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        Berechnen Sie mit wenigen Klicks Ihre geschätzte jährliche Stromkosten-Ersparnis basierend auf Ihrer Haushaltsgröße, Dachfläche und Stromverbrauch. Schnell, einfach & kostenlos.
                    </p>
                    <button
                        onClick={() => setCurrentStep(0)}
                        className="w-full py-3 px-6 bg-teal-500 text-white rounded-xl font-medium hover:bg-black transition-colors cursor-pointer"
                    >
                        Jetzt starten
                    </button>
                </div>
            </div>
        );
    }


    if (currentStep === steps.length) {
        const savings = calculateSavings();
        const savings20Years = savings.annualSavings * 20;
        const amortizationYears = Math.round(savings.systemSize * 1000 / savings.annualSavings);

        return (
            <div className="w-full flex items-center justify-center">
                <div className="max-w-xl w-full p-8 text-center result-in">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        🎉 Glückwunsch! Solar lohnt sich für Sie!
                    </h2>

                    <p className="text-gray-800 mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        <strong>{savings.annualSavings} €</strong> potentielles jährliches Stromersparnis
                    </p>
                    <p className="text-gray-800 mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        <strong>{savings20Years.toLocaleString()} €</strong> in 20 Jahren sparen
                    </p>
                    <p className="text-gray-800 mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        Nach <strong>{amortizationYears} Jahren</strong> amortisiert sich die Anlage
                    </p>

                    <p className="text-gray-900 font-medium mb-8 leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        In einem kostenlosen und unverbindlichen Gespräch berechnen wir Ihre genauen Werte und Sparziele.
                    </p>

                    {/* 👇 Neuer Button statt Formular */}
                    <button
                        onClick={() => {
                            const modal = document.getElementById("contact-form");
                            if (modal) {
                                modal.style.display = "flex";
                                modal.style.opacity = "1";
                            }
                        }}
                        className="w-full py-3 px-6 bg-teal-500 text-white rounded-xl font-medium hover:bg-black transition-colors cursor-pointer"
                    >
                        Unverbindliches Angebot anfordern
                    </button>

                    <button
                        onClick={restart}
                        className="mt-6 w-full py-3 px-6 bg-[#E5F5F3] text-gray-700 rounded-xl font-medium hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                        Neu berechnen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center max-w-md mx-auto mb-12 w-full">
            {/* Slide-in Bereich */}
            <div key={currentStep} className="slide-in">
                <h3 className="text-lg font-semibold text-gray-800 mb-12 leading-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    {steps[currentStep].title}
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-12">
                    {steps[currentStep].options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleOptionSelect(option.value)}
                            className={`p-4 rounded-xl border bg-white hover:border-[#00A48B] transition-all duration-200 cursor-pointer ${formData[steps[currentStep].key] === option.value
                                ? 'border-[#00A48B]'
                                : 'border-gray-200'
                                }`}
                        >
                            <div
                                className="text-sm font-medium text-gray-700 leading-tight"
                                style={{ fontFamily: 'Satoshi, sans-serif' }}
                            >
                                {option.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-center space-x-2 mb-3">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-8 rounded-full transition-colors ${index <= currentStep ? 'bg-teal-500' : 'bg-gray-200'}`}
                        />
                    ))}
                </div>
                <div className="text-xs text-gray-600" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Schritt {currentStep + 1} von {steps.length}
                </div>
            </div>

            {currentStep > 0 && (
                <button
                    onClick={goBack}
                    className="text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                >
                    ← Zurück
                </button>
            )}
        </div>
    );
};

export default SolarCalculator;
