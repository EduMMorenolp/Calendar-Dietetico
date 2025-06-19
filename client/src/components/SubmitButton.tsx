interface SubmitButtonProps {
    generarResumen: () => void;
}

export default function SubmitButton({ generarResumen }: SubmitButtonProps) {

    return (
        <div className="mt-8 text-center">
            <button
                onClick={generarResumen}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 text-sm sm:text-base"
            >
                ✅ Mandar Información
            </button>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Resumen copiado al portapapeles para enviar por WhatsApp o Email.
            </p>
        </div>
    );
}