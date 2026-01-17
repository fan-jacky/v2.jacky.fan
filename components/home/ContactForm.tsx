'use client'
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useContext, useRef, useState } from "react";
import { AlertContext } from "@/contexts/AlertContext";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export default function ContactForm() {

    const inputName = useRef<HTMLInputElement>(null)
    const inputEmail = useRef<HTMLInputElement>(null)
    const inputMessage = useRef<HTMLTextAreaElement>(null)
    const { setAlert } = useContext(AlertContext);
    const { executeRecaptcha } = useGoogleReCaptcha()

    const [isLoading, setIsLoading] = useState(false);
    const [showRequired, setShowRequired] = useState({ name: false, email: false, message: false });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const name = inputName.current?.value.trim();
        const email = inputEmail.current?.value.trim();
        const message = inputMessage.current?.value.trim();
        
        const hasErrors = !name || !email || !message;
        setShowRequired({ 
            name: !name, 
            email: !email, 
            message: !message 
        });
        
        if (hasErrors) return;
        
        try {
            setIsLoading(true);
            
            // Execute reCAPTCHA
            if (!executeRecaptcha) {
                throw new Error('reCAPTCHA is not initialized');
            }
            const token = await executeRecaptcha('contact_form');
            
            // Send to backend API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message, token })
            });
            
            if (!response.ok) throw new Error('Failed to send message');
            
            setAlert?.({
                show: true,
                message: 'Message sent successfully! I\'ll get back to you soon.',
                type: 'success'
            });
            
            inputName.current && (inputName.current.value = '');
            inputEmail.current && (inputEmail.current.value = '');
            inputMessage.current && (inputMessage.current.value = '');
        } catch (error) {
            setAlert?.({
                show: true,
                message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            <div className="form-control w-full md:max-w-xs mb-4">
                <label htmlFor="contactName" className="label">
                    <span className="label-text text-md md:text-xl">What is your name?</span>
                </label>
                <input id="contactName" type="text" placeholder="Type your name here" className="input input-bordered w-full md:max-w-xs" ref={inputName} />
                {showRequired.name &&
                    <label className="label">
                        <span className="label-text-alt text-error">This field is required.</span>
                    </label>
                }
            </div>

            <div className="form-control w-full md:max-w-xs mb-4">
                <label htmlFor="contactEmail" className="label">
                    <span className="label-text text-md md:text-xl">What is your Email?</span>
                </label>
                <input id="contactEmail" type="email" placeholder="Type your email here" className="input input-bordered w-full md:max-w-xs" ref={inputEmail} />
                {showRequired.email &&
                    <label className="label">
                        <span className="label-text-alt text-error">This field is required.</span>
                    </label>
                }
            </div>

            <div className="form-control w-full mb-4">
                <label htmlFor="contactMessage" className="label">
                    <span className="label-text text-md md:text-xl">What is your message?</span>
                </label>
                <textarea id="contactMessage" className="textarea textarea-bordered h-24" placeholder="Type your message here" ref={inputMessage} name="body"></textarea>
                {showRequired.message &&
                    <label className="label">
                        <span className="label-text-alt text-error">This field is required.</span>
                    </label>
                }
            </div>

            <button type="submit" className="btn btn-neutral" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Submit'}
                <PaperAirplaneIcon className="h-6 w-6 text-content" />
            </button>

        </form>
    );
}