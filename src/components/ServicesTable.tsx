import { useEffect, useState } from "react";
import type { Service } from "../types/status";
import {
  SearchX,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Wrench,
  Activity,
  ChevronDown,
} from "lucide-react";

interface Props {
  services: Service[];
}

const ServicesTable = ({ services }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const renderStatus = (status: Service["status"]) => {
    switch (status) {
      case "operational":
        return (
          <span className="status operational">
            <CheckCircle size={12} /> Operational
          </span>
        );
      case "under_maintenance":
        return (
          <span className="status maintenance">
            <Wrench size={12} /> Maintenance
          </span>
        );
      case "partial_outage":
        return (
          <span className="status partial">
            <AlertTriangle size={12} /> Partial Outage
          </span>
        );
      case "major_outage":
        return (
          <span className="status major">
            <AlertOctagon size={12} /> Major Outage
          </span>
        );
      case "degraded_performance":
        return (
          <span className="status degraded">
            <Activity size={12} /> Degraded
          </span>
        );
      default:
        return null;
    }
  };

  if (services.length === 0) {
    return (
      <div className="panel empty-state">
        <SearchX size={28} />
        <p>No services match your search.</p>
      </div>
    );
  }

  return (
    <table className="services-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Status</th>
          <th className="desktop-only">Region</th>
          <th className="desktop-only">Latency</th>
          <th className="desktop-only">Uptime</th>
        </tr>
      </thead>

      <tbody>
        {services.map((service) => {
          const isOpen = expandedId === service.id;

          return (
            <>
              <tr
                key={service.id}
                className={`service-row ${isOpen ? "open" : ""}`}
                onClick={() =>
                  isMobile
                    ? setExpandedId(isOpen ? null : service.id)
                    : undefined
                }
              >
                <td className="service-cell">
                  <span className="truncate">{service.name}</span>

                  {isMobile && (
                    <ChevronDown
                      size={14}
                      className={`row-chevron ${isOpen ? "rotated" : ""}`}
                    />
                  )}
                </td>

                <td>{renderStatus(service.status)}</td>

                <td className="desktop-only">{service.region}</td>
                <td className="desktop-only">
                  {service.latency ? `${service.latency} ms` : "-"}
                </td>
                <td className="desktop-only">{service.uptime || "-"}</td>
              </tr>

              {isMobile && (
                <tr
                  className={`service-expanded ${
                    isOpen ? "expanded" : "collapsed"
                  }`}
                >
                  <td colSpan={2}>
                    <div className="expanded-panel">
                      <div>
                        <strong>Region:</strong> {service.region}
                      </div>
                      <div>
                        <strong>Latency:</strong>{" "}
                        {service.latency ? `${service.latency} ms` : "-"}
                      </div>
                      <div>
                        <strong>Uptime:</strong> {service.uptime || "-"}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default ServicesTable;