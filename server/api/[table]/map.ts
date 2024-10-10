import { defineEventHandler, sendError, H3Event } from "h3";
import { setupDatabaseConnection } from "../../database/dbConnection";
import { fetchConfig, fetchData } from "../../database/dbOperations";
import {
  prepareMapData,
  transformSurveyData,
} from "../../dataProcessing/transformData";
import {
  filterUnwantedKeys,
  filterOutUnwantedValues,
  filterGeoData,
} from "../../dataProcessing/filterData";
import {
  type AllowedFileExtensions,
  type ColumnEntry,
  type DataEntry,
} from "../../types";

export default defineEventHandler(async (event: H3Event) => {
  const { table } = event.context.params as { table: string };

  const {
    public: { allowedFileExtensions },
    configDatabase,
    database,
    dbHost,
    dbUser,
    dbPassword,
    dbPort,
    dbSsl,
    isSqlite,
    sqliteDbPath,
    // eslint-disable-next-line no-undef
  } = useRuntimeConfig() as unknown as {
    public: { allowedFileExtensions: AllowedFileExtensions };
    configDatabase: string;
    database: string;
    dbHost: string;
    dbUser: string;
    dbPassword: string;
    dbPort: string;
    dbSsl: boolean;
    isSqlite: boolean;
    sqliteDbPath: string;
  };

  const configDb = await setupDatabaseConnection(
    /* isConfigDb */ true,
    isSqlite,
    sqliteDbPath,
    configDatabase,
    database,
    dbHost,
    dbUser,
    dbPassword,
    dbPort,
    dbSsl,
  );

  if (!configDb) {
    throw new Error("Failed to connect to configDb");
  }

  const db = await setupDatabaseConnection(
    /* isConfigDb */ false,
    isSqlite,
    sqliteDbPath,
    database,
    database,
    dbHost,
    dbUser,
    dbPassword,
    dbPort,
    dbSsl,
  );

  try {
    const viewsConfig = await fetchConfig(configDb, isSqlite);
    const { mainData, columnsData } = await fetchData(db, table, isSqlite);

    // Filter data to remove unwanted columns and substrings
    const filteredData = filterUnwantedKeys(
      mainData as DataEntry[],
      columnsData as ColumnEntry[],
      viewsConfig[table].UNWANTED_COLUMNS,
      viewsConfig[table].UNWANTED_SUBSTRINGS,
    );
    // Filter data to remove unwanted values per chosen column
    const dataFilteredByValues = filterOutUnwantedValues(
      filteredData,
      viewsConfig[table].FILTER_BY_COLUMN,
      viewsConfig[table].FILTER_OUT_VALUES_FROM_COLUMN,
    );
    // Filter only data with valid geofields
    const filteredGeoData = filterGeoData(dataFilteredByValues);
    // Transform data that was collected using survey apps (e.g. KoBoToolbox, Mapeo)
    const transformedData = transformSurveyData(filteredGeoData);
    // Process geodata
    const processedGeoData = prepareMapData(
      transformedData,
      viewsConfig[table].FRONT_END_FILTER_COLUMN,
    );

    const response = {
      allowedFileExtensions: allowedFileExtensions,
      data: processedGeoData,
      filterColumn: viewsConfig[table].FRONT_END_FILTER_COLUMN,
      mapLegendLayerIds: viewsConfig[table].MAP_LEGEND_LAYER_IDS,
      mapbox3d: viewsConfig[table].MAPBOX_3D === "YES",
      mapboxAccessToken: viewsConfig[table].MAPBOX_ACCESS_TOKEN,
      mapboxBearing: Number(viewsConfig[table].MAPBOX_BEARING),
      mapboxLatitude: Number(viewsConfig[table].MAPBOX_CENTER_LATITUDE),
      mapboxLongitude: Number(viewsConfig[table].MAPBOX_CENTER_LONGITUDE),
      mapboxPitch: Number(viewsConfig[table].MAPBOX_PITCH),
      mapboxProjection: viewsConfig[table].MAPBOX_PROJECTION,
      mapboxStyle: viewsConfig[table].MAPBOX_STYLE,
      mapboxZoom: Number(viewsConfig[table].MAPBOX_ZOOM),
      mediaBasePath: viewsConfig[table].MEDIA_BASE_PATH,
      planetApiKey: viewsConfig[table].PLANET_API_KEY,
      table: table,
    };

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching data on API side:", error.message);
      return sendError(event, new Error(error.message));
    } else {
      console.error("Unknown error fetching data on API side:", error);
      return sendError(event, new Error("An unknown error occurred"));
    }
  }
});
