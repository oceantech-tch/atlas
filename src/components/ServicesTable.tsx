import type { Service } from "../types/status";

interface Props {
  services: Service[];
}

const ServicesTable = ({ services }: Props) => {

  const renderStatus = (status: Service["status"]) => {
    switch (status) {
      case "operational":
        return <span className="status operational">Operational</span>;
      case "under_maintenance":
        return <span className="status maintenance">Under Maintenance</span>;
      case "partial_outage":
        return <span className="status partial">Partial Outage</span>;
      case "major_outage":
        return <span className="status major">Major Outage</span>;
      case "degraded_performance":
        return <span className="status degraded">Degraded Performance</span>;
      default:
        return null;
    }
};

  return (
    <table className="services-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Region</th>
          <th>Status</th>
          <th>Latency</th>
          <th>Uptime</th>
        </tr>
      </thead>

      <tbody>
        {services.map((service) => (
          <tr key={service.id}>
            <td>{service.name}</td>
            <td>{service.region}</td>
            <td>{renderStatus(service.status)}</td>
            <td>{service.latency ? `${service.latency} ms` : "-"}</td>
            <td>{service.uptime ? `${service.uptime}` : "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServicesTable;