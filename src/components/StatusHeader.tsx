interface Props {
    overall: string;
    updatedAt: string;
}

const StatusHeader = ({ overall, updatedAt }: Props) => {
    return (
        <section className="status-header">
            <h1>Atlas</h1>
            <p className="overall">{overall}</p>
            <span className="updated">
                Last updated: {new Date(updatedAt).toLocaleString()}
            </span>
        </section>
    );
};

export default StatusHeader;