import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

interface UseQuestionnaireUnsavedChangesOptions {
    formData: any;
    initialData: any;
    enabled?: boolean;
}

export default function useQuestionnaireUnsavedChanges(options: UseQuestionnaireUnsavedChangesOptions) {
    const { formData, initialData, enabled = true } = options;

    const [isDirty, setIsDirty] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const initialDataRef = useRef(initialData);
    const isNavigatingRef = useRef(false);

    // Detect changes
    useEffect(() => {
        if (!enabled) return;

        const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);
        setIsDirty(hasChanges);
    }, [formData, enabled]);

    // Handle browser close/refresh (native dialog)
    useEffect(() => {
        if (!enabled || !isDirty) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // Modern browsers show their own message
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty, enabled]);

    // Handle Inertia navigation (custom modal)
    useEffect(() => {
        if (!enabled) return;

        const handleInertiaBefore = (event: any) => {
            // Skip if no unsaved changes
            if (!isDirty) return;

            // Skip if this is a programmatic navigation we've already approved
            if (isNavigatingRef.current) {
                isNavigatingRef.current = false;
                return;
            }

            // Don't block form submissions (POST, PUT, PATCH)
            const method = event.detail.visit.method?.toLowerCase();
            if (method === 'post' || method === 'put' || method === 'patch') {
                return;
            }

            // Block navigation and show custom modal
            event.preventDefault();
            setPendingNavigation(event.detail.visit.url);
            setShowModal(true);
        };

        document.addEventListener('inertia:before', handleInertiaBefore);

        return () => {
            document.removeEventListener('inertia:before', handleInertiaBefore);
        };
    }, [isDirty, enabled]);

    // Handle modal actions
    const handleSaveAndContinue = () => {
        // Chiudi la modale e naviga (chiamato dal parent dopo salvataggio riuscito)
        setShowModal(false);
        if (pendingNavigation) {
            isNavigatingRef.current = true;
            router.visit(pendingNavigation);
        }
        setPendingNavigation(null);
    };

    const handleContinueWithoutSaving = () => {
        setShowModal(false);
        if (pendingNavigation) {
            isNavigatingRef.current = true;
            setIsDirty(false); // Clear dirty flag to allow navigation
            router.visit(pendingNavigation);
        }
        setPendingNavigation(null);
    };

    const handleCancelNavigation = () => {
        setShowModal(false);
        setPendingNavigation(null);
    };

    return {
        isDirty,
        setIsDirty,
        showModal,
        pendingNavigation,
        handleSaveAndContinue,
        handleContinueWithoutSaving,
        handleCancelNavigation,
    };
}
