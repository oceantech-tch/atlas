import React, { useEffect, useState } from "react";
import type { Service } from "../types/status";
import {
  SearchX,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Wrench,
  Activity,
} from "lucide-react";

interface Props {
  services: Service[];
  statusHistory: Record<string, Service["status"][]>;
}

const ServicesTable = ({ services, statusHistory }: Props) => {
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
      <table className="services-table">
        <thead>
          <tr>
            <th>Service</th>
            <th className="desktop-only">Region</th>
            <th>Status</th>
            <th className="desktop-only">Latency</th>
            <th className="desktop-only">Uptime</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5}>
              <div className="empty-state">
                <SearchX size={28} />
                <p>No services match your search.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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

          // -------- STATUS HISTORY INTERPRETATION (VISUAL ONLY) --------
          const history = (statusHistory[service.id] ?? []).slice(-5);
          const changes = history.length > 1 ? history.length - 1 : 0;

          const hasMajor = history.includes("major_outage");
          const hasDegraded = history.some(
            (s) =>
              s === "partial_outage" || s === "degraded_performance"
          );

          const stability = hasMajor
            ? "unstable"
            : hasDegraded
            ? "flapping"
            : "stable";

          return (
            <React.Fragment key={service.id}>
              <tr
                className={`service-row ${isOpen ? "open" : ""}`}
                onClick={() =>
                  isMobile
                    ? setExpandedId(isOpen ? null : service.id)
                    : undefined
                }
              >
                <td className="service-cell">
                  <span className="truncate">{service.name}</span>
                </td>

                <td>
                  <div className="status-cell">
                    {renderStatus(service.status)}

                    <div
                      className={`status-history ${stability}`}
                      data-tooltip={
                        changes > 0
                          ? `Status changed ${changes} time${
                              changes > 1 ? "s" : ""
                            } recently`
                          : "No recent status changes"
                      }
                    >
                      {history.map((s, i) => (
                        <span key={i} className={`dot ${s}`} />
                      ))}
                    </div>
                    {/* ----------------------------------------- */}
                  </div>
                </td>

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
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default ServicesTable;