import { reactive, ref } from 'vue';
import axios from 'axios';

export function useContactForm() {
    const form = reactive({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const errors = reactive({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submitState = ref('idle');

    function validateField(field) {
        const value = form[field] ? form[field].trim() : '';

        if (field === 'name') {
            errors.name = value.length === 0 ? 'Please enter your name.' : '';
        }

        if (field === 'email') {
            if (!value.length) {
                errors.email = 'Please enter your email.';
            } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
                errors.email = 'Please enter a valid email address.';
            } else {
                errors.email = '';
            }
        }

        if (field === 'message') {
            if (!value.length) {
                errors.message = 'Please include a short message.';
            } else if (value.length > 2000) {
                errors.message = 'Message cannot exceed 2000 characters.';
            } else {
                errors.message = '';
            }
        }
    }

    function validateForm() {
        validateField('name');
        validateField('email');
        validateField('message');
        return !errors.name && !errors.email && !errors.message;
    }

    async function handleContactSubmit() {
        if (!validateForm()) {
            submitState.value = 'error';
            return;
        }

        submitState.value = 'submitting';

        try {
            await axios.post('/contact', {
                name: form.name,
                email: form.email,
                subject: form.subject || 'Portfolio Contact',
                message: form.message,
            });

            submitState.value = 'success';
            form.name = '';
            form.email = '';
            form.subject = '';
            form.message = '';

            Object.keys(errors).forEach((key) => (errors[key] = ''));
        } catch (error) {
            console.error(error);
            submitState.value = 'error';
        } finally {
            setTimeout(() => {
                if (submitState.value === 'success') {
                    submitState.value = 'idle';
                }
            }, 3000);
        }
    }

    return {
        form,
        errors,
        submitState,
        handleContactSubmit,
    };
}
