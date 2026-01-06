import atlasLogo from "../assets/atlas-logo.svg";

interface Props {
    overall: string;
    updatedAt: string;
}

const StatusHeader = ({ overall, updatedAt }: Props) => {
    return (
        <section className="status-header atlas-header">
            <div className="atlas-brand">
                <img
                    src={atlasLogo}
                    alt="Atlas"
                    className="atlas-logo"
                />
                <h1>Atlas</h1>
            </div>
            <p className="overall">{overall}</p>
            <span className="updated">
                Last updated: {new Date(updatedAt).toLocaleString()}
            </span>
        </section>
    );
};

export default StatusHeader;