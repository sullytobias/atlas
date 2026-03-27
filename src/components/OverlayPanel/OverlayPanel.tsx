import type { ReactNode } from "react";
import "./OverlayPanel.css";

type Props = {
    ariaLabel: string;
    className?: string;
    eyebrow?: string;
    title: string;
    description?: string;
    leading?: ReactNode;
    actions?: ReactNode;
    onClose?: () => void;
    closeLabel?: string;
    children: ReactNode;
};

export default function OverlayPanel({
    ariaLabel,
    className = "",
    eyebrow,
    title,
    description,
    leading,
    actions,
    onClose,
    closeLabel = "Close panel",
    children,
}: Props) {
    return (
        <aside
            className={`overlay-panel ${className}`.trim()}
            aria-label={ariaLabel}
        >
            <div className="overlay-panel-header">
                <div className="overlay-panel-header-main">
                    {leading ? (
                        <div className="overlay-panel-leading">{leading}</div>
                    ) : null}
                    <div className="overlay-panel-heading">
                        {eyebrow ? (
                            <div className="overlay-panel-eyebrow">{eyebrow}</div>
                        ) : null}
                        <h2 className="overlay-panel-title">{title}</h2>
                        {description ? (
                            <p className="overlay-panel-description">
                                {description}
                            </p>
                        ) : null}
                    </div>
                </div>
                <div className="overlay-panel-actions">
                    {actions}
                    {onClose ? (
                        <button
                            type="button"
                            className="overlay-panel-close"
                            onClick={onClose}
                            aria-label={closeLabel}
                        >
                            ✕
                        </button>
                    ) : null}
                </div>
            </div>
            <div className="overlay-panel-body">{children}</div>
        </aside>
    );
}
