import './styles.scss';

const Toolbar = ({uniqueStatuses = []}) => {

    return (
        <div className="toolbar">
            <select
            >
                {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Toolbar;
