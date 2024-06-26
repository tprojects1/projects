import { useEffect } from 'react';
import './styles.scss';

let any: any;

const Button = ({
    children = any,
    type = 'button',
    text = '',
    onClick = () => { },
    icon = '',
    action = any,
    tier = 'primary',
    isActive = false,
    isDisabled = false
}) => {
    useEffect(() => {
        // Add a keydown event listener to the document
        const handleKeyDown = (event: any) => {
            if (event.key === 'Escape' && action === 'close') {
                onClick(); // Trigger the same function as click
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Clean up the listener on unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [action, onClick]); // Only re-run the effect if the action or onClick event changes

    return (
        <button
            type={type as 'button' | 'submit' | 'reset'}
            className={`${tier || ''} ${action || ''} ${isActive ? 'active' : ''}`}
            onClick={onClick}
            disabled={isDisabled}
        >
            {action === 'close' ? <i className={`fa-solid fa-xmark`} /> : (
                icon ? (
                    <>
                        <i className={`fa-solid fa-${icon}`} />
                        <span>{text}</span>
                    </>
                ) : (
                    <>{text}</>
                )
            )}
            {children}
        </button>
    );
};

export default Button;
