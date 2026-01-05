import type { Incident } from "../types/status";

interface Props {
    incidents: Incident[];
}

const IncidentFeed = ({ incidents }: Props) => {
    return (
        <section className="panel">
            <h2>Incidents</h2>
            {incidents.length === 0 && <p>No active incidents</p>}
            {incidents.map((i) => (
                <div key={i.id} className="incident">
                    <strong>{i.name}</strong>
                    <span>{new Date(i.updated_at).toLocaleString()}</span>
                </div>
            ))}
        </section>
    );
};

export default IncidentFeed;