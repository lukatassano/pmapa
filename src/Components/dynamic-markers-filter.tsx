import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import useSWR from "swr";
import {
  filteredNursesAtom,
  selectedCoordsAtom,
  specialtiesFilterAtom,
} from "../atoms/nurse";
import { listNurses } from "../service/nurse";
import { CompleteFormType } from "../types/form";

export const coordsAtom = atom({
  northEast: {
    lat: 0,
    lng: 0,
  },
  southWest: {
    lat: 0,
    lng: 0,
  },
});

export function DynamicMarkersFilter() {
  const { data: nurses } = useSWR(["nurses"], listNurses);

  const [, setFilteredNurses] = useAtom(filteredNursesAtom);
  const [selectedCoords, setSelectedCoords] = useAtom(selectedCoordsAtom);
  const [specialtiesFilter] = useAtom(specialtiesFilterAtom);

  const mMap = useMap();

  const updateFilteredNurses = () => {
    let filteredNurses: CompleteFormType[] = [];

    if (selectedCoords !== undefined) {
      filteredNurses = (nurses || []).filter((nurse) => {
        const { lat, lng } = selectedCoords;
        const [nurseLat, nurseLng] = nurse.address.coordinates || [-1, -1];

        return (
          lat.toPrecision(4) === nurseLat.toPrecision(4) &&
          lng.toPrecision(4) === nurseLng.toPrecision(4)
        );
      });
    } else {
      const bounds = mMap.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      filteredNurses = (nurses || []).filter((nurse) => {
        const coords = nurse.address.coordinates;
        if (coords) {
          const lat = coords[0];
          const lng = coords[1];

          const inLat = northEast.lat > lat && lat > southWest.lat;
          const inLng = northEast.lng > lng && lng > southWest.lng;
          return inLat && inLng;
        }

        return false;
      });
    }

    if (specialtiesFilter.length > 0) {
      filteredNurses = filteredNurses.filter((nurse) =>
        (nurse.specialties || []).some((specialty) =>
          specialtiesFilter.includes(specialty)
        )
      );
    }

    setFilteredNurses(filteredNurses);
  };

  useEffect(() => {
    updateFilteredNurses();
  }, [selectedCoords, specialtiesFilter]);

  useMapEvents({
    moveend: updateFilteredNurses,
    click: () => setSelectedCoords(undefined),
  });

  return <></>;
}
