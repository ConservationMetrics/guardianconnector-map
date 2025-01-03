import pg from "pg";
import sqlite3 from "sqlite3";

export type DatabaseConnection = pg.Client | sqlite3.Database | null;

export interface Database {
  // SQLite methods
  all: <T = unknown>(
    _sql: string,
    _callback: (_err: Error, _rows: T[]) => void,
  ) => void;
  run: (
    _sql: string,
    _values?: unknown[],
    _callback?: (_err: Error) => void,
  ) => void;
  // Method for other databases to execute a query
  query: <T = unknown>(
    _sql: string,
    _values?: unknown[],
    _callback?: (_err: Error, _result: { rows: T[] }) => void,
  ) => void;

  host?: string;
  user?: string;
  password?: string;
  port?: number;
  ssl?: boolean;

  close?: () => Promise<void>;
}

export type ConfigRow = {
  table_name: string;
  views_config: string;
};

export type ColumnEntry = {
  original_column: string;
  sql_column: string;
};

export type DataEntry = Record<string, string>;

export type Coordinate = [number, number];
export type LineString = Coordinate[];
export type Polygon = LineString[];
export type MultiPolygon = Polygon[];

export type GeoJSONFeature = {
  type: "Feature";
  id?: string;
  properties: { [key: string]: unknown };
  geometry?: { [key: string]: unknown };
};

export type GeoJSON = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

export type AlertsMetadata = {
  data_source: string;
  type_alert: string;
  month: number;
  year: number;
  total_alerts: string;
  description_alerts: string;
  territory: string;
};

export type AlertsPerMonth = Record<string, number>;

export type AlertsStatistics = {
  territory: string;
  typeOfAlerts: string[];
  dataProviders: string[];
  alertDetectionRange: string;
  allDates: string[];
  earliestAlertsDate: string;
  recentAlertsDate: string;
  recentAlertsNumber: number;
  alertsTotal: number;
  alertsPerMonth: AlertsPerMonth;
  hectaresTotal: string;
  hectaresPerMonth: AlertsPerMonth;
  twelveMonthsBefore: string;
};
export interface ViewConfig {
  VIEWS: string;
  FILTER_BY_COLUMN: string;
  FILTER_OUT_VALUES_FROM_COLUMN: string;
  FRONT_END_FILTER_COLUMN: string;
  MAPBOX_ACCESS_TOKEN: string;
  MAPBOX_STYLE: string;
  MAPBOX_PROJECTION: string;
  MAPBOX_CENTER_LATITUDE: string;
  MAPBOX_CENTER_LONGITUDE: string;
  MAPBOX_ZOOM: string;
  MAPBOX_PITCH: string;
  MAPBOX_BEARING: string;
  MAPBOX_3D: string;
  MAPEO_TABLE: string;
  MAPEO_CATEGORY_IDS: string;
  MAP_LEGEND_LAYER_IDS: string;
  MEDIA_BASE_PATH: string;
  MEDIA_BASE_PATH_ALERTS: string;
  LOGO_URL: string;
  PLANET_API_KEY: string;
  UNWANTED_COLUMNS?: string;
  UNWANTED_SUBSTRINGS?: string;
}

export interface Views {
  [key: string]: ViewConfig;
}

export type AllowedFileExtensions = {
  audio: string[];
  image: string[];
  video: string[];
};
