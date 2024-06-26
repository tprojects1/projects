import { useEffect, useState } from 'react';
import { formattedString, repositionTheDataPanel } from '@projects/common';
import { Button } from '..';
import './styles.scss';
import { Row } from '../common';

let any: any,
    row: Row;

const DataPanel = (

    {
        onClose = () => { },
        onSave = any,
        selectedRow = row,
        setSelectedRow = any,
        uniqueStatuses = []
    }


) => {
    const [modifiedData, setModifiedData] = useState(selectedRow || {}); // Initialize with selectedRow or empty object

    /*useEffect(() => {
        appendAnOverlayIfNecessary();
    }, []);*/

    useEffect(() => {
        setTimeout(() => {
            repositionTheDataPanel();
            window.addEventListener('resize', function () {
                repositionTheDataPanel();
            });
            setTimeout(repositionTheDataPanel, 1000);
        }, 2000);
    }, []);

    if (!selectedRow) return null; // Hide the panel when no row is selected

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setModifiedData({ ...selectedRow, [name]: value }); // Still needed for tracking changes
        setSelectedRow({ ...selectedRow, [name]: value }); // Update selectedRow directly                
    };

    const handleSave = () => {
        onSave(modifiedData); // Pass modified data to onSave on button click    

        setTimeout(onClose); // async to avoid the form submission console warning
        /*setTimeout(() => {
            onSave(modifiedData);
            // document.querySelector('.data-panel').querySelector('.close').remove();
        });*/
    };

    const editableFields = [
        'status',
        'patient_phone',
        'doctor_phone',
        'patient_name',
        'notes'
    ]

    return (
        <div className="data-panel hidden">
            <Button action='close' tier='secondary' onClick={onClose} />
            <h2>Edit Order #{selectedRow.id}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                {/* Dynamically render form elements based on selectedRow data */}
                {Object.entries(selectedRow).map(([key]) => (
                    editableFields.includes(key) && (
                        <div key={key}>
                            <label htmlFor={key}>{formattedString(key)}</label>
                            {key === 'status' ? (
                                <select
                                    id={key}
                                    name={key}
                                    value={selectedRow[key]}
                                    onChange={handleInputChange}
                                >
                                    {uniqueStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            ) : key === 'notes' ? (
                                <textarea
                                    id={key}
                                    name={key}
                                    value={selectedRow[key]}
                                    onChange={handleInputChange}
                                ></textarea>
                            ) : (
                                <input
                                    type="text"
                                    id={key}
                                    name={key}
                                    value={selectedRow[key]}
                                    onChange={handleInputChange}
                                />
                            )}
                        </div>
                    )
                ))}
                <div className="save">
                    <Button text="Save and Close" type="submit" icon="check" onClick={handleSave} />
                </div>
            </form>
        </div>
    );

};

export default DataPanel;