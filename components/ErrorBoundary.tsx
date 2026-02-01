import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
                    <h1 style={{ color: '#dc2626' }}>Wystąpił błąd krytyczny</h1>
                    <p>Aplikacja napotkała problem podczas ładowania.</p>
                    <pre style={{
                        marginTop: '10px',
                        padding: '10px',
                        background: '#f3f4f6',
                        borderRadius: '4px',
                        overflow: 'auto',
                        color: '#1f2937'
                    }}>
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#4f46e5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        onClick={() => window.location.reload()}
                    >
                        Odśwież stronę
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
