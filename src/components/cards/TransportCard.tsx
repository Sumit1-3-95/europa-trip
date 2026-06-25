import { Plane, Train, Ship, Bus, ArrowRight } from "lucide-react";
import type { Transport } from "@/data/tripData";

const icons = {
  flight: Plane,
  train: Train,
  ferry: Ship,
  bus: Bus,
  taxi: Bus,
  tram: Train,
  "water-bus": Ship,
};

const labels = {
  flight: "Flight",
  train: "Train",
  ferry: "Ferry",
  bus: "Bus",
  taxi: "Taxi",
  tram: "Tram",
  "water-bus": "Water bus",
};

interface Props {
  transport: Transport;
}

export default function TransportCard({ transport }: Props) {
  const Icon = icons[transport.type];
  const label = labels[transport.type];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
          <Icon size={16} strokeWidth={1.5} className="text-gray-600" />
        </div>
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
        {transport.operator && (
          <span className="ml-auto text-xs text-gray-400">{transport.operator}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{transport.from}</p>
          {transport.departureTime && (
            <p className="text-lg font-medium text-gray-900 mt-0.5">{transport.departureTime}</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <ArrowRight size={16} strokeWidth={1.5} className="text-gray-300" />
          {transport.duration && (
            <span className="text-[10px] text-gray-400">{transport.duration}</span>
          )}
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-medium text-gray-900">{transport.to}</p>
          {transport.arrivalTime && (
            <p className="text-lg font-medium text-gray-900 mt-0.5">{transport.arrivalTime}</p>
          )}
        </div>
      </div>

      {(transport.flightNumber || transport.trainNumber || transport.bookingRef) && (
        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-50">
          {(transport.flightNumber || transport.trainNumber) && (
            <span className="text-xs text-gray-500">
              {transport.flightNumber ?? transport.trainNumber}
            </span>
          )}
          {transport.bookingRef && (
            <span className="text-xs text-gray-500 ml-auto">
              Ref: <span className="font-medium text-gray-700">{transport.bookingRef}</span>
            </span>
          )}
        </div>
      )}

      {transport.notes && (
        <p className="text-xs text-gray-400 mt-2">{transport.notes}</p>
      )}
    </div>
  );
}
