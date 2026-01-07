import { useEffect, useState } from "react";
import "../styles/loader.css";

type Props = {
    isLoading: boolean;
};

export default function Loader({ isLoading }: Props) {
    const [shouldRender, setShouldRender] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 500); 
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div className={`loader-overlay ${!isVisible ? "fade-out" : ""}`}>
            <div className="loader-container">
                <div className="spinner"></div>
                <p className="loader-text">Loading Atlas...</p>
            </div>
        </div>
    );
}